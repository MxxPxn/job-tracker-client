import { useState, useEffect} from "react";
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
    <div className="container mt-5">
      <h2>Edit Job Application</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
            <label htmlFor="title" className="form-label">Job Title</label>
            <input
                type="text"
                className="form-control"
                id="title"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
            />
        </div>
        <div className="mb-3">
            <label htmlFor="company" className="form-label">Company</label>
            <input
                type="text"
                className="form-control"
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
            />
        </div>
        <div className="mb-3">
            <label htmlFor="status" className="form-label">Status</label>
            <select
                className="form-select"
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
        <div className="mb-3">
            <label htmlFor="appliedDate" className="form-label">Applied Date</label>
            <input
                type="date"
                className="form-control"
                id="appliedDate"
                value={appliedDate}
                onChange={(e) => setAppliedDate(e.target.value)}
                 required
            />
        </div>
        <div className="mb-3">
            <label htmlFor="notes" className="form-label">Notes</label>
            <textarea
                className="form-control"
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
            />
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
        <Link to="/jobs" className="btn btn-secondary ms-2">Cancel</Link>
      </form>
    </div>
  );
};

export default EditJobPage;