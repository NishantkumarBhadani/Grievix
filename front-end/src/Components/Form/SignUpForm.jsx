import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../config/api.js";

function SignUpForm() {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",   
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${API_BASE_URL}/users/register`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setMessage("Registration successful! Redirecting to login...");

      setTimeout(()=>{
        navigate("/login");
      },1500)
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-emerald-600 mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          {/* Phone */}
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          {/* Role (dropdown) */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg bg-white"
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 text-white py-2 rounded-lg"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {message && <p className="text-center mt-4">{message}</p>}

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-amber-500 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUpForm;
