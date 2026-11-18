import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import AppHeader from "../Components/AppHeader";
import BackButton from "../Components/BackButton";
import { getCurrentUserProfile } from "../utils/auth";
import {
  isBookmarked,
  markDailyChallengeCompleted,
  setLastWeakArea,
  toggleBookmark,
} from "../utils/learning";

function getPerformanceLabel(percent) {
  if (percent >= 90) return "Excellent";
  if (percent >= 80) return "Very Good";
  if (percent >= 70) return "Good";
  if (percent >= 60) return "Above Average";
  if (percent >= 50) return "Average";
  if (percent >= 35) return "Below Average";
  return "Needs Review";
}

function ResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showAnswers, setShowAnswers] = useState(false);
  const [, setBookmarkVersion] = useState(0);
  const hasSavedScore = useRef(false);

  const hasValidState = Boolean(state?.questions?.length && state?.answers);
  const questions = useMemo(() => state?.questions || [], [state?.questions]);
  const answers = useMemo(() => state?.answers || [], [state?.answers]);
  const subject = state?.subject || "WAD";
  const title = state?.title || `${subject} Assessment`;
  const mode = state?.mode || "test";
  const dayKey = state?.dayKey || null;

  const score = useMemo(
    () =>
      questions.reduce(
        (total, question, index) => total + (question.answer === answers[index] ? 1 : 0),
        0
      ),
    [questions, answers]
  );

  const percent = useMemo(
    () => (questions.length ? (score / questions.length) * 100 : 0),
    [score, questions.length]
  );

  const wrongQuestions = useMemo(
    () =>
      questions
        .map((question, index) => ({
          question,
          userAnswer: answers[index] || "Not Answered",
          index,
        }))
        .filter((item) => item.question.answer !== answers[item.index]),
    [questions, answers]
  );

  const weakAreaSummary = useMemo(() => {
    if (!wrongQuestions.length) return "Perfect run. Keep the momentum going.";
    if (wrongQuestions.length === 1) return `Review 1 ${subject} concept from this attempt.`;
    return `Review ${wrongQuestions.length} ${subject} concepts from this attempt.`;
  }, [wrongQuestions.length, subject]);

  useEffect(() => {
    if (!hasValidState || hasSavedScore.current) return;
    hasSavedScore.current = true;

    const saved = JSON.parse(localStorage.getItem("scores")) || [];
    const profile = getCurrentUserProfile();
    const user = profile.displayName || "Guest";
    saved.push({
      user,
      subject,
      score: Number(percent.toFixed(2)),
      date: new Date().toISOString(),
    });
    localStorage.setItem("scores", JSON.stringify(saved));

    setLastWeakArea({
      subject,
      summary: weakAreaSummary,
      wrongCount: wrongQuestions.length,
    });

    if (mode === "daily-challenge" && dayKey) {
      markDailyChallengeCompleted({
        dayKey,
        subject,
        score: Number(percent.toFixed(2)),
      });
    }
  }, [hasValidState, percent, subject, weakAreaSummary, wrongQuestions.length, mode, dayKey]);

  if (!hasValidState) {
    return (
      <div className="qn-page-wrap">
        <AppHeader />
        <main className="qn-main qn-narrow">
          <div className="qn-panel qn-empty-state">
            <h2>No Result Data Found</h2>
            <p>Complete an assigned test or daily challenge to view your performance breakdown.</p>
            <div className="qn-inline-actions">
              <button type="button" className="qn-btn-primary" onClick={() => navigate("/subjects")}>
                Browse Tests
              </button>
              <button type="button" className="qn-btn-secondary" onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const performanceLabel = getPerformanceLabel(percent);
  const showCelebration = percent >= 80;
  const retryPath = mode === "assigned-test" ? "/subjects" : "/practice";
  const retryLabel = mode === "assigned-test" ? "Back to Tests" : "Practice Again";

  const handleBookmark = (question) => {
    toggleBookmark(subject, question);
    setBookmarkVersion((value) => value + 1);
  };

  return (
    <div className="qn-page-wrap">
      <AppHeader />
      {showCelebration && <Confetti recycle={false} numberOfPieces={160} />}

      <main className="qn-main qn-narrow">
        <div className="page-toolbar">
          <BackButton fallback="/dashboard" />
          <span className="qn-meta-inline">{subject} · {title}</span>
        </div>

        <section className="qn-panel result-panel">
          <div className="result-hero">
            <div>
              <p className="page-eyebrow">Assessment Summary</p>
              <h1 className="page-title">{performanceLabel}</h1>
              <p className="page-description">
                Review your score, inspect missed concepts, and save questions to your revision notebook.
              </p>
            </div>

            <div className="result-score-box">
              <span className="qn-kpi-label">Final Score</span>
              <strong className="result-percent qn-num">{percent.toFixed(1)}%</strong>
              <span className="qn-meta-inline qn-num">
                {score} of {questions.length} correct
              </span>
            </div>
          </div>

          <div className="result-insights-row">
            <div className="result-insight-item">
              <span className="qn-kpi-label">Focus Area</span>
              <strong>{subject}</strong>
              <p>{weakAreaSummary}</p>
            </div>
            <div className="result-insight-item">
              <span className="qn-kpi-label">Missed Questions</span>
              <strong className="qn-num">{wrongQuestions.length}</strong>
              <p>
                {wrongQuestions.length
                  ? "Expand the answer review below and bookmark items for revision."
                  : "Zero mistakes recorded in this attempt."}
              </p>
            </div>
          </div>

          <div className="result-actions">
            <button
              type="button"
              className="qn-btn-primary"
              onClick={() => setShowAnswers((value) => !value)}
            >
              {showAnswers ? "Hide Answer Review" : "Review Answers"}
            </button>
            <button
              type="button"
              className="qn-btn-secondary"
              onClick={() => navigate(retryPath)}
            >
              {retryLabel}
            </button>
            <button
              type="button"
              className="qn-btn-ghost"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>
          </div>
        </section>

        {showAnswers && (
          <section className="answer-review" aria-label="Answer review">
            {questions.map((question, index) => {
              const userAnswer = answers[index] || "Not Answered";
              const isCorrect = question.answer === answers[index];
              const bookmarked = isBookmarked(subject, question);

              return (
                <article key={index} className="qn-panel answer-card">
                  <div className="answer-card-head">
                    <span className="qn-meta-inline qn-num">Question {index + 1}</span>
                    <span className={`answer-status ${isCorrect ? "is-correct" : "is-wrong"}`}>
                      {isCorrect ? "Correct" : answers[index] ? "Incorrect" : "Timed Out"}
                    </span>
                  </div>

                  <p className="answer-question">{question.question}</p>

                  <div className="answer-comparison">
                    <div className="correct">
                      <span className="answer-label">Correct Answer</span>
                      <strong>{question.answer}</strong>
                    </div>
                    <div className={isCorrect ? "correct" : "wrong"}>
                      <span className="answer-label">Your Answer</span>
                      <strong>{userAnswer}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`qn-btn-secondary bookmark-btn ${bookmarked ? "is-saved" : ""}`}
                    onClick={() => handleBookmark(question)}
                  >
                    {bookmarked ? "Saved in Bookmarks (Remove)" : "Save for Revision"}
                  </button>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}

export default ResultPage;
