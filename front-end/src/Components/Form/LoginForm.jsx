import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../config/api.js";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../../redux/Features/authSlice.js";
import { setAdmin } from "../../redux/Features/adminSlice.js";

function LoginForm() {
  const [formdata, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //Checking for the tokens
  const token = useSelector((state) => state.auth.token);
  // console.log("Redex user token:", token);
  const tokenAdmin = useSelector((state) => state.admin.token);
  // console.log("Redex adminuser token:", tokenAdmin);

  const handleChange = (e) => {
    setFormData({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/users/login`, formdata, {
        withCredentials: true,
      });

      setFormData({ email: "", password: "" });

      //Setting the token in redux
      if (res.data.success) {
        dispatch(setToken(true));

        const user = res.data.data.user; 
        if (user && user.role.toLowerCase() === "admin") {
          dispatch(setAdmin(true));
          navigate("/admin/complaints")
        }
        else{
          navigate("/");
        }

        
      }

      // console.log("Login response:", res.data);
    } catch (error) {
      console.log("Login Failed", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-emerald-600 mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formdata.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formdata.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 text-white py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Sign Up redirect */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link
            to="/signUp"
            className="text-amber-500 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
