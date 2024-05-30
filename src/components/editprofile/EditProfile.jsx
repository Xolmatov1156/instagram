import { Button, Input, Textarea, Typography } from "@material-tailwind/react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState, useEffect, useCallback } from "react";
import { auth, db, storage } from "../../firebase/config";
import { doc, updateDoc, collection, getDocs } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const EditProfile = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState(user.username || "");
  const [fullName, setFullName] = useState(user.full_name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUserNameAvailable, setIsUserNameAvailable] = useState(true);
  const [isUserNameCharAvailable, setIsUserNameCharAvailable] = useState(true);
  const [isUserNameLengthValid, setIsUserNameLengthValid] = useState(true);
  const [usersData, setUsersData] = useState([]);
  const nav = useNavigate();

  const handleOpen = () => {
    setOpen(!open);
    if (!open) {
      setFullName(user.full_name || "");
      setUsername(user.username || "");
      setBio(user.bio || "");
      setPreview(null);
      setProfileImage(null);
    }
  };

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  const handleSave = async () => {
    if (!isUserNameCharAvailable || !isUserNameAvailable || !isUserNameLengthValid) {
      console.error("Username is either invalid, already taken, or too short.");
      return;
    }

    try {
      let photoUrl = user.pfp;
      if (profileImage) {
        const storageRef = ref(
          storage,
          `profile_images/${user.uid}/${profileImage.name}`
        );
        await uploadBytes(storageRef, profileImage);
        photoUrl = await getDownloadURL(storageRef);
      }

      const userDoc = doc(db, "users", user.uid);
      const updatedData = {
        username,
        full_name: fullName,
        bio,
        pfp: photoUrl,
        email: user.email,
        followers: user.followers || [],
        following: user.following || [],
        posts: user.posts || 0,
      };
      await updateDoc(userDoc, updatedData);

      if (username !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, {
          displayName: username,
        });
      }

      nav("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  useEffect(() => {
    if (profileImage) {
      const previewUrl = URL.createObjectURL(profileImage);
      setPreview(previewUrl);

      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setPreview(null);
    }
  }, [profileImage]);

  const inputForUsername = (e, setState) => {
    const input = e.target.value;
    const regex = /^[a-zA-Z0-9_.]*$/;
    const isCharAvailable = regex.test(input);
    const isLengthValid = input.length >= 3;

    setIsUserNameCharAvailable(isCharAvailable);
    setIsUserNameLengthValid(isLengthValid);
    setState(input);
  };

  useEffect(() => {
    const getUserName = async () => {
      const accountRef = collection(db, "users");
      const querySnapshot = await getDocs(accountRef);
      const data = querySnapshot.docs.map((doc) => doc.data());
      setUsersData(data);
    };
    getUserName();
  }, []);

  const isUsernameUnavailable = useCallback(
    (username) => {
      const normalizedUsername = username.toLowerCase();
      return usersData.some(
        (user) =>
          user.username &&
          user.username.toLowerCase() === normalizedUsername &&
          user.uid !== auth.currentUser.uid
      );
    },
    [usersData]
  );

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      const isAvailable = !isUsernameUnavailable(username);
      setIsUserNameAvailable(isAvailable);
    };

    if (username.trim() !== "") {
      checkUsernameAvailability();
    } else {
      setIsUserNameAvailable(true);
    }
  }, [username, isUsernameUnavailable]);

  return (
    <div>
      <Button color="purple" onClick={handleOpen}>
        Edit Profile
      </Button>
      {open && (
        <div
          className="fixed top-0 left-0 w-full h-[100vh] flex align-middle justify-center items-center"
          onClick={handleOpen}
          style={{
            backdropFilter: "blur(3px)",
            background: "rgba(0, 0, 0, 0.514)",
          }}
        >
          <div
            className="w-[30%] h-2/3 bg-black rounded-lg flex flex-col items-center"
            onClick={stopPropagation}
          >
            <Typography className="text-center text-2xl py-4">
              Edit your profile
            </Typography>
            <form className="w-[80%] gap-4 flex flex-col">
              <Input
                label="Username"
                value={username}
                onChange={(e) => inputForUsername(e, setUsername)}
                error={!isUserNameAvailable || !isUserNameCharAvailable || !isUserNameLengthValid}
                helperText={
                  !isUserNameAvailable
                    ? "Username is already taken."
                    : !isUserNameCharAvailable
                    ? "Username contains invalid characters."
                    : !isUserNameLengthValid
                    ? "Username must be at least 3 characters long."
                    : ""
                }
                color="white"
              />
              <Input
                label="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                color="white"
              />
              <Textarea
                placeholder="Bio"
                label="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="text-white"
              />
            </form>
            {preview && (
              <div className="w-full flex justify-center">
                <img
                  src={preview}
                  alt="Profile Preview"
                  className="w-32 h-32 object-cover rounded-full mt-4"
                />
              </div>
            )}
            <label htmlFor="file">
              <div className="p-9 cursor-pointer text-blue-500">
                Upload image for profile picture
              </div>
            </label>
            <input
              id="file"
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />
            <Button
              color="blue"
              className="w-[80%]"
              onClick={handleSave}
              disabled={!isUserNameAvailable || !isUserNameCharAvailable || !isUserNameLengthValid}
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
