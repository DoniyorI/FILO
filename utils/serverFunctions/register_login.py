import bcrypt
import hashlib
import secrets
from flask import jsonify, make_response

def newUserRegister(data, collection):
    email = data.get("email")
    username = data.get("username")
    password = data.get("password")
    passwordConfirm = data.get("confirm_password")
    findDupName = collection.find_one({"username": username})
    if findDupName:
        return jsonify({'message': 'choose different username'}), 400
    if username == " " or password == " ":
        return jsonify({'message': 'Username and password are required'}), 400
    if password != passwordConfirm:  # Use != instead of is not
        return jsonify({'message': 'Passwords do not match'}), 400
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    collection.insert_one({
        "email": email,
        "username": username, 
        "password": hashed_password, 
        "salt": salt, 
        })
    return make_response()
    
def retUserLogin(data, collection):
    retusername = data.get("username")
    retuserpassword = data.get("password")
    if retusername == " " or retuserpassword == " ":
        return jsonify({'message': 'Username and password are required'}), 400
    checking = collection.find_one({"username": retusername})
    salt = checking["salt"]
    hasheduserpasswd = bcrypt.hashpw(retuserpassword.encode(),salt)
    if retusername == checking["username"]:
        if hasheduserpasswd == checking["password"]:
            token1 = secrets.token_hex()
            result = hashlib.sha256(token1.encode("utf-8")).hexdigest()
            response = make_response()
            response.set_cookie("auth_tok",value = token1,max_age=3600,httponly=True)
            collection.update_one(
                {"username": retusername},
                {"$set":{"token":result}}
            )
            return response
        else:
            return jsonify({'message': 'password is incorrect'}), 400
    else:
        return jsonify({'message': 'Username is incorrect'}), 400