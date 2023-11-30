import React, { useState, useEffect } from "react";

const UserProfileModal = ({ user, onClose, onUpdate }) => {
  const [profileImage, setProfileImage] = useState(user.profileImage);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("profileImage", file, user.username + "_" + file.name);

    fetch("/upload-profile-picture", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to upload image");
        }
        return response.json();
      })
      .then((data) => {
        setProfileImage(data.filePath);
        onUpdate(data.filePath); // Call the provided onUpdate function with the new image path
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <div className="profile-section">
          <img src={profileImage} alt="Profile" />
          <input type="file" onChange={handleImageChange} />
        </div>
        <div className="user-info">
          <p>Email: {user.email}</p>
          <p>Username: {user.username}</p>
          {/* Display other user info here */}
        </div>
        <div className="social-info">
          <p>Following: {user.following}</p>
          <p>Followers: {user.followers}</p>
          {/* Insert following/followers components here */}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
