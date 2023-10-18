import React from "react";
import Logo from "../assets/FILO_Logo.png";
import ProfileImage from "../assets/Profile_Image.png";

const Nav = () => {
  return (
    <header>
      <nav className="nav_bg flex justify-between items-center w-full z-10 py-2 px-6 shadow-2xl">
        <a href="/">
          <img src={Logo} alt="logo" width={55} height={25} />
        </a>
        <div className="flex gap-5 px-5">
          <h1 className="text-[#f0a73e] text-2xl">Solomon Lian</h1>
          <a href="/profile">
            <img src={ProfileImage} alt="profile" width={35} height={27} />
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
