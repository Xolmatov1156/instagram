import React, { useState } from "react";
import { Button, Input, Typography } from "@material-tailwind/react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, doc, increment, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../../firebase/config";

const CreatePost = () => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [desc, setDesc] = useState("");

  const handleOpen = () => {
    setOpen(!open);
    setFile(null);
    setPreview(null);
    setDesc("");
  };

  const handelSubmit = async () => {
    let photoUrl = "";
    if (file) {
      const storageRef = ref(
        storage,
        `posts/${auth.currentUser.uid}/${file.name}`
      );
      await uploadBytes(storageRef, file);
      photoUrl = await getDownloadURL(storageRef);
    }
    const post = {
      photoUrl,
      desc,
      uid: auth.currentUser.uid,
      likes: [],
      comments: [],
    };

    const newPostRef = doc(collection(db, "posts"));

    await setDoc(newPostRef, post);

    const userRef = doc(collection(db, "users"), auth.currentUser.uid);
    await updateDoc(userRef, {
      posts: increment(1),
    });

    setOpen(false);
    window.location.reload();
  };

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <div
        className="h-12 flex align-middle cursor-pointer"
        style={{ margin: "4px 0", padding: "12px" }}
        onClick={handleOpen}
      >
        <span className="material-symbols-outlined">add_box</span>
        <span className="pl-1">Create</span>
      </div>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(3px)",
          }}
          onClick={handleOpen}
        >
          <div
            className="w-[600px] bg-black rounded-2xl p-8 flex flex-col items-center gap-4 border-2"
            onClick={stopPropagation}
          >
            <Typography className="text-center text-3xl mb-4">
              Create new post
            </Typography>
            <input
              type="file"
              id="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
            <label
              htmlFor="file"
              className="cursor-pointer text-purple-400 mb-4"
            >
              Upload image
            </label>
            {file && <p className="mb-4">Selected file: {file.name}</p>}
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="max-w-full h-auto rounded-lg"
                style={{ maxHeight: "200px" }}
              />
            )}
            <Input
            color="white"
              label="Description"
              onChange={(e) => setDesc(e.target.value)}
            />
            <div className=" flex justify-evenly w-3/4">
              <Button color="red" onClick={handleOpen}>
                Cancel
              </Button>
              <Button color="purple" onClick={handelSubmit}>
                Create Post
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
