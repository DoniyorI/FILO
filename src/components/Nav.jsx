import React, { useState, useEffect, useRef } from "react";
import Logo from "../assets/FILO_Logo.png";
import ProfileImage from "../assets/mainProfile.svg";

const Nav = () => {
  const [userName, setUserName] = useState(null);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);

  const profileMenuRef = useRef(null);

  useEffect(() => {
    fetch("/get-user")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((user) => {
        setUserName(user);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const handleDocumentClick = (e) => {
    // Check if the click occurred outside the profile menu
    if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
      setProfileMenuOpen(false);
    }
  };

  const handleProfileIconClick = () => {
    setProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleMenu = () => {
    setProfileMenuOpen(false);
  };

  return (
    <header>
      <nav className="nav_bg flex justify-between items-center w-full z-10 py-4 px-10 shadow-lg">
        <a href="/">
          <img src={Logo} alt="logo" width={35} height={25} />
        </a>
        <div className="flex gap-6 px-4">
          <h1 className="text-sand text-2xl font-bold">
            {userName ? userName : "Loading..."}
          </h1>
          <div ref={profileMenuRef}>
            <img
              src={ProfileImage}
              alt="profile"
              width={30}
              height={30}
              onClick={handleProfileIconClick}
              className="cursor-pointer"
            />
            {isProfileMenuOpen && (
              <div className="absolute top-16 right-6 bg-primaryBlue text-sand shadow-md p-2 border-2 border-sand rounded-md">
                <ul className="text-center">
                  <li
                    className="hover:scale-110 hover:underline cursor-pointer"
                    onClick={handleMenu}
                  >
                    Profile
                  </li>
                  <li
                    className="hover:scale-110 hover:underline cursor-pointer"
                    onClick={handleMenu}
                  >
                    Settings
                  </li>
                  <li
                    className="hover:scale-110 hover:underline cursor-pointer"
                    onClick={handleMenu}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
