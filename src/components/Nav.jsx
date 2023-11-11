import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import UserContext, { useFetchUser } from './UserContext';


import Logo from "../assets/FILO_Logo.png";


const Nav = () => {
  const navigate = useNavigate();
  const { user, setUser, dmUsers, setDmUsers, channels, setChannels, error } = useFetchUser();

  useEffect(() => {
      if (error) {
          navigate('/login');
      }
  }, [error, navigate]);


  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const profileMenuRef = useRef(null);
  const modalRef = useRef(null);

  // const { user, dmUsers, channels } = useContext(UserContext);

  const handleMenu = () => {
    setProfileMenuOpen(false);
  };

  useEffect(() => {
    const handleDocumentClick = (e) => {
      // Close profile menu if click is outside
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setProfileMenuOpen(false);
      }
      // Close modal if click is outside
      if (
        isModalOpen &&
        modalRef.current &&
        !modalRef.current.contains(e.target)
      ) {
        setIsModalOpen(false);
      }
    };

    // Add event listener when the component is mounted
    document.addEventListener("mousedown", handleDocumentClick);

    // Cleanup the event listener when the component is unmounted
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, [isModalOpen]);

  const handleProfileIconClick = () => {
    setProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleProfileClick = () => {
    setIsModalOpen(true);
    setProfileMenuOpen(false); // Close dropdown menu
  };

  const [newImage, setNewImage] = useState(null);
  const [saveChanges, setSaveChanges] = useState(false);

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Update the new image state
        setNewImage(e.target.result);
        // Set the saveChanges flag to true
        setSaveChanges(true);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCancel = () => {
    // Reset the newImage state and close the modal
    setNewImage(null);
    setIsModalOpen(false);
  };

  const handleSave = () => {
    if (saveChanges && newImage) {
      const payload = {
        username: user.username,
        image: newImage, // Send the base64-encoded image data directly
      };
  
      fetch('/new-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            console.log("Profile uploaded successfully");
            // Reset the saveChanges flag
            setSaveChanges(false);
            window.location.href = "/";
          } else {
            console.error("Error uploading profile:", data.error);
          }
        });
    }

    // Close the modal
    setIsModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/logout', {
        method: 'POST',
        credentials: 'include', // to ensure cookies are sent
      });
      if (response.ok) {
        // Handle successful logout
        // e.g., redirect to login page or update UI state
      } else {
        // Handle logout failure
      }
    } catch (error) {
      // Handle any errors
    }
  };
  
  return (
    // TODO: Implement search bar
    <header>
      <nav className="nav_bg flex justify-between items-center w-full z-10 py-2 px-8 shadow-lg">
        <a href="/">
          {/* <img src={Logo} alt="logo" width={35} height={25} /> */}
        </a>
        <div className="flex gap-6 px-4">
          <h1 className="text-sand text-2xl font-bold">
            {user ? user.username : "Loading..."}
          </h1>
          <div ref={profileMenuRef}>
            {user && user.profile_image && (
              <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                onClick={handleProfileIconClick}
                src={user.profile_image}
                alt="profile"
                className="w-full h-full object-cover cursor-pointer"
              />
            </div>
            )}
            {isProfileMenuOpen && (
              <div className="absolute top-16 right-6 bg-primaryBlue text-sand shadow-md p-2 border-2 border-sand rounded-md">
                <ul className="text-center">
                  <li
                    className="hover:scale-110 hover:underline cursor-pointer"
                    onClick={handleProfileClick}
                  >
                    Profile
                  </li>
                  <li
                    className="hover:scale-110 hover:underline cursor-pointer"
                    onClick={handleMenu}
                  >
                    Settings
                  </li>
                  <li
                    className="hover:scale-110 hover:underline cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center ">
          <div
            ref={modalRef}
            className="nav_bg p-4 rounded text-white "
            style={{ minHeight: "50vh", minWidth: "80vw" }}
          >
            <h2 className="text-amber-500 pb-10 text-center text-3xl	">
              User Profile
            </h2>
            <div className="flex flex-wrap">
              <div className="flex flex-col items-center w-1/2 border-r">
                {/* Image Container */}
                <div className="w-full flex justify-center p-10">
                  <div className="relative">
                    {newImage ? ( // Display the new image if available
                      <div className="w-52 h-52 rounded-full overflow-hidden">
                        <img
                          src={newImage}
                          alt="profile"
                          className="w-full h-full object-cover cursor-pointer"
                        />
                      </div>
                    ) : (
                      user &&
                      user.profile_image && ( // Display the user's existing profile image
                        <div className="w-52 h-52 rounded-full overflow-hidden">
                          <img
                            src={user.profile_image}
                            alt="profile"
                            className="w-full h-full object-cover cursor-pointer"
                          />
                        </div>
                      )
                    )}
                    {/* Upload Icon Overlay */}
                    <input
                      type="file"
                      id="profile-upload"
                      onChange={handleChange}
                      className="hidden"
                    />

                    {/* Upload Icon Overlay */}
                    <label
                      htmlFor="profile-upload"
                      className="absolute bottom-2 right-3 bg-blue-300 text-white rounded-full flex items-center justify-center w-10 h-10 cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </label>
                  </div>
                </div>

                {/* Information Container */}
                <div className="w-full flex justify-between px-2 text-2xl pb-10">
                  <div className="flex-1 flex justify-center items-center border-r">
                    <div className="text-center">
                      <div className="font-semibold">Following</div>
                      <div>
                        {user && Array.isArray(user.following)
                          ? user.following.length
                          : "Loading..."}
                      </div>
                    </div>
                  </div>

                  {/* Followers Column */}
                  <div className="flex-1 flex justify-center items-center">
                    <div className="text-center">
                      <div className="font-semibold">Followers</div>
                      <div>
                        {user && Array.isArray(user.followers)
                          ? user.followers.length
                          : "Loading..."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-1/2 pl-2 ">
                <div className="p-10">
                  <div className="user-info-field flex flex-col mb-4">
                    <label className="mb-1 text-sm font-semibold">Email</label>
                    <input
                      className="border-0 border-b-2 border-gray-300   text-gray-600 bg-transparent focus:outline-none focus:ring-0"
                      type="text"
                      value={user ? user.email : "Loading..."}
                      readOnly
                    />
                  </div>

                  <div className="user-info-field flex flex-col mb-4">
                    <label className="mb-1 text-sm font-semibold">
                      Username
                    </label>
                    <input
                      className="border-0 border-b-2 border-gray-300  text-gray-600 bg-transparent focus:outline-none focus:ring-0"
                      type="text"
                      value={user ? user.username : "Loading..."}
                      readOnly
                    />
                  </div>

                  <div className="user-info-field flex flex-col mb-4">
                    <label className="mb-1 text-sm font-semibold">
                      Password
                    </label>
                    <input
                      className="border-0 border-b-2 border-gray-300 text-gray-600 bg-transparent focus:outline-none focus:ring-0"
                      type="password"
                      value={"****************"}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              {/* Render the Save and Cancel buttons based on the saveChanges flag */}
              {saveChanges ? (
                <>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-400 text-white px-4 py-2 rounded-md"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded-md"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Nav;
