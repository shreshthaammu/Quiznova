const USERS_KEY = "users";
const CURRENT_USER_KEY = "user";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function parseUsers() {
  const raw = localStorage.getItem(USERS_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((user) => ({
        name: String(user?.name || "").trim(),
        email: normalizeEmail(user?.email || user?.user || user?.username),
        password: String(user?.password || user?.pass || "").trim(),
      }))
      .filter((user) => user.email);
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getStoredUsers() {
  return parseUsers();
}

export function getCurrentUser() {
  return String(localStorage.getItem(CURRENT_USER_KEY) || "").trim();
}

export function getCurrentUserProfile() {
  const currentEmail = getCurrentUser();
  const users = parseUsers();
  const user = users.find((entry) => entry.email === currentEmail);

  if (!user) {
    return {
      email: currentEmail,
      name: "",
      displayName: currentEmail || "Guest",
    };
  }

  return {
    email: user.email,
    name: user.name,
    displayName: user.name || user.email,
  };
}

export function getDisplayName(value) {
  const rawValue = String(value || "").trim();

  if (!rawValue) {
    return "Anonymous";
  }

  const normalizedValue = normalizeEmail(rawValue);
  const users = parseUsers();
  const matchedUser = users.find((entry) => entry.email === normalizedValue);

  return matchedUser?.name || rawValue;
}

export function updateCurrentUserName(name) {
  const trimmedName = String(name || "").trim();
  const currentEmail = getCurrentUser();
  const users = parseUsers();
  const currentUser = users.find((entry) => entry.email === currentEmail);

  if (!currentUser) {
    return {
      ok: false,
      error: "Account not found",
    };
  }

  const updatedUsers = users.map((entry) =>
    entry.email === currentEmail
      ? {
          ...entry,
          name: trimmedName,
        }
      : entry
  );

  saveUsers(updatedUsers);

  const scores = JSON.parse(localStorage.getItem("scores")) || [];
  const previousLabels = new Set(
    [currentUser.email, currentUser.name].filter(Boolean).map((label) => String(label).trim())
  );

  const updatedScores = scores.map((entry) =>
    previousLabels.has(String(entry.user || "").trim())
      ? {
          ...entry,
          user: trimmedName || currentUser.email,
        }
      : entry
  );

  localStorage.setItem("scores", JSON.stringify(updatedScores));

  return {
    ok: true,
    user: {
      ...currentUser,
      name: trimmedName,
    },
  };
}

export function signOutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function signInUser({ email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPassword = String(password || "").trim();
  const users = parseUsers();

  if (users.length === 0) {
    return {
      ok: false,
      error: "No account found. Please sign up first",
    };
  }

  const userByEmail = users.find((entry) => entry.email === normalizedEmail);

  if (!userByEmail) {
    return {
      ok: false,
      error: "No account found with this email. Please sign up first",
    };
  }

  if (userByEmail.password !== normalizedPassword) {
    return {
      ok: false,
      error: "Password is incorrect",
    };
  }

  localStorage.setItem(CURRENT_USER_KEY, userByEmail.email);

  return {
    ok: true,
    user: userByEmail,
  };
}

export function signUpUser({ name, email, password }) {
  const trimmedName = String(name || "").trim();
  const normalizedEmail = normalizeEmail(email);
  const normalizedPassword = String(password || "").trim();
  const users = parseUsers();

  if (users.some((user) => user.email === normalizedEmail)) {
    return {
      ok: false,
      error: "An account with this email already exists",
    };
  }

  const nextUser = {
    name: trimmedName,
    email: normalizedEmail,
    password: normalizedPassword,
  };

  saveUsers([...users, nextUser]);
  localStorage.setItem(CURRENT_USER_KEY, nextUser.email);

  return {
    ok: true,
    user: nextUser,
  };
}
