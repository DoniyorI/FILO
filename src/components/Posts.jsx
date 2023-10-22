import React, { useState, useEffect } from "react";
import Profile from "../assets/mainProfile.svg";
import heartIcon from "../assets/heart-regular.svg";
import redHeart from "../assets/redHeart.svg";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const [clicked, setClicked] = useState([]);
  const [formData, setFormData] = useState({
    like_counts: ""
    });
    const { like_counts } = formData;
    const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
    ...formData,
    [name]: value,
    });
    };
    
    const handleLikes = async (event) => {
    event.preventDefault();
    // Create an object with the data you want to send to the server
    
      const dataToSend = {
      
      likes: like_counts
      
      };
      
      console.log(dataToSend);
      
        
      
      try {
      
      const response = await fetch("/post-like", {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
      });
    
      if (response.ok) {
      console.log(dataToSend);
      window.location.href = "/";
      // Registration was successful, you can handle the response here
      // e.g., redirect or display a success message
      } else {
      // Registration failed, handle the error here
      // e.g., display an error message
      }
      } catch (error) {
      // ...
      }
    }

  function handleClick(index) {
    const newClicked = [...clicked];
    newClicked[index] = !newClicked[index]; // Toggle the clicked state for the specific post
    setClicked(newClicked);
    handleLikes();
  }

  useEffect(() => {
    const fetchPosts = () => {
      fetch("/get-posts")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          setPosts(data.reverse());
          setClicked(new Array(data.length).fill(false));
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your fetch operation:",
            error
          );
          setError(error.toString());
        });
    };
  
    fetchPosts();  // Fetch posts initially when component mounts
  
    const intervalId = setInterval(fetchPosts, 5000);  // Fetch posts every 5 seconds
  
    return () => clearInterval(intervalId);  // Clear the interval when component unmounts
  }, []);
  return (
    <div className="justify-center">
      {error ? (
        <p className="text-red-500 text-xl">Error: {error}</p>
      ) : posts.length === 0 ? (
        <p className="text-white text-4xl">No posts available!</p>
      ) : (
        posts.map((post, index) => (
          <div
            key={index}
            className="max-w-5xl mx-auto my-1 p-3 bg-post rounded-xl text-white"
          >
            <div className="flex items-center space-x-4">
              <img
                src={Profile}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <h2>{post.username}</h2>
            </div>
            <hr className="my-4" />
            <h1 className="text-2xl text-sand font-bold">{post.title}</h1>
            <hr className="my-4" />
            <p className="text-sand">{post.description}</p>
            <hr className="my-2" />
            <div className="mt-2 w-5 h-5 cursor-pointer hover:scale-110">
              {clicked[index] ? (
                <img
                  src={redHeart}
                  onClick={() => handleClick(index)}
                  alt="Liked"
                />
              ) : (
                <img
                  src={heartIcon}
                  onClick={() => handleClick(index)}
                  alt="Like"
                />
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Posts;
