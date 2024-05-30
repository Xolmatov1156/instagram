import React, { useState } from "react";
import PostDialog from "./PostDialog";

const PostCard = ({ post, setIsChanged }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  const handleCloseDialog = () => setOpen(false);

  return (
    <>
      <div
        className="h-64 w-96 cursor-pointer overflow-hidden transition-opacity hover:opacity-90 m-2"
        onClick={handleOpen}
      >
        <img
          alt="nature"
          className="h-full w-full object-cover object-center"
          src={post.photoUrl}
        />
      </div>
      <PostDialog handleClose={handleCloseDialog} open={open} post={post} setIsChanged={setIsChanged} />
    </>
  );
};

export default PostCard;
