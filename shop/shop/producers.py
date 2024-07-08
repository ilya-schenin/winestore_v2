import uuid
import time
import pika
import json
from jwt.exceptions import InvalidTokenError


class BaseClient:
    def __init__(self):
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters(host='localhost', port=5672)
        )
        self.channel = self.connection.channel()

        callback_queue_name = self.channel.queue_declare(queue='', exclusive=True)
        self.callback_queue = callback_queue_name.method.queue

        self.channel.basic_consume(
            queue=self.callback_queue,
            on_message_callback=self.__on_response,
            auto_ack=True
        )

        self.response = None
        self.corr_id = None

    def __on_response(self, ch, method, props, body):
        if self.corr_id == props.correlation_id:
            self.response = json.loads(body)

    def send_request(self, routing_key, message, timeout=5):
        self.response = None
        self.corr_id = str(uuid.uuid4())

        self.channel.basic_publish(
            exchange='',
            routing_key=routing_key,
            properties=pika.BasicProperties(
                reply_to=self.callback_queue,
                correlation_id=self.corr_id
            ),
            body=message
        )
        start_time = time.time()
        while self.response is None:
            self.connection.process_data_events()
            if time.time() - start_time > timeout:
                raise TimeoutError(
                    "Request timed out after {} seconds".format(timeout)
                )
        if self.response is None:
            raise TypeError('error with getting data')

        if self.response['status'] == 401:
            raise InvalidTokenError("Invalid token")


class UserClient(BaseClient):
    def __init__(self):
        super().__init__()

    def get_user_id_by_jwt(self, token, timeout=5):
        self.send_request(
            'jwt_validation_queue',
            token
        )
        return self.response['content']