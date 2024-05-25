import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";

const Videos = () => {
  const { isLoggedIn, isFirebaseActive } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn && isFirebaseActive) {
      navigate("/");
    }
  }, [isLoggedIn, isFirebaseActive]);

  return <div>Videos</div>;
};

export default Videos;
