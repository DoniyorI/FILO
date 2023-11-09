import React, { useState, useEffect, useContext } from "react";
import heartIcon from "../assets/heart-regular.svg";
import redHeart from "../assets/redHeart.svg";

import UserContext from './UserContext';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const { user, setUser } = useContext(UserContext);

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
    const dataToSend = { postId, userId: user.username };

    try {
      await fetch("/post-like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  function handleClick(postId, index) {
    const updatedPosts = [...posts];
    const post = updatedPosts[index];

    if (post.likers.includes(user.username)) {
      // If the post is already liked, unlike it
      const likerIndex = post.likers.indexOf(user.username);
      post.likers.splice(likerIndex, 1);
      post.like_counter--;
    } else {
      // If the post is not yet liked, like it
      post.likers.push(user.username);
      post.like_counter++;
    }

    setPosts(updatedPosts);
    handleLikes(postId, index); // This will now just update the like status in the backend
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
          setPosts(data.reverse());
          console.log(data);
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

    fetchPosts();

    const intervalId = setInterval(fetchPosts, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const isFollowing = (username) => {
    return user.following.includes(username);
  };

  // The function to handle the follow action
  const handleFollow = async (usernameToFollow) => {
    // Optimistically update the local state
    const isNowFollowing = isFollowing(usernameToFollow);
    const updatedFollowing = isNowFollowing
      ? user.following.filter(username => username !== usernameToFollow) // Remove the user from the following array
      : [...user.following, usernameToFollow]; // Add the user to the following array
  
    setUser({
      ...user,
      following: updatedFollowing
    });
  
    try {
      // Perform the backend update
      const response = await fetch("/follow-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          followers: user.username,
          following: usernameToFollow,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      // No need to update the state here, as we've already done it optimistically
  
    } catch (error) {
      // If the backend update fails, revert the state change
      console.error("There has been a problem with your follow operation:", error);
      setUser(prevUser => ({
        ...prevUser,
        // Revert to the previous following list
        following: isNowFollowing ? [...prevUser.following, usernameToFollow] : prevUser.following.filter(username => username !== usernameToFollow),
      }));
    }
  };

  return (
    <div className="justify-center">
      {error ? (
        <p className="text-red-500 text-xl">Error: {error}</p>
      ) : posts.length === 0 ? (
        <div className="flex justify-center items-center">
          <p className="text-sand text-4xl text-center">No posts available!</p>
        </div>
      ) : (
        posts.map((post, index) => (
          <div
            key={index}
            className="max-w-5xl mx-auto my-1 p-3 bg-post rounded-xl text-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {user && user.profile_image && (
                  <img
                    src={require(`../assets/${user.profile_image}`)}
                    alt="profile"
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <h2 className="text-xl">{post.username}</h2>
              </div>
              {/* If post is yourself show Follow or following*/}
              {user && user.username !== post.username && (
                <button
                  onClick={() => handleFollow(post.username)}
                  className="text-blue-300 text-md px-3 cursor-pointer hover:scale-110"
                >
                  {isFollowing(post.username) ? "Following" : "Follow"}
                </button>
              )}
            </div>

            <hr className="my-4" />
            <h1 className="text-2xl text-sand font-bold">{post.title}</h1>
            <hr className="my-4" />
            {post.description && (
              <div>
                <p className="text-sand">{post.description}</p>
                <hr className="my-2" />
              </div>
            )}

            {post.image_path && (
              <div>
                 <img
                    src={require(`../post-image/${post.image_path}`)}
                    alt="profile"
                    className="h-32"
                  />
                {/* <img
                  src={require(`../assets/${user.profile_image}`)}
                  alt="Post"
                  className="h-32" 
                /> */}
                <p>Hello</p>
                <hr className="my-2" />
              </div>
            )}

            <div className="mt-2 w-5 h-5 flex items-center space-x-2">
              {user && post.likers.includes(user.username) ? (
                <img
                  src={redHeart}
                  onClick={() => handleClick(post._id, index)}
                  alt="Liked"
                  className="hover:scale-110"
                />
              ) : (
                <img
                  src={heartIcon}
                  onClick={() => handleClick(post._id, index)}
                  alt="Like"
                  className="hover:scale-110"
                />
              )}
              <span className="text-white">{post.like_counter}</span>{" "}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Posts;
