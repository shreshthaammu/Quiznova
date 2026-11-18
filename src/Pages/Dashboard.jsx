import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../Components/AppHeader";
import { getCurrentUserProfile, signOutUser } from "../utils/auth";
import {
  getBookmarks,
  getCurrentStreak,
  getDailyChallenge,
  getLastWeakArea,
  hasCompletedDailyChallenge,
} from "../utils/learning";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function Dashboard() {
  const navigate = useNavigate();
  const profile = getCurrentUserProfile();
  const user = profile.displayName;

  const myScores = useMemo(() => {
    const allScores = JSON.parse(localStorage.getItem("scores")) || [];
    return allScores
      .filter(
        (score) =>
          score.user === profile.displayName ||
          score.user === profile.email ||
          score.user === profile.name
      )
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [profile.displayName, profile.email, profile.name]);

  const totalTests = myScores.length;
  const avg =
    totalTests > 0
      ? (myScores.reduce((sum, entry) => sum + entry.score, 0) / totalTests).toFixed(1)
      : "0.0";
  const highest = totalTests > 0 ? Math.max(...myScores.map((entry) => entry.score)) : 0;

  const daily = useMemo(() => getDailyChallenge(), []);
  const dailyDone = hasCompletedDailyChallenge();
  const streak = getCurrentStreak();
  const bookmarkCount = getBookmarks().length;
  const lastWeakArea = getLastWeakArea();

  const startDailyChallenge = () => {
    navigate("/quiz", {
      state: {
        subject: daily.subject,
        timer: daily.timer,
        numQuestions: daily.questions.length,
        title: daily.title,
        assignedBy: daily.assignedBy,
        mode: "daily-challenge",
        questions: daily.questions,
      },
    });
  };

  const handleLogout = () => {
    signOutUser();
    navigate("/login", { replace: true });
  };

  return (
    <div className="qn-page-wrap">
      <AppHeader />

      <main className="qn-main">
        <section className="qn-hero-grid">
          <div className="qn-hero-card">
            <p className="qn-kicker">Workspace Overview</p>
            <h1 className="qn-hero-title">
              {getGreeting()}, {user}
            </h1>
            <p className="qn-hero-subtitle">
              Track your assessment readiness across WAD and CAEG, launch a timed session, or review saved concepts.
            </p>
            <div className="qn-hero-actions">
              <button type="button" className="qn-btn-primary" onClick={() => navigate("/subjects")}>
                Browse Assigned Tests
              </button>
              <button type="button" className="qn-btn-secondary" onClick={() => navigate("/practice")}>
                Custom Practice
              </button>
              <button type="button" className="qn-btn-ghost" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </div>

          <div className="qn-daily-card">
            <div className="qn-daily-head">
              <span className="qn-kicker">Daily Challenge</span>
              <span className="qn-meta-inline qn-num">
                {daily.subject} · {daily.questions.length} Qs · {daily.timer}s each
              </span>
            </div>
            <h2 className="qn-daily-title">
              {dailyDone ? "Today's challenge complete" : "5-Question Sprint"}
            </h2>
            <p className="qn-daily-copy">
              {dailyDone
                ? `You are on a ${streak}-day streak. Keep momentum sharp with custom practice.`
                : "Complete today's curated sprint to build your daily learning streak."}
            </p>
            <button
              type="button"
              className="qn-btn-primary qn-full-btn"
              onClick={dailyDone ? () => navigate("/practice") : startDailyChallenge}
            >
              {dailyDone ? "Run Extra Practice" : "Start Daily Challenge"}
            </button>
          </div>
        </section>

        <section className="qn-kpi-strip" aria-label="Performance metrics">
          <div className="qn-kpi-card">
            <span className="qn-kpi-label">Total Attempts</span>
            <strong className="qn-kpi-value qn-num">{totalTests}</strong>
            <span className="qn-kpi-sub">Saved quizzes & tests</span>
          </div>
          <div className="qn-kpi-card">
            <span className="qn-kpi-label">Average Score</span>
            <strong className="qn-kpi-value qn-num">{avg}%</strong>
            <span className="qn-kpi-sub">Across all attempts</span>
          </div>
          <div className="qn-kpi-card">
            <span className="qn-kpi-label">Best Score</span>
            <strong className="qn-kpi-value qn-num">{highest}%</strong>
            <span className="qn-kpi-sub">Personal high mark</span>
          </div>
          <div className="qn-kpi-card">
            <span className="qn-kpi-label">Daily Streak</span>
            <strong className="qn-kpi-value qn-num">{streak}d</strong>
            <span className="qn-kpi-sub">{bookmarkCount} saved bookmarks</span>
          </div>
        </section>

        <section className="qn-section">
          <div className="qn-section-head">
            <h2>Study Modules</h2>
            <span className="qn-meta-inline">Choose a workflow to continue</span>
          </div>

          <div className="qn-module-grid">
            <button type="button" className="qn-module-card" onClick={() => navigate("/subjects")}>
              <span className="qn-module-meta">Assigned · Faculty Sets</span>
              <h3>Tests</h3>
              <p>Timed WAD and CAEG assessments with deadlines and full answer review.</p>
            </button>

            <button type="button" className="qn-module-card" onClick={() => navigate("/practice")}>
              <span className="qn-module-meta">Flexible · Custom Timer</span>
              <h3>Practice</h3>
              <p>Dial in question count and per-question speed for focused drills.</p>
            </button>

            <button type="button" className="qn-module-card" onClick={() => navigate("/notes")}>
              <span className="qn-module-meta">Revision · {bookmarkCount} Bookmarked</span>
              <h3>Notes & Bookmarks</h3>
              <p>Browse subject question banks, verify answers, and manage saved items.</p>
            </button>

            <button type="button" className="qn-module-card" onClick={() => navigate("/ai")}>
              <span className="qn-module-meta">Assistant · Topic Search</span>
              <h3>Quiznovaa AI</h3>
              <p>Ask questions about WAD, CAEG, your streak, or how workspace tools work.</p>
            </button>
          </div>
        </section>

        <section className="qn-two-col">
          <div className="qn-panel">
            <div className="qn-section-head">
              <h2>Recent Attempts</h2>
              <button type="button" className="qn-text-link" onClick={() => navigate("/leaderboard")}>
                View Leaderboard
              </button>
            </div>

            {myScores.length === 0 ? (
              <div className="qn-empty-state">
                <p>No completed attempts yet. Launch a test or practice sprint to record your first score.</p>
                <button type="button" className="qn-btn-secondary" onClick={() => navigate("/subjects")}>
                  Take First Test
                </button>
              </div>
            ) : (
              <div className="qn-table-wrap">
                <table className="qn-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th className="qn-align-right">Score</th>
                      <th className="qn-align-right">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myScores.slice(0, 5).map((entry, idx) => (
                      <tr key={`${entry.date}-${idx}`}>
                        <td>{entry.subject || "Quiz"}</td>
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
          </div>

          <div className="qn-panel">
            <div className="qn-section-head">
              <h2>Focus Recommendation</h2>
              <button
                type="button"
                className="qn-text-link"
                onClick={() => navigate("/notes", { state: { view: "bookmarks" } })}
              >
                Open Bookmarks
              </button>
            </div>

            {lastWeakArea ? (
              <div className="qn-focus-body">
                <p className="qn-meta-inline">Latest Weak Area · {lastWeakArea.subject}</p>
                <h3 className="qn-focus-title">{lastWeakArea.summary}</h3>
                <p className="qn-focus-copy">
                  {lastWeakArea.wrongCount > 0
                    ? `You missed ${lastWeakArea.wrongCount} question${lastWeakArea.wrongCount === 1 ? "" : "s"} in your last ${lastWeakArea.subject} session. Review notes or run a targeted 5-question drill.`
                    : `Zero misses on your last ${lastWeakArea.subject} run. Challenge yourself with a faster timer.`}
                </p>
                <div className="qn-inline-actions">
                  <button type="button" className="qn-btn-secondary" onClick={() => navigate("/notes")}>
                    Review {lastWeakArea.subject} Notes
                  </button>
                  <button type="button" className="qn-btn-ghost" onClick={() => navigate("/practice")}>
                    Drill Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="qn-focus-body">
                <p className="qn-meta-inline">Getting Started</p>
                <h3 className="qn-focus-title">Establish your baseline</h3>
                <p className="qn-focus-copy">
                  Complete any assigned test or daily challenge to unlock automated weak-area recommendations here.
                </p>
                <button type="button" className="qn-btn-secondary" onClick={startDailyChallenge}>
                  Start Daily Challenge
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
