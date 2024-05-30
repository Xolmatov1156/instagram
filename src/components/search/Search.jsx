import { Button, Input } from "@material-tailwind/react";
import React, { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import AccountCard from "../accountcard/AccountCard";

const Search = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);

  const handleOpen = () => {
    setOpen(!open);
  };

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    searchData(e);
  };

  const searchData = async (e) => {
    const inputVal = e.target.value.trim();
    if (inputVal === "") {
      setResult([]);
      return;
    }

    try {
      const usersCol = collection(db, "users");
      const querySnapshot = await getDocs(usersCol);
      const filteredRes = [];

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (
          userData &&
          userData.username.includes(inputVal) &&
          userData.username !== auth.currentUser.displayName
        ) {
          filteredRes.push(userData);
        }
      });

      setResult(filteredRes);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div
        className="h-[48px] flex"
        style={{ margin: "4px 0", padding: "12px", cursor: "pointer" }}
        onClick={handleOpen}
      >
        <span className="material-symbols-outlined">search</span>
        Search
      </div>
      {open && (
        <div
          className="fixed top-0 right-0 w-full h-[100vh] flex align-middle justify-center items-center"
          onClick={handleOpen}
          style={{
            background: "rgba(0, 0, 0, 0.514)",
            backdropFilter: "blur(3px)",
          }}
        >
          <div
            className="w-[600px] h-3/4 bg-black rounded-md p-6 border-2" 
            onClick={stopPropagation}
          >
            <div className="flex flex-row mb-4">
              <Input
              color="white"
                label="Search..."
                value={search}
                onChange={handleSearchChange}
                className="w-full mr-2"
              />
              <Button color="purple" onClick={searchData}>
                Search
              </Button>
            </div>
            <div className="overflow-y-auto">
              {result.map((user, index) => (
                <div key={user} onClick={handleOpen}>
                  <AccountCard key={index} user={user} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
