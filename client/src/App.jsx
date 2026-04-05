import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth.js";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import ChatView from "./pages/ChatView";
import JournalView from "./pages/JournalView";
import MoodView from "./pages/MoodView";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MoodCheckIn from "./components/MoodCheckIn";

function Dashboard() {
  const { isAuthenticated, loading } = useAuth();
  const navigate                     = useNavigate();
  const [activeView, setActiveView]  = useState("chat");
  const [showMood, setShowMood]      = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate("/login");
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div className="loader-ring" />
      </div>
    );
  }
  if (!isAuthenticated) return null;

  const views = {
    chat:    <ChatView />,
    journal: <JournalView />,
    mood:    <MoodView />,
  };

  return (
    <div className="app-shell">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <Navbar onMoodClick={() => setShowMood(true)} />

      <div className="app-body">
        <Sidebar active={activeView} onChange={setActiveView} />
        <main className="app-main">{views[activeView]}</main>
      </div>

      {showMood && <MoodCheckIn onClose={() => setShowMood(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"      element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard"  element={<Dashboard />} />
          <Route path="*"           element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}