import { useCallback, useEffect, useState } from "react";
import subjects from "../questions";

const subjectList = Object.keys(subjects);

function buildQuestions(sub) {
  const data = subjects[sub] || [];
  return [...data].sort(() => 0.5 - Math.random()).slice(0, 5);
}

function Practice() {
  const [subject, setSubject] = useState(subjectList[0] || "WAD");
  const [questions, setQuestions] = useState(() => buildQuestions(subjectList[0] || "WAD"));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(10);
  const [finished, setFinished] = useState(false);

  const user = localStorage.getItem("user") || "Guest";
  const question = questions[current];

  const finishQuiz = useCallback(
    (finalScore) => {
      setFinished(true);
      const percent = Math.round((finalScore / (questions.length || 1)) * 100);
      const scores = JSON.parse(localStorage.getItem("scores")) || [];
      scores.push({
        user,
        subject,
        score: percent,
        date: new Date().toISOString(),
      });
      localStorage.setItem("scores", JSON.stringify(scores));
    },
    [questions.length, subject, user]
  );

  const handleNext = useCallback(() => {
    if (!questions.length || !question) return;

    let newScore = score;
    if (selected === question.answer) {
      newScore = score + 1;
      setScore(newScore);
    }

    setSelected(null);

    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1);
      setTime(10);
    } else {
      finishQuiz(newScore);
    }
  }, [current, finishQuiz, question, questions.length, score, selected]);

  useEffect(() => {
    if (!questions.length || finished) return undefined;

    const timer = setTimeout(() => {
      if (time > 0) {
        setTime((t) => t - 1);
      } else {
        handleNext();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [time, questions.length, finished, handleNext]);

  const handleSubjectChange = (nextSub) => {
    setSubject(nextSub);
    setQuestions(buildQuestions(nextSub));
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setTime(10);
    setFinished(false);
  };

  const restart = () => {
    handleSubjectChange(subject);
  };

  if (!questions.length) return <h2>Loading...</h2>;

  if (finished) {
    return (
      <div className="qn-card" style={{ textAlign: "center" }}>
        <h2>Quiz Finished</h2>
        <p className="qn-num">{score} / {questions.length}</p>
        <button type="button" className="qn-btn-primary" onClick={restart}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <select
        className="practice-select"
        value={subject}
        onChange={(e) => handleSubjectChange(e.target.value)}
      >
        {subjectList.map((sub) => (
          <option key={sub} value={sub}>
            {sub}
          </option>
        ))}
      </select>

      <div className="top">
        <span>Q {current + 1}/{questions.length}</span>
        <span>{time}s</span>
      </div>

      <h3>{question.question}</h3>

      <div className="options">
        {question.options.map((opt, i) => (
          <button
            type="button"
            key={i}
            onClick={() => setSelected(opt)}
            className={`opt ${selected === opt ? "selected" : ""}`}
          >
            {opt}
          </button>
        ))}
      </div>

      <button type="button" onClick={handleNext} disabled={!selected}>
        Next
      </button>
    </div>
  );
}

export default Practice;