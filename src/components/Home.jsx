import React from "react";
import "./Home.css";


const Home = () => {
  
  return (
    <section className="home_bg h-screen w-full">
      <div className="flex justify-center items-center text-3xl text-white pt-2">
        <a href="/home" className="px-4 text-base">
          Home
        </a>
        |
        <a href="/following" className="px-4 text-base">
          Following
        </a>
      </div>
    </section>
  );
};

export default Home;
