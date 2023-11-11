import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import UserContext from "./UserContext";
import { IoSend } from "react-icons/io5";
import { io } from "socket.io-client"; // for web-sockets

function Messages() {
  const { user, dmUsers, channels } = useContext(UserContext);
  const { channelName } = useParams();
  const [channelData, setChannelData] = useState(null);
  const [error, setError] = useState(null);
  const [isChannelTime, setIsChannelTime] = useState(null);

  useEffect(() => {
    fetch(`/get-channel?channel_name=${channelName}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setChannelData(data))
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setError(error);
      });
  }, [channelName]);

  useEffect(() => {
    if (!user) {
      return; // Return early or show a loading state until user is available
    }

    const timeData = { channel_name: channelName, username: user.username };
    const socket = io.connect("http://127.0.0.1:8080", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    socket.emit("join_channel", timeData);
    socket.on("request_countdown", (response) => {
      setIsChannelTime(response.timeRemaining);
      console.log(response.timeRemaining);
    });

    return () => {
      socket.emit("leave_channel", timeData);
      socket.disconnect();
    };
  }, [channelName, user]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!channelData) {
    return <div>Loading...</div>;
  }
  const channelDescription = channelData.description;
  const channelMembers = channelData.members;
  const channelMessages = channelData.messages;
  const channelLimit = channelData.member_limit;

  console.log(channelName);
  console.log(channelDescription);
  console.log(channelMembers);
  console.log(channelMessages);
  console.log(channelLimit);

  const { description, members, messages, member_limit } = channelData;

  // Mock data for members (if needed)
  const mockMembers = ["User 1", "User 2", "User 3", "User 4", "User 5"];

  return (
    <>
      {/* Main Content Area */}
      <section className="home_bg flex flex-col h-screen ml-[16.666667vw]">
        <div>
          <nav className="fixed top-12 z-10 w-full text-goldenOrange text-2xl flex items-center pl-4">
            <div className="bg-sand w-11 h-11 border-[1px] border-goldenOrange rounded-full m-2">
              {/* IMG */}
            </div>
            <h2 className="p-2">CHANNEL NAME {channelName}</h2>
          </nav>
          <hr className="w-[98%] bg-gray-200 mt-14 mx-auto" />
        </div>

        {/* Side bar on right for channel information */}
        <div className="nav_bg w-[15%] fixed mt-14 right-0 h-full z-20 overflow-hidden ">
          <div className="p-4">
            <div className="text-white">
              <h2 className="font-bold">Description:</h2>
              <p className="time-sm">{channelDescription}</p>
            </div>

            <div className="mt-4 text-white">
              <h2 className="text-xl font-bold py-5">
                Members: {channelMembers.length}/{channelLimit}
              </h2>
              <div className="overflow-auto h-[40vh]">
                {members.map((member, index) => (
                  <div key={index} className="flex items-center">
                    <div className="bg-primaryBlue w-11 h-11 border-[1px] border-goldenOrange rounded-full m-2"></div>
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

        {/* Scrollable Messages Section */}
        <div className="overflow-y-auto mr-[17%]">
          {channelMessages.map((message, index) => (
            <div key={index} className="flex items-start p-4 ">
              <div className="flex-shrink-0 bg-sand w-11 h-11 border-[1px] border-goldenOrange rounded-full mr-3">
                {message.profile_path}
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
      </section>

      {/* Fixed Message Input Section */}
      <div className="bg-yellow-400 h-screen">
        <div className="w-[65%] bottom-3 fixed ml-[18.5vw] mr-[15%]">
          <form className="bg-white rounded-2xl ">
            <input
              placeholder="Enter a Message"
              className="w-full rounded-2xl px-3  pr-8 py-1"
            />
            <button
              type="submit"
              className="absolute right-2 bottom-1 hover:scale-110 py-1"
            >
              <IoSend height={14} className="text-primaryDark" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Messages;
