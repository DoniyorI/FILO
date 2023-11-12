import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import UserContext from "./UserContext";
import { IoSend } from "react-icons/io5";
import { io } from "socket.io-client"; // for web-sockets

function Messages() {
  const { user, dmUsers, channels } = useContext(UserContext);
  const [error, setError] = useState(null);

  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);

  const { channelName } = useParams();
  const [isChannelTime, setIsChannelTime] = useState(null);

  const [isChannelData, setIsChannelData] = useState(null);
  const [channelDescription, setIsChannelDescription] = useState(null);
  const [channelMembers, setIsChannelMembers] = useState(null);
  const [channelMessages, setIsChannelMessages] = useState(null);
  const [channelLimit, setIsChannelLimit] = useState(null);
  const [channelImage, setIsChannelImage] = useState(null);

  useEffect(() => {
    fetch(`/get-channel?channel_name=${channelName}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setIsChannelData(data);
        setIsChannelDescription(data.description);
        setIsChannelMembers(data.members);
        setIsChannelMessages(data.messages);
        setIsChannelLimit(data.member_limit);
        setIsChannelImage(data.image_path);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setError(error);
      });
  }, [channelName]);

  console.log(channelName);
  console.log(channelDescription);
  console.log(channelMembers);
  console.log(channelMessages);
  console.log(channelLimit);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [channelMessages]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const newSocket = io.connect("http://127.0.0.1:8080", {
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.emit("join_channel", {
      channel_name: channelName,
      username: user.username,
    });

    newSocket.on("request_countdown", (response) => {
      setIsChannelTime(response.timeRemaining);
      setIsChannelMessages(response.messages);
      setIsChannelMembers(response.members);
      setIsChannelImage(response.image_path);
    });

    newSocket.on("message_received", (response) => {
      setIsChannelMessages(response.messages);
    });
    newSocket.on("time_up", () => {
      console.log("Channel time is up");
      // Example: Disable message sending or show alert
    });

    return () => {
      newSocket.emit("leave_channel", {
        channel_name: channelName,
        username: user.username,
      });
      newSocket.disconnect();
    };
  }, [channelName, user]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (socket && message.trim()) {
      // Check if socket is connected and message is not just whitespace
      socket.emit("new_message", {
        channel_name: channelName,
        username: user.username,
        message: message,
      });
      setMessage(""); // Clear the message input field
    }
  };

  useEffect(() => {
    if (isChannelData) {
      setIsChannelDescription(isChannelData.description);
      setIsChannelMembers(isChannelData.members);
      setIsChannelMessages(isChannelData.messages);
      setIsChannelLimit(isChannelData.member_limit);
      setIsChannelImage(isChannelData.image_path);
    }
  }, [isChannelData]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!isChannelData) {
    return <div>Loading...</div>;
  }

  // const { description, members, messages, member_limit } = channelData;

  // Mock data for members (if needed)
  const mockMembers = ["User 1", "User 2", "User 3", "User 4", "User 5"];

  return (
    <div className="">
      <nav className="fixed top-12 z-10 w-full text-goldenOrange text-2xl flex items-center pl-4 ml-[16.666667vw]">
        <div className="bg-sand w-11 h-11 border-[1px] border-goldenOrange rounded-full m-3">
          <img
            src={channelImage}
            alt="channel image"
            className="w-full h-full"
          />
        </div>
        <h2 className="p-2">{channelName}</h2>
      </nav>

      <section>
        <div className="nav_bg w-[15%] fixed mt-14 right-0 h-screen z-20 overflow-hidden ">
          <div className="p-4">
            <div className="text-white">
              <h2 className="font-bold">Description:</h2>
              <p className="time-sm">{channelDescription}</p>
            </div>

            <div className="mt-4 text-white">
              <h2 className="text-xl font-bold py-5">
                Members: {channelMembers.length}/{channelLimit}
              </h2>
              <div className="overflow-auto h-[50vh]">
                {channelMembers.map((member, index) => (
                  <div key={index} className="flex items-center">
                    <div className="bg-primaryBlue w-11 h-11 border-[1px] border-goldenOrange rounded-full m-2">
                      <img
                        src={member.profile_image}
                        alt="profile"
                        className="w-full h-full object-cover cursor-pointer"
                      />
                    </div>
                    <div className="text-lg text-white">{member}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center w-full text-center">
            <p className="text-xl z-30 text-bold text-white">
              Remaining Session Time:
            </p>
            <div className="w-[80%] p-2 bg-goldenOrange text-white">
              <p className="text-lg ">{isChannelTime}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}

      <section
        className="home_bg flex flex-col h-screen ml-[16.666667vw] relative"
        style={{ height: "calc(100vh - 60px)" }}
      >
        <hr className="w-[98%] bg-gray-200 mt-14 mx-auto" />
        <div className="flex flex-col overflow-y-auto mr-[17%] mb-10 ">
          {channelMessages.map((message, index) => (
            <div
              key={index}
              className="flex items-start p-4"
              ref={messagesEndRef}
            >
              <div className="flex-shrink-0 bg-sand w-11 h-11 border-[1px] border-goldenOrange rounded-full mr-3">
                <img
                  src={message.profile_image}
                  alt="profile"
                  className="w-full h-full object-cover cursor-pointer"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-white">
                  {message.username}
                </p>
                <p className="text-md break-words text-white">
                  {message.message}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-2 w-[95%] pr-[15%] mx-3">
          <form
            className="bg-white rounded-2xl flex items-center justify-between"
            onSubmit={handleSubmit}
          >
            <input
              placeholder="Enter a Message"
              className="flex-grow rounded-2xl px-2 py-1"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" className="hover:scale-110 px-1">
              <IoSend width={20} className="text-goldenOrange" />
            </button>
          </form>
        </div>
      </section>

      {/* Fixed Message Input Section */}
    </div>
  );
}

export default Messages;
