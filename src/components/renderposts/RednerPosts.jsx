import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import Post from "../post/Post";

const RednerPosts = ({setIsPostsRendered}) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataRef = await getDoc(
          doc(db, "users", auth.currentUser.uid)
        );
        const userData = userDataRef.data();
        console.log(userData);
        if (userData && userData.following) {
          const userPostsQuery = query(
            collection(db, "posts"),
            where("uid", "in", userData.following)
          );

          const querySnapshot = await getDocs(userPostsQuery);
          const postsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setPosts(postsData);
          setIsPostsRendered(true);
        } else {
          console.log("User data or following list is missing");
          setIsPostsRendered(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  console.log(posts);

  return (
    <div className="flex flex-col">
      {posts.map((post) => (
        <Post post={post} />
      ))}
    </div>
  );
};

export default RednerPosts;
