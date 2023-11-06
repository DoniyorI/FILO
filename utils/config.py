from flask import Flask
from pymongo import MongoClient
from bson import json_util
import hashlib
import bcrypt
import secrets
from bson.objectid import ObjectId


#! "localhost" for server.py, "mongo" for docker
server = "localhost"
server1 = "mongo"
mongo_client = MongoClient(server)
db = mongo_client["FILO"]
userCollection = db["user"]
postCollection = db["global post"]

app = Flask(__name__)
