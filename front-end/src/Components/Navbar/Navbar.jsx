import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react"; // hamburger and close icons

function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigateToLinks = [
    { name: "Dashboard", path: "/" },
    { name: "Submit Complaint", path: "/about" },
    { name: "My Complaints", path: "/contact" },
  ];

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
                aria-current={
                  location.pathname === link.path ? "page" : undefined
                }
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

          {/* Right side - Sign In */}
          <div className="hidden md:block">
            <Link
              to="/login"
              className="bg-white text-emerald-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-amber-200 transition-colors"
            >
              Sign In
            </Link>
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

          {/* Mobile Sign In button */}
          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="block bg-white text-emerald-600 text-center px-4 py-2 rounded-md text-sm font-semibold hover:bg-amber-200 transition-colors"
          >
            Sign In
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
