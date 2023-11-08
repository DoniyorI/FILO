import React, { useState, useEffect, useContext } from "react";
import SendIcon from "../assets/sendIcon.svg";

import UserContext from "./UserContext";

function Messages() {
  const { user, dmUsers, channels } = useContext(UserContext);

  // how do I get the data from the user (_id) database? useEffect?

  // TODO: Make Messaging page Like the Figma, Should fetch the messages and information from the backend
  // For DMS use /get-dm and send the DM ID  will give oyu all the User Info
  // MORE IMPORTANT LO2: For Channels should use /get-Channel  Send the Channel ID they clicked to backend.
  // using webSockets should countdown
  return (
    <div className="home_bg min-h-screen ml-20">
      {/* 1) the code below is for displaying the chat's icon and chat name */}
      <div className="flex items-center pt-2 pl-6 pb-2 border-b-[1px]">
        <div className="h-11 w-11 rounded-full bg-white mr-1"></div>
        <div className="mx-4 font-semibold text-goldenOrange text-xl">
          Username
        </div>
      </div>
      <div className="fixed w-11/12 mx-auto bottom-0 pb-6">
        <form className="flex bg-white h-8 rounded-2xl">
          <input className="ml-5 w-full"></input>
          <button
            type="submit"
            className="bg-blue hover:scale-150 text-white font-semibold mx-4 rounded-r-2xl"
          >
            <img src={SendIcon} alt="send" width={20} height={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Messages;
