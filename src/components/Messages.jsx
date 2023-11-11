import React, { useState, useEffect, useContext } from "react";
import { useLocation, useParams } from "react-router-dom";
import UserContext from "./UserContext";
import { IoSend } from "react-icons/io5";
import { io } from 'socket.io-client'; // for web-sockets

function Messages() {
  const { user, dmUsers, channels } = useContext(UserContext);
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  const params = useParams(); // Extract the parameters from the URL
  const channelNameFromURL = params.channelName; // Assuming your route parameter is named 'channelName'
  const [isChannelTime, setIsChannelTime] = useState("");


  // State to store the channel data
  const [channelData, setChannelData] = useState(location.state?.channelData || null);

  // Fetch Channel Data function
  useEffect(() => {
    const fetchChannelData = async (channelName) => {
      const queryParams = new URLSearchParams({
        channel_name: channelName,
        username: user?.username // Assuming 'user' has a 'username' property
      });
      try {
        const response = await fetch(`/get-channel?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("****************");
        console.log(data);
        console.log("****************");
        setChannelData(data); // Update the state with the fetched data
  
          // const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
          // const protocol = window.location.protocol === "ws:";
  
          
          // Construct the Socket.IO server URL
          // const socketUrl = `${protocol}//${window.location.host}`;
        
          // Initialize the Socket.IO client
          const socket = io("ws://localhost:8080/messages/d", {
            path: '/socket.io',
            transports: ['websocket'],
          })
          const T = { channel_name: channelName, username: user.username }
          socket.on('request_countdown', (T) => {
            setIsChannelTime(T.timeRemaining);
          });
      
          // socket.on('countdown_update', (data) => {
          //   setIsChannelTime(data.timeRemaining);
          // });
          return () => {
            socket.disconnect();
          };
      
        
      } catch (error) {
        console.error("Error fetching channel data:", error);
      }
    };
    
  }, [channelNameFromURL]);
  
  const fetchChannelData = async (channelName) => {
    const queryParams = new URLSearchParams({
      channel_name: channelName,
      username: user?.username // Assuming 'user' has a 'username' property
    });
    try {
      const response = await fetch(`/get-channel?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("****************");
      console.log(data);
      console.log("****************");
      setChannelData(data); // Update the state with the fetched data

        // const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        // const protocol = window.location.protocol === "ws:";

        
        // Construct the Socket.IO server URL
        // const socketUrl = `${protocol}//${window.location.host}`;
      
        // Initialize the Socket.IO client
        const socket = io("ws://localhost:8080/messages/d", {
          path: '/socket.io',
          transports: ['websocket'],
        })
        const T = { channel_name: channelName, username: user.username }
        socket.on('request_countdown', (T) => {
          setIsChannelTime(T.timeRemaining);
        });
    
        // socket.on('countdown_update', (data) => {
        //   setIsChannelTime(data.timeRemaining);
        // });
        return () => {
          socket.disconnect();
        };
    
      
    } catch (error) {
      console.error("Error fetching channel data:", error);
    }
  };

  // Effect to fetch channel data if not available
  useEffect(() => {
    if (!channelData) {
      fetchChannelData(channelNameFromURL);
    }
  }, [channelNameFromURL]);

  // Check if channelData exists in the state
  if (!channelData) {
    // Display loading or a placeholder content
    return <div>Loading...</div>;
  }

  // Channel data details
  const channelName = channelData.channel_name;
  const channelDescription = channelData.description;
  const channelMembers = channelData.members;
  const channelMessages = channelData.messages;
  const channelLimit = channelData.member_limit;

  console.log(channelName);
  console.log(channelDescription);
  console.log(channelMembers);
  console.log(isChannelTime);
  console.log(channelMessages);
  console.log(channelLimit);




//   useEffect(() => {
//     // This condition is now inside useEffect
//     if (channelName) {
//         const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
//         const socketUrl = `${protocol}//${window.location.host}`;
//         const socket = io(socketUrl, {
//             path: '/socket.io',
//             transports: ['websocket'],
//         });
//         const data = { channel_name: channelName, username: user.username };
//         socket.on('request_countdown', (data) => {
//             setIsChannelTime(data.timeRemaining);
//         });
//     }
// }, [someCondition, channelName, user.username]); // Dependencies array


  // Mock data for members
  const members = [
    "User 1",
    "User 2",
    "User 3",
    "User 4",
    "User 5",
    "User 6",
    "User 7",
  ];

  // Function to handle expanding the description
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // how do I get the data from the user (_id) database? useEffect?

  // TODO: Make Messaging page Like the Figma, Should fetch the messages and information from the backend
  // For DMS use /get-dm and send the DM ID  will give oyu all the User Info
  // MORE IMPORTANT LO2: For Channels should use /get-Channel  Send the Channel ID they clicked to backend.
  // using webSockets should countdown
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
              <p
                className='time-sm'
              >
                {channelDescription}
                
                {!expanded && (
                  <span
                    className="text-blue-600 cursor-pointer"
                    onClick={toggleExpand}
                  >
                    ... (more)
                  </span>
                )}
              </p>
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
              <p className="text-lg ">Time: {isChannelTime || "00:00:00"}</p>
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
