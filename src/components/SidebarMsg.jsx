import React, { useState, useContext } from "react";
import FILO from "../assets/FiLo_Word.svg";
import Logo from "../assets/FILO_Logo.png";
import UserContext from "./UserContext";

const SidebarMsg = () => {
  // const { user, dmUsers, channels } = useContext(UserContext);
  return (
    <>
      <div className="w-1/6 h-screen sidebar_bg z-10 fixed">
        <div className="">
          <a href="/" className="m-2 flex items-center">
            <img src={Logo} alt="logo" width={50} className="mx-2"/>
            <img src={FILO} width={80}  />

          </a>
          {/* <a href="/" className="pl-6">
            <img src={FILO} width={80}  />
          </a> */}
        </div>

        <div className="flex pl-4 py-2">
          <div className="w-12 h-12 rounded-full bg-primaryBlue border-[1px] border-goldenOrange"></div>
          <h1 className="flex items-center pl-4 text-md">Jimmy</h1>
        </div>
        <div>
          <hr class="w-[80%] h-[1px] mx-auto my-4 bg-black border-0 rounded" />
        </div>
        <div>
          <div className="flex pl-4 py-2">
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
    </>
  );
};

export default SidebarMsg;
