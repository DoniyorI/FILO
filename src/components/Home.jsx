import React, { useRef, useEffect, useState } from "react";
import "./Home.css";
import Posts from "./Posts";
import SendIcon from "../assets/sendIcon.svg"

// create a const function that takes user to Home Page when "Home" is clicked

const Home = ({ title, content }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const formRef = useRef(); 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowDescription(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [formRef]);

  return (
    <div className="home_bg h-screen ml-20">
      <div className="flex justify-center items-center text-3xl text-white pt-2">
        <a href="/" className="px-4 text-base hover:underline underline-offset-8">
          Home
        </a>
        |
        <a href="/" className="px-4 text-base hover:underline underline-offset-8">
          Following
        </a>
      </div>

      <div className="max-w-5xl mx-auto p-4 my-8 bg-primaryDark shadow-md rounded-md text-sand "
      ref={formRef}>
        <h1 className="text-base font-semibold mb-2 text-center">New Post</h1>
        <form action="/posts-upload" method="post" content="text/plain">
          <input
            className="bg-transparent border-none appearance-none leading-tight focus:outline-none w-full"
            id="new-post"
            placeholder="What's On Your Mind?"
            onFocus={() => { setIsFocused(true); setShowDescription(true); }}
            onBlur={() => setIsFocused(false)}
          >
            {title}
          </input>
        </form>
        {isFocused && <p className="text-gray-700">{content}</p>}
        
        <hr/>

        {showDescription && (
          <div className="mt-2">
            <form action="/posts-upload" method="post" content="text/plain">
            <textarea
              className="bg-transparent border-none appearance-none leading-tight focus:outline-none w-full h-20 resize-none overflow-auto"
              id="description"
              placeholder="Description"
              onFocus={() => {setIsFocused(true); setShowDescription(true);}}
            >
              {content}
          </textarea>
            </form>
            <hr className="p-2"/>

            <div className="flex justify-end">
              <button className="bg-none hover:scale-150 text-white font-semibold px-4 py-2 rounded-md">
                <img src={SendIcon} alt="send" width={20} height={20}/>
              </button>
            </div>
          </div>
        )}
      </div>
      <Posts/>
    </div>
  );
};


export default Home;
