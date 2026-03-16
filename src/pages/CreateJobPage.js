import { useState} from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";

const CreateJobPage = () => {
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [appliedDate, setAppliedDate] = useState("");
  const [status, setStatus] = useState("applied");
  const [ note, setNote] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await apiClient.post("/jobs", { position, company, appliedDate, status });
      navigate("/jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create job application");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create Job Application</h2>
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
            <label htmlFor="note" className="form-label">Note</label>
            <textarea
                className="form-control"
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
            />
        </div>  
        <button type="submit" className="btn btn-primary">Create</button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/jobs")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CreateJobPage;