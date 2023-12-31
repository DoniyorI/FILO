from utils.static_routes import *
from utils.auth_routes import *
from utils.post import *
from utils.response import *
from utils.userInteract import *
from utils.channels import *
from utils.config import app, channelCollection
from utils.Google import *

import os
from datetime import datetime, timedelta

from flask import Flask, abort, make_response, jsonify, request, url_for
from flask_socketio import SocketIO, emit, join_room, leave_room
from itsdangerous import URLSafeTimedSerializer


import base64
from email.mime.text import MIMEText
import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

app = Flask(__name__)

# TODO: Make these app.config confidential, not hardcoded here
app.config['SECRET_KEY'] = str(os.urandom(16))

# Initialize itsdangerous for token generation
serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])

def generate_verification_token(email):
    return serializer.dumps(email, salt=app.config['SECRET_KEY'])


def verify_token(token, expiration=3600):
    try:
        email = serializer.loads(token, salt=app.config['SECRET_KEY'], max_age=expiration)
        return email
    except Exception as e:
        # print(f"Token verification failed: {e}")
        return None

def send_verification_email(email):
    print()
    user_data = userCollection.find_one({"email": email})
    username = user_data['username']
    token = generate_verification_token(email)

    verification_link = url_for('verify_email', token=token, _external=True)

    clientSecret = "client_secret.json"
    apiName = 'gmail'
    apiVersion = "v1"
    scopes = ['https://mail.google.com/']

    service = Create_Service(clientSecret, apiName, apiVersion, scopes)

    mimeMsg = MIMEMultipart()
    emailMsg = f"Hello {username},\n\nClick the link below to verify your FILO account:\n\n{verification_link}\n\nBest regards,\nFILO"
    mimeMsg['to'] = email
    mimeMsg['subject'] = 'Verify Your FILO Account'
    mimeMsg.attach(MIMEText(emailMsg, 'plain'))

    raw_string = base64.urlsafe_b64encode(mimeMsg.as_bytes()).decode()

    try:
        message = service.users().messages().send(userId='me', body={'raw': raw_string}).execute()
        # print(F'sent message to {message} Message Id: {message["id"]}')
    except HTTPError as error:
        # print(F'An error occurred: {error}')
        message = None

@app.route('/send-verification-email', methods=['POST'])
def send_verification_email_route():
    try:
        # Extract email from the JSON payload
        data = request.get_json()
        email = data.get('email')

        # Validate and send verification email
        if email:
            send_verification_email(email)
            return jsonify({'message': 'Verification email sent successfully'})
        else:
            return jsonify({'error': 'Email not provided in the request. Failed to send verification email.'}), 400

    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500

@app.route('/verify')
def verify_email():
    token = request.args.get('token')
    # Verify the token and update user's status in the database
    email = verify_token(token)
    if email:
        # TODO: Update User's Database (e.g., set verified=True)
        user_data = userCollection.find_one({"email": email})
        if user_data:
            userCollection.update_one({"email": email}, {"$set": {"verified": True}})
            return redirect("/")
            # return 'Email verified successfully!'
        else:
            return jsonify({"message_verify": False}), 200
        
        
    else:
        return jsonify({"message_verify": False, "error": "Invalid or expired token. Please request a new verification email."}), 200


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

            # print(currTime)
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
            # print(f"Error joining channel: {e}")
            # print("someone left the channel")
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
    # print(filename)
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
