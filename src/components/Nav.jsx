import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { getAuth, signOut } from "firebase/auth";
const Nav = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const logout = async () => {
    const auth = getAuth();
    await signOut(auth);
  };
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">AI Video Analyzer</NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end={true}>
                Home
              </NavLink>
            </li>
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/upload" end={true}>
                    Upload Video
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/videos">
                    Videos
                  </NavLink>
                </li>
                <li className="nav-item">
                  <span className="nav-link" onClick={logout}>
                    Logout
                  </span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
