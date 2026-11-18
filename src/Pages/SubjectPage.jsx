import { useNavigate } from "react-router-dom";
import AppHeader from "../Components/AppHeader";
import BackButton from "../Components/BackButton";
import subjects from "../questions";

const assignedTests = [
  {
    id: "wad-assignment",
    title: "WAD Subject Test",
    subject: "WAD",
    description: "Core JavaScript scope, hoisting, asynchronous execution, callbacks, promises, and React fundamentals.",
    assignedBy: "Web Technologies Faculty",
    dueDate: "Apr 10, 2026",
    dueTime: "5:00 PM",
    timer: 20,
    numQuestions: 10,
  },
  {
    id: "caeg-assignment",
    title: "CAEG Subject Test",
    subject: "CAEG",
    description: "Computer-aided engineering graphics, projections, sectioning, CAD commands, and geometric dimensioning.",
    assignedBy: "Engineering Graphics Faculty",
    dueDate: "Apr 12, 2026",
    dueTime: "3:30 PM",
    timer: 25,
    numQuestions: 10,
  },
];

function SubjectPage() {
  const navigate = useNavigate();

  return (
    <div className="qn-page-wrap">
      <AppHeader />

      <main className="qn-main">
        <div className="page-toolbar">
          <BackButton fallback="/dashboard" />
        </div>

        <div className="page-intro">
          <p className="page-eyebrow">Assigned Assessments</p>
          <h1 className="page-title">Subject Tests</h1>
          <p className="page-description">
            Review faculty deadlines, question counts, and per-question timing before launching an assessment, or customize your own configuration.
          </p>
        </div>

        <div className="assigned-tests-grid">
          {assignedTests.map((test) => {
            const totalAvailable = subjects[test.subject]?.length || test.numQuestions;
            const questionCount = Math.min(test.numQuestions, totalAvailable);

            const startAssignedTest = () =>
              navigate("/quiz", {
                state: {
                  subject: test.subject,
                  timer: test.timer,
                  numQuestions: questionCount,
                  title: test.title,
                  assignedBy: test.assignedBy,
                  dueDate: test.dueDate,
                  dueTime: test.dueTime,
                  mode: "assigned-test",
                },
              });

            const openCustomSetup = () =>
              navigate("/setup", {
                state: { subject: test.subject },
              });

            return (
              <article key={test.id} className="qn-panel assigned-test-tile">
                <div>
                  <p className="qn-meta-inline">
                    {test.subject} · {test.assignedBy}
                  </p>
                  <h2 className="assigned-test-heading">{test.title}</h2>
                  <p className="assigned-test-desc">{test.description}</p>
                </div>

                <div className="assigned-test-tiles-meta">
                  <div className="assigned-test-chip">
                    <small>Due Date</small>
                    <strong className="qn-num">{test.dueDate}</strong>
                  </div>
                  <div className="assigned-test-chip">
                    <small>Due Time</small>
                    <strong className="qn-num">{test.dueTime}</strong>
                  </div>
                  <div className="assigned-test-chip">
                    <small>Per Question</small>
                    <strong className="qn-num">{test.timer}s</strong>
                  </div>
                  <div className="assigned-test-chip">
                    <small>Questions</small>
                    <strong className="qn-num">{questionCount}</strong>
                  </div>
                </div>

                <div className="qn-inline-actions">
                  <button
                    type="button"
                    className="qn-btn-primary assigned-test-start-btn"
                    onClick={startAssignedTest}
                  >
                    Start Assigned Test
                  </button>
                  <button
                    type="button"
                    className="qn-btn-secondary"
                    onClick={openCustomSetup}
                  >
                    Custom Setup
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default SubjectPage;
