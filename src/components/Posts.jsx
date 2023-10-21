// import React, { useState, useEffect } from "react";
// import Profile from "../assets/mainProfile.svg";

const Posts = ({ title, content }) => {
  return (
    <div className="max-w-lg mx-auto p-4 my-8 bg-primaryDark shadow-md rounded-md text-sand">
      <h1 className="text-sm font-semibold mb-2 text-center">New Post</h1>
      <form action="/posts-upload" method="post" content="text/plain">
        <input
          className="bg-transparent border-none appearance-none leading-tight focus:outline-none w-full"
          id="new-post"
          placeholder="What's On Your Mind?"
        ></input>
      </form>
      <p className="text-gray-700">{content}</p>
      <button className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md">
        Send
      </button>
    </div>
  );

  // const [posts, setPosts] = useState([]);

  // useEffect(() => {
  //   const serverEndpoint = '/get-posts';

  //   fetch(serverEndpoint)
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok ' + response.statusText);
  //       }
  //       return response.json();
  //     })
  //     .then(data => {
  //       setPosts(data);
  //     })
  //     .catch(error => {
  //       console.error('There has been a problem with your fetch operation:', error);
  //     });
  // }, []);

  // return (
  //   <div className="min-h-screen flex items-center justify-center">
  //     {posts.length === 0 ? (
  //       <p className="text-white text-4xl">No posts available!</p>
  //     ) : (
  //       posts.map(post => (
  //         <div key={post.id} className="p-2 m-2 bg-post rounded-xl">
  //           <div className="flex items-center space-x-4">
  //             <img src={Profile} alt="Profile" className="w-10 h-10 rounded-full" />
  //             <h2>{post.username}</h2>
  //           </div>
  //           <h1>{post.title}</h1>
  //           <p>{post.description}</p>
  //         </div>
  //       ))
  //     )}
  //   </div>
  // );
};

export default Posts;
