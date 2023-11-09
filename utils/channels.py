from flask import jsonify, request
import os
import base64

from utils.config import channelCollection, imgCounterCollection

def newChannel():
    data = request.get_json()
    print(data)
    creator = data.get("username")
    channel_name = data.get("channel_name")
    description = data.get("description")
    member_limit = data.get("member_limit")
    date = ""
    time = ""
    timeZone = ""
    never = data.get("never")

    if not never:
        time = data.get("time")
        date = data.get("date")
        timeZone = data.get("time_zone")

    imgData = data.get("image_path")
    image_path = "public/image/Channel.svg"

    if imgData:
        # Process image data and save it with a unique name
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

        filename = os.path.join(upload_folder, imageName)

        with open(filename, 'wb') as image_file:
            image_file.write(decoded_bytes)

        image_path = filename

    members = [creator]
    testMessage = [{"username": "Jimmy", "message": "hi", "time": "10:45"},
                   {"username": "Chad", "message": "hello", "time": "12:18"}]

    channelCollection.insert_one({
        "channel_name": channel_name,
        "image_path": image_path,
        "description": description,
        "date": date,
        "member_limit": member_limit,
        "never": never,
        "members": members,
        "time": time,
        "time_zone": timeZone,
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
