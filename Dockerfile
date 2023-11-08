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
EXPOSE 8080

CMD python server.py
