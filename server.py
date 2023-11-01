# from utils.static_routes import *
# from utils.auth_routes import *
# from utils.post import *
# from utils.response import *

from flask import Flask, request, Response, make_response,jsonify,redirect, json
from pymongo import MongoClient
from bson import json_util
import hashlib
import bcrypt
import secrets
from bson.objectid import ObjectId

from utils.response import sendResponse
from utils.config import app, userCollection, postCollection
# from utils.static_routes import *
app = Flask(__name__)

# #! "localhost" for server.py, "mongo" for docker
# mongo_client = MongoClient("localhost")
# # mongo_client = MongoClient("mongo")
# db = mongo_client["FILO"]
# userCollection = db["user"]
# postCollection = db["global post"]

@app.route('/')
def serve_react_app():
    try:
        token = request.cookies.get("auth_tok")
        if not token:
            return redirect("login")
        else:
            return sendResponse(filenamedir="./build/index.html", path=None, mimetype="text/html", xcontenttypeoptions="nosniff", makeresponse=True)
    except Exception:
        return page_not_found()

@app.route('/static/css/<path:filename>')
def serve_static_css(filename):
    try:
        # response = send_from_directory('./build/static/css', filename)
        # response.headers['MIME type'] = 'text/css'
        # response.headers['X-Content-Type-Options'] = 'nosniff'
        # return response
        return sendResponse(filenamedir="./build/static/css", path=filename, mimetype="text/css", xcontenttypeoptions="nosniff", makeresponse=False)
    except Exception:
        return page_not_found()

@app.route('/static/js/<path:filename>')
def serve_static_js(filename):
    try:
        # response = send_from_directory('./build/static/js', filename)
        # response.headers['MIME type'] = 'text/javascript'
        # response.headers['X-Content-Type-Options'] = 'nosniff'
        # return response
        return sendResponse(filenamedir="./build/static/js", path=filename, mimetype="text/javascript", xcontenttypeoptions="nosniff", makeresponse=False)
    except Exception:
        return page_not_found()

@app.route('/image/<path:picture>')
def image(picture):
    try:
        
        # response = make_response(send_file(f'public/image/{picture}', mimetype="image/jpeg"))
        # response.headers['X-Content-Type-Options'] = 'nosniff'
        # return response
        return sendResponse(filenamedir=f"public/image{picture}", path=None, mimetype="image/jpeg", xcontenttypeoptions="nosniff", makeresponse=True)
    except Exception:
        return page_not_found()    
    
@app.route('/static/media/<path:filename>')
def serve_svg(filename):
    try:
        # response = send_from_directory('./build/static/media', filename)
        # response.headers['mimetype'] = "image/svg+xml"
        # response.headers['X-Content-Type-Options'] = 'nosniff'
        # return response
        return sendResponse(filenamedir="./build/static/media", path=filename, mimetype="image/svg+xml", xcontenttypeoptions="nosniff", makeresponse=False)
    except Exception:
        return page_not_found()



## Login and Register
@app.route('/login/new_user', methods=['POST'])  
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
        userCollection.insert_one({
            "email": email,
            "username": username, 
            "password": hashed_password, 
            "salt": salt, 
            })
        return make_response()
    except Exception as e:  # Catch the exception and print it for debugging
        print(e)
        return jsonify({'message': 'An error occurred'}), 500

@app.route('/login/returning_user', methods=['POST'])  
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

@app.route('/login')
def register():
    try:
        # response = make_response(send_file('./build/index.html', mimetype='text/html'))
        # response.headers['X-Content-Type-Options'] = 'nosniff'
        # return response
        return sendResponse(filenamedir="./build/index.html", path=None, mimetype="text/html", xcontenttypeoptions="nosniff", makeresponse=True)
    except Exception:
        return page_not_found()



## Get User
@app.route("/get-user")
def getUser():
    try:
        token = request.cookies.get("auth_tok")
        print(token)

        user = userCollection.find_one({"token": hashlib.sha256(token.encode("utf-8")).hexdigest()})

        return json_util.dumps(user["username"])
    except Exception as e:
            error_message = "An error occurred: {}".format(str(e))
            print("***********ERROR**:", error_message)




## Post
@app.route('/posts-upload', methods = ['POST'])
def userPost():
    try:
        token = request.cookies.get("auth_tok")
        user = userCollection.find_one({"token": hashlib.sha256(token.encode("utf-8")).hexdigest()})
        data = request.get_json()
        post = data.get("description")
        title = data.get("title")
        postCollection.insert_one({
            "username": user["username"],
            "description": post,
            "title": title,
            "like_counter":0,
            "likers":[],
            "comments": [],
            "image_id":None
        })
        return make_response()
    except Exception:
        return page_not_found()    

@app.route("/get-posts")
def getPost():
    try:
        posts = list(postCollection.find())
        return json_util.dumps(posts)  
    except Exception as e:
            error_message = "An error occurred: {}".format(str(e))
            print("***********ERROR**:", error_message)

@app.route('/post-like', methods=['POST'])
def post_like():
    data = request.json
    postId = data["postId"]['$oid']
    userId = data['userId']
    post = postCollection.find_one({'_id': ObjectId(postId)})
    if not post:
        return jsonify({'error': 'Post not found'}), 404

    likers = set(post['likers'])
   
    like_counter = len(likers)

    if userId in likers:
        likers.remove(userId)
        post = postCollection.update_one(
            {"_id": ObjectId(postId)}, 
            {
                "$pull": { "likers": userId },
                "$set": {'like_counter': like_counter-1}
            }
        )
    else:
        likers.add(userId)
        post = postCollection.update_one(
            {"_id": ObjectId(postId)}, 
            {
                "$addToSet": { "likers": userId},
                "$set": {'like_counter': like_counter+1}
            }
        )

    return jsonify({'like_counter': like_counter})


@app.errorhandler(404)
def page_not_found(error=None):
    return Response(
        response='HTTP/1.1 404 Not Found',
        status=404,
        mimetype="text/plain",
        headers={'X-Content-Type-Options': 'nosniff'}
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
