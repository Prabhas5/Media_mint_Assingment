import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../constants";

function Navbar() {
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem(ACCESS_TOKEN)
  );

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem(ACCESS_TOKEN));
  }, [location]);

  return (
    <nav style={{ background: "#222", padding: "10px", color: "white" }}>
      
      {isLoggedIn && (
        <Link to="/" style={{ color: "white", marginRight: "20px" }}>
          Home
        </Link>
      )}

      {!isLoggedIn && (
        <>
          <Link to="/login" style={{ color: "white", marginRight: "20px" }}>
            Login
          </Link>

          <Link to="/register" style={{ color: "white" }}>
            Register
          </Link>
        </>
      )}

      {isLoggedIn && (
        <Link to="/logout" style={{ color: "white" }}>
          Logout
        </Link>
      )}
    </nav>
  );
}

export default Navbar;