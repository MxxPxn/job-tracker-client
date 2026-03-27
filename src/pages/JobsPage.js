import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/client";
import StatusBadge from "../components/StatusBadge";

const JOBS_PER_PAGE = 10;

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10 });
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError("");
      try {
        const params = {
          page: currentPage,
          limit: JOBS_PER_PAGE,
        };
        if (statusFilter) {
          params.status = statusFilter;
        }
        const response = await apiClient.get("/jobs", { params });
        setJobs(response.data.data);
        setPagination(response.data.pagination);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage, statusFilter]);

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job application?")) {
      return;
    }
    try {
      await apiClient.delete(`/jobs/${jobId}`);
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete job");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Job Applications</h2>
        <div className="flex gap-2">
          <Link
            to="/jobs/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Add Job
          </Link>
          <button
            onClick={handleLogout}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
          Filter by Status
        </label>
        <select
          id="statusFilter"
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={handleStatusChange}
        >
          <option value="">All</option>
          <option value="applied">Applied</option>
          <option value="interview">Interviewing</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading jobs...</p>
      ) : error ? (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500">No job applications found. Start by adding a new job!</p>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Company</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Position</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Applied Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800">{job.company}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{job.position}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {new Date(job.appliedDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm flex gap-2">
                      <Link
                        to={`/jobs/${job.id}/edit`}
                        className="border border-blue-500 text-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-50 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="border border-red-400 text-red-500 px-3 py-1 rounded text-xs hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              Page {pagination.page} of {Math.ceil(pagination.total / JOBS_PER_PAGE)}
            </p>
            <div className="flex gap-2">
              <button
                className="border border-gray-300 text-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-40"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={pagination.page === 1}
              >
                Previous
              </button>
              <button
                className="border border-gray-300 text-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-40"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(pagination.total / JOBS_PER_PAGE)))}
                disabled={pagination.page === Math.ceil(pagination.total / JOBS_PER_PAGE)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default JobsPage;
