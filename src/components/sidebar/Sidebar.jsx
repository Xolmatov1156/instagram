import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/config";
import { signOut } from "firebase/auth";
import Search from "../search/Search";
import CreatePost from "../createpost/CreatePost";
import logo from '../../assets/instagram.png'

const Sidebar = () => {
  const nav = useNavigate();

  return (
    <div className="w-64 h-[100vh] sticky top-0 border-r-2 p-6 flex flex-col align-middle">
      <img
        src={logo}
        alt=""
        className="w-40"
      />
      <div
        className="h-[48px] flex"
        style={{ margin: "4px 0", padding: "12px", cursor: "pointer" }}
        onClick={() => nav("/")}
      >
        <span className="material-symbols-outlined">home</span>
        <h1 className="pl-1">Home</h1>
      </div>
      <Search />
      <CreatePost />
      <div
        className="h-[48px] flex"
        style={{ margin: "4px 0", padding: "12px", cursor: "pointer" }}
        onClick={() => nav(`/${auth.currentUser.displayName}/`)}
      >
        <span className="material-symbols-outlined">account_circle</span>
        <h1 className="pl-1">Profiles</h1>
      </div>
      <div
        className="h-[48px] flex"
        style={{ margin: "4px 0", padding: "12px", cursor: "pointer" }}
        onClick={() => signOut(auth)}
      >
        <span className="material-symbols-outlined">logout</span>
        Logout
      </div>
    </div>
  );
};

export default Sidebar;
