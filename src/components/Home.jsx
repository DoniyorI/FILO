import React from "react";
import "./Home.css";
import Posts from "./Posts";


/* create const variables for reading in user get requests to make posts live on the home page */
const Home = () => {
  return (
    <div className="home_bg h-screen ml-20"> {/* Adjust the left margin here */}
      <div className="flex justify-center items-center text-3xl text-white pt-2">
        <a href="/home" className="px-4 text-base">
          Home
        </a>
        |
        <a href="/following" className="px-4 text-base">
          Following
        </a>
      </div>
      <Posts/>
    </div>
  );
};



export default Home;
