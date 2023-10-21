from flask import Flask, request, Response, send_file, make_response, send_from_directory
import pymongo
from pymongo import MongoClient
app = Flask(__name__)

mongo_client = MongoClient("mongo") #"localhost" for server.py, "mongo" for docker
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

@app.route('/image/<picture>')
def image(picture):
    try:
        # need to read in the svg files
        
        response = make_response(send_file(f'public/image/{picture}', mimetype="image/jpeg"))
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
        checking = userCollection.find_one({"username":retusername})
        salt = checking["salt"]
        hasheduserpasswd = bcrypt.hashpw(retuserpassword.encode(),salt)
        if retusername == checking["username"]:
            if hasheduserpasswd == checking["password"]:
                token1 = secrets.token_hex()
                result = hashlib.sha256(token1.encode("utf-8")).hexdigest()
                response = make_response()
                response.set_cookie("auth_tok",value = token1,max_age=3600,httponly=True)
                userCollection.update_one(
                    {"username":retusername},
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
