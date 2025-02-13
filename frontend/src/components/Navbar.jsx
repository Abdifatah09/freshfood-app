import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/log-in");
  };

  return (
    <nav className="bg-blue-500 p-4">
      <ul className="flex space-x-6 justify-center text-white">
        <li>
          <Link to="/" className="hover:text-gray-300 text-lg font-semibold">
            Home
          </Link>
        </li>
        <li>
          <Link to="/register" className="hover:text-gray-300 text-lg font-semibold">
            Register
          </Link>
        </li>
        <li>
          <Link to="/users" className="hover:text-gray-300 text-lg font-semibold">
            Users
          </Link>
        </li>
        <li>
          <Link to="/log-in" className="hover:text-gray-300 text-lg font-semibold">
            Log in
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="hover:text-gray-300 text-lg font-semibold bg-transparent border-none cursor-pointer"
          >
            Log out
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
