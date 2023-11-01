from flask import Flask
from pymongo import MongoClient
from bson import json_util
import hashlib
import bcrypt
import secrets
from bson.objectid import ObjectId


#! "localhost" for server.py, "mongo" for docker
mongo_client = MongoClient("localhost")
# mongo_client = MongoClient("mongo")
db = mongo_client["FILO"]
userCollection = db["user"]
postCollection = db["global post"]

app = Flask(__name__)
