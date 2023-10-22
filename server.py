import hashlib
import bcrypt
from flask import Flask, request, Response, send_file, make_response, send_from_directory,jsonify
import secrets
from bson.objectid import ObjectId
from pymongo import MongoClient
from bson import json_util
from flask import json

app = Flask(__name__)

# "localhost" for server.py, "mongo" for docker
mongo_client = MongoClient("localhost")
db = mongo_client["FILO"]
userCollection = db["user"]
postCollection = db["global post"]

# postCollection.insert_one({
#     "username": "test",
#     "description": "test",
#     "title" :"test",
#     "like_counter":0,
#     "likers":[],
#     "comments": [],
#     "image_id":None
# })


def getUsername(token):
    checking = userCollection.find_one({"token":hashlib.sha256(token.encode("utf-8")).hexdigest()})
    print(checking)
    return checking["username"]

@app.route('/')
def serve_react_app():
    try:
        response = make_response(send_file('./build/index.html', mimetype='text/html'))
        response.headers['X-Content-Type-Options'] = 'nosniff'
        return response
    except Exception:
        return page_not_found()
@app.route("/get-posts")
def getPost():
    try:
        posts = list(postCollection.find({}, {'_id': False}))  # Exclude _id from the response
        return json_util.dumps(posts)  
    except Exception as e:
            error_message = "An error occurred: {}".format(str(e))
            print("***********ERROR**:", error_message)

@app.route('/static/css/<path:filename>')
def serve_static_css(filename):
    try:
        response = send_from_directory('./build/static/css', filename)
        response.headers['MIME type'] = 'text/css'
        response.headers['X-Content-Type-Options'] = 'nosniff'
        return response
    except Exception:
        return page_not_found()

@app.route('/static/js/<path:filename>')
def serve_static_js(filename):
    try:
        response = send_from_directory('./build/static/js', filename)
        response.headers['MIME type'] = 'text/javascript'
        response.headers['X-Content-Type-Options'] = 'nosniff'
        return response
    except Exception:
        return page_not_found()


@app.route('/login')
def register():
    try:
        response = make_response(send_file('./build/index.html', mimetype='text/html'))
        response.headers['X-Content-Type-Options'] = 'nosniff'
        return response
    except Exception:
        return page_not_found()

@app.route('/image/<picture>')
def image(picture):
    try:
        # need to read in the svg files
        
        response = make_response(send_file(f'public/image/{picture}', mimetype="image/jpeg"))
        response.headers['X-Content-Type-Options'] = 'nosniff'
        return response
    except Exception:
        return page_not_found()    
    
@app.route('/static/media/<path:filename>')
def serve_svg(filename):
    try:
        response = send_from_directory('./build/static/media', filename)
        response.headers['mimetype'] = "image/svg+xml"
        response.headers['X-Content-Type-Options'] = 'nosniff'
        return response
    except Exception:
        return page_not_found()

@app.route('/login/new_user', methods=['POST'])  
def newUser():
    try:
        newUserDat = request.get_json()
        print("register form",newUserDat)
        email = newUserDat.get("email")
        print("email", email)
        username = newUserDat.get("username")
        print("username", username)
        password = newUserDat.get("password")
        print("password", password)
        passwordConfirm = newUserDat.get("confirm_password")
        print("passwordConfirm", passwordConfirm)
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
    except Exception as e:  # Catch the exception and print it for debugging
        print(e)
        return jsonify({'message': 'An error occurred'}), 500
        
@app.route('/posts-upload', methods = ['POST'])
def userPost():
    try:
        print("***************TRYING TO LOAD *******************")
        token = request.cookies.get("auth_tok")
        print(token)
        user = userCollection.find_one({"token": hashlib.sha256(token.encode("utf-8")).hexdigest()})
        data = request.get_json()
        print(data)
        post = data.get("description")
        print(post)
        title = data.get("title")
        print(title)
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

@app.route('/post-like', methods = ['POST'])
def userLike():
    try:
        data = request.get_json()
        objID = data.get('objectID')
        token = request.cookies.get("auth_tok")
        username = getUsername(token)
        thisPost = postCollection.find_one({"_id": ObjectId(objID)})
        postCollection.update_one({"_id": ObjectId(objID)}, {"$set": { "likers": thisPost["likers"].add(username) }}) 

        return make_response()
    except Exception:
        return page_not_found()  

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
