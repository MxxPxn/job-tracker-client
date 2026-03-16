import { useState, useEffect} from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/client";
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
    setCurrentPage(1); // Reset to first page when filter changes
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
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Job Applications</h2>
        <div>
          <Link to="/jobs/create" className="btn btn-primary me-2">Add Job</Link>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="statusFilter" className="form-label">Filter by Status</label>
        <select
          id="statusFilter"
          className="form-select"
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
        <p>Loading jobs...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : jobs.length === 0 ? (
        <p>No job applications found. Start by adding a new job!</p>
      ) : (
        <>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Company</th>
                <th>Position</th>
                <th>Status</th>
                <th>Applied Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.company}</td>
                  <td>{job.position}</td>
                  <td>{job.status}</td>
                  <td>{new Date(job.appliedDate).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/jobs/${job.id}/edit`} className="btn btn-sm btn-outline-primary">Edit</Link>
                    <button onClick={() => handleDelete(job.id)} className="btn btn-sm btn-outline-danger ms-2">Delete</button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center">
            <p>
              Page {pagination.page} of {Math.ceil(pagination.total / JOBS_PER_PAGE)}
            </p>
            <div>
              <button
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={pagination.page === 1}
              >
                Previous
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
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