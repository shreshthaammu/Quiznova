function Sidebar({ active, setActive }) {
  const menu = [
    { name: "home", label: "🏠 Home" },
    { name: "practice", label: "⚡ Practice" },
    { name: "tests", label: "📝 Tests" },
    { name: "leaderboard", label: "🏆 Leaderboard" }
  ];

  return (
    <div className="sidebar">
      <h3 style={{ marginBottom: "20px" }}>Menu</h3>

      {menu.map((item) => (
        <button
          key={item.name}
          onClick={() => setActive(item.name)}
          className={`side-btn ${
            active === item.name ? "active" : ""
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default Sidebar;