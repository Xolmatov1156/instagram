import { Button, Input, Typography } from "@material-tailwind/react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/config";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";

const Signup = () => {
  const [showPass, setShowPass] = useState(false);
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [isUserNameAvailable, setIsUserNameAvailable] = useState(true);
  const [isUserNameCharAvailable, setIsUserNameCharAvailable] = useState(true);
  const [isUserNameLengthValid, setIsUserNameLengthValid] = useState(true);
  const [usersData, setUsersData] = useState([]);
  const nav = useNavigate();

  const handlePass = (e) => {
    e.preventDefault();
    setShowPass(!showPass);
  };

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
      console.log(data);
      setUsersData(data);
    };
    getUserName();
  }, []);

  const isUsernameUnavailable = async () => {
    const username = userName.toLowerCase();
    return !usersData.some(
      (user) => user.username && user.username.toLowerCase() === username
    );
  };

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      const isAvailable = await isUsernameUnavailable();
      setIsUserNameAvailable(isAvailable);
    };

    if (userName.trim() !== "") {
      checkUsernameAvailability();
    } else {
      setIsUserNameAvailable(true);
    }
  }, [userName, isUsernameUnavailable]);

  const handleInput = (e, setState) => {
    const input = e.target.value;
    setState(input);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        pass
      );
      const user = userCredential.user;
      await updateProfile(user, {
        displayName: userName,
      });

      const profileInfo = {
        username: userName,
        full_name: name,
        email: email,
        pfp: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
        following: [],
        followers: [],
        posts: 0,
        bio: null,
        uid: user.uid,
      };

      await setDoc(doc(db, "users", user.uid), profileInfo);
      nav("/");
    } catch (error) {
      console.error("Error signing up: ", error);
    }
  };

  return (
    <div className="flex h-[100vh] align-middle justify-center items-center flex-col gap-4 text-white">
      <div className="border-2 w-96 h-[470px] text-wrap p-5 flex flex-col align-middle items-center">
        <Typography className="text-gray-80000 text-2xl text-center py-10">
          Sign Up
        </Typography>
        <form
          className="gap-4 flex flex-col w-3/4 justify-center align-middle items-center"
          onSubmit={handleSubmit}
        >
          <Input
            label="Email"
            type="email"
            onChange={(e) => handleInput(e, setEmail)}
            required
            color="white"
          />
          <Input
            label="Full Name"
            type="text"
            onChange={(e) => handleInput(e, setName)}
            required
            color="white"
          />
          <div className="relative w-full">
            <Input
              label="Username"
              type="text"
              color={
                isUserNameAvailable && isUserNameCharAvailable && isUserNameLengthValid
                  ? "green"
                  : "red"
              }
              onChange={(e) => {
                inputForUsername(e, setUserName);
              }}
              required
              className="text-white"
            />
            {!isUserNameAvailable && isUserNameCharAvailable && isUserNameLengthValid && (
              <Typography color="red">{userName} is unavailable</Typography>
            )}
            {!isUserNameLengthValid && (
              <Typography color="red">Username must be at least 3 characters long</Typography>
            )}
            {!isUserNameCharAvailable && (
              <Typography color="red">Username contains invalid characters</Typography>
            )}
          </div>
          <div className="relative w-full">
            <Input
              label="Password"
              type={showPass ? "text" : "password"}
              onChange={(e) => handleInput(e, setPass)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              required
              color="white"
            />
            {pass && (
              <button
                className="absolute right-1 top-3 text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  handlePass(e);
                }}
              >
                {showPass ? "Hide" : "Show"}
              </button>
            )}
          </div>
          <Button
            color="blue"
            type="submit"
            variant="gradient"
            ripple={false}
            className={`mt-3 w-64 shadow-none hover:shadow-none ${!isUserNameAvailable || !isUserNameCharAvailable || !isUserNameLengthValid
              ? "disabled-button"
              : ""
              }`}
            disabled={!isUserNameAvailable || !isUserNameCharAvailable || !isUserNameLengthValid}
          >
            SIGN UP
          </Button>
        </form>
      </div>
      <div className="border-2 w-96 h-[63px] text-wrap p-5 flex flex-col align-middle items-center text-center justify-center">
        <Typography className="text-sm">
          Have an account?{" "}
          <a
            className="cursor-pointer text-blue-600"
            onClick={() => nav("/login")}
          >
            Log In
          </a>
        </Typography>
      </div>
    </div>
  );
};

export default Signup;
