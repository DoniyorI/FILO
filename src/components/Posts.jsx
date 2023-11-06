import React, { useState, useEffect } from "react";
import Profile from "../assets/mainProfile.svg";
import heartIcon from "../assets/heart-regular.svg";
import redHeart from "../assets/redHeart.svg";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const [user, setUser] = useState(null); // Added this state to hold the user's name

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
        setUser(user); 
        console.log(user);
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
  // TODO: Update Posts to load images look at the way profile images are uploaded should be similar

  return (
    <div className="justify-center">
      {error ? (
        <p className="text-red-500 text-xl">Error: {error}</p>
      ) : posts.length === 0 ? (
        <div className="flex justify-center items-center">
          <p className="text-sand text-4xl text-center">
            No posts available!
          </p>
        </div>
      ) : (
        posts.map((post, index) => (
          <div
            key={index}
            className="max-w-5xl mx-auto my-1 p-3 bg-post rounded-xl text-white"
          >
            <div className="flex items-center space-x-4" id={post._id}>
            
            {user && user.profile_path && (
              <img
                src={require(`../assets/${user.profile_path}`)}
                alt="profile"
                className="w-10 h-10 rounded-full"
              />
            )}

              <h2>{post.username}</h2>
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
