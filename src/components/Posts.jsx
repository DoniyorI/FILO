import React, { useState, useEffect } from "react";
import Profile from "../assets/mainProfile.svg";
import heartIcon from "../assets/heart-regular.svg";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch posts when component mounts
    fetch("/get-posts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => setPosts(data.reverse()))  // Added reverse() here
      .catch((error) => {
        console.error("There has been a problem with your fetch operation:", error);
        setError(error.toString());
      });
  }, []); // The empty array means this useEffect runs once when component mounts, like componentDidMount

  return (
    <div className="justify-center">
      {error ? (
        <p className="text-red-500 text-xl">Error: {error}</p>
      ) : posts.length === 0 ? (
        <p className="text-white text-4xl">No posts available!</p>
      ) : (
        posts.map((post, index) => (
          <div key={index} className="max-w-5xl mx-auto my-1 p-3 bg-post rounded-xl text-white">
            <div className="flex items-center space-x-4">
              <img src={Profile} alt="Profile" className="w-10 h-10 rounded-full" />
              <h2>{post.username.username}</h2> 
            </div>
            <hr />
            <h1>{post.title}</h1>
            <hr />
            <p>{post.description}</p>
            <hr />
            <div className="">
              <img src={heartIcon} alt="Like" className="mt-2 w-5 h-5"></img>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Posts;
