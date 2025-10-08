import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/api.js";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Upload, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";

function ComplaintForm() {
  const [submissionType, setSubmissionType] = useState("public");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (subject.length < 5) {
      newErrors.subject = "Subject must be at least 5 characters";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'video/mp4'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        newErrors.file = "Please upload JPEG, PNG, PDF, or MP4 files only";
      }

      if (file.size > maxSize) {
        newErrors.file = "File size must be less than 10MB";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle file change with preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setErrors(prev => ({ ...prev, file: "" }));

    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  // Remove file
  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setShowSuccess(false);

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
      setShowSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setSubmissionType("public");
        setSubject("");
        setDescription("");
        setFile(null);
        setPreviewUrl(null);
        setShowSuccess(false);
        navigate('/mycomplaints');
      }, 2000);

    } catch (error) {
      console.error("Error submitting complaint:", error.response?.data || error.message);
      setErrors({ 
        submit: error.response?.data?.message || "Something went wrong. Please try again." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Character counters
  const subjectCount = subject.length;
  const descriptionCount = description.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3 animate-in slide-in-from-top duration-500">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-green-800 font-medium">Complaint submitted successfully!</p>
              <p className="text-green-600 text-sm">Redirecting to your complaints...</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Submit a Complaint</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Let us know about any issues you're facing. We're here to help resolve them.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-100"
        >
          {/* Submission Type */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Submission Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "public", label: "Public", desc: "Your name will be visible" },
                { value: "anonymous", label: "Anonymous", desc: "Your identity will be hidden" }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSubmissionType(option.value)}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${
                    submissionType === option.value
                      ? "border-emerald-500 bg-emerald-50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      submissionType === option.value
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-gray-300"
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">{option.label}</p>
                      <p className="text-sm text-gray-500 mt-1">{option.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Subject
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setErrors(prev => ({ ...prev, subject: "" }));
              }}
              placeholder="Brief summary of your complaint"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                errors.subject ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
              required
            />
            <div className="flex justify-between mt-2">
              {errors.subject ? (
                <p className="text-red-600 text-sm flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.subject}</span>
                </p>
              ) : (
                <div />
              )}
              <p className={`text-xs ${
                subjectCount > 50 ? "text-red-600" : "text-gray-500"
              }`}>
                {subjectCount}/100
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors(prev => ({ ...prev, description: "" }));
              }}
              placeholder="Please provide detailed information about your complaint..."
              rows={6}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none ${
                errors.description ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
              required
            />
            <div className="flex justify-between mt-2">
              {errors.description ? (
                <p className="text-red-600 text-sm flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.description}</span>
                </p>
              ) : (
                <div />
              )}
              <p className={`text-xs ${
                descriptionCount > 500 ? "text-red-600" : "text-gray-500"
              }`}>
                {descriptionCount}/1000
              </p>
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Attach Media (Optional)
            </label>
            
            {/* File Input */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-emerald-400 transition-colors">
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/jpg,application/pdf,video/mp4"
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Click to upload files</p>
                <p className="text-gray-500 text-sm mt-1">
                  Supports JPG, PNG, PDF, MP4 (Max 10MB)
                </p>
              </label>
            </div>

            {/* File Preview */}
            {previewUrl && (
              <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-gray-700">Image Preview</p>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Selected File Info */}
            {file && !previewUrl && (
              <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-gray-50 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <span className="text-emerald-600 font-semibold text-sm">
                      {file.type.includes('pdf') ? 'PDF' : 'FILE'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 text-sm">{file.name}</p>
                    <p className="text-gray-500 text-xs">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            )}

            {errors.file && (
              <p className="text-red-600 text-sm mt-2 flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.file}</span>
              </p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting Complaint...</span>
              </div>
            ) : (
              "Submit Complaint"
            )}
          </button>

          {/* Help Text */}
          <p className="text-center text-gray-500 text-sm mt-4">
            Your complaint will be reviewed and you'll receive updates on its status.
          </p>
        </form>
      </div>
    </div>
  );
}

export default ComplaintForm;