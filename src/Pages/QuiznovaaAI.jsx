import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../Components/AppHeader";
import BackButton from "../Components/BackButton";
import subjects from "../questions";
import { getBookmarks, getCurrentStreak, hasCompletedDailyChallenge } from "../utils/learning";

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "can",
  "do",
  "does",
  "for",
  "how",
  "i",
  "in",
  "is",
  "me",
  "my",
  "of",
  "on",
  "or",
  "show",
  "tell",
  "the",
  "this",
  "to",
  "website",
  "what",
  "where",
]);

const WEBSITE_KNOWLEDGE = [
  {
    keywords: ["dashboard", "home", "main", "page", "overview"],
    answer:
      "Overview is your main hub. It surfaces your Daily Challenge, attempt stats, streak, weak-area recommendations, and quick links to Tests, Practice, Notes, and Leaderboard.",
  },
  {
    keywords: ["account", "profile", "username", "email"],
    answer:
      "Open Account from the top-right avatar button to update your display name, sign out, or unlock the Admin Control Room.",
  },
  {
    keywords: ["admin", "code", "control", "room"],
    answer:
      "Admin access lives inside Account or at /admin. Entering the admin code opens the Control Room with participant and subject analytics.",
  },
  {
    keywords: ["leaderboard", "rank", "ranking", "top", "champions"],
    answer:
      "Leaderboard highlights the top 3 podium performers, supports subject filtering, and lists all ranked attempts below.",
  },
  {
    keywords: ["notes", "bookmark", "bookmarks", "revision", "saved"],
    answer:
      "Notes displays searchable subject-wise questions with verified answers, plus a dedicated Bookmarks tab for saved revision items.",
  },
  {
    keywords: ["practice", "custom", "session"],
    answer:
      "Practice lets you customize subject, timer per question, and question count for focused drills with keyboard shortcuts.",
  },
  {
    keywords: ["test", "tests", "assigned", "deadline", "timed"],
    answer:
      "Tests contains faculty-assigned WAD and CAEG assessments with due dates, per-question timers, and instant result breakdowns.",
  },
  {
    keywords: ["theme", "dark", "light", "color"],
    answer:
      "Use the sun/moon icon in the top navigation bar at any time to switch between Dark and Light themes.",
  },
  {
    keywords: ["login", "signup", "sign", "auth"],
    answer:
      "You can sign in or create an account on the login screen. Your email identifies your account while your display name appears across results and leaderboards.",
  },
  {
    keywords: ["result", "score", "answers", "review", "weak"],
    answer:
      "After each quiz, Results summarizes your score, rating, missed concepts, and full answer review with one-click bookmarking.",
  },
  {
    keywords: ["ai", "assistant", "quiznovaa"],
    answer:
      "Quiznovaa AI answers questions about workspace pages, WAD and CAEG topics, your daily streak, and saved bookmarks.",
  },
];

function findSubjectFromPrompt(text) {
  const lower = text.toLowerCase();
  if (lower.includes("wad")) return "WAD";
  if (lower.includes("caeg") || lower.includes("cad")) return "CAEG";
  return null;
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token && !STOP_WORDS.has(token));
}

function getBestWebsiteAnswer(text) {
  const tokens = tokenize(text);
  if (!tokens.length) return null;

  let best = null;

  WEBSITE_KNOWLEDGE.forEach((entry) => {
    const score = entry.keywords.reduce(
      (sum, keyword) => sum + (tokens.includes(keyword) ? 1 : 0),
      0
    );
    if (!best || score > best.score) {
      best = { score, answer: entry.answer };
    }
  });

  return best && best.score > 0 ? best.answer : null;
}

function getSubjectSearchReply(text, subjectQuestions, subject) {
  const tokens = tokenize(text);
  if (!subject || !tokens.length) return null;

  const matches = subjectQuestions
    .map((item) => {
      const haystack = `${item.question} ${item.answer} ${item.options.join(" ")}`.toLowerCase();
      const score = tokens.reduce((sum, token) => sum + (haystack.includes(token) ? 1 : 0), 0);
      return { ...item, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (!matches.length) return null;

  return `${subject} matches:\n${matches
    .map((item, index) => `${index + 1}. ${item.question}\nAnswer: ${item.answer}`)
    .join("\n\n")}`;
}

function buildAiReply(prompt) {
  const text = prompt.trim().toLowerCase();
  const subject = findSubjectFromPrompt(text);
  const subjectQuestions = subject ? subjects[subject] || [] : [];
  const bookmarkCount = getBookmarks().length;
  const streak = getCurrentStreak();
  const challengeDone = hasCompletedDailyChallenge();

  if (!text) {
    return "Ask about Overview, Tests, Practice, Notes, Bookmarks, Leaderboard, Account, WAD, or CAEG.";
  }

  if (text.includes("notes") || text.includes("bookmark") || text.includes("revision")) {
    return `Notes shows subject-wise questions, options, and answers. You currently have ${bookmarkCount} bookmarked question${bookmarkCount === 1 ? "" : "s"} saved for revision.`;
  }

  if (text.includes("daily challenge") || text.includes("challenge") || text.includes("streak")) {
    return `Your current Daily Challenge streak is ${streak} day${streak === 1 ? "" : "s"}, and today's challenge is ${challengeDone ? "completed" : "still open"}.`;
  }

  if (subject && (text.includes("how many") || text.includes("count"))) {
    return `${subject} has ${subjectQuestions.length} questions in the study bank right now.`;
  }

  if (subject && (text.includes("answer") || text.includes("important") || text.includes("topic") || text.includes("revision"))) {
    const preview = subjectQuestions
      .slice(0, 3)
      .map((item, index) => `${index + 1}. ${item.question}\nAnswer: ${item.answer}`);
    return `${subject} quick revision:\n\n${preview.join("\n\n")}`;
  }

  const subjectSearchReply = getSubjectSearchReply(text, subjectQuestions, subject);
  if (subjectSearchReply) {
    return subjectSearchReply;
  }

  if (subject) {
    const firstQuestion = subjectQuestions[0];
    if (firstQuestion) {
      return `${subject} includes ${subjectQuestions.length} questions. Sample:\n${firstQuestion.question}\nAnswer: ${firstQuestion.answer}`;
    }
  }

  const websiteAnswer = getBestWebsiteAnswer(text);
  if (websiteAnswer) {
    return websiteAnswer;
  }

  return "I can help with Dashboard, Tests, Practice, Notes, Bookmarks, Leaderboard, Account, Admin, WAD, and CAEG. Try asking about one of those topics.";
}

const QUICK_PROMPTS = [
  { label: "WAD Quick Revision", text: "WAD important topics" },
  { label: "CAEG Quick Revision", text: "CAEG important topics" },
  { label: "My Streak & Notes", text: "How is my daily challenge streak and notes" },
  { label: "Tests vs Practice", text: "How do tests and practice work" },
];

function QuiznovaaAI() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Ask about app workflows, your daily streak, saved bookmarks, or WAD and CAEG concepts.",
    },
  ]);

  const sendPrompt = (textToAsk) => {
    const cleaned = textToAsk.trim();
    if (!cleaned) return;
    const reply = buildAiReply(cleaned);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: cleaned },
      { role: "assistant", text: reply },
    ]);
    setPrompt("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendPrompt(prompt);
  };

  return (
    <div className="qn-page-wrap">
      <AppHeader />

      <main className="qn-main qn-narrow">
        <div className="page-toolbar">
          <BackButton fallback="/dashboard" />
          <div className="qn-inline-actions">
            <button type="button" className="qn-btn-secondary" onClick={() => navigate("/notes")}>
              Open Notes
            </button>
            <button type="button" className="qn-btn-ghost" onClick={() => navigate("/practice")}>
              Practice
            </button>
          </div>
        </div>

        <div className="page-intro">
          <p className="page-eyebrow">Quiznovaa AI</p>
          <h1 className="page-title">Study Helper</h1>
          <p className="page-description">
            Query subject concepts, check your revision status, or explore how assessment modes work.
          </p>
        </div>

        <section className="qn-panel ai-chat-panel">
          <div className="ai-quick-prompts" role="group" aria-label="Suggested questions">
            {QUICK_PROMPTS.map((item) => (
              <button
                key={item.label}
                type="button"
                className="qn-btn-secondary qn-btn-sm"
                onClick={() => sendPrompt(item.text)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="ai-thread" aria-live="polite">
            {messages.map((msg, idx) => (
              <div key={idx} className={`ai-bubble ${msg.role === "user" ? "is-user" : "is-bot"}`}>
                <span className="ai-bubble-author">
                  {msg.role === "user" ? "You" : "Quiznovaa Helper"}
                </span>
                <pre className="ai-bubble-text">{msg.text}</pre>
              </div>
            ))}
          </div>

          <form className="ai-input-row" onSubmit={handleSubmit}>
            <input
              type="text"
              className="qn-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask about WAD, CAEG, bookmarks, or tests..."
              aria-label="Ask Quiznovaa Helper"
            />
            <button type="submit" className="qn-btn-primary">
              Ask
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default QuiznovaaAI;
