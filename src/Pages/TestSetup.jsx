import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppHeader from "../Components/AppHeader";
import BackButton from "../Components/BackButton";
import subjects from "../questions";

function TestSetup() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const subject = state?.subject;

  const maxQuestions = subject ? subjects[subject]?.length || 10 : 10;
  const [timer, setTimer] = useState(15);
  const [numQuestions, setNumQuestions] = useState(() => Math.min(5, maxQuestions));

  if (!subject) {
    return (
      <div className="qn-page-wrap">
        <AppHeader />
        <main className="qn-main qn-narrow">
          <div className="qn-panel qn-empty-state">
            <h2>No subject selected</h2>
            <p>Choose an assigned subject from Tests to configure a custom quiz session.</p>
            <button type="button" className="qn-btn-primary" onClick={() => navigate("/subjects")}>
              Browse Subjects
            </button>
          </div>
        </main>
      </div>
    );
  }

  const startQuiz = () => {
    navigate("/quiz", {
      state: { subject, timer, numQuestions },
    });
  };

  return (
    <div className="qn-page-wrap">
      <AppHeader />

      <main className="qn-main qn-narrow">
        <div className="page-toolbar">
          <BackButton fallback="/subjects" />
        </div>

        <section className="qn-panel">
          <div className="page-intro">
            <p className="page-eyebrow">{subject} · Custom Configuration</p>
            <h1 className="page-title">Configure Your Quiz</h1>
            <p className="page-description">
              Adjust the time limit per question and total question count before starting.
            </p>
          </div>

          <div className="setup-control">
            <div className="setup-control-head">
              <label htmlFor="setup-timer-range">Time per Question</label>
              <strong className="qn-num">{timer} seconds</strong>
            </div>
            <input
              id="setup-timer-range"
              className="setup-slider"
              type="range"
              min="5"
              max="60"
              value={timer}
              onChange={(e) => setTimer(Number(e.target.value))}
            />
          </div>

          <div className="setup-control">
            <div className="setup-control-head">
              <label htmlFor="setup-count-range">Number of Questions</label>
              <strong className="qn-num">{numQuestions} / {maxQuestions}</strong>
            </div>
            <input
              id="setup-count-range"
              className="setup-slider"
              type="range"
              min="1"
              max={maxQuestions}
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
            />
          </div>

          <div className="setup-summary-line qn-meta-inline qn-num">
            <span>{subject}</span>
            <span aria-hidden="true">·</span>
            <span>{numQuestions} Questions</span>
            <span aria-hidden="true">·</span>
            <span>{timer}s Each</span>
          </div>

          <button type="button" onClick={startQuiz} className="qn-btn-primary setup-start-btn">
            Start Quiz
          </button>
        </section>
      </main>
    </div>
  );
}

export default TestSetup;
