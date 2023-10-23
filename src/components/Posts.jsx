import React, { useState, useEffect } from "react";
import Profile from "../assets/mainProfile.svg";
import heartIcon from "../assets/heart-regular.svg";
import redHeart from "../assets/redHeart.svg";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const [userName, setUserName] = useState(null); // Added this state to hold the user's name

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
        setUserName(user); // Assuming the username is stored in the 'username' property
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  }, []);

  const [clicked, setClicked] = useState([]);
  const [formData, setFormData] = useState({
    like_counts: "",
  });
  const { like_counts } = formData;
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLikes = async (postId, index) => {
    // No need for event.preventDefault() here because there's no form submission

    // Send the post ID and user ID to the backend
    const dataToSend = { postId, userId: userName }; // Replace 'someUserId' with the actual user ID

    try {
      const response = await fetch("/post-like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const data = await response.json(); // Get the updated like count from the backend
        const updatedPosts = [...posts];
        updatedPosts[index].like_counter = data.like_counter; // Update the like count in the frontend
        setPosts(updatedPosts);
      } else {
        // Handle error
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  function handleClick(postId, index) {
    const newClicked = [...clicked];
    newClicked[index] = !newClicked[index];
    setClicked(newClicked);
    handleLikes(postId, index); // Pass the post ID to the handleLikes function
  }

  useEffect(() => {
    const fetchPosts = () => {
      fetch("/get-posts")
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Network response was not ok " + response.statusText
            );
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

    fetchPosts(); // Fetch posts initially when component mounts

    const intervalId = setInterval(fetchPosts, 5000); // Fetch posts every 5 seconds

    return () => clearInterval(intervalId); // Clear the interval when component unmounts
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
            <div className="flex items-center space-x-4" id={post._id}>
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
            {/* <div className="mt-2 w-5 h-5 cursor-pointer hover:scale-10">
              {clicked[index] ? (
                <img
                  src={redHeart}
                  onClick={() => handleClick(post._id, index)} // Pass the post ID to handleClick
                  alt="Liked"
                />
              ) : (
                <img
                  src={heartIcon}
                  onClick={() => handleClick(post._id, index)} // Pass the post ID to handleClick
                  alt="Like"
                />
              )}
            </div> */}
            <div className="mt-2 w-5 h-5  flex items-center space-x-2 ">
              {clicked[index] ? (
                <img
                  src={redHeart}
                  onClick={() => handleClick(post._id, index)}
                  alt="Liked"
                />
              ) : (
                <img
                  src={heartIcon}
                  onClick={() => handleClick(post._id, index)}
                  alt="Like"
                />
              )}
              <span className="text-white">{post.like_counter}</span>{" "}
              {/* Display the like count here */}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Posts;
