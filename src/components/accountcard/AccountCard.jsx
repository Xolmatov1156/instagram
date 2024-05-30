import { Avatar, Typography } from "@material-tailwind/react";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isFollowed, handleFollow } from "../../functions";
import { auth } from "../../firebase/config";

const AccountCard = React.memo(
  ({ user }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const nav = useNavigate();
    const [userData, setUserData] = useState();

    const handleFollowClick = useCallback(() => {
      handleFollow(user.uid, setIsFollowing, setUserData());
    }, [user.uid, setIsFollowing, auth.currentUser]);

    useEffect(() => {
      isFollowed(user.uid).then((following) => {
        setIsFollowing(following);
      });
    }, [user.uid, setIsFollowing]);

    return (
      <div className="flex items-center gap-4 cursor-pointer justify-between w-full">
        <div
          className="flex items-center gap-4"
          onClick={() => nav(`/${user.username}/`)}
        >
          <img
            src={user.pfp}
            alt=""
            className="w-10 rounded-full"
            loading="lazy"
            width="40"
            height="40"
          />
          <div className="text-left">
            <Typography variant="h6">{user.username}</Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              className="font-normal"
            >
              {user.full_name}
            </Typography>
          </div>
        </div>
        <button
          className="text-blue-700 pr-6"
          onClick={handleFollowClick}
        >
          {isFollowing ? "UNFLOW" : "FOLLOW"}
        </button>
      </div>
    );
  },
  (prev, next) => prev.user.uid === next.user.uid
);

export default AccountCard;
