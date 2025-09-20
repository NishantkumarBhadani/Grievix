import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/api.js"
import { useSelector} from "react-redux";
import {useNavigate} from 'react-router-dom'

function ComplaintForm() {
  const [submissionType, setSubmissionType] = useState("public");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const token = useSelector((state) => state.auth.token);

  const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("submissionType", submissionType);
      data.append("subject", subject);
      data.append("description", description);
      if (file) {
        data.append("media", file);
      }

      const res = await axios.post(
        `${API_BASE_URL}/complaint/createComplaint`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("Complaint Response:", res.data);
      alert("Complaint registered successfully!");

      // Reset form
      setSubmissionType("public");
      setSubject("");
      setDescription("");
      setFile(null);

      setTimeout(()=>{
        navigate('/userDashboard');
      },1000)

    } catch (error) {
      console.error("Error submitting complaint:", error.response?.data || error.message);
      alert("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-6 rounded-lg w-full max-w-md"
      >
        <h2 className="text-xl font-bold text-emerald-600 mb-4">Submit Complaint</h2>

        {/* Submission Type */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Submission Type</label>
          <select
            value={submissionType}
            onChange={(e) => setSubmissionType(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          >
            <option value="public">Public</option>
            <option value="anonymous">Anonymous</option>
          </select>
        </div>

        {/* Subject */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Upload Media</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
        >
          {isLoading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
}

export default ComplaintForm;
