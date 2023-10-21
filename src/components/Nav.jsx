import React from "react";
import Logo from "../assets/FILO_Logo.png";
import ProfileImage from "../assets/mainProfile.svg";

const Nav = () => {
  return (
    <header>
      <nav className="nav_bg flex justify-between items-center w-full z-10 py-3 px-10 shadow-lg">
        <a href="/">
          <img src={Logo} alt="logo" width={35} height={25} />
          <link href="/" alt="title" />
          
        </a>
        <div className="flex gap-5 px-5">
          <h1 className="text-[#EFEBDA] text-2xl">Solomon Lian</h1>
          <a href="/profile">
            <img src={ProfileImage} alt="profile" width={30} height={30} />
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
