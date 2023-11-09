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
    <div className="home_bg flex">
      {/* SIDEBAR */}
      <div className="sidebar_bg w-1/6 h-screen">
        <h1 className="text-xl text-goldenOrange flex justify-center items-center pt-4">
          Direct Messages
        </h1>
        <div className="flex pl-4 pt-4">
          <div className="w-12 h-12 rounded-full bg-primaryBlue border-[1px] border-goldenOrange"></div>
          <h1 className="flex items-center pl-4 text-md">Jimmy</h1>
        </div>
        <div>
          <hr class="w-[14rem] h-[2px] mx-auto mb-4 mt-20 bg-black border-0 rounded" />
        </div>
        <div>
          <div className="flex justify-center items-center">
            <div className="w-[13rem] h-12 rounded-3xl bg-sand flex">
              <div className="flex bg-goldenOrange w-12 h-full rounded-full justify-center items-center text-3xl text-sand">
                #
              </div>
              <h1 className="flex items-center text-center pl-1 text-red-500 text-md">
                {"<"}CHANNEL NAME{">"}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* 2ND SECTION CHAT FIELD */}
      <div className="w-2/3 bg-purple-600 h-screen overflow-y-auto">
        <div>
          <nav className="text-goldenOrange text-2xl flex items-center pl-4">
            <div className="bg-sand w-12 h-12 border-[1px] border-goldenOrange rounded-full m-2"></div>
            <h1 className="p-2">CHANNEL NAME</h1>
          </nav>{" "}
          <div class="flex items-center justify-center">
            <hr class="w-[95%] bg-gray-200 border-[1px] rounded"></hr>
          </div>
        </div>
        {/* TODO: FIX THE INPUT SIZE FIELD */}
        <div className="fixed bottom-0">
          <form className="bg-white w-full">
            <input className="flex w-full" />
          </form>
        </div>
      </div>
      {/* CHANNEL INFO */}
      <div className="bg-red-500 w-1/6 relative">
        {/* BUTTON TO GET INFO ON THE CHANNEL */}
        <button className="absolute top-2 right-2">
          <BsInfoCircle className="w-7 h-7" />
        </button>
        {/* CHANNEL DESCRIPTION */}
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
        {/* MEMBERS LIST SECTION */}
        <div className="pl-2 pt-8">
          <h1 className="text-goldenOrange text-xl font-semibold flex">
            Members #
          </h1>
          <div className="pt-2 flex items-center">
            <div className="w-12 h-12 bg-primaryBlue rounded-full border-[1px] border-goldenOrange"></div>
            <h1 className="pl-4 text-xl text-sand">User 1</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;

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
