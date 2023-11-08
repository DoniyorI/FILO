from flask import request, jsonify

from utils.config import userCollection

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
