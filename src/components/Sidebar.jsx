import React, { useState, useEffect, useContext } from "react";
import Logo from "../assets/FILO_Logo.png";
import UserContext from './UserContext';


const Sidebar = ({ userId }) => {
  const { user, dmUsers, channels } = useContext(UserContext);

  // const [channels, setChannels] = useState([]);
  // const [dmUsers, setDmUsers] = useState([]);
  // const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // useEffect(() => {
  //   fetch("/get-user")
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok " + response.statusText);
  //       }
  //       return response.json();
  //     })
  //     .then((userData) => {
  //       setDmUsers(userData.direct_messages);
  //       console.log(userData.direct_messages);
  //       setChannels(userData.channels);
  //       setUser(userData);
  //     })
  //     .catch((error) => {
  //       console.error(
  //         "There has been a problem with your fetch operation:",
  //         error
  //       );
  //     });
  // }, []);

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

  if (!handleOpenModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission logic
    console.log("Form submitted");
    console.log(channelName);
    console.log(description);
    console.log(memberLimit);
    console.log(date);
    console.log(time);
    console.log(timeZone);
    console.log(never);
  };

  return (
    <>
      <header>
        <aside className="sidebar_bg h-screen py-3 w-20 fixed z-10 flex flex-col">
          <div className="flex flex-col items-center">
            <a href="/" className="mb-6">
              <img src={Logo} alt="logo" width={50} />
            </a>

            {/* Direct Messages */}

            {/* when user's image is clicked, redirect to the messaging and also send that user's name to the server */}

            {dmUsers.map((dm) => (
              <div
                key={dm._id}
                className="group flex h-14 w-14 transform items-center justify-center rounded-full bg-primaryBlue transition-transform hover:scale-110 mt-6 relative cursor-pointer"
                // className="group transform flex h-14 w-14 items-center justify-center rounded-full bg-primaryBlue mt-6 relative hover:scale-110 cursor-pointer"
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

            <hr className="sidebar-divider my-4 w-2/3" />

            {/* Channels */}
            {channels.map((channel) => (
              <div
                key={channel._id}
                className="group flex h-14 w-14 items-center justify-center rounded-full bg-primaryBlue relative cursor-pointer"
              >
                <img
                  src={require(`../assets/${channel.image}`)} // Adjust the path as necessary
                  alt={channel.name}
                  className="rounded-full w-full h-full object-cover"
                />
                <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 hidden group-hover:block whitespace-nowrap rounded-md bg-sand py-1 px-3 text-lg text-bold text-primaryBlue shadow-lg transition-opacity duration-300 ease-in-out delay-150 z-10">
                  {channel.name}
                </span>
              </div>
            ))}
          </div>

          <div
            className="mt-auto flex flex-col items-center pb-6"
            onClick={handleOpenModal} // Open the modal on click
          >
            {" "}
            <div className="relative group h-14 w-14 rounded-full bg-sand flex items-center justify-center text-2xl font-bold text-goldenOrange cursor-pointer">
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
            style={{ minHeight: "40vh", minWidth: "80vh" }}
            onClick={handleModalContentClick} // Prevents event bubbling to backdrop
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
                  <div className="w-full flex justify-center p-10">
                    <div className="relative">
                      {user && user.profile_image && (
                        <img
                          src={require(`../assets/${user.profile_image}`)}
                          alt="profile"
                          className="w-48 h-auto cursor-pointer rounded-full"
                        />
                      )}
                      {/* Upload Icon Overlay */}
                      <input
                        type="file"
                        id="profile-upload"
                        className="hidden"
                      />
                      {/* Upload Icon Overlay */}
                      <label
                        htmlFor="profile-upload"
                        className="absolute bottom-10 right-10 bg-blue-300 text-white rounded-full 
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
                  </div>
                </div>
                <div className="flex flex-col w-2/3">
                  <h2 className="text-white pb-4 text-xl	">Session End Time</h2>
                  <div>
                    <input
                      type="checkbox"
                      checked={never}
                      onChange={(e) => setNever(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 mx-2"
                    />
                    <span>Never</span>
                  </div>

                  <div className="flex items-center space-x-2">
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
                        never ? "bg-gray-200" : ""
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
