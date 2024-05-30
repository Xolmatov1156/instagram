import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export const fetchUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.data();
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const isFollowed = async (targetUid) => {
  const currentUserData = await fetchUserData(auth.currentUser.uid);
  return currentUserData?.following.includes(targetUid);
};
