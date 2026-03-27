import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../api/client";
import { useParams } from "react-router-dom";

const EditJobPage = () => {
  const { id } = useParams();
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [appliedDate, setAppliedDate] = useState("");
  const [status, setStatus] = useState("applied");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await apiClient.get(`/jobs/${id}`);
        const job = response.data.data;
        setPosition(job.position);
        setCompany(job.company);
        setAppliedDate(job.appliedDate);
        setStatus(job.status);
        setNotes(job.notes || "");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch job application");
      }
    };

    fetchJob();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await apiClient.put(`/jobs/${id}`, { position, company, appliedDate, status, notes });
      navigate("/jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update job application");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Job Application</h2>
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Job Title
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="title"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="applied">Applied</option>
            <option value="interview">Interviewing</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label htmlFor="appliedDate" className="block text-sm font-medium text-gray-700 mb-1">
            Applied Date
          </label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="appliedDate"
            value={appliedDate}
            onChange={(e) => setAppliedDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Update
          </button>
          <Link
            to="/jobs"
            className="bg-gray-100 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditJobPage;
