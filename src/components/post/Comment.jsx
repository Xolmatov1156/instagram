import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

const Comment = ({ uid, content }) => {
  const [userData, setUserData] = useState(null);
  const nav= useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (uid) {
          const userDoc = await getDoc(doc(db, "users", uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.log("User data does not exist");
          }
        } else {
          console.log("UID is not provided");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [uid]);

  return (
    <div className="flex items-center gap-3 border-b-2 cursor-pointer" onClick={()=> nav(`/${userData.username}`) }>
      {userData ? (
        <img
          src={userData.pfp}
          alt="Profile"
          className="rounded-full h-8 w-8"
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-gray-200"></div>
      )}
      <div>
        <p className="font-semibold">
          {userData ? userData.username : "Loading..."}
        </p>
        <p className="text-white">{content}</p>
      </div>
    </div>
  );
};

export default Comment;
