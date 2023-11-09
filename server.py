from utils.static_routes import *
from utils.auth_routes import *
from utils.post import *
from utils.response import *
from utils.userInteract import *
from utils.channels import *

from flask import Flask, abort
from utils.config import app
import os
app = Flask(__name__)

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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
