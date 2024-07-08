FROM python:3.10

WORKDIR /app

COPY ./cart/requirements /app/requirements

RUN pip install -r /app/requirements/requirements.txt

COPY . /app

EXPOSE 8002