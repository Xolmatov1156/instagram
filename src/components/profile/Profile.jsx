import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import { useParams } from "react-router-dom";
import { auth, db } from "../../firebase/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Button } from "@material-tailwind/react";
import EditProfile from "../editprofile/EditProfile";
import { fetchPosts, handleFollow, isFollowed } from "../../functions";
import PostCard from "../post/PostCard";

const Profile = () => {
  const { name } = useParams();
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [userData, setUserData] = useState({});
  const [isFollow, setIsFollow] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isChanged, setIsChanged] = useState(false)

  const fetchData = async () => {
    if (auth.currentUser.displayName === name) {
      setIsOwnProfile(true);
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      setUserData(docSnap.data());
    } else {
      const userQuery = query(
        collection(db, "users"),
        where("username", "==", name)
      );
      const querySnapshot = await getDocs(userQuery);
      const userData = querySnapshot.docs[0].data();
      setUserData(userData);

      const isFollowing = await isFollowed(userData.uid);
      setIsFollow(isFollowing);
    }
  };

  useEffect(() => {
    fetchData();
  }, [name, isChanged]);

  useEffect(() => {
    if (userData.uid) {
      fetchPosts(userData, setPosts);
      setIsChanged(false)
    }
  }, [userData.uid, isChanged]);

  const handleFollowClick = async () => {
    await handleFollow(userData.uid, setIsFollow, setUserData);
  };

  console.log(posts);

  return (
    <div className="flex flex-row text-white">
      <Sidebar />
      <div className="w-[90%]">
        <div className="flex justify-evenly mt-10 ">

          <div className="flex align-middle justify-center items-center">
            <img src={userData.pfp} alt="" className="rounded-full w-32" />
            <div className="flex flex-col ml-5 text-wrap">
              <h1 className="text-2xl font-bold ">{userData.full_name}</h1>
              <h1 className="text-xl font-thin ">@{userData.username}</h1>
              <p>{userData.bio}</p>
            </div>
          </div>
          <div className="">

            <div className="flex align-middle justify-center flex-row gap-24 pt-9">
              <div className="text-center">
                <h1>{userData.posts}</h1>
                <h1>Posts</h1>
              </div>
              <div className="text-center">
                <h1>{userData.followers ? userData.followers.length : 0}</h1>
                <h1>Followers</h1>
              </div>
              <div className="text-center">
                <h1>{userData.following ? userData.following.length : 0}</h1>
                <h1>Following</h1>
              </div>
            </div>
            <div className="flex align-middle justify-center py-9 pb-5 pr-10">
              {isOwnProfile ? (
                <EditProfile user={userData} />
              ) : (
                <Button onClick={handleFollowClick}>
                  {isFollow ? "Unfollow" : "Follow"}
                </Button>
              )}
            </div>
          </div>

        </div>

        <div>
          <h1 className="text-2xl text-center pr-10 pt-5 border-b-2 ">Posts</h1>
          <div className="grid grid-cols-3 mt-2 px-5">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} setIsChanged={setIsChanged} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
