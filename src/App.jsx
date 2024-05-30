import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home, Login, Profile, Signup } from "./components";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={user ? <Home /> : <Signup />} />
        <Route path="/login" element={user ? <Home /> : <Login />} />
        <Route path="/" element={user ? <Home /> : <Login />} />
        <Route path="/:name" element={user ? <Profile/>  : <Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
