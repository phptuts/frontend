import { getAuth } from "firebase/auth";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export default ({ children }) => {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    user: undefined,
    isFirebaseActive: false,
  });
  useEffect(() => {
    const auth = getAuth();
    auth.onAuthStateChanged((u) => {
      console.log(u);
      setAuth({ isLoggedIn: u !== null, user: u, isFirebaseActive: true });
    });
  }, []);
  return (
    <AuthContext.Provider value={{ ...auth }}>{children}</AuthContext.Provider>
  );
};
