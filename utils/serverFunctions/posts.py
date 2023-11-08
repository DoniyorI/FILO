from flask import make_response, jsonify
import hashlib
from bson.objectid import ObjectId

def uploadPosts(token, data, collection1, collection2):
    post = data.get("description")
    title = data.get("title")
    user = collection1.find_one({"token": hashlib.sha256(token.encode("utf-8")).hexdigest()})
    collection2.insert_one({
        "username": user["username"],
        "description": post,
        "title": title,
        "like_counter":0,
        "likers":[],
        "comments": [],
        "image_id":None
    })
    return make_response()

def likePosts(data, collection):
    postId = data["postId"]['$oid']
    userId = data['userId']
    post = collection.find_one({'_id': ObjectId(postId)})
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    likers = set(post['likers'])
    like_counter = len(likers)
    if userId in likers:
        likers.remove(userId)
        post = collection.update_one(
            {"_id": ObjectId(postId)}, 
            {
                "$pull": { "likers": userId },
                "$set": {'like_counter': like_counter-1}
            }
        )
    else:
        likers.add(userId)
        post = collection.update_one(
            {"_id": ObjectId(postId)}, 
            {
                "$addToSet": { "likers": userId},
                "$set": {'like_counter': like_counter+1}
            }
        )
    return jsonify({'like_counter': like_counter})
