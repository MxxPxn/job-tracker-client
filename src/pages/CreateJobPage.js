import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";

const CreateJobPage = () => {
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [priority, setPriority] = useState("medium");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [appliedDate, setAppliedDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("applied");
  const [jobUrl, setJobUrl] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await apiClient.post("/jobs", { position, company, appliedDate, status });
      navigate("/jobs");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create job application",
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Create Job Application
      </h2>
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6 grid grid-cols-2 gap-6"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Position
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
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
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
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
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
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Priority
          </label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="location"
            value={location}
            placeholder="e.g, Remote, New York, etc."
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="Salary"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Salary
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="Salary"
            value={salary}
            placeholder="e.g, &80k - &100k"
            onChange={(e) => setSalary(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="appliedDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
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
          <label
            htmlFor="deadline"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Deadline Date
          </label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
        <div className="col-span-2">
          <label
            htmlFor="jobUrl"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Job URL
          </label>
          <input
            type="url"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="jobUrl"
            value={jobUrl}
            placeholder="https://..."
            onChange={(e) => setJobUrl(e.target.value)}
          />
        </div>
        <div className="col-span-2">
          <label
            htmlFor="note"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Note
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create
          </button>
          <button
            type="button"
            className="bg-gray-100 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-200 transition-colors"
            onClick={() => navigate("/jobs")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJobPage;
