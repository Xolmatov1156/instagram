import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";

export const fetchPosts = async (user, setPosts) => {
  try {
    const userPostsQuery = query(
      collection(db, "posts"),
      where("uid", "==", user.uid)
    );
    const userPostsSnapshot = await getDocs(userPostsQuery);
    const userPosts = userPostsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setPosts(userPosts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
  }
};
