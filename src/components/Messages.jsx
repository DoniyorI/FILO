import React, { useState, useEffect, useContext } from "react";
import { IoSend } from "react-icons/io5";
// import SendIcon from "../assets/sendIcon.svg";
import SidebarMsg from "../components/SidebarMsg";
import { BsInfoCircle } from "react-icons/bs";

import UserContext from "./UserContext";

const members = [
  { id: 1, name: "User 1" },
  { id: 2, name: "User 2" },
  { id: 3, name: "User 3" },
];

function Messages() {
  const { user, dmUsers, channels } = useContext(UserContext);

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
        <div className="bg-sand w-[15%] fixed mt-14 right-0 h-full z-20">
          {/* Sidebar content goes here */}
        </div>
          {/* Scrollable Messages Section */}
          <div className="overflow-y-auto mr-[17%]">
            {/* Sample Message */}
            <div className="flex items-start p-4 "> {/* Changed from items-center to items-start */}
              <div className="flex-shrink-0 bg-sand w-11 h-11 border-[1px] border-goldenOrange rounded-full mr-3">
                {/* Sender Icon */}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-white">Sender Name</p>
                <p className="text-md break-words text-white">This is a very long sample message that might cause issues if it's too long for the container, but now it should wrap or truncate properly.</p>
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
              className="w-full rounded-2xl px-2 pr-8"
            />
            <button
              type="submit"
              className="absolute right-2 bottom-1 hover:scale-110"
            >
              <IoSend width={10} height={10} className="text-primaryDark" />
            </button>
          </form>
        </div>
      </div>
    </>

  );
}

export default Messages;

{
  /* <div className="sidebar_bg w-1/6 relative">

        <button className="absolute top-2 right-2">
          <BsInfoCircle className="w-7 h-7" />
        </button>

        <div className="pl-2 pt-6">
          <h1 className="text-goldenOrange text-xl font-semibold flex">
            Description:
          </h1>
          <p className="pl-2">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam
            quidem architecto voluptatem praesentium velit est dicta labore
            voluptatum, adipisci quas ut dolorem accusantium provident iste
            officiis odio vel! Itaque, exercitationem.
          </p>
        </div>
        <div className="pl-2 pt-8">
          <h1 className="text-goldenOrange text-xl font-semibold flex">
            Members #
          </h1>

          <div className="pt-2 flex items-center">
            <div className="w-12 h-12 bg-primaryBlue rounded-full border-[1px] border-goldenOrange"></div>
            <h1 className="pl-4 text-xl text-sand">User 1</h1>
          </div>
          <div className="relative">
            <div className="text-center absolute inset-x-0 bottom-0">
              <h1 className="text-sand text-md">Remaining Session Timer</h1>
              <div className="flex items-center justify-center">
                <div className="flex justify-center items-center w-32 h-8 bg-goldenOrange">
                  <time
                    className="text-sand text-sm text-center"
                    // dateTime="2011-11-18T14:54:39.929"
                  >
                    2011-11-18T14:54:39.929
                  </time>
                </div>
              </div>
            </div>
          </div> 
        </div>
      </div>*/
}

{
  /* <div className="w-1/5 h-screen sidebar_bg text-white right-0 fixed">
<div className="p-4">
  <h1 className="text-xl font-semibold text-goldenOrange">
    Description
  </h1>
  <p>
    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloremque
    voluptatem quasi quas excepturi ipsa officiis vero accusantium
    quaerat explicabo, eum culpa cupiditate iusto! Dolorum atque
    sapiente labore corrupti ut aliquid.
  </p>
  <h2 className="text-xl font-semibold text-goldenOrange mb-4 pt-6">
    Members
  </h2>
  <ul>
    {members.map((member) => (
      <li key={member.id} className="mb-2">
        {member.name}
      </li>
    ))}
  </ul>
</div>
</div>
<div className="flex-1">
<div className="flex items-center pt-2 pl-6 pb-2 border-b-[1px] sticky">
  <div className="h-11 w-11 rounded-full bg-white mr-1"></div>
  <div className="mx-4 font-semibold text-goldenOrange text-xl">
    Channel Name
  </div>
</div>
<div className="flex items-center">
  <div class="h-12 w-12 rounded-full bg-blue-500 border-[1px] border-goldenOrange flex-shrink-0"></div>
  <div>
    <h3 className="text-md text-sand pl-3 pt-2">Jimmy</h3>
    <p class="text-sand text-sm pt-2">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores
      architecto quidem, vero alias necessitatibus exercitationem neque
      veniam fugiat dolorem sit sunt possimus similique placeat ea omnis
      quae ratione! Eum, laborum!
    </p>
  </div>
</div>
</div>
<div
className="fixed bottom-0 pb-6 w-full"
style={{ left: "2rem", right: "1rem" }}
>
<form
  className="group flex bg-white h-8 rounded-2xl justify-center items-center mx-auto"
  style={{ maxWidth: "calc(100% - 10rem)" }}
>
  <input
    className="ml-4 flex-grow border-none rounded-2xl px-4 text-black"
    placeholder="Type a message..."
  ></input>
  <button
    type="submit"
    className="bg-blue hover:scale-150 font-semibold mx-4"
  >
    <IoSend className="w-5 h-5 text-primaryBlue" />
  </button>
</form>
</div> */
}
