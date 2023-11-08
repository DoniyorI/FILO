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
    <div className="home_bg min-h-screen ml-16">
      {/* 1) the code below is for displaying the chat's icon and chat name */}
      <div className="flex items-center pt-2 pl-6 pb-2 border-b-[1px]">
        <div className="h-11 w-11 rounded-full bg-white mr-1"></div>
        <div className="mx-4 font-semibold text-goldenOrange text-xl">
          Username
        </div>
      </div>
      <div className="fixed bottom-0 pb-6 w-full" style={{ left: '2rem', right: '1rem' }}> 
    <form className="flex bg-white h-8 rounded-2xl justify-center items-center mx-auto" style={{ maxWidth: 'calc(100% - 10rem)' }}>
      <input className="ml-5 flex-grow border-none rounded-l-2xl px-4" placeholder="Type a message..."></input>
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
