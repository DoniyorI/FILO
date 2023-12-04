from flask import Flask

from pymongo import MongoClient

#! "localhost" for server.py, "mongo" for docker
server = "localhost"
server1 = "mongo"
mongo_client = MongoClient(server1)
db = mongo_client["FILO"]
userCollection = db["user"]
postCollection = db["global post"]
channelCollection = db["channel"]
imgCounterCollection = db["counter"]
imgCounterCollection.insert_one({"count": 0})

app = Flask(__name__)
