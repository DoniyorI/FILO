from flask import Flask, request, Response, send_file, make_response, send_from_directory, jsonify, redirect
import pymongo
from pymongo import MongoClient
app = Flask(__name__)
import bcrypt
import hashlib


mongo_client = MongoClient("localhost") #"localhost" for server.py, "mongo" for docker
db = mongo_client["FILO"]
userCollection = db["user"]

@app.route('/')
def serve_react_app():

    try:
        response = make_response(send_file('./build/index.html', mimetype='text/html'))
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
        response = make_response(send_file('./build/index.html', mimetype='text/html'))
        response.headers['X-Content-Type-Options'] = 'nosniff'
        return response
    except Exception:
        return page_not_found()

@app.route('/login/new_user', method = ["POST"])
def newUser():
    try:
        newUserDat= request.get_json()
        email = newUserDat.get("email_new")
        username = newUserDat.get("username_new")
        password = newUserDat.get("password_new")
        passwordConfirm = newUserDat.get("confirm_password_new")
        
        if not username or not password:
            return jsonify({'message': 'Username and password are required'}), 400
        
        if password is not passwordConfirm:
            return jsonify({'message': 'passwords do not match'}), 400
        
        salt = bcrypt.gensalt()
        userCollection.insert_one({"username": username, "password": bcrypt.hashpw(password.encode('utf-8'), salt), "salt": salt, "token":None})
        return redirect('/')
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
