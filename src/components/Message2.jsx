import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import UserContext from "./UserContext";
import { IoSend } from "react-icons/io5";
import { io } from "socket.io-client"; // for web-sockets

const Messages2 = () => {
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

  return (
    <div class="flex">
      {/* <div class="h-screen w-[17%] bg-pink-200">SECTION 1</div> */}

      {/* CHANNEL NAME HEADER */}
      <nav className="fixed top-12 z-10 w-[68%] text-goldenOrange text-2xl flex items-center pl-4 ml-[16.666667vw] border-sand border-b-[1px]">
        <div className="bg-sand w-11 h-11 border-[1px] border-goldenOrange rounded-full m-3">
          <img
            alt="channel image"
            src={channelImage}
            className="w-full h-full"
          />
        </div>
        <h2 className="p-2">{channelName}</h2>
        {/* <h2 className="p-2">CHANNEL NAME</h2> */}
      </nav>

      {/* MESSAGING AREA */}
      <div class="home_bg h-screen w-[68%] overflow-y-auto mt-12 text-sand ml-[17%]">
        <div className="p-4">
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
                {/* <p className="text-sm font-semibold truncate text-white"> */}
                <p className="text-sm font-semibold text-white">
                  {message.username}
                </p>
                {/* <p className="text-md break-words text-white"> */}
                <p className="text-md text-white">{message.message}</p>
              </div>
            </div>
          ))}
        </div>
        {/* HARDCODED MESSAGES */}
        {/* 
        <div class="p-4">
          <h1>SECTION 2</h1>
          <div class="mb-4">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit....</p>
          </div>
          <div class="mb-4">
            <p>Another message goes here...</p>
          </div>
          <div class="mb-4">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Fusce
              ut placerat orci nulla. Et malesuada fames ac turpis egestas sed
              tempus urna et. Et netus et malesuada fames ac turpis. Mauris
              commodo quis imperdiet massa tincidunt. Vitae et leo duis ut.
              Lacus sed turpis tincidunt id aliquet risus feugiat in ante. Id
              cursus metus aliquam eleifend mi in. Pellentesque pulvinar
              pellentesque habitant morbi tristique. Vulputate eu scelerisque
              felis imperdiet proin fermentum leo vel. Pellentesque elit eget
              gravida cum sociis natoque penatibus et. Aliquam malesuada
              bibendum arcu vitae elementum curabitur. Velit egestas dui id
              ornare arcu. Elementum integer enim neque volutpat ac tincidunt
              vitae semper. Sed id semper risus in. Id velit ut tortor pretium
              viverra suspendisse potenti. Diam volutpat commodo sed egestas
              egestas fringilla phasellus faucibus scelerisque. In arcu cursus
              euismod quis viverra nibh cras pulvinar. Velit euismod in
              pellentesque massa placerat duis ultricies lacus. Ac orci
              phasellus egestas tellus. Et netus et malesuada fames ac. Lectus
              arcu bibendum at varius vel. Massa vitae tortor condimentum
              lacinia quis vel eros donec ac. Donec massa sapien faucibus et
              molestie ac feugiat sed lectus. Cras tincidunt lobortis feugiat
              vivamus at augue eget arcu. Est ullamcorper eget nulla facilisi
              etiam dignissim diam quis enim. Turpis egestas pretium aenean
              pharetra magna ac. Mi sit amet mauris commodo quis imperdiet massa
              tincidunt. At tellus at urna condimentum mattis pellentesque id.
              Varius sit amet mattis vulputate enim nulla aliquet porttitor
              lacus. Semper risus in hendrerit gravida. Viverra mauris in
              aliquam sem fringilla ut morbi tincidunt. Mattis ullamcorper velit
              sed ullamcorper morbi tincidunt ornare massa eget. Viverra aliquet
              eget sit amet tellus cras adipiscing. Velit aliquet sagittis id
              consectetur purus. Dui id ornare arcu odio ut sem nulla. Sodales
              neque sodales ut etiam sit amet nisl. Porttitor leo a diam
              sollicitudin tempor id eu nisl. Tortor aliquam nulla facilisi
              cras. Elit sed vulputate mi sit. Nunc congue nisi vitae suscipit
              tellus mauris a diam maecenas. Feugiat scelerisque varius morbi
              enim. Elementum tempus egestas sed sed risus pretium quam. Ut diam
              quam nulla porttitor massa id neque aliquam. Ac tortor vitae purus
              faucibus ornare suspendisse. Eu nisl nunc mi ipsum faucibus vitae
              aliquet. Ac placerat vestibulum lectus mauris ultrices. At
              imperdiet dui accumsan sit amet nulla facilisi morbi. Aliquam
              ultrices sagittis orci a scelerisque purus semper. Quisque id diam
              vel quam elementum pulvinar etiam non quam. Vel turpis nunc eget
              lorem dolor sed. Et leo duis ut diam quam. Amet dictum sit amet
              justo donec. Amet consectetur adipiscing elit ut. Vestibulum
              lectus mauris ultrices eros in cursus turpis massa tincidunt. Est
              pellentesque elit ullamcorper dignissim. In pellentesque massa
              placerat duis ultricies lacus sed turpis tincidunt. Interdum
              posuere lorem ipsum dolor sit amet. Phasellus vestibulum lorem sed
              risus ultricies tristique. Mauris ultrices eros in cursus turpis
              massa tincidunt dui ut. Imperdiet dui accumsan sit amet nulla
              facilisi morbi tempus iaculis. Velit egestas dui id ornare arcu
              odio ut sem nulla. Mi in nulla posuere sollicitudin aliquam
              ultrices sagittis. Molestie nunc non blandit massa enim nec dui.
              Tellus mauris a diam maecenas sed enim. Proin fermentum leo vel
              orci porta non pulvinar neque laoreet. Commodo ullamcorper a lacus
              vestibulum sed arcu non odio. Placerat orci nulla pellentesque
              dignissim enim sit amet. Aliquam ultrices sagittis orci a
              scelerisque. Eget arcu dictum varius duis at consectetur lorem
              donec. Rutrum tellus pellentesque eu tincidunt tortor aliquam. Sed
              enim ut sem viverra aliquet. Est pellentesque elit ullamcorper
              dignissim. Facilisis volutpat est velit egestas dui id ornare.
            </p>
          </div>
        </div> */}

        <div className="flex item-center justify-center">
          <form
            className="fixed bottom-2 w-[66%] bg-white rounded-3xl"
            onSubmit={handleSubmit}
          >
            <div className="flex items-center relative">
              <input
                placeholder="Enter a Message"
                className="flex-grow rounded-2xl pr-10 px-2 py-1 text-black"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:scale-110 px-1"
              >
                <IoSend width={20} className="text-goldenOrange" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* SECTION 3 */}
      <div className="nav_bg w-[15%] fixed mt-28 right-0 h-screen z-20">
        <div className="p-4">
          <div className="text-white">
            <h2 className="font-bold">Description:</h2>
            <p className="overflow-y-auto h-[20%]">{channelDescription}</p>

            {/* HARDCODED DESCRIPTION */}

            {/* <p className="overflow-y-auto h-[20vh]">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Asperiores placeat et tenetur accusamus minus beatae impedit quo,
              architecto non vitae ea voluptatem debitis modi eos itaque
              perferendis laboriosam reiciendis voluptatibus. Lorem ipsum dolor
              sit, amet consectetur adipisicing elit. Asperiores placeat et
              tenetur accusamus minus beatae impedit quo, architecto non vitae
              ea voluptatem debitis modi eos itaque perferendis laboriosam
              reiciendis voluptatibus.
            </p> */}
          </div>

          <div className="mt-4 text-white">
            <h2 className="text-xl font-bold py-5">
              Members: {channelMembers.length}/{channelLimit}
              {/* Members */}
            </h2>
            <div className="overflow-y-auto h-[25vh] mb-4">
              {channelMembers.map((member, index) => (
                <div key={index} className="flex items-center">
                  <div className="bg-primaryBlue w-11 h-11 border-[1px] border-goldenOrange rounded-full m-2">
                    <img
                      src={member.profile_image}
                      alt="profile"
                      className="w-full h-full object-cover cursor-pointer"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <div className="text-lg text-white">{member}</div>
                </div>
              ))}

              {/* HARDCODED MEMBERS */}
              {/* <ul>User 1</ul>
              <ul>User 2</ul>
              <ul>User 3</ul>
              <ul>User 4</ul>
              <ul>User 5</ul>
              <ul>User 1</ul>
              <ul>User 2</ul>
              <ul>User 3</ul>
              <ul>User 4</ul>
              <ul>User 5</ul>
              <ul>User 1</ul>
              <ul>User 2</ul>
              <ul>User 3</ul>
              <ul>User 4</ul>
              <ul>User 5</ul>
              <ul>User 1</ul>
              <ul>User 2</ul>
              <ul>User 3</ul>
              <ul>User 4</ul>
              <ul>User 5</ul> */}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center w-full text-center">
          <p className="text-xl z-30 text-bold text-white">
            Remaining Session Time:
          </p>
          <div className="w-[80%] p-2 bg-goldenOrange text-white">
            <p className="text-lg ">{isChannelTime}</p>
            {/* <p className="text-lg ">00:00:00</p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages2;
