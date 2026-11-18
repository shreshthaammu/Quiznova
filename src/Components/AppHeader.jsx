import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getCurrentUserProfile } from "../utils/auth";

function AppHeader() {
  const navigate = useNavigate();
  const profile = getCurrentUserProfile();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  const initial = (profile.displayName || "Q").charAt(0).toUpperCase();

  return (
    <header className="qn-topbar">
      <div className="qn-topbar-inner">
        <button
          type="button"
          className="qn-brand"
          onClick={() => navigate("/dashboard")}
        >
          Quiznovaa
        </button>

        <nav className="qn-nav" aria-label="Primary">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `qn-nav-link ${isActive ? "active" : ""}`}
          >
            Overview
          </NavLink>
          <NavLink
            to="/subjects"
            className={({ isActive }) => `qn-nav-link ${isActive ? "active" : ""}`}
          >
            Tests
          </NavLink>
          <NavLink
            to="/practice"
            className={({ isActive }) => `qn-nav-link ${isActive ? "active" : ""}`}
          >
            Practice
          </NavLink>
          <NavLink
            to="/notes"
            className={({ isActive }) => `qn-nav-link ${isActive ? "active" : ""}`}
          >
            Notes
          </NavLink>
          <NavLink
            to="/leaderboard"
            className={({ isActive }) => `qn-nav-link ${isActive ? "active" : ""}`}
          >
            Leaderboard
          </NavLink>
        </nav>

        <div className="qn-topbar-actions">
          <button
            type="button"
            className="qn-icon-btn"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {theme === "dark" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                <path
                  d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          <button
            type="button"
            className="qn-account-btn"
            onClick={() => navigate("/account")}
          >
            <span className="qn-avatar" aria-hidden="true">{initial}</span>
            <span className="qn-account-label">{profile.displayName || "Account"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
