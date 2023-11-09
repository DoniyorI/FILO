from flask import jsonify, request

from utils.config import channelCollection

def newChannel():
    data = request.get_json()
    creator = data.get("username")
    channel_name = data.get("channel_name")
    description = data.get("description")
    member_limit = data.get("member_limit")
    end_time = data.get("end_time")
    imgData = data.get("image_path")
    image_path = "Channel.svg"
    
    if imgData != "": 
        #Prase data
        image_path = "newName"


    members = [creator]
    testMessage = [{"username": "Jimmy", "message": "hi", "time": "10:45"}, 
                   {"username": "Chad", "message": "hello", "time": "12:18"}]

    channelCollection.insert_one({
        "channel_name": channel_name,
        "image_path": image_path,
        "description": description,
        "member_limit": member_limit,
        "members": members,
        "end_time": end_time,
        "messages": testMessage
    })
    return jsonify({"success": True, "message": "New channel created"}), 200

def channelMessage():
    data = request.get_json()
    channel_name = data["channel_name"]
    time = data["time"]
    username = data["username"]
    message = data["message"]
    messageEntry = {"username": username, "message": message, "time": time}
    
    channel = channelCollection.find_one({"channel_name": channel_name})
    
    messageList = channel["messages"]
    messageList.append(messageEntry)

    channelCollection.update_one(
        {"channel_name": channel_name},
        {"$set": {"messages": messageList}}
    )
    return jsonify({"success": True, "message": f"New message from {username} added"}), 200
