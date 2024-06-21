import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth.context";

const Protected = ({ children }) => {
  const { isLoggedIn, isFirebaseActive } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoggedIn && isFirebaseActive) {
      navigate("/");
    }
  }, [isLoggedIn, isFirebaseActive]);
  if (!isFirebaseActive) {
    return <h1>Loading...</h1>;
  }
  return <>{children}</>;
};

export default Protected;
