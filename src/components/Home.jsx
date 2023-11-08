import React, { useRef, useEffect, useState } from "react";
import Posts from "./Posts";
import SendIcon from "../assets/sendIcon.svg";
import { LuImagePlus } from "react-icons/lu";

const Home = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [formData, setFormData] = useState({
    new_title: "",
    new_description: "",
  });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewPost = async (event) => {
    event.preventDefault();

    const dataToSend = {
      title: formData.new_title,
      description: formData.new_description,
    };

    try {
      console.log("dataToSend: ");
      console.log(dataToSend);
      const response = await fetch("/posts-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        window.location.href = "/";
      } else {
        // handle error
      }
    } catch (error) {
      window.location.href = "/";
      console.error("Error:", error);
    }
  };
  // TODO: Update Posts to load images look at the way profile images are uploaded should be similar

  return (
    <div className="home_bg min-h-screen h-full ml-20">
      <div className="flex justify-center items-center text-3xl text-white pt-2">
        <a
          href="/"
          className="px-4 text-base hover:underline underline-offset-8"
        >
          Home
        </a>
        |
        <a
          href="/"
          className="px-4 text-base hover:underline underline-offset-8"
        >
          Following
        </a>
      </div>

      <div
        className="max-w-5xl mx-auto p-4 my-8 bg-primaryDark shadow-md rounded-md text-sand"
        ref={formRef}
      >
        <h1 className="text-base font-semibold mb-2 text-center">New Post</h1>
        <form onSubmit={handleNewPost}>
          <input
            name="new_title"
            className="bg-transparent border-none appearance-none leading-tight focus:outline-none w-full"
            placeholder="What's On Your Mind?"
            value={formData.new_title}
            onFocus={() => {
              setIsFocused(true);
              setShowDescription(true);
            }}
            onBlur={() => setIsFocused(false)}
            onChange={handleInputChange}
          />
          <hr />
          {showDescription && (
            <div className="mt-2">
              <textarea
                name="new_description"
                className="bg-transparent border-none appearance-none leading-tight focus:outline-none w-full h-20 resize-none overflow-auto"
                placeholder="Description"
                value={formData.new_description}
                onFocus={() => {
                  setIsFocused(true);
                  setShowDescription(true);
                }}
                onChange={handleInputChange}
              />
              <hr className="p-2" />

              <div className="flex justify-end items-center">
                <label className="cursor-pointer">
                  <LuImagePlus 
                  className="w-7 h-7 inline-block text-white mr-2 hover:scale-125"
                  />
                  <input
                    type="file"
                    className="hidden"
                    // onChange={handleFileChange}
                    accept="image/*"
                  />
                </label>
                <button
                  type="submit"
                  className="bg-none hover:scale-125 text-white font-semibold mx-4 rounded-md justify-between"
                >
                  <img src={SendIcon} alt="send" width={20} height={20} />
                </button>

              </div>
            </div>
          )}
        </form>
      </div>

      <Posts />
    </div>
  );
};

export default Home;
