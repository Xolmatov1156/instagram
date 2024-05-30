import { Button, Input, Typography } from "@material-tailwind/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/config";

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");
  const nav = useNavigate();

  const handlePass = (e) => {
    e.preventDefault();
    setShowPass(!showPass);
  };

  const handleInput = (e, setState) => {
    const input = e.target.value;
    setState(input);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      nav("/");
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="flex h-[100vh] align-middle justify-center items-center flex-col gap-4 ">
      <div className="border-2 w-96 h-[360px] text-wrap p-5 flex flex-col align-middle items-center">
        <Typography className="text-white text-2xl text-center py-10">
          Log In
        </Typography>
        <form
          className="gap-4 flex flex-col w-3/4 justify-center align-middle items-center text-white"
          onSubmit={handleSubmit}
        >
          <Input
            label="Email"
            type="email"
            onChange={(e) => handleInput(e, setEmail)}
            required
            color="white"
          />
          <div className="relative w-full">
            <Input
              label="Password"
              type={showPass ? "text" : "password"}
              onChange={(e) => handleInput(e, setPass)}
              required
              color="white"
            />
            {pass && (
              <button
                className="absolute right-1 top-3 text-sm"
                onClick={handlePass}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSubmit(e);
                  }
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
            className="mt-3 w-64 shadow-none hover:shadow-none"
          >
            SIGN IN
          </Button>
        </form>
      </div>
      <div className="border-2 w-96 h-[63px] text-wrap p-5 flex flex-col align-middle items-center text-center justify-center">
        <Typography className="text-sm text-white">
          Don't have an account?{" "}
          <a
            className="cursor-pointer text-blue-600"
            onClick={() => nav("/signup")}
          >
            Sign Up
          </a>
        </Typography>
      </div>
    </div>
  );
};

export default Login;
