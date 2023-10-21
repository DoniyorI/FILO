import React from "react";
// import { BsPlus } from 'react-icons/bs';
import Logo from "../assets/FILO_Logo.png";

const Sidebar = ({ friends }) => {
  return (
    <header>
      <aside className="sidebar_bg h-screen py-3 w-20 fixed z-10">
        <div className="flex flex-col items-center">
          <a href="/">
            <img src={Logo} alt="logo" width={50} />
            <link href="/" alt="title" />
          </a>

          <div class="group flex h-14 w-14 transform items-center justify-center rounded-full bg-primaryBlue transition-transform hover:scale-110 mt-6 relative">
            <div class="opacity-0 group-hover:opacity-100 absolute left-20 rounded-lg bg-white p-2 text-lg shadow-md transition-opacity">
              {friends}
            </div>
          </div>
        </div>
      </aside>
    </header>
  );
};
export default Sidebar;
