import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute";
import Admin from "./Pages/Admin";
import AdminDashboard from "./Pages/AdminDashboard";
import Account from "./Pages/Account";
import Dashboard from "./Pages/Dashboard";
import Leaderboard from "./Pages/Leaderboard";
import Login from "./Pages/Login";
import NotesPage from "./Pages/NotesPage";
import Practice from "./Pages/Practice";
import QuiznovaaAI from "./Pages/QuiznovaaAI";
import ResultPage from "./Pages/ResultPage";
import SubjectPage from "./Pages/SubjectPage";
import TestPage from "./Pages/TestPage";
import TestSetup from "./Pages/TestSetup";

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.body.classList.remove("light", "dark");
    document.body.classList.add(savedTheme);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute><Login initialMode="login" /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login initialMode="login" /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Login initialMode="signup" /></PublicRoute>} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/subjects" element={<ProtectedRoute><SubjectPage /></ProtectedRoute>} />
        <Route path="/setup" element={<ProtectedRoute><TestSetup /></ProtectedRoute>} />
        <Route path="/quiz" element={<ProtectedRoute><TestPage /></ProtectedRoute>} />
        <Route path="/result" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
        <Route path="/ai" element={<ProtectedRoute><QuiznovaaAI /></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />

        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<PublicRoute><Login initialMode="login" /></PublicRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
