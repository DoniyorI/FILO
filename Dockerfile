FROM node AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

  

# Stage 2: Setting up the Flask server

FROM python:3.9.13

WORKDIR /root

COPY --from=builder /app/build /root/build

# Copy the utils directory and other necessary files

COPY utils/ /root/utils/

COPY server.py /root/

COPY requirements.txt /root/

RUN pip install -r requirements.txt

EXPOSE 8080

CMD ["python", "server.py"]