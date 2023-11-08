from flask import request, make_response, jsonify
from bson import json_util
import bcrypt
import hashlib
import secrets

from utils.response import sendResponse, page_not_found
from utils.config import app, userCollection, channelCollection


def newUser():
    try:
        newUserDat = request.get_json()
            
        email = newUserDat.get("email")
        username = newUserDat.get("username")
        password = newUserDat.get("password")
        passwordConfirm = newUserDat.get("confirm_password")
        
        findDupName = userCollection.find_one({"username": username})
        if findDupName:
            return jsonify({'message': 'choose different username'}), 400
        if username == " " or password == " ":
            return jsonify({'message': 'Username and password are required'}), 400

        if password != passwordConfirm:  # Use != instead of is not
            return jsonify({'message': 'Passwords do not match'}), 400
        
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

        #test DM Render
        # testDM = {
        #     "_id": "1",
        #     "username": "test 1",
        #     "profile_path": "mainProfile.svg",
        #     "messages": []
        # }
        # testDM2 = {
        #     "_id": "2",
        #     "username": "test 2",
        #     "profile_path": "mainProfile.svg",
        #     "messages": []
        # }
        # testChannel = {
        #     "_id": "3",
        #     "name": "channel test 2",
        #     "description": "channel test 2",
        #     "member_limit": 5,
        #     "image": "Channel.svg",
        #     "messages": []
        # }
        # channelCollection.insert_one(testChannel)

        userCollection.insert_one({
            "email": email,
            "username": username, 
            "password": hashed_password, 
            "salt": salt, 
            "following": [],
            'followers': [],
            "profile_image": "mainProfile.svg",
            "direct_messages": [],
            })
        return make_response()
    except Exception as e:  # Catch the exception and print it for debugging
        print(e)
        return jsonify({'message': 'An error occurred'}), 500

def returningUser():
    try:
        retUserdat = request.get_json()
        retusername = retUserdat.get("username")
        retuserpassword = retUserdat.get("password")

        if retusername == " " or retuserpassword == " ":
            return jsonify({'message': 'Username and password are required'}), 400
        checking = userCollection.find_one({"username": retusername})
        salt = checking["salt"]
        hasheduserpasswd = bcrypt.hashpw(retuserpassword.encode(),salt)
        if retusername == checking["username"]:
            if hasheduserpasswd == checking["password"]:
                token1 = secrets.token_hex()
                result = hashlib.sha256(token1.encode("utf-8")).hexdigest()
                response = make_response()
                response.set_cookie("auth_tok",value = token1,max_age=3600,httponly=True)
                userCollection.update_one(
                    {"username": retusername},
                    {"$set":{"token":result}}
                )
                return response
            else:
                return jsonify({'message': 'password is incorrect'}), 400
        else:
            return jsonify({'message': 'Username is incorrect'}), 400
    except Exception as e: 
        return jsonify({'message': 'An error occurred'}), 500

def register():
    try:
        return sendResponse(filenamedir="./build/index.html", path=None, mimetype="text/html", xcontenttypeoptions="nosniff", makeresponse=True)
    except Exception:
        return page_not_found()

def getUser():
    try:
        token = request.cookies.get("auth_tok")
        user = userCollection.find_one({"token": hashlib.sha256(token.encode("utf-8")).hexdigest()})
        channels = channelCollection.find({})
        user["channels"] = channels
   
        return json_util.dumps(user)
    except Exception as e:
            error_message = "An error occurred: {}".format(str(e))
            print("***********ERROR**:", error_message)
