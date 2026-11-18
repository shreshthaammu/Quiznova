import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../Components/AppHeader";
import BackButton from "../Components/BackButton";
import { getDisplayName } from "../utils/auth";

function Leaderboard() {
  const navigate = useNavigate();
  const [scores, setScores] = useState(() => JSON.parse(localStorage.getItem("scores")) || []);
  const [subjectFilter, setSubjectFilter] = useState("ALL");
  const [confirmClear, setConfirmClear] = useState(false);

  const subjectOptions = useMemo(() => {
    const unique = new Set(scores.map((entry) => entry.subject).filter(Boolean));
    return ["ALL", ...unique];
  }, [scores]);

  const sorted = useMemo(() => {
    const filtered =
      subjectFilter === "ALL"
        ? scores
        : scores.filter((entry) => entry.subject === subjectFilter);
    return [...filtered].sort((a, b) => b.score - a.score);
  }, [scores, subjectFilter]);

  const topThree = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  const getRankLabel = (index) => ["1st Place", "2nd Place", "3rd Place"][index] || `#${index + 1}`;

  const clearLeaderboard = () => {
    localStorage.removeItem("scores");
    setScores([]);
    setConfirmClear(false);
  };

  return (
    <div className="qn-page-wrap">
      <AppHeader />

      <main className="qn-main">
        <div className="page-toolbar">
          <BackButton fallback="/dashboard" />
          <div className="qn-inline-actions">
            {scores.length > 0 && !confirmClear && (
              <button
                type="button"
                className="qn-btn-ghost"
                onClick={() => setConfirmClear(true)}
              >
                Reset Leaderboard
              </button>
            )}
            {confirmClear && (
              <>
                <button type="button" className="danger-btn" onClick={clearLeaderboard}>
                  Confirm Reset
                </button>
                <button
                  type="button"
                  className="qn-btn-ghost"
                  onClick={() => setConfirmClear(false)}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        <div className="page-intro">
          <p className="page-eyebrow">Rankings</p>
          <h1 className="page-title">Top Performers</h1>
          <p className="page-description">
            Compare top attempts across subjects and review recent standings.
          </p>
        </div>

        {subjectOptions.length > 1 && (
          <div className="leaderboard-filter-bar">
            <div className="qn-segmented" role="group" aria-label="Filter by subject">
              {subjectOptions.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  className={`qn-seg-btn ${subjectFilter === sub ? "active" : ""}`}
                  onClick={() => setSubjectFilter(sub)}
                >
                  {sub === "ALL" ? "All Subjects" : sub}
                </button>
              ))}
            </div>
          </div>
        )}

        {sorted.length === 0 ? (
          <div className="qn-panel qn-empty-state">
            <h2>No scores recorded yet</h2>
            <p>Complete a subject test or daily challenge to appear on the leaderboard.</p>
            <button type="button" className="qn-btn-primary" onClick={() => navigate("/subjects")}>
              Take a Test
            </button>
          </div>
        ) : (
          <>
            <section className="leaderboard-podium" aria-label="Top three performers">
              {topThree.map((score, index) => (
                <article
                  key={`${score.user}-${score.date}-${index}`}
                  className={`qn-panel leaderboard-podium-card place-${index + 1}`}
                >
                  <span className="leaderboard-rank qn-num">{getRankLabel(index)}</span>
                  <h3>{getDisplayName(score.user)}</h3>
                  <p className="qn-meta-inline">
                    {score.subject}
                    {score.date ? ` · ${new Date(score.date).toLocaleDateString()}` : ""}
                  </p>
                  <strong className="leaderboard-score qn-num">{score.score}%</strong>
                </article>
              ))}
            </section>

            {rest.length > 0 && (
              <section className="qn-panel leaderboard-table-panel">
                <div className="qn-section-head">
                  <h2>All Standings</h2>
                  <span className="qn-meta-inline qn-num">{sorted.length} attempts</span>
                </div>

                <div className="qn-table-wrap">
                  <table className="qn-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Learner</th>
                        <th>Subject</th>
                        <th className="qn-align-right">Score</th>
                        <th className="qn-align-right">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rest.map((entry, idx) => (
                        <tr key={`${entry.user}-${entry.date}-${idx}`}>
                          <td className="qn-num">#{idx + 4}</td>
                          <td>{getDisplayName(entry.user)}</td>
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
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Leaderboard;
