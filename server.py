import hashlib
import bcrypt
from flask import Flask, request, Response, send_file, make_response, send_from_directory, jsonify, redirect
import pymongo
from pymongo import MongoClient
app = Flask(__name__)


# "localhost" for server.py, "mongo" for docker
mongo_client = MongoClient("localhost")
db = mongo_client["FILO"]
userCollection = db["user"]


@app.route('/')
def serve_react_app():

    try:
        response = make_response(
            send_file('./build/index.html', mimetype='text/html'))
        response.headers['X-Content-Type-Options'] = 'nosniff'
        return response
    except Exception:
        return page_not_found()


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
        response = make_response(
            send_file('./build/index.html', mimetype='text/html'))
        response.headers['X-Content-Type-Options'] = 'nosniff'
        return response
    except Exception:
        return page_not_found()


@app.route('/login/new_user', methods=['POST'])  
def newUser():
    print("*********new user*********")
    try:
        newUserDat = request.get_json()
        print(newUserDat)
        email = newUserDat.get("email")
        print(email)
        username = newUserDat.get("username")
        print(username)
        password = newUserDat.get("password")
        print(password)
        passwordConfirm = newUserDat.get("confirm_password")
        print(passwordConfirm)
        if username == " " or password == " ":
            print("user does not have both username and pass")
            return jsonify({'message': 'Username and password are required'}), 400

        if password != passwordConfirm:  # Use != instead of is not
            print("user does not have both username and pass")
            return jsonify({'message': 'Passwords do not match'}), 400
        
        print("user has both username and pass")
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        print("///////////////")
        print(hashed_password)
        userCollection.insert_one({
            "email": email,
            "username": username, 
            "password": hashed_password, 
            "salt": salt, 
            "token": None})
        
        print("user")
        # return jsonify({'message': 'Registration successful'}), 301
        return redirect("/", code=301)
    except Exception as e:  # Catch the exception and print it for debugging
        print(e)
        return jsonify({'message': 'An error occurred'}), 500


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
