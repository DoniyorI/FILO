FROM node:14 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM python:3.9.13

ENV HOME /root
WORKDIR /root

COPY --from=builder /app/build /app/build
COPY . .

RUN pip install -r requirements.txt

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

EXPOSE 8080

CMD ["/wait", "&&", "python", "server.py"]
# CMD /wait && python server.py
