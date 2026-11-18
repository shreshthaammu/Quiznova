import subjects from "../questions";

const BOOKMARKS_KEY = "bookmarkedQuestions";
const DAILY_LOG_KEY = "dailyChallengeLog";
const LAST_WEAK_AREA_KEY = "lastWeakArea";

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function createQuestionId(subject, question) {
  return `${subject}::${question.question || question.id || ""}`;
}

export function getBookmarks() {
  return readJson(BOOKMARKS_KEY, []);
}

export function isBookmarked(subject, question) {
  const id = createQuestionId(subject, question);
  return getBookmarks().some((item) => item.id === id);
}

export function toggleBookmark(subject, question) {
  const current = getBookmarks();
  const id = createQuestionId(subject, question);
  const exists = current.some((item) => item.id === id);

  if (exists) {
    const updated = current.filter((item) => item.id !== id);
    writeJson(BOOKMARKS_KEY, updated);
    return false;
  }

  const updated = [
    ...current,
    {
      id,
      subject,
      question: question.question,
      options: question.options || [],
      answer: question.answer || "",
    },
  ];
  writeJson(BOOKMARKS_KEY, updated);
  return true;
}

export function getDayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function hashString(value) {
  return value.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export function getDailyChallenge(date = new Date()) {
  const subjectKeys = Object.keys(subjects);
  const dayKey = getDayKey(date);
  const seed = hashString(dayKey);
  const subject = subjectKeys[seed % subjectKeys.length] || "WAD";
  const bank = subjects[subject] || [];
  const count = Math.min(5, bank.length);
  const start = bank.length ? seed % bank.length : 0;
  const questions = [];

  for (let i = 0; i < count; i += 1) {
    questions.push(bank[(start + i) % bank.length]);
  }

  return {
    dayKey,
    subject,
    title: "Daily Challenge",
    assignedBy: "Quiznovaa",
    timer: 15,
    questions,
  };
}

export function markDailyChallengeCompleted(payload) {
  const log = readJson(DAILY_LOG_KEY, {});
  log[payload.dayKey] = payload;
  writeJson(DAILY_LOG_KEY, log);
}

export function getDailyChallengeLog() {
  return readJson(DAILY_LOG_KEY, {});
}

export function getCurrentStreak() {
  const keys = Object.keys(getDailyChallengeLog()).sort();
  if (!keys.length) return 0;

  let streak = 0;
  let cursor = new Date(`${keys[keys.length - 1]}T00:00:00`);

  for (let index = keys.length - 1; index >= 0; index -= 1) {
    const currentKey = getDayKey(cursor);
    if (keys[index] !== currentKey) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function hasCompletedDailyChallenge(dayKey = getDayKey()) {
  const log = getDailyChallengeLog();
  return Boolean(log[dayKey]);
}

export function setLastWeakArea(value) {
  writeJson(LAST_WEAK_AREA_KEY, value);
}

export function getLastWeakArea() {
  return readJson(LAST_WEAK_AREA_KEY, null);
}
