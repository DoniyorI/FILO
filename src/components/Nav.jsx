// import React from "react";
// import Logo from "../assets/FILO_Logo.png";
// import ProfileImage from "../assets/mainProfile.svg";

// const Nav = () => {
//   return (
//     <header>
//       <nav className="nav_bg flex justify-between items-center w-full z-10 py-3 px-10 shadow-lg">
//         <a href="/">
//           <img src={Logo} alt="logo" width={35} height={25} />
//           <link href="/" alt="title" />
          
//         </a>
//         <div className="flex gap-5 px-5">
//           <h1 className="text-[#EFEBDA] text-2xl">Solomon Lian</h1>
//           <a href="/profile">
//             <img src={ProfileImage} alt="profile" width={30} height={30} />
//           </a>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Nav;
import React, { useState, useEffect } from "react";
import Logo from "../assets/FILO_Logo.png";
import ProfileImage from "../assets/mainProfile.svg";

const Nav = () => {
  const [userName, setUserName] = useState(null);  // Added this state to hold the user's name

  useEffect(() => {
    // Fetch user when component mounts
    fetch("/get-user")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((user) => {
        setUserName(user);  // Assuming the username is stored in the 'username' property
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  }, []);  // The empty array means this useEffect runs once when component mounts

  return (
    <header>
      <nav className="nav_bg flex justify-between items-center w-full z-10 py-3 px-10 shadow-lg">
        <a href="/">
          <img src={Logo} alt="logo" width={35} height={25} />
        </a>
        <div className="flex gap-5 px-5">
          <h1 className="text-[#EFEBDA] text-2xl">{userName ? userName : "Loading..."}</h1>  
          {/* Updated to display the user's name, if it's null, it will show "Loading..." */}
          <a href="/profile">
            <img src={ProfileImage} alt="profile" width={30} height={30} />
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Nav;


