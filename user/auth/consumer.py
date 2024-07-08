import uuid
import time
import json
import pika
from jwt import InvalidTokenError
from auth.utils.jwt_utils import decode_jwt


class UserConsumerJWT:
    def __init__(self):
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq', port=5672))
        self.channel = self.connection.channel()
        self.channel.queue_declare('jwt_validation_queue')
        self.response = None
        self.channel.basic_qos(prefetch_count=1)
        self.channel.basic_consume(queue='jwt_validation_queue', on_message_callback=self.__on_request)

    def start_consuming(self):
        print("Awaiting JWT validation requests")
        self.channel.start_consuming()

    def __on_request(self, ch, method, props, body):
        token = body.decode()
        try:
            payload = decode_jwt(token=token)
            self.response = {"content": payload['sub'], "status": 200}
            ch.basic_publish(
                exchange='',
                routing_key=props.reply_to,
                properties=pika.BasicProperties(correlation_id=props.correlation_id),
                body=json.dumps(self.response)
            )
            ch.basic_ack(delivery_tag=method.delivery_tag)
        except InvalidTokenError:
            self.response = {"content": '', "status": 401}
            ch.basic_publish(
                exchange='',
                routing_key=props.reply_to,
                properties=pika.BasicProperties(correlation_id=props.correlation_id),
                body=json.dumps(self.response)
            )
            ch.basic_ack(delivery_tag=method.delivery_tag)
