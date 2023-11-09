from flask import request, jsonify
import os
import base64

from utils.config import userCollection, imgCounterCollection

def follow_user():
    data = request.get_json()
    print(data)
    follower = data["followers"]
    print(follower)
    toFollow = data['following']
    print(toFollow)

    followerColl = userCollection.find_one({'username': follower})
    toFollowColl = userCollection.find_one({"username": toFollow})
    if not followerColl or not toFollowColl:
        return jsonify({"success": False, "message": "One or both users not found"}), 404

    followingSet = set(followerColl.get("following", []))
    toFollowSet = set(toFollowColl.get("followers", []))

    if toFollow in followingSet:
        followingSet.remove(toFollow)
        toFollowSet.remove(follower)    
        print(f"following will be :{toFollowSet}")
        print(f"followers will be :{followingSet}")
    else:
        followingSet.add(toFollow)
        toFollowSet.add(follower)
        print(f"following will be :{toFollowSet}")
        print(f"followers will be :{followingSet}")
    
    # Update the follower's 'following' list
    userCollection.update_one(
        {"username": follower},
        {"$set": {"following": list(followingSet)}}
    )
    
    userCollection.update_one(
        {"username": toFollow},
        {"$set": {"followers": list(toFollowSet)}}
    )
    
    return jsonify({"success": True, "message": "Follow status updated"}), 200

def new_profile():
    data = request.get_json()
    username = data.get("username")
    print(username)
    imgData = data.get("image")
    print("image Data" + str(imgData))

    if not imgData:
        return jsonify({'success': False, 'error': 'No image data provided'})

    try:
        # Ensure the upload folder exists
        upload_folder = "public/image"
        os.makedirs(upload_folder, exist_ok=True)

        imgCount = imgCounterCollection.find_one({})["count"]
        new_count = imgCount + 1
        imgCounterCollection.update_one({}, {'$set': {"count": new_count}})
        imageName = f"{new_count}.jpg"  # Assuming the image is a JPEG
        print(imageName)


        # Decode the image data
        _, encoded = imgData.split(",", 1)
        decoded_bytes = base64.b64decode(encoded)
        print("Image is decoded .......")

        filename = os.path.join(upload_folder, imageName)

        with open(filename, 'wb') as image_file:
            image_file.write(decoded_bytes)

        image_path = filename

        # Save the image path and username to the database
        print("Image is trying to upload .......")
        userCollection.update_one(
            {"username": username},
            {"$set": {"profile_image": image_path}}
        )
        print("Image is uploaded .......")

        return jsonify({'success': True, 'image_path': image_path, 'username': username})

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

