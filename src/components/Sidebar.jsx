import React, { useState, useContext } from "react";
import Logo from "../assets/FILO_Logo.png";
import UserContext from "./UserContext";
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client'; // for web-sockets


const Sidebar = ({ userId }) => {
  const navigate = useNavigate();
  const { user, dmUsers, channels } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Prevent modal close when clicking inside the modal content
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [memberLimit, setMemberLimit] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [never, setNever] = useState(false);
  const [channelImage, setChannelImage] = useState(null);

  if (!handleOpenModal) return null;

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setChannelImage(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("channelName: ", channelName);
    console.log("description: ", description);
    console.log("memberLimit: ", memberLimit);
    console.log("date: ", date);
    console.log("time: ", time);
    console.log("timeZone: ", timeZone);
    console.log("channelImage: ", channelImage);
    console.log("never: ", never);

    fetch('/create-channel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      body: JSON.stringify({
        username: user.username,
        channel_name: channelName,
        description: description,
        member_limit: memberLimit,
        date: date,
        end: time,
        time_zone: timeZone,
        image_path: channelImage, // Assuming newImage contains the image data
        never: never,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("New channel created successfully");
          // Reset the form and navigate to the desired page
          setChannelName("");
          setDescription("");
          setMemberLimit("");
          setDate("");
          setTime("");
          setTimeZone("");
          setNever(false);
          setChannelImage(null);
          window.location.href = "/";
        } else {
          console.error("Error creating channel:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error creating channel:", error);
      });
  };

  // function to get the data when a channel is clicked:
  // const handleChannelClick = (channelId, channelName) => {
  //   const data = {
  //     channel_name: channelName,
  //     username: user.username,
  //   };
  // // Send the data to the /get-channel path
  //   fetch('/get-channel', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(data),
  //   })
  //     .then((response) => response.json())
  //     .then((responseJson) => {
  //       // Log that the data was sent and the response (if any)
  //       console.log("Data sent to /get-channel:", data);
  //       console.log("Response from /get-channel:", responseJson);
  //       // You can handle the response here if needed
  //     })
  //     .catch((error) => {
  //       console.error("Error sending data to /get-channel:", error);
  //     });
  // }
  const handleChannelClick = (channelName, username) => {

    
    const queryParams = new URLSearchParams({
      channel_name: channelName,
      username: username
    });

    // Establish a WebSocket connection
    // const socket = io('ws://example.com:8080'); // Replace with your WebSocket server URL

    // socket.on('connect', () => {
    //   // Send a request for time data to the server
    //   socket.emit('get-time-data', {
    //     channel_name: channelName,
    //     username: username
    //   });
    // });

    // // Listen for time data from the server
    // socket.on('time-data', (data) => {
    //   // Update the component's state with the received time data
    //   setChannelData(data);
    // });

    // // Redirect to the new path with the channel data
    // navigate(`/messages/${channelName}`, { state: { channelData } });

    // socket.disconnect(); // Disconnect the WebSocket when done
    console.log("channelName:", channelName);
    console.log("username:", username);
    console.log("queryParams:", queryParams.toString());
  
    fetch(`/get-channel?${queryParams.toString()}`, { // Modified line
      method: 'GET', // Changed to GET
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((channelData) => {
      // Redirect to the new path with the channel data
      navigate(`/messages/${channelData.channel_name}`, { state: { channelData } });
    })
    .catch((error) => {
      console.error("Error fetching channel data:", error);
    });
  }
  
  

  return (
    <>
      <header>
        <aside className="sidebar_bg h-screen py-3 w-16 fixed z-10 flex flex-col">
          <div className="flex flex-col items-center">
            <a href="/" className="">
              <img src={Logo} alt="logo" width={50} />
            </a>

            {/* Direct Messages */}

            {/* when user's image is clicked, redirect to the messaging and also send that user's name to the server */}

            {dmUsers.map((dm) => (
              <div
                key={dm._id}
                className="group flex h-12 w-12 transform items-center justify-center rounded-full bg-primaryBlue transition-transform hover:scale-110 my-3 relative cursor-pointer"
              >
                <img
                  src={require(`../assets/${dm.profile_path}`)}
                  alt={dm.username}
                  className="rounded-full w-full h-full object-cover"
                />
                <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 hidden group-hover:block whitespace-nowrap rounded-md bg-sand py-1 px-3 text-lg text-bold text-primaryBlue shadow-lg transition-opacity duration-300 ease-in-out delay-150 z-10">
                  {dm.username}
                </span>
              </div>
            ))}

            <hr className="sidebar-divider my-2 w-2/3" />

            {/* Channels */}
            {channels.map((channel) => (
              <div
                key={channel._id}
                className="group flex h-12 w-12 transform items-center justify-center rounded-full bg-goldenOrange transition-transform hover:scale-110 my-3 relative cursor-pointer"
                // when the channel is clicked, call on the handleChannel function:
                onClick={() => handleChannelClick(channel.channel_name, user.username)}

              >
                <img
                  src={channel.image_path}
                  alt={channel.channel_name}
                  className="rounded-full w-full h-full object-cover"
                />
                <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 hidden group-hover:block whitespace-nowrap rounded-md bg-sand py-1 px-3 text-lg text-bold text-primaryBlue shadow-lg transition-opacity duration-300 ease-in-out delay-150 z-10">
                  {channel.channel_name}
                </span>
              </div>
            ))}
          </div>

          <div
            className="mt-auto flex flex-col items-center pb-3"
            onClick={handleOpenModal} // Open the modal on click
          >
            <div className="relative group h-12 w-12 rounded-full bg-sand flex items-center justify-center text-2xl font-bold text-goldenOrange cursor-pointer">
              <div className="">+</div>
              <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 hidden group-hover:block whitespace-nowrap rounded-md bg-white py-1 px-3 text-sm shadow-lg transition-opacity duration-300 ease-in-out delay-150 text-primaryBlue z-10">
                Create new Channel
              </span>
            </div>
          </div>
        </aside>
      </header>
      {isModalOpen && (
        <div
          id="modal-backdrop"
          className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
          onClick={handleCloseModal} // Close the modal on backdrop click
        >
          <div
            className="nav_bg p-4 rounded text-white"
            style={{ minHeight: "50vh", minWidth: "80vw" }}
            onClick={handleModalContentClick}
          >
            <h2 className="text-amber-500 pb-10 text-center text-3xl	">
              New Channel
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Channel Name"
                  className="bg-transparent border-none appearance-none leading-tight focus:outline-none w-full"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  required
                />
                <hr />
              </div>
              <div>
                <textarea
                  placeholder="Description"
                  className="bg-transparent border-none appearance-none leading-tight focus:outline-none w-full h-20 resize-none overflow-auto"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                <hr className="my-2" />
              </div>

              <div className="flex flex-wrap">
                <div className="flex flex-col items-center w-1/3 border-r">
                  {/* Image Container */}
                  <div className="w-full flex justify-center p-10 mb-10">
                    <div className="relative">
                      {channelImage ? ( // Display the new channel image if available
                        <div className="w-44 h-44 rounded-full overflow-hidden mb-4">
                          <img
                            src={channelImage}
                            alt="uploaded-channel-image"
                            className="w-full h-full object-cover cursor-pointer"
                          />
                        </div>
                      ) : (
                        <div className="w-44 h-44 rounded-full overflow-hidden mb-4">
                          <img
                            src={"public/image/channel.svg"}
                            alt="default-channel-image"
                            className="w-full h-full object-cover cursor-pointer"
                          />
                        </div>
                      )}
                      {/* Upload Icon Overlay */}
                      <input
                        type="file"
                        id="channel-image-upload"
                        className="hidden"
                        onChange={handleChange}
                      />
                      {/* Upload Icon Overlay */}
                      <label
                        htmlFor="channel-image-upload"
                        className="absolute bottom-2 right-3 bg-blue-300 text-white rounded-full 
                        flex items-center justify-center w-10 h-10 cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="# of Members"
                      className="px-4 py-2 border rounded-md text-black"
                      value={memberLimit}
                      onChange={(e) => setMemberLimit(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col w-2/3">
                  <h2 className="text-white mx-8 pb-8 text-xl">
                    Session End Time:
                  </h2>
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={never}
                        onChange={(e) => setNever(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 mx-2"
                      />
                      <span>Never</span>
                    </div>

                    <div className="flex items-center justify-center space-x-2">
                      <input
                        type="date"
                        className={`px-4 py-2 border rounded-md text-gray-500 ${
                          never ? "bg-gray-200" : ""
                        }`}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        disabled={never}
                        required={!never}
                      />
                      <input
                        type="time"
                        className={`px-4 py-2 border rounded-md text-gray-500 ${
                          never ? "bg-gray-200" : ""
                        }`}
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        disabled={never}
                        required={!never}
                      />
                      {/* Replace the below with your actual time zones options */}
                      <select
                        className={`px-4 py-2 border rounded-md text-gray-500${
                          never ? " bg-gray-200" : ""
                        }`}
                        value={timeZone}
                        onChange={(e) => setTimeZone(e.target.value)}
                        disabled={never}
                        required={!never}
                      >
                        <option value="">Select Time Zone</option>
                        <option value="PST">PST</option>
                        <option value="EST">EST</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-20 mr-2"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-20"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
