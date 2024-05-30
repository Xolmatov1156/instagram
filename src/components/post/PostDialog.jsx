import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Avatar,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { Favorite, FavoriteBorder, Delete } from "@mui/icons-material"; // Import Delete icon
import Comment from "./Comment";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  deleteDoc, // Import deleteDoc from Firestore
} from "firebase/firestore";
import { auth, db } from "../../firebase/config";

const PostDialog = ({ post, open, handleClose, setIsChanged }) => {
  const [isLiked, setIsLiked] = useState(post.likes.includes(auth.currentUser.uid));
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(post.likes.length);

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
    const postRef = doc(db, "posts", post.id);
    const unsubscribe = onSnapshot(postRef, (doc) => {
      if (doc.exists()) {
        const postData = doc.data();
        setComments(postData.comments || []);
        setLikes(postData.likes.length);
        setIsLiked(postData.likes.includes(auth.currentUser.uid));
      }
    });

    return () => unsubscribe();
  }, [post.id]);

  const like = async () => {
    try {
      const postRef = doc(db, "posts", post.id);
      if (!isLiked) {
        await updateDoc(postRef, {
          likes: arrayUnion(auth.currentUser.uid),
        });
        setIsLiked(true);
      } else {
        await updateDoc(postRef, {
          likes: arrayRemove(auth.currentUser.uid),
        });
        setIsLiked(false);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const postComment = async () => {
    try {
      const postRef = doc(db, "posts", post.id);
      if (comment.trim() !== "") {
        await updateDoc(postRef, {
          comments: arrayUnion({
            uid: auth.currentUser.uid,
            content: comment.trim(),
          }),
        });
        setComment("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const deletePost = async () => {
    try {
      const postRef = doc(db, "posts", post.id);
      const userRef = doc(db, "users", post.uid);
  
      await deleteDoc(postRef);
  
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const newPostCount = userData.posts - 1; 
        await updateDoc(userRef, { posts: newPostCount });
      } else {
        console.error("User document not found");
      }
  
      handleClose();
      setIsChanged(true);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  

  const isOwner = auth.currentUser.uid === post.uid;

  return (
    <Dialog
      size="xl"
      open={open}
      handler={handleClose}
      className="flex flex-row justify-between  h-[95vh] overflow-y-auto bg-blue-gray-900"
    >
      <div className="w-[50%]">
        <DialogHeader className="justify-between">
          <div className="flex items-center gap-3">
            {user && (
              <Avatar
                size="sm"
                variant="circular"
                alt="user profile picture"
                src={user.pfp}
              />
            )}
            <div className="-mt-px flex flex-col">
              {user && (
                <>
                  <Typography
                    variant="small"
                    color="white"
                    className="font-medium"
                  >
                    {user.username}
                  </Typography>
                  <Typography
                    variant="small"
                    color="white"
                    className="text-xs font-normal"
                  >
                    @{user.username}
                  </Typography>
                </>
              )}
            </div>
          </div>
        </DialogHeader>
        <DialogBody>
          <img
            alt="nature"
            className="max-h-[600px]  rounded-lg object-cover object-center"
            src={post.photoUrl}
          />
        </DialogBody>
        <DialogFooter className="justify-between flex flex-col items-start gap-1">
          <Typography>{post.desc}</Typography>
          <div className="flex items-start gap-3 flex-col">
            <button className="like" onClick={like}>
              {isLiked ? (
                <Favorite style={{ fontSize: "30px", color: "red" }} />
              ) : (
                <FavoriteBorder style={{ fontSize: "30px" }} />
              )}
            </button>
            <Typography>{likes} likes</Typography>
          </div>
          <div className="flex w-full">
            <Input
              label="Add comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              color="white"
            />
            <Button onClick={postComment}>POST</Button>
          </div>
        </DialogFooter>
        {isOwner && (
          <DialogFooter className="justify-between">
            <Button color="red" onClick={deletePost}>
              Delete
            </Button>
          </DialogFooter>
        )}
      </div>
      <div className="w-[50%]">
        <Typography className="text-center mt-3 ">Comments</Typography>
        <div className="flex overflow-y-scroll h-[90%] flex-col">
          {comments.map((comment, index) => (
            <Comment key={index} uid={comment.uid} content={comment.content} />
          ))}
        </div>
      </div>
    </Dialog>
  );
};

export default PostDialog;
