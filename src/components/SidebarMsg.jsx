import React, { useState, useContext } from "react";
import FILO from "../assets/FiLo_Word.svg";
import Logo from "../assets/FILO_Logo.png";
import UserContext, { useFetchUser } from "./UserContext";

const SidebarMsg = () => {
  // const { user, dmUsers, channels } = useContext(UserContext);
  const { user, setUser, dmUsers, setDmUsers, channels, setChannels, error } =
    useFetchUser();

  return (
    <>
      <div className="w-1/6 h-screen sidebar_bg z-10 fixed">
        <div className="">
          <a href="/" className="m-2 flex items-center">
            <img src={Logo} alt="logo" width={50} className="mx-2" />
            <img src={FILO} width={80} />
          </a>
        </div>

        {/* <div className="flex mx-4 py-2">
          
          <div className="w-12 h-12 rounded-full bg-primaryBlue border-[1px] border-goldenOrange"></div>
          {/* <h1 className="flex items-center pl-4 text-md">Jimmy</h1> */}
        {/* </div> */} 
        <div>
          <hr class="w-[80%] h-[1px] mx-auto my-4 bg-black border-0 rounded" />
        </div>

        {/* <h1 className="flex items-center text-center pl-1 text-red-500 text-md"> */}
        {channels.map((channel) => (
          <div class="flex py-2 mx-4">
            <div class="h-12 w-full rounded-3xl bg-sand flex items-center pr-2 text-center">
              <div class="flex h-full w-12 items-center justify-center rounded-full bg-goldenOrange text-center text-xl text-white">
                <img src={channel.image_path} alt="Channel Image" />
              </div>
              <h1 class="px-2">{channel.channel_name}</h1>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SidebarMsg;