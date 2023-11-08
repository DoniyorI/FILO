from flask import Flask

from pymongo import MongoClient

#! "localhost" for server.py, "mongo" for docker
server = "localhost"
server1 = "mongo"
mongo_client = MongoClient(server)
db = mongo_client["FILO"]
userCollection = db["user"]
postCollection = db["global post"]
channelCollection = db["channel"]

app = Flask(__name__)
