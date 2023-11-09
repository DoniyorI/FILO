from flask import request, make_response, jsonify
import hashlib
from bson import json_util
from bson.objectid import ObjectId
import os
from werkzeug.utils import secure_filename
import base64


from utils.config import app, userCollection, postCollection,imgCounterCollection
from utils.response import make_response, page_not_found

def userPost():
    try:
        token = request.cookies.get("auth_tok")
        user = userCollection.find_one({"token": hashlib.sha256(token.encode("utf-8")).hexdigest()})
        data = request.get_json()
        post = data.get("description")
        title = data.get("title")
        imgData = data.get("image") 
        image_path = ""

        if imgData != "":
            imgCount = imgCounterCollection.find_one({})["count"]
            new_count = imgCount + 1
            imgCounterCollection.update_one({}, {'$set': {"count": new_count}})
    
            imageName = str(new_count) + ".jpg"  # Assuming the image is a JPEG

            # Decode the image data
            _, encoded = imgData.split(",", 1)
            decoded_bytes = base64.b64decode(encoded)
            
            # Ensure the upload folder exists
            upload_folder = "public/image"
            if not os.path.exists(upload_folder):
                os.makedirs(upload_folder)
            
            # filename = os.path.join(upload_folder, imageName) 
            filename = f"public/image/{imageName}"

            with open(filename, 'wb') as image_file:
                image_file.write(decoded_bytes)
            
            image_path = filename
        postCollection.insert_one({
            "username": user["username"],
            "profile_image": user["profile_image"],
            "description": post,
            "title": title,
            "like_counter":0,
            "likers":[],
            "comments": [],
            "image_path": image_path
        })
        return make_response()
    except Exception:
        return page_not_found()    

def getPost():
    try:
        posts = list(postCollection.find())
        return json_util.dumps(posts)  
    except Exception as e:
            error_message = "An error occurred: {}".format(str(e))
            print("***********ERROR**:", error_message)

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