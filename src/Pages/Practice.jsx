import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../Components/AppHeader";
import BackButton from "../Components/BackButton";
import subjects from "../questions";
import "./Practice.css";

const OPTION_LETTERS = ["A", "B", "C", "D"];

function getPerformanceLabel(percent) {
  if (percent >= 90) return "Excellent";
  if (percent >= 80) return "Very Good";
  if (percent >= 70) return "Good";
  if (percent >= 60) return "Above Average";
  if (percent >= 50) return "Average";
  if (percent >= 35) return "Below Average";
  return "Needs Review";
}

function Practice() {
  const navigate = useNavigate();
  const subjectKeys = Object.keys(subjects);
  const [selectedSubject, setSelectedSubject] = useState(subjectKeys[0] || "WAD");
  const [timer, setTimer] = useState(15);
  const [numQuestions, setNumQuestions] = useState(5);
  const [session, setSession] = useState(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(15);
  const [showBlast, setShowBlast] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const availableQuestions = useMemo(() => subjects[selectedSubject] || [], [selectedSubject]);
  const maxQuestions = availableQuestions.length || 1;
  const effectiveNumQuestions = Math.min(numQuestions, maxQuestions);
  const question = session?.questions?.[current];

  const percent = useMemo(
    () => (session?.questions?.length ? (finalScore / session.questions.length) * 100 : 0),
    [finalScore, session]
  );
  const performanceLabel = getPerformanceLabel(percent);

  const handleSubjectChange = (nextSubject) => {
    setSelectedSubject(nextSubject);
    const nextMax = (subjects[nextSubject] || []).length || 1;
    setNumQuestions((value) => Math.min(value, nextMax));
  };

  const handleNext = useCallback(() => {
    if (!session || !question) return;

    const nextScore = selected === question.answer ? score + 1 : score;
    setScore(nextScore);
    setSelected(null);

    if (current + 1 < session.questions.length) {
      setCurrent((value) => value + 1);
      setTime(session.timer);
    } else {
      setFinalScore(nextScore);
      setShowBlast(true);
    }
  }, [current, question, score, selected, session]);

  useEffect(() => {
    if (!session || showBlast) return undefined;
    if (time <= 0) {
      const immediate = setTimeout(() => {
        handleNext();
      }, 0);
      return () => clearTimeout(immediate);
    }
    const timerId = setTimeout(() => setTime((value) => value - 1), 1000);
    return () => clearTimeout(timerId);
  }, [time, session, showBlast, handleNext]);

  useEffect(() => {
    if (!showBlast) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showBlast]);

  useEffect(() => {
    if (!session || showBlast || !question) return undefined;
    const onKeyDown = (event) => {
      if (["1", "2", "3", "4"].includes(event.key)) {
        const option = question.options[Number(event.key) - 1];
        if (option) setSelected(option);
      } else if (event.key === "Enter" && selected) {
        handleNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [session, showBlast, question, selected, handleNext]);

  const startPractice = () => {
    const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, Math.min(effectiveNumQuestions, availableQuestions.length));

    setSession({
      subject: selectedSubject,
      timer,
      questions: picked,
    });
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinalScore(0);
    setTime(timer);
    setShowBlast(false);
  };

  const resetPractice = () => {
    setSession(null);
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinalScore(0);
    setTime(timer);
    setShowBlast(false);
  };

  if (!session) {
    return (
      <div className="qn-page-wrap">
        <AppHeader />

        <main className="qn-main qn-narrow">
          <div className="page-toolbar">
            <BackButton fallback="/dashboard" />
          </div>

          <section className="qn-panel">
            <div className="page-intro">
              <p className="page-eyebrow">Practice Mode · Custom Drill</p>
              <h1 className="page-title">Build Your Practice Session</h1>
              <p className="page-description">
                Choose a subject, configure your per-question timer, and pick how many questions to attempt.
              </p>
            </div>

            <div className="setup-control">
              <div className="setup-control-head">
                <label htmlFor="practice-subject">Subject</label>
                <strong>{selectedSubject}</strong>
              </div>
              <div className="qn-segmented" role="group" aria-label="Select subject">
                {subjectKeys.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    className={`qn-seg-btn ${selectedSubject === subject ? "active" : ""}`}
                    onClick={() => handleSubjectChange(subject)}
                  >
                    {subject} ({(subjects[subject] || []).length} Qs)
                  </button>
                ))}
              </div>
            </div>

            <div className="setup-control">
              <div className="setup-control-head">
                <label htmlFor="practice-timer">Time per Question</label>
                <strong className="qn-num">{timer} seconds</strong>
              </div>
              <input
                id="practice-timer"
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
                <label htmlFor="practice-count">Number of Questions</label>
                <strong className="qn-num">{effectiveNumQuestions} / {maxQuestions}</strong>
              </div>
              <input
                id="practice-count"
                className="setup-slider"
                type="range"
                min="1"
                max={maxQuestions}
                value={effectiveNumQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
              />
            </div>

            <div className="setup-summary-line qn-meta-inline qn-num">
              <span>{selectedSubject}</span>
              <span aria-hidden="true">·</span>
              <span>{effectiveNumQuestions} Questions</span>
              <span aria-hidden="true">·</span>
              <span>{timer}s Each</span>
            </div>

            <button type="button" onClick={startPractice} className="qn-btn-primary setup-start-btn">
              Start Practice Session
            </button>
          </section>
        </main>
      </div>
    );
  }

  if (!question) return <h2 className="qn-empty-heading">No Question Found</h2>;

  const progressPct = ((current + 1) / session.questions.length) * 100;
  const timerPct = Math.max(0, (time / session.timer) * 100);
  const isLowTime = time <= 5;

  return (
    <div className="quiz-page">
      <div className="qn-panel quiz-card">
        <div className="page-toolbar">
          <BackButton fallback="/dashboard" />
          <div className="qn-quiz-header-meta">
            <span className="qn-meta-inline">{session.subject} Practice</span>
            <button type="button" className="qn-text-link" onClick={resetPractice}>
              Exit Session
            </button>
          </div>
        </div>

        <div className="qn-progress-track" aria-hidden="true">
          <div className="qn-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>

        <div className="top">
          <span className="qn-num">
            Question {current + 1} of {session.questions.length}
          </span>
          <span id="timer" className={`qn-num ${isLowTime ? "danger" : ""}`}>
            {isLowTime ? `Low time · ${time}s` : `${time}s`}
          </span>
        </div>

        <div className="qn-timer-track" aria-hidden="true">
          <div
            className={`qn-timer-fill ${isLowTime ? "low" : ""}`}
            style={{ width: `${timerPct}%` }}
          />
        </div>

        <h2 className="quiz-question">{question.question}</h2>

        <div className="options" role="radiogroup" aria-label="Answer choices">
          {question.options.map((opt, i) => {
            const isSelected = selected === opt;
            return (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`opt ${isSelected ? "selected" : ""}`}
                onClick={() => setSelected(opt)}
              >
                <span className="opt-letter qn-num">{OPTION_LETTERS[i] || i + 1}</span>
                <span className="opt-text">{opt}</span>
              </button>
            );
          })}
        </div>

        <div className="quiz-footer-bar">
          <span className="qn-meta-inline">Tip: Press 1–4 to choose, Enter to continue</span>
          <button
            type="button"
            onClick={handleNext}
            disabled={!selected && time > 0}
            className="qn-btn-primary quiz-action-btn"
          >
            {current + 1 === session.questions.length ? "Finish Session" : "Next Question"}
          </button>
        </div>
      </div>

      {showBlast && (
        <div className="blast" role="dialog" aria-modal="true" aria-labelledby="practice-done-title">
          <div className="blast-content">
            <p className="qn-kicker">Practice Summary</p>
            <h2 id="practice-done-title">Session Completed</h2>
            <div className="blast-score qn-num">
              <strong>{finalScore}/{session.questions.length}</strong>
              <span>{percent.toFixed(1)}% · {performanceLabel}</span>
            </div>
            <div className="blast-actions">
              <button type="button" className="qn-btn-primary" onClick={startPractice}>
                Practice Again
              </button>
              <button type="button" className="qn-btn-secondary" onClick={resetPractice}>
                Change Settings
              </button>
              <button type="button" className="qn-btn-ghost" onClick={() => navigate("/notes")}>
                Open Revision Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Practice;
