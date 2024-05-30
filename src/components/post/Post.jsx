// Post.jsx
import React, { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import "./Post.scss";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import PostDialog from "./PostDialog";
import { useNavigate } from "react-router-dom";

const Post = ({ post }) => {
  const [showPost, setShowPost] = useState(false);
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const nav = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", post.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [post.uid]);

  useEffect(() => {
    setIsLiked(post.likes.includes(auth.currentUser.uid));
  }, [post.likes]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setComment(val);
    setShowPost(val.trim() !== "");
  };

const likePost = async () => {
  try {
    const postRef = doc(db, "posts", post.id);
    if (!isLiked) {
      await updateDoc(postRef, {
        likes: arrayUnion(auth.currentUser.uid),
      });
      setIsLiked(true);
      post.likes.push(auth.currentUser.uid); 
    } else {
      await updateDoc(postRef, {
        likes: arrayRemove(auth.currentUser.uid),
      });
      setIsLiked(false);
      post.likes = post.likes.filter(id => id !== auth.currentUser.uid); 
    }
  } catch (error) {
    console.error("Error toggling like:", error);
  }
};

const postComment = () => {
  const postRef = doc(db, "posts", post.id);
    if (comment.length > 0) {
      updateDoc(postRef, {
        comments: arrayUnion({
          uid: auth.currentUser.uid,
          content: comment,
        }),
      });
      setComment("");
    }
}


  const handleComment = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  console.log(post);

  return (
    <div className="post">
      <div className="channel cursor-pointer" onClick={()=> nav(`/${user.username}`)}  >
        <div className="pfp">
          {user && <img src={user.pfp} alt="" />}
        </div>
        <div className="detailes">
          <div className="name">{user && user.username}</div>
        </div>
      </div>
      <img src={post.photoUrl} className="post-img" alt="Post" />
      <div className="section">
        <button className="like" onClick={likePost}>
          {!isLiked ? (
            <FavoriteBorder style={{ fontSize: "30px" }} />
          ) : (
            <Favorite style={{ fontSize: "30px", color: "red" }} />
          )}
        </button>
        <button className="comment" onClick={handleComment}>
          <i className="fa-regular fa-comment text-2xl" style={{ fontSize: "24px" }}></i>
        </button>
      </div>
      <div className="likes">
        <p>{post.likes.length} likes</p>
      </div>
      <div className="description">
        <p>
          <a href="#" className="font-bold">{user && user.username}</a>
          <a>{post.desc}</a>
        </p>
      </div>
      <div className="comment-input">
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={handleInputChange}
          className="bg-black"
        />
        {showPost && <button className="post text-white " onClick={postComment}>Post</button>}
      </div>
      <PostDialog open={openDialog} setOpen={setOpenDialog} post={post} handleClose={handleCloseDialog} />
    </div>
  );
};

export default Post;
