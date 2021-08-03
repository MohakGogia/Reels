// Will store all details related to Auth that can be used in other components
import React, { useState, useEffect } from "react";
import { firebaseAuth } from "../config/firebase";
export const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  function login(email, password) {
    return firebaseAuth.signInWithEmailAndPassword(email, password);
  }

  function signOut() {
    return firebaseAuth.signOut();
  }

  function signUp(email, password) {
    return firebaseAuth.createUserWithEmailAndPassword(email , password);
  }

  //Setting the current user
  useEffect(() => {
    firebaseAuth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
  }, []);

  let value = {
    currentUser: currentUser,
    signOut: signOut,
    login: login,
    signUp: signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}