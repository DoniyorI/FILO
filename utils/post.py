
from bson import json_util
from bson.objectid import ObjectId
from flask import request, jsonify
import hashlib

from utils.config import app, userCollection, postCollection
from utils.response import make_response, page_not_found

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

