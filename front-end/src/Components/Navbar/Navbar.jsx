import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import API_BASE_URL from "../../config/api.js";
import { setToken } from "../../redux/Features/authSlice.js";
import { setAdmin } from "../../redux/Features/adminSlice.js";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  // Redux state
  const token = useSelector((state) => state.auth.token);
  const isAdmin = useSelector((state) => state.admin.token);

  const navigateToLinks = [
    { name: "Dashboard", path: "/" },
    { name: "Submit Complaint", path: "/complaintForm" },
    { name: "My Complaints", path: "/contact" },
  ];

  // Logout function
  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/users/logout`, {}, { withCredentials: true });
      dispatch(setToken(false));
      dispatch(setAdmin(false));
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
    }
  };

  return (
    <nav className="bg-emerald-600 shadow-lg w-full fixed top-0 left-0 z-[5000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
        <div className="flex justify-between items-center h-14">
          {/* Left side - Brand */}
          <div className="text-white font-bold text-lg">Grievix</div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            {navigateToLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                aria-current={location.pathname === link.path ? "page" : undefined}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "text-amber-300"
                    : "text-white hover:text-amber-200"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right side - Auth buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {token ? (
              <>
                {/* Profile Button */}
                <Link
                  to="/profile"
                  className="text-white font-medium hover:text-amber-200"
                >
                  Profile
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-white text-emerald-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-amber-200 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-white text-emerald-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-amber-200 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-amber-200"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-emerald-700 px-4 pt-2 pb-4 space-y-2">
          {navigateToLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "text-amber-300"
                  : "text-white hover:text-amber-200"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Mobile Auth Buttons */}
          {token ? (
            <>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="block text-white text-center px-4 py-2 rounded-md text-sm font-medium hover:text-amber-200"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="block w-full bg-white text-emerald-600 text-center px-4 py-2 rounded-md text-sm font-semibold hover:bg-amber-200 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block bg-white text-emerald-600 text-center px-4 py-2 rounded-md text-sm font-semibold hover:bg-amber-200 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
