import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../Components/BackButton";
import { getDisplayName } from "../utils/auth";

function AdminDashboard() {
  const navigate = useNavigate();
  const [scores, setScores] = useState(() => JSON.parse(localStorage.getItem("scores")) || []);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");
    if (!isAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const normalizedScores = useMemo(
    () =>
      scores.map((entry) => ({
        ...entry,
        displayUser: getDisplayName(entry.user),
      })),
    [scores]
  );

  const sorted = useMemo(
    () => [...normalizedScores].sort((a, b) => b.score - a.score),
    [normalizedScores]
  );

  const totalTests = normalizedScores.length;
  const avg =
    totalTests > 0
      ? (normalizedScores.reduce((sum, entry) => sum + entry.score, 0) / totalTests).toFixed(1)
      : "0.0";
  const totalUsers = useMemo(
    () => new Set(normalizedScores.map((score) => score.displayUser || "Anonymous")).size,
    [normalizedScores]
  );
  const topPerformer = sorted[0] || null;

  const strongestSubject = useMemo(() => {
    const grouped = normalizedScores.reduce((acc, entry) => {
      const key = entry.subject || "Unknown";
      if (!acc[key]) acc[key] = [];
      acc[key].push(entry.score);
      return acc;
    }, {});

    const ranked = Object.entries(grouped).map(([subject, values]) => ({
      subject,
      avg: values.reduce((sum, value) => sum + value, 0) / values.length,
      attempts: values.length,
    }));

    return ranked.sort((a, b) => b.avg - a.avg)[0] || null;
  }, [normalizedScores]);

  const recentActivity = useMemo(
    () =>
      [...normalizedScores]
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        .slice(0, 8),
    [normalizedScores]
  );

  const subjectInsights = useMemo(() => {
    const grouped = normalizedScores.reduce((acc, entry) => {
      const key = entry.subject || "Unknown";
      if (!acc[key]) acc[key] = { total: 0, attempts: 0, high: 0, low: 100 };
      acc[key].total += entry.score;
      acc[key].attempts += 1;
      acc[key].high = Math.max(acc[key].high, entry.score);
      acc[key].low = Math.min(acc[key].low, entry.score);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([subject, value]) => ({
        subject,
        average: (value.total / value.attempts).toFixed(1),
        attempts: value.attempts,
        range: `${value.low}% – ${value.high}%`,
      }))
      .sort((a, b) => Number(b.average) - Number(a.average));
  }, [normalizedScores]);

  const clearAll = () => {
    localStorage.removeItem("scores");
    setScores([]);
    setConfirmReset(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin", { replace: true });
  };

  return (
    <div className="admin-panel-page">
      <div className="qn-main">
        <div className="page-toolbar">
          <BackButton fallback="/account" />
          <div className="qn-inline-actions">
            {normalizedScores.length > 0 && !confirmReset && (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="qn-btn-ghost"
              >
                Reset Scores
              </button>
            )}
            {confirmReset && (
              <>
                <button type="button" onClick={clearAll} className="danger-btn">
                  Confirm Reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="qn-btn-ghost"
                >
                  Cancel
                </button>
              </>
            )}
            <button type="button" className="qn-btn-secondary" onClick={handleLogout}>
              Exit Admin
            </button>
          </div>
        </div>

        <div className="page-intro">
          <p className="page-eyebrow">Admin Dashboard</p>
          <h1 className="page-title">Quiznovaa Control Room</h1>
          <p className="page-description">
            Monitor learner momentum, subject averages, and recent assessment activity.
          </p>
        </div>

        <section className="qn-kpi-strip" aria-label="Control room summary">
          <div className="qn-kpi-card">
            <span className="qn-kpi-label">Total Attempts</span>
            <strong className="qn-kpi-value qn-num">{totalTests}</strong>
            <span className="qn-kpi-sub">Recorded quiz submissions</span>
          </div>
          <div className="qn-kpi-card">
            <span className="qn-kpi-label">Participants</span>
            <strong className="qn-kpi-value qn-num">{totalUsers}</strong>
            <span className="qn-kpi-sub">Unique active learners</span>
          </div>
          <div className="qn-kpi-card">
            <span className="qn-kpi-label">Average Score</span>
            <strong className="qn-kpi-value qn-num">{avg}%</strong>
            <span className="qn-kpi-sub">
              Top: {topPerformer ? `${topPerformer.displayUser} (${topPerformer.score}%)` : "—"}
            </span>
          </div>
          <div className="qn-kpi-card">
            <span className="qn-kpi-label">Best Subject</span>
            <strong className="qn-kpi-value">{strongestSubject ? strongestSubject.subject : "—"}</strong>
            <span className="qn-kpi-sub">
              {strongestSubject ? `${strongestSubject.avg.toFixed(1)}% average` : "Waiting for attempts"}
            </span>
          </div>
        </section>

        <div className="qn-two-col">
          <section className="qn-panel">
            <div className="qn-section-head">
              <h2>Subject Snapshot</h2>
              <span className="qn-meta-inline">Average & score range</span>
            </div>

            {subjectInsights.length === 0 ? (
              <p className="admin-empty">No subject data recorded yet.</p>
            ) : (
              <div className="qn-table-wrap">
                <table className="qn-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th className="qn-align-right">Attempts</th>
                      <th className="qn-align-right">Range</th>
                      <th className="qn-align-right">Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectInsights.map((item) => (
                      <tr key={item.subject}>
                        <td><strong>{item.subject}</strong></td>
                        <td className="qn-align-right qn-num">{item.attempts}</td>
                        <td className="qn-align-right qn-num qn-muted">{item.range}</td>
                        <td className="qn-align-right qn-num"><strong>{item.average}%</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="qn-panel">
            <div className="qn-section-head">
              <h2>Recent Activity</h2>
              <span className="qn-meta-inline">Latest saved attempts</span>
            </div>

            {recentActivity.length === 0 ? (
              <p className="admin-empty">No activity recorded yet.</p>
            ) : (
              <div className="qn-table-wrap">
                <table className="qn-table">
                  <thead>
                    <tr>
                      <th>Learner</th>
                      <th>Subject</th>
                      <th className="qn-align-right">Score</th>
                      <th className="qn-align-right">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.map((entry, index) => (
                      <tr key={`${entry.displayUser}-${entry.subject}-${index}`}>
                        <td>{entry.displayUser}</td>
                        <td>{entry.subject}</td>
                        <td className="qn-align-right qn-num">{entry.score}%</td>
                        <td className="qn-align-right qn-num qn-muted">
                          {entry.date ? new Date(entry.date).toLocaleDateString() : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
