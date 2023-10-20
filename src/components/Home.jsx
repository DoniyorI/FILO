import React from "react";
import "./Home.css";
import Posts from "./Posts";


/* create const variables for reading in user get requests to make posts live on the home page */
const Home = () => {
  return (
    <div className="home_bg ml-20"> {/* Adjust the left margin here */}
      <div className="flex justify-center items-center text-3xl text-white pt-2">
        Home | Following
      </div>
      <div className="text-5xl text-white">
        Helooooooooooooo
      </div>
      <Posts/>
    </div>
  );
};



export default Home;
