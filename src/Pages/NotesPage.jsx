import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import AppHeader from "../Components/AppHeader";
import BackButton from "../Components/BackButton";
import subjects from "../questions";
import { getBookmarks, isBookmarked, toggleBookmark } from "../utils/learning";

function NotesPage() {
  const { state } = useLocation();
  const subjectKeys = Object.keys(subjects);
  const [selectedSubject, setSelectedSubject] = useState(subjectKeys[0] || "WAD");
  const [view, setView] = useState(state?.view === "bookmarks" ? "bookmarks" : "subject");
  const [query, setQuery] = useState("");
  const [, setBookmarkRefresh] = useState(0);

  const selectedQuestions = useMemo(() => subjects[selectedSubject] || [], [selectedSubject]);
  const bookmarks = getBookmarks();

  const normalizedQuery = query.trim().toLowerCase();

  const visibleSubjectQuestions = useMemo(() => {
    if (!normalizedQuery) return selectedQuestions;
    return selectedQuestions.filter((item) => {
      const text = `${item.question} ${item.answer} ${item.options.join(" ")}`.toLowerCase();
      return text.includes(normalizedQuery);
    });
  }, [selectedQuestions, normalizedQuery]);

  const visibleBookmarks = useMemo(() => {
    if (!normalizedQuery) return bookmarks;
    return bookmarks.filter((item) => {
      const text = `${item.subject} ${item.question} ${item.answer} ${(item.options || []).join(" ")}`.toLowerCase();
      return text.includes(normalizedQuery);
    });
  }, [bookmarks, normalizedQuery]);

  const handleToggleBookmark = (item) => {
    toggleBookmark(item.subject, item);
    setBookmarkRefresh((value) => value + 1);
  };

  return (
    <div className="qn-page-wrap">
      <AppHeader />

      <main className="qn-main">
        <div className="page-toolbar">
          <BackButton fallback="/dashboard" />
        </div>

        <div className="page-intro">
          <p className="page-eyebrow">Study Notebook</p>
          <h1 className="page-title">
            {view === "bookmarks" ? "Bookmarked Questions" : `${selectedSubject} Study Notes`}
          </h1>
          <p className="page-description">
            Search verified questions and answers, or review items you saved for revision.
          </p>
        </div>

        <section className="qn-panel notes-shell">
          <div className="notes-controls-bar">
            <div className="qn-segmented" role="tablist" aria-label="Notes view">
              <button
                type="button"
                role="tab"
                aria-selected={view === "subject"}
                className={`qn-seg-btn ${view === "subject" ? "active" : ""}`}
                onClick={() => setView("subject")}
              >
                Subject Bank
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={view === "bookmarks"}
                className={`qn-seg-btn ${view === "bookmarks" ? "active" : ""}`}
                onClick={() => setView("bookmarks")}
              >
                Bookmarks ({bookmarks.length})
              </button>
            </div>

            {view === "subject" && (
              <div className="qn-segmented" role="group" aria-label="Select subject">
                {subjectKeys.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    className={`qn-seg-btn ${selectedSubject === subject ? "active" : ""}`}
                    onClick={() => setSelectedSubject(subject)}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            )}

            <div className="notes-search-wrap">
              <input
                type="search"
                className="qn-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions or answers..."
                aria-label="Search notes"
              />
            </div>
          </div>

          <div className="notes-count-bar">
            <span className="qn-meta-inline qn-num">
              {view === "subject"
                ? `${visibleSubjectQuestions.length} of ${selectedQuestions.length} questions`
                : `${visibleBookmarks.length} of ${bookmarks.length} saved`}
            </span>
          </div>

          {view === "subject" ? (
            visibleSubjectQuestions.length === 0 ? (
              <p className="notes-empty">No questions match &ldquo;{query}&rdquo;.</p>
            ) : (
              <div className="ai-notes-list">
                {visibleSubjectQuestions.map((item, index) => {
                  const saved = isBookmarked(selectedSubject, item);
                  return (
                    <article key={`${selectedSubject}-${item.question}`} className="ai-note-item">
                      <div className="note-item-head">
                        <span className="qn-meta-inline qn-num">
                          {selectedSubject} · Q{index + 1}
                        </span>
                        <button
                          type="button"
                          className={`qn-btn-ghost qn-btn-sm ${saved ? "is-saved" : ""}`}
                          onClick={() => handleToggleBookmark({ ...item, subject: selectedSubject })}
                        >
                          {saved ? "Bookmarked" : "Save"}
                        </button>
                      </div>

                      <p className="notes-question">{item.question}</p>

                      <ul className="notes-options-grid">
                        {item.options.map((option, optionIndex) => {
                          const isAnswer = option === item.answer;
                          return (
                            <li
                              key={`${selectedSubject}-${index}-${optionIndex}`}
                              className={`notes-option-cell ${isAnswer ? "is-answer" : ""}`}
                            >
                              <span>{option}</span>
                              {isAnswer && <span className="notes-answer-tag">Answer</span>}
                            </li>
                          );
                        })}
                      </ul>
                    </article>
                  );
                })}
              </div>
            )
          ) : visibleBookmarks.length === 0 ? (
            <div className="qn-empty-state">
              <p>
                {bookmarks.length === 0
                  ? "No questions bookmarked yet. Save questions from Study Notes or after any Quiz Result."
                  : `No saved bookmarks match "${query}".`}
              </p>
              {bookmarks.length === 0 && (
                <button
                  type="button"
                  className="qn-btn-secondary"
                  onClick={() => setView("subject")}
                >
                  Browse Subject Bank
                </button>
              )}
            </div>
          ) : (
            <div className="ai-notes-list">
              {visibleBookmarks.map((item, index) => (
                <article key={item.id || `${item.subject}-${index}`} className="ai-note-item">
                  <div className="note-item-head">
                    <span className="qn-meta-inline">{item.subject} · Saved Revision</span>
                    <button
                      type="button"
                      className="qn-btn-ghost qn-btn-sm"
                      onClick={() => handleToggleBookmark(item)}
                    >
                      Remove
                    </button>
                  </div>

                  <p className="notes-question">{item.question}</p>

                  <ul className="notes-options-grid">
                    {(item.options || []).map((option, optionIndex) => {
                      const isAnswer = option === item.answer;
                      return (
                        <li
                          key={`${item.subject}-${index}-${optionIndex}`}
                          className={`notes-option-cell ${isAnswer ? "is-answer" : ""}`}
                        >
                          <span>{option}</span>
                          {isAnswer && <span className="notes-answer-tag">Answer</span>}
                        </li>
                      );
                    })}
                  </ul>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default NotesPage;
