import React, { useState, useEffect, useContext } from "react";

import { IoSend } from "react-icons/io5";
// import SendIcon from "../assets/sendIcon.svg";
import SidebarMsg from "../components/SidebarMsg";
import { BsInfoCircle } from "react-icons/bs";

import UserContext from "./UserContext";

function Messages() {
  const { user, dmUsers, channels } = useContext(UserContext);

  const [expanded, setExpanded] = useState(false);

  // Mock data for members
  const members = [
    "User 1",
    "User 2",
    "User 3",
    "User 4",
    "User 5",
    "User 6",
    "User 7",
    "User 8",
    "User 9",
    "User 10",
    "User 11",
    "User 1",
    "User 2",
    "User 3",
    "User 4",
    "User 5",
    "User 6",
    "User 7",
    "User 8",
    "User 9",
    "User 10",
    "User 11",
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
            <h2 className="p-2">CHANNEL NAME</h2>
          </nav>
          <hr className="w-[98%] bg-gray-200 mt-14 mx-auto" />
        </div>

        {/* Side bar on right for channel information */}
        <div className="nav_bg w-[15%] fixed mt-14 right-0 h-full z-20 overflow-hidden ">
          <div className="p-4">
            <div className="text-white">
              <h2 className="font-bold">Description:</h2>
              <p
                className={`text-sm ${
                  expanded ? "line-clamp-none" : "line-clamp-5"
                }`}
              >
                Lorem ipsum dolor sit amet, no nam vidit noluisse theophrastus,
                veri accusan adolescens mei in, offendit...Lorem ipsum dolor sit
                amet, no nam vidit noluisse theophrastus, veri accusan
                adolescens mei in, offendit...Lorem ipsum dolor sit amet, no nam
                vidit noluisse theophrastus, veri accusan adolescens mei in,
                offendit...
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
                Members: ...LIVE COUNTER{" "}
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
            <p className="text-xl z-30 text-bold text-white">Remaining Session Time: </p>
            <div className="w-[80%] p-2 bg-goldenOrange text-white">
              <p className="text-lg ">TIME</p>
            </div>
          </div>
        </div>

        {/* Scrollable Messages Section */}
        <div className="overflow-y-auto mr-[17%]">
          {/* Sample Message */}
          <div className="flex items-start p-4 ">
            {" "}
            {/* Changed from items-center to items-start */}
            <div className="flex-shrink-0 bg-sand w-11 h-11 border-[1px] border-goldenOrange rounded-full mr-3">
              {/* Sender Icon */}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-white">
                Sender Name
              </p>
              <p className="text-md break-words text-white">
                This is a very long sample message that might cause issues if
                it's too long for the container, but now it should wrap or
                truncate properly.
              </p>
            </div>
          </div>
          {/* More messages can be added here */}
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


