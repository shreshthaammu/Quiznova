import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../Components/BackButton";
import subjects from "../questions";
import { getDayKey } from "../utils/learning";

const OPTION_LETTERS = ["A", "B", "C", "D"];

function TestPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const subject = state?.subject || "WAD";
  const numQuestions = state?.numQuestions || 5;
  const initialTime = state?.timer || 15;
  const title = state?.title || `${subject} Test`;
  const assignedBy = state?.assignedBy || "Quiznovaa";
  const dueDate = state?.dueDate;
  const dueTime = state?.dueTime;
  const mode = state?.mode || "test";

  const [selectedQuestions] = useState(() => {
    if (state?.questions?.length) {
      return state.questions;
    }
    const allQuestions = subjects[subject] || [];
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numQuestions);
  });

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [time, setTime] = useState(initialTime);

  const question = selectedQuestions[index];

  const handleNext = useCallback(
    (option) => {
      const updated = [...answers, option];
      setAnswers(updated);

      if (index + 1 < selectedQuestions.length) {
        setIndex((prev) => prev + 1);
        setSelected(null);
        setTime(initialTime);
      } else {
        navigate("/result", {
          state: {
            questions: selectedQuestions,
            answers: updated,
            subject,
            title,
            mode,
            dayKey: mode === "daily-challenge" ? getDayKey() : null,
          },
        });
      }
    },
    [answers, index, initialTime, mode, navigate, selectedQuestions, subject, title]
  );

  useEffect(() => {
    if (!selectedQuestions.length) return undefined;
    if (time <= 0) {
      const immediate = setTimeout(() => {
        handleNext(null);
      }, 0);
      return () => clearTimeout(immediate);
    }
    const timerId = setTimeout(() => setTime((value) => value - 1), 1000);
    return () => clearTimeout(timerId);
  }, [time, selectedQuestions.length, handleNext]);

  useEffect(() => {
    if (!question) return undefined;
    const onKeyDown = (event) => {
      if (["1", "2", "3", "4"].includes(event.key)) {
        const option = question.options[Number(event.key) - 1];
        if (option) setSelected(option);
      } else if (event.key === "Enter" && selected) {
        handleNext(selected);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [question, selected, handleNext]);

  if (!selectedQuestions.length || !question) {
    return (
      <div className="quiz-page">
        <div className="qn-panel quiz-card qn-empty-state">
          <h2>No Questions Available</h2>
          <p>Return to Tests or Dashboard to select a valid assessment.</p>
          <button type="button" className="qn-btn-primary" onClick={() => navigate("/subjects")}>
            Back to Tests
          </button>
        </div>
      </div>
    );
  }

  const progressPct = ((index + 1) / selectedQuestions.length) * 100;
  const timerPct = Math.max(0, (time / initialTime) * 100);
  const isLowTime = time <= 5;

  return (
    <div className="quiz-page">
      <div className="qn-panel quiz-card">
        <div className="page-toolbar">
          <BackButton fallback="/subjects" label="Exit Test" />
          <span className="qn-meta-inline">
            {subject} · {assignedBy}
            {dueDate ? ` · Due ${dueDate}${dueTime ? `, ${dueTime}` : ""}` : ""}
          </span>
        </div>

        <div className="quiz-head-block">
          <p className="page-eyebrow">
            {mode === "assigned-test"
              ? "Assigned Assessment"
              : mode === "daily-challenge"
                ? "Daily Challenge"
                : "Quiz Session"}
          </p>
          <h1 className="quiz-title">{title}</h1>
        </div>

        <div className="qn-progress-track" aria-hidden="true">
          <div className="qn-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>

        <div className="top">
          <span className="qn-num">
            Question {index + 1} of {selectedQuestions.length}
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
          <span className="qn-meta-inline">Press 1–4 to choose, Enter to submit</span>
          <button
            type="button"
            className="qn-btn-primary quiz-action-btn"
            onClick={() => handleNext(selected)}
            disabled={!selected && time > 0}
          >
            {index + 1 === selectedQuestions.length ? "Finish Quiz" : "Next Question"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestPage;
