import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import Suggestions from "../suggestions/Suggestions";
import RednerPosts from "../renderposts/RednerPosts";
import { Typography } from "@material-tailwind/react";
import Logo from "../../assets/logo_outlined.png";
import Meta from "../../assets/meta.jfif";

const Home = () => {
  const [isPostsRendered, setIsPostsRendered] = useState(false);
  const [isSuggestionsRendered, setIsSuggestionsRendered] = useState(false);

  return (
    <div className="text-white">
      <div className="flex flex-row justify-between">
        <Sidebar />
        <div className="pt-5 flex flex-row justify-between w-full">
          <div></div>
          <RednerPosts setIsPostsRendered={setIsPostsRendered} />
          <Suggestions setIsSuggestionsRendered={setIsSuggestionsRendered} />
        </div>
      </div>
      {!isPostsRendered && !isSuggestionsRendered ? (
        <div className="flex align-middle justify-center absolute top-0 right-0 w-full items-center h-[100vh] bg-white">
          <img src={Logo} style={{ width: "70px", height: "70px" }} />
          <div className="absolute left-0 w-full bottom-36 align-middle justify-center flex flex-col items-center ">
            <Typography color="gray">from</Typography>
            <img src={Meta} className="w-28" />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Home;
