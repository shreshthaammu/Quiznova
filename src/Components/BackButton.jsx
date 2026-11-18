import { useNavigate } from "react-router-dom";

function BackButton({ label = "Back", fallback = "/dashboard", className = "" }) {
  const navigate = useNavigate();

  const handleBack = () => {
    const canGoBack =
      typeof window !== "undefined" &&
      typeof window.history?.state?.idx === "number" &&
      window.history.state.idx > 0;

    if (canGoBack) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      type="button"
      className={`back-button ${className}`.trim()}
      onClick={handleBack}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M10 12.5L5.5 8L10 3.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{label}</span>
    </button>
  );
}

export default BackButton;
