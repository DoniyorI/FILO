from utils.static_routes import *
from utils.auth_routes import *
from utils.post import *
from utils.response import *
from utils.userInteract import *
from utils.channels import *
from utils.config import app, channelCollection

import os
from datetime import datetime, timedelta

from flask import Flask, abort, make_response, jsonify, request, url_for
from flask_socketio import SocketIO, emit, join_room, leave_room
# from flask_pymongo import PyMongo
from flask_oauthlib.client import OAuth
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer
from google.oauth2.credentials import Credentials




import base64
from email.mime.text import MIMEText
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from requests import HTTPError


# app = Flask(__name__)


# @app.route('/send-verification-email', methods=['POST'])
# def send_verification_email_route():
#     SCOPES = [
#             "https://www.googleapis.com/auth/gmail.send"
#         ]
#     flow = InstalledAppFlow.from_client_secrets_file('googleCreds.json', SCOPES)
#     creds = flow.run_local_server(port=8080)

#     service = build('gmail', 'v1', credentials=creds)
#     message = MIMEText('This is the body of the email')
#     message['to'] = 'zodin.thanga9@gmail.com'
#     message['subject'] = 'Email Subject'
#     create_message = {'raw': base64.urlsafe_b64encode(message.as_bytes()).decode()}

#     try:
#         message = (service.users().messages().send(userId="me", body=create_message).execute())
#         print(F'sent message to {message} Message Id: {message["id"]}')
#     except HTTPError as error:
#         print(F'An error occurred: {error}')
#         message = None




#! ************************************************************************************************************************
# app.config['SECRET_KEY'] = 'your_secret_key'
# app.config['GOOGLE_ID'] = 'your_google_client_id'
# app.config['GOOGLE_SECRET'] = 'your_google_client_secret'
# app.config['MONGO_URI'] = 'your_mongo_connection_string'

# oauth = OAuth(app)

# google = oauth.remote_app(
#     'google',
#     consumer_key=app.config['GOOGLE_ID'],
#     consumer_secret=app.config['GOOGLE_SECRET'],
#     request_token_params={'scope': 'email'},
#     base_url='https://www.googleapis.com/oauth2/v1/',
#     request_token_url=None,
#     access_token_method='POST',
#     access_token_url='https://accounts.google.com/o/oauth2/token',
#     authorize_url='https://accounts.google.com/o/oauth2/auth',
# )

# mongo = PyMongo(app)
#! ************************************************************************************************************************

clientId = "343448333586-ijsrfcaqfknaqs85etmg8cbaul44bc0e.apps.googleusercontent.com"
clientSecret = "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"

# redirURI = "http://localhost:8080/login"
# refreshTok = "1//049zMs46M-bDoCgYIARAAGAQSNwF-L9IrzD1xL7WvqPEXbYg2Dyz_SD98l98-35Kg7BIdcSHgpIV9alM6TXhX4f1X1MqBDnrXRlM"

app = Flask(__name__)

# TODO: Make these app.config confidential, not hardcoded here
# Configure Flask-Mail
app.config['SECRET_KEY'] = str(os.urandom(16))
app.config['MAIL_SERVER'] = 'smtp.googlemail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'filowebconnect@gmail.com'
app.config['MAIL_PASSWORD'] = 'OAuth2' # Set a placeholder for now, will be replaced dynamically
app.config['MAIL_DEFAULT_SENDER'] = 'filowebconnect@gmail.com'
# app.config['MONGO_URI'] = 'mongodb://username:password@localhost:27017/mydatabase'

# Configure OAuth for Google
oauth = OAuth(app)

# google = oauth.remote_app(
#     'google',
#     consumer_key=clientId,
#     consumer_secret=clientSecret,
#     request_token_params={'scope': 'email'},
#     base_url='https://www.googleapis.com/oauth2/v1/',
#     request_token_url=None,
#     access_token_method='POST',
#     access_token_url='https://accounts.google.com/o/oauth2/token',
#     authorize_url='https://accounts.google.com/o/oauth2/auth',
# )

# Initialize Flask-Mail
mail = Mail(app)

# Initialize itsdangerous for token generation
serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])

# Rest of your existing code...

def generate_verification_token(email):
    return serializer.dumps(email, salt=app.config['SECRET_KEY'])

def verify_token(token, expiration=3600):
    try:
        email = serializer.loads(token, salt=app.config['SECRET_KEY'], max_age=expiration)
        return email
    except Exception as e:
        print(f"Token verification failed: {e}")
        return None

def send_verification_email(email):
    # Generate a unique token for the user
    token = generate_verification_token(email)
    print("############################################################")
    print("USER'S TOKEN", token)

    # Construct the verification link with the token
    verification_link = url_for('verify_email', token=token, _external=True)

    # TODO: Update User's Database with the token
    # You may store the token in the user's database record

    # Create the email message
    subject = 'Verify Your FILO Account'
    body = f'Click the following link to verify your account: {verification_link}'
    sender = 'filowebconnect@gmail.com'

    msg = Message(subject, recipients=[email], sender=sender)
    msg.body = body

    try:
        print("SEND VERIFICATION TRY")
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

@app.route('/send-verification-email', methods=['POST'])
def send_verification_email_route():
    try:
        # Extract email from the JSON payload
        data = request.get_json()
        print("----------------------------------")
        print("SEND VER. DATA", data)
        email = data.get('email')
        print("SERVER.PY EMAIL", email)

        # Validate and send verification email
        if email:
            send_verification_email(email)
            return jsonify({'message': 'Verification email sent successfully'})
        else:
            return jsonify({'error': 'Email not provided in the request. Failed to send verification email.'}), 400

    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500

@app.route('/verify-email/<token>')
def verify_email(token):
    # Verify the token and update user's status in the database
    email = verify_token(token)
    if email:
        # TODO: Update User's Database (e.g., set verified=True)
        user_data = userCollection.find_one({"email": email})
        if user_data:
            userCollection.update_one({"email": email}, {"$set": {"verified": True}})
            return jsonify({"message_verify": True}), 200
            # return 'Email verified successfully!'
        else:
            return jsonify({"message_verify": False}), 200
        
        
    else:
        return jsonify({"message_verify": False, "error": "Invalid or expired token. Please request a new verification email."}), 200


#! GOOGLE OAUTH2.0 Functions

# Function to send verification email using Google OAuth
def send_verification_email_google(email, access_token):
    token = generate_verification_token(email)
    verification_link = url_for('verify_email', token=token, _external=True)
    subject = 'Verify Your FILO Account'
    body = f'Click the following link to verify your account: {verification_link}'
    
    msg = Message(subject, recipients=[email], sender='your_email@gmail.com')
    msg.body = body

    try:
        # Dynamically set the MAIL_PASSWORD to the access token obtained from OAuth
        app.config['MAIL_PASSWORD'] = access_token
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

# Route to send verification email using Google OAuth
@app.route('/send-verification-email-google', methods=['POST'])
def send_verification_email_google_route():
    try:
        data = request.get_json()
        email = data.get('email')
        access_token = data.get('access_token')  # Add this line to retrieve the access_token

        if email and access_token:
            send_verification_email_google(email, access_token)  # Pass both arguments to the function
            return jsonify({'message': 'Verification email sent successfully'})
        else:
            return jsonify({'error': 'Email or access_token not provided in the request. Failed to send verification email.'}), 400

    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500

#! ------------------------------------------------------------------------------------------------------------------------------------------------------------


app.config['SECRET_KEY'] = os.urandom(32)

socketio = SocketIO(app, cors_allowed_origins="*", transports=['websocket'])

@socketio.on('join_channel')
def handle_join_channel(timeData):
    while(True):
        # print("00000000000000")
        # channel_name = timeData['channel_name']
        try:
            channel_name = timeData['channel_name']
            username = timeData['username']
            
            join_room(channel_name)

            channel = channelCollection.find_one({"channel_name": channel_name})
            messages = channel.get("messages", [])
            members = channel.get("members", [])
            image_path = channel.get("image_path", "")
            utc_time = datetime.utcnow()
            currTime = utc_time - timedelta(hours=5)

            print(currTime)
            end_time = channel["time"]
            closeServerTime = datetime(int(end_time[0]), int(end_time[1]), int(end_time[2]), int(end_time[3]), int(end_time[4]))
            # endTime = datetime.datetime.strptime(closeServerTime, "%Y/%m/%d/%H/%M")
            timeDifference = closeServerTime - currTime
            # print(type(timeRemaining))
            years, days = divmod(timeDifference.days, 365)
            hours, remainder = divmod(timeDifference.seconds, 3600)
            minutes, seconds = divmod(remainder, 60)

            # print(timeRemaining)
            # print(currTime)
            # print(closeServerTime)
            # print(timeDifference)
            if timeDifference.total_seconds() <= 0:
                timeRemainingStr = "TIME IS UP"
                emit('request_countdown', {"timeRemaining": timeRemainingStr, "messages":messages, "members": members, "image_path": image_path }, room=channel_name, broadcast=True)
                break
            else:
                timeParts = []
                if years > 0:
                    timeParts.append(f"{years} Years")
                if days > 0 or years > 0:  # Display days if there are any days or years
                    timeParts.append(f"{days} Days")
                timeParts.append(f"{hours}:{minutes:02d}:{seconds:02d}")  # Pad minutes and seconds with leading zeros
                timeRemainingStr = ", ".join(timeParts)

            emit('request_countdown', {"timeRemaining": timeRemainingStr, "messages":messages, "members": members, "image_path": image_path }, room=channel_name, broadcast=True)
            socketio.sleep(1)
            
        except KeyError as e:
            print(f"Error joining channel: {e}")
            print("someone left the channel")
            break
        # Handle the error appropriately

@socketio.on('new_message')
def handle_new_message(data):
    channel_name = data['channel_name']
    username = data['username']
    message = data['message']

    message_data = {
        'username': username,
        'message': message,
        'time': str(datetime.now().timestamp())  # Convert datetime to timestamp
    }

    # Update the channel document to add the message
    channelCollection.update_one(
        {'channel_name': channel_name},
        {'$push': {'messages': message_data}}
    )

    channel = channelCollection.find_one({"channel_name": channel_name})
    messages = channel["messages"]

    emit('message_received', {'messages': messages, 'message': message}, room=channel_name, broadcast=True)

@socketio.on('leave_channel')
def handle_leave_channel(data):
    channel_name = data['channel_name']
    username = data['username']

    leave_room(channel_name)


@app.route("/messages/<path:filename>")
def doNothing(filename):
    print(filename)
    return serve_react_app()

@app.route('/')
def do():
    return serve_react_app()

@app.route('/static/css/<path:filename>')
def doCSS(filename):
    return serve_static_css(filename)

@app.route('/static/js/<path:filename>')
def doJSS(filename):
    return serve_static_js(filename)

@app.route('/public/image/<filename>')
def serve_image(filename):
    try:
        # Assuming your images are stored in a folder named 'public/image' within your Flask application directory
        return send_from_directory('public/image', filename)
    except FileNotFoundError:
        abort(404)

# @app.route('/public/image/<path:picture>')
# def doImage(picture):
#     return image(picture)    

@app.route('/static/media/<path:filename>')
def doSVG(filename):
    return serve_svg(filename)

#TODO
# Take the Channels from user collection and make its own collection
            # Update "/get-user" so it sill sends the channel collection like original so front end does not have to update

# "/new-channel" Create New Channel Post Request should add to Channel collection and redirect to the home (Store: Channel Name, Description, Member Limit, Image(Buffering), {Date, Time, TimeZone} or Never(TRUE or FALSE))

# "/upload-profile Picture" (BUFFERING)

# UPDATE for images at "/posts-upload" and "/get-post" if Needed (BUFFERING)

# "/get-channel" send Channel information should receive a Channel ID to look up should send back everything of that Channel should also work with Web Sockets if the timer hits 0 should stop and no more typing so when messages are being sent and timer is 0 then dont update
            # Messages should be updated (WEBSOCKET)
            # Timer (WEBSOCKET)


# Jesse Email
# Add timing to the chat the rooms. Instead of having a room close when everyone leaves, have a room end after a certain amount of time passes. The timing must be maintained by the server and sent to each client via WebSockets. Once the timer hits 0, no one can chat in that room anymore
# Anything else you come up with that satisfies both a live timer that is maintained by the server with the current time sent to the users via WebSockets -and- the app having some different behavior after a certain amount of time

## Login and Register
@app.route('/login/new_user', methods=['POST'])  
def doNewUser():
    return newUser()

@app.route('/login/returning_user', methods=['POST'])  
def doReturningUser():
    return returningUser()

@app.route('/login')
def doRegister():
    return register()

@app.route('/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({"message": "Logged out successfully"}))
    response.set_cookie('auth_token', '', expires=0)  # Setting the cookie to expire immediately
    return response

@app.route("/get-user")
def doGetUser():
    return getUser()

@app.route("/create-channel", methods = ["POST"])
def doNewChannel():
    return newChannel()
    
@app.route("/channel-message", methods = ["POST"])
def doChannelMessage():
    return channelMessage()

@app.route('/posts-upload', methods = ['POST'])
def doUserPost():
    return userPost()

@app.route("/get-posts")
def doGetPost():
    return getPost()

@app.route('/post-like', methods=['POST'])
def doPostLike():
    return post_like()

@app.route('/follow-user', methods = ['POST'])
def doFollowUser():
    return follow_user()

@app.route('/new-profile', methods = ['POST'])
def doNewProfile():
    return new_profile()

@app.errorhandler(404)
def doPNF(error=None):
    return page_not_found()

@app.route("/get-channel")
def doGetChannel():
    return getChannel()

if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=8080, allow_unsafe_werkzeug=True)
    # app.run(app, host='0.0.0.0', port=8080)
