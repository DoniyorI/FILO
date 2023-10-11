FROM python:3.8

ENV HOME /root
WORKDIR /root

COPY . .
RUN pip install -r requirements.txt
EXPOSE 8080
CMD python3 -u server.py