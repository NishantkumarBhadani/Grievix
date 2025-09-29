import React from "react";
import {Link} from 'react-router-dom';

function ComplaintCard({ complaint }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-4 border border-gray-200">
      <h3 className="text-lg font-semibold text-emerald-600">{complaint.subject}</h3>
      <p className="text-gray-700 mt-1">{complaint.description}</p>

      {complaint.mediaUrl && (
        <img
          src={complaint.mediaUrl}
          alt="Complaint Media"
          className="mt-3 w-full max-h-60 object-cover rounded-lg"
        />
      )}

      <div className="mt-3 text-sm text-gray-600">
        <p><strong>Status:</strong> {complaint.status}</p>
        <p><strong>Submitted At:</strong> {new Date(complaint.createdAt).toLocaleString()}</p>
      </div>

       <Link
        to={`/complaints/${complaint.id}/details`}
        className="mt-3 inline-block bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
      >
        Show Status
      </Link>
    </div>
  );
}

export default ComplaintCard;
