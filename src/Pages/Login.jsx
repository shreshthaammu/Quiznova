import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInUser, signUpUser } from "../utils/auth";

function Login({ initialMode = "login" }) {
  const navigate = useNavigate();
  const mode = initialMode;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const switchMode = (nextMode) => {
    setError("");
    setPassword("");
    setConfirmPassword("");
    navigate(nextMode === "signup" ? "/signup" : "/login", { replace: true });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Enter email and password");
      return;
    }

    if (!email.trim().includes("@")) {
      setError("Enter a valid email address");
      return;
    }

    if (password.trim().length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    if (mode === "signup") {
      if (!name.trim()) {
        setError("Enter your full name");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const result = signUpUser({
        name,
        email,
        password,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      navigate("/dashboard");
      return;
    }

    const result = signInUser({ email, password });

    if (!result.ok) {
      setError(result.error);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="auth-shell">
      <div className="auth-layout">
        <section className="auth-showcase" aria-label="Workspace highlights">
          <span className="auth-wordmark">Quiznovaa</span>
          <h2 className="auth-showcase-title">
            Focused assessments, instant review, and structured revision.
          </h2>
          <p className="auth-showcase-copy">
            Practice WAD and CAEG fundamentals under realistic timers, track weak areas after every attempt, and save key concepts into your revision notebook.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <strong>01. Assigned & Custom Timed Sessions</strong>
              <span>Run faculty tests or configure custom question counts and per-question timers.</span>
            </div>
            <div className="auth-feature-item">
              <strong>02. Weak-Area Review & Bookmarks</strong>
              <span>Inspect missed questions immediately and bookmark them for targeted study.</span>
            </div>
            <div className="auth-feature-item">
              <strong>03. Daily Streak & Leaderboard</strong>
              <span>Complete the daily 5-question challenge and track your standing across attempts.</span>
            </div>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-header">
            <p className="auth-eyebrow">Quiznovaa Account</p>
            <h1>{mode === "signup" ? "Create your account" : "Welcome back"}</h1>
            <p className="auth-subtitle">
              {mode === "signup"
                ? "Sign up to save your quiz history, bookmarks, and daily streak."
                : "Sign in to continue your assessments and track your progress."}
            </p>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              className={`auth-tab ${mode === "login" ? "active" : ""}`}
              onClick={() => switchMode("login")}
            >
              Sign In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              className={`auth-tab ${mode === "signup" ? "active" : ""}`}
              onClick={() => switchMode("signup")}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <form className="auth-fields" onSubmit={handleSubmit} noValidate>
            {mode === "signup" && (
              <label className="auth-field">
                <span>Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  autoComplete="name"
                />
              </label>
            )}

            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <div className="auth-password-row">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                />
                <button
                  type="button"
                  className="auth-toggle"
                  onClick={() => setShow((value) => !value)}
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {mode === "signup" && (
              <label className="auth-field">
                <span>Confirm Password</span>
                <input
                  type={show ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                />
              </label>
            )}

            <button type="submit" className="auth-submit">
              {mode === "signup" ? "Create Account" : "Sign In"}
            </button>
          </form>

          <button
            type="button"
            className="auth-secondary"
            onClick={() => switchMode(mode === "signup" ? "login" : "signup")}
          >
            {mode === "signup"
              ? "Already have an account? Sign In"
              : "Need an account? Create one"}
          </button>

          <p className="auth-note">
            Progress, bookmarks, and scores are saved locally in this browser.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Login;
