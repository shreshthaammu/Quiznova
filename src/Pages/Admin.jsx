import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../Components/BackButton";

function Admin() {
  const [code, setCode] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("Enter admin code");
      return;
    }

    if (code.trim() === "admin123") {
      localStorage.setItem("admin", "true");
      navigate("/admin/dashboard", { replace: true });
    } else {
      setError("Incorrect admin code");
    }
  };

  return (
    <div className="admin-page">
      <div className="qn-panel admin-access-card">
        <div className="page-toolbar">
          <BackButton fallback="/dashboard" />
        </div>

        <div className="page-intro">
          <p className="page-eyebrow">Admin Zone</p>
          <h1 className="page-title">Control Room Access</h1>
          <p className="page-description">
            Open the administrative workspace to monitor learner scores, subject averages, and recent activity.
          </p>
        </div>

        <div className="admin-preview-grid">
          <div className="admin-preview-card">
            <span className="qn-kpi-label">Insights</span>
            <strong>Performance trends</strong>
          </div>
          <div className="admin-preview-card">
            <span className="qn-kpi-label">Participants</span>
            <strong>Top player snapshots</strong>
          </div>
          <div className="admin-preview-card">
            <span className="qn-kpi-label">Subjects</span>
            <strong>Range breakdowns</strong>
          </div>
        </div>

        {error && <p className="auth-error" role="alert">{error}</p>}

        <form className="auth-fields" onSubmit={handleLogin}>
          <label className="auth-field">
            <span>Admin Code</span>
            <div className="auth-password-row">
              <input
                type={show ? "text" : "password"}
                placeholder="Enter Admin Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button
                type="button"
                className="auth-toggle"
                onClick={() => setShow((value) => !value)}
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <button type="submit" disabled={!code.trim()} className="qn-btn-primary setup-start-btn">
            Enter Control Room
          </button>
        </form>
      </div>
    </div>
  );
}

export default Admin;
