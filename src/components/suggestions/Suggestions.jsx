import React, { useEffect, useState } from "react";
import AccountCard from "../accountcard/AccountCard";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { Typography } from "@material-tailwind/react";
import { getDocs, collection } from "firebase/firestore";
import { auth, db } from "../../firebase/config";

const Suggestions = ({setIsSuggestionsRendered}) => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const handleOpen = () => setOpen(!open);

  const isOwnAcc = (e) => {
    return !(e.username === auth.currentUser.displayName)
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userCol = collection(db, "users");
        const userSnapshot = await getDocs(userCol);
        const userData = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userData.filter(isOwnAcc));
        setIsSuggestionsRendered(true)
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);


  return (
    <div>
      <div className="recomendeds w-96 flex flex-col align-middle text-wrap text-center">
        <div className="flex flex-row justify-between pr-6 mb-3">
          <Typography>Suggested for you </Typography>
          <button className="text-light-blue-800" onClick={handleOpen}>
            SEE ALL
          </button>
        </div>
        {users.slice(0, 5).map(user => (
          <AccountCard key={user.id} user={user} />
        ))}
      </div>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Suggested for you</DialogHeader>
        <DialogBody className="overflow-y-scroll max-h-[600px]">
          {users.map(user => (
            <AccountCard key={user.id} user={user} />
          ))}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default Suggestions;
