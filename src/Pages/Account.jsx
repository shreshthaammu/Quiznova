import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../Components/AppHeader";
import BackButton from "../Components/BackButton";
import { getCurrentUserProfile, signOutUser, updateCurrentUserName } from "../utils/auth";

function Account() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => getCurrentUserProfile());
  const [name, setName] = useState(profile.name || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [adminError, setAdminError] = useState("");

  const handleSave = (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Enter a username");
      return;
    }

    const result = updateCurrentUserName(name);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setProfile(getCurrentUserProfile());
    setMessage("Username updated");
  };

  const handleAdminAccess = (event) => {
    event.preventDefault();
    setAdminError("");

    if (!adminCode.trim()) {
      setAdminError("Enter admin code");
      return;
    }

    if (adminCode.trim() === "admin123") {
      localStorage.setItem("admin", "true");
      navigate("/admin/dashboard");
      return;
    }

    setAdminError("Incorrect admin code");
  };

  const handleLogout = () => {
    signOutUser();
    navigate("/login", { replace: true });
  };

  return (
    <div className="qn-page-wrap">
      <AppHeader />

      <main className="qn-main">
        <div className="page-toolbar">
          <BackButton fallback="/dashboard" />
          <button type="button" className="qn-btn-ghost" onClick={handleLogout}>
            Sign Out
          </button>
        </div>

        <div className="account-banner qn-panel">
          <div className="account-identity">
            <div className="account-avatar-lg" aria-hidden="true">
              {(profile.displayName || "Q").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="page-eyebrow">Account Settings</p>
              <h1 className="page-title">{profile.displayName || "Your Account"}</h1>
              <p className="qn-meta-inline">{profile.email}</p>
            </div>
          </div>
        </div>

        <div className="qn-two-col">
          <section className="qn-panel">
            <div className="qn-section-head">
              <h2>Profile</h2>
              <span className="qn-meta-inline">Display identity</span>
            </div>

            {error && <p className="auth-error" role="alert">{error}</p>}
            {message && <p className="account-message" role="status">{message}</p>}

            <form className="auth-fields" onSubmit={handleSave}>
              <label className="auth-field">
                <span>Display Name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter display name"
                />
              </label>

              <label className="auth-field">
                <span>Email</span>
                <input value={profile.email} disabled />
              </label>

              <button type="submit" className="qn-btn-primary">
                Save Changes
              </button>
            </form>
          </section>

          <section className="qn-panel">
            <div className="qn-section-head">
              <h2>Admin Access</h2>
              <span className="qn-meta-inline">Control Room</span>
            </div>

            <p className="qn-muted">
              Enter your administrator passkey to inspect cohort attempts, subject averages, and activity feeds.
            </p>

            {adminError && <p className="auth-error" role="alert">{adminError}</p>}

            <form className="auth-fields" onSubmit={handleAdminAccess}>
              <label className="auth-field">
                <span>Admin Code</span>
                <div className="auth-password-row">
                  <input
                    type={showAdminCode ? "text" : "password"}
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    placeholder="Enter admin code"
                  />
                  <button
                    type="button"
                    className="auth-toggle"
                    onClick={() => setShowAdminCode((v) => !v)}
                  >
                    {showAdminCode ? "Hide" : "Show"}
                  </button>
                </div>
              </label>

              <button type="submit" className="qn-btn-secondary">
                Open Control Room
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Account;
