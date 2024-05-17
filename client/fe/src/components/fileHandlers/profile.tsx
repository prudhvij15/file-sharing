import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";

const ProfilePicture = () => {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [profilePicture]); // Update profile picture when profilePicture state changes

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("http://localhost:3001/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfilePicture(response.data.profilePicture);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await axios.post(
          "http://localhost:3001/api/upload-profile-picture",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Update profile picture URL after successful upload
        setProfilePicture(response.data.profilePictureUrl);
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Redirect to the login page
    window.location.href = "/";
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-10 h-10 rounded-full overflow-hidden bg-gray-100 focus:outline-none focus:border-white"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {profilePicture ? (
            <img src={profilePicture} alt="Profile" className="w-full h-full" />
          ) : (
            <svg
              className="w-full h-full text-gray-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M2.707 10.707a1 1 0 011.414 0L12 19.586l8.879-8.879a1 1 0 111.414 1.414l-9 9a1 1 0 01-1.414 0l-9-9a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>
      {showDropdown && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            <label
              htmlFor="profilePictureInput"
              className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Change Profile Picture
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="profilePictureInput"
            />
            <button
              onClick={handleLogout}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;
