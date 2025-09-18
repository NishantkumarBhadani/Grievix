import React, { useState } from "react";

const ComplaintForm = () => {
  const [submissionType, setSubmissionType] = useState("Public");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submission logic here (API call)
    console.log({ submissionType, subject, description, file });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Submit Complaint</h2>

      {/* Submission Type */}
      <div className="mb-6">
        <p className="font-semibold mb-2 text-gray-700">Submission Type</p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setSubmissionType("Public")}
            className={`px-4 py-2 rounded-lg font-medium ${
              submissionType === "Public"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Public
          </button>
          <button
            type="button"
            onClick={() => setSubmissionType("Anonymous")}
            className={`px-4 py-2 rounded-lg font-medium ${
              submissionType === "Anonymous"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Anonymous
          </button>
        </div>
      </div>

      {/* Complaint Details */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        {/* Attachments */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Attachments (Optional)
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="w-full border-dashed border-2 border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500"
          />
          {file && <p className="mt-2 text-gray-600">{file.name}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Submit Complaint
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
