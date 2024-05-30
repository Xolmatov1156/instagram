import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBegEi9WgOQL19hXZBSav9pYWWFrhSNgaY",
  authDomain: "instagram-58c7b.firebaseapp.com",
  projectId: "instagram-58c7b",
  storageBucket: "instagram-58c7b.appspot.com",
  messagingSenderId: "220978265937",
  appId: "1:220978265937:web:202b0a83be5c92437d5d70",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
