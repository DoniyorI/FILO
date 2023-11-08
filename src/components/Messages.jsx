import React, { useState, useEffect } from "react";
import Profile from "../assets/mainProfile.svg";
import SendIcon from "../assets/sendIcon.svg";


function Messages() {

  // how do I get the data from the user (_id) database? useEffect?
  const [user, setUser] = useState(null); // Added this state to hold the user's name

  useEffect(() => {
    // Fetch user when component mounts
    fetch("/get-dm")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((user) => {
        setUser(user);
        console.log(user);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  }, []);
  
  // 
  return (
    <div className="home_bg min-h-screen h-full ml-20">
      {/*   TODO: Make Messaging page Like the Figma, Should fetch the messages and information from the backend 
                For DMS use /get-dm and send the DM ID  will give oyu all the User Info
        MORE IMPORTANT LO2: For Channels should use /get-Channel  Send the Channel ID they clicked to backend.
        using webSockets should countdown
      */}
      {/* 1) the code below is for displaying the chat's icon and chat name */}
      <div className='flex items-center pt-4 pl-6 pb-4 border-b-[1px]'>
        <div className='h-14 w-14 rounded-full bg-white mr-2'></div>
        <div className='mx-4 font-semibold text-goldenOrange text-2xl'>
            USERNAME
        </div>
      </div>
      <div class="min-h-screen flex items-end justify-center pb-6">
        <form class="w-3/4 flex">
          <input class="bg-white flex-1 h-10 rounded-l-2xl">
            <button
              type="submit"
              class="bg-none hover:scale-150 text-white font-semibold mx-4 rounded-r-2xl"
            >
              <img src={SendIcon} alt="send" width={20} height={20} />
            </button>
          </input>
        </form>
      </div>




    </div>
  )
}

export default Messages
