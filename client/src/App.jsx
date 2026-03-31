import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Onboarding from "./pages/Onboarding";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login (default route) */}
        <Route path="/" element={<Login />} />

        {/* Onboarding welcome screen */}
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Main chat interface */}
        <Route path="/chat" element={<Chat />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
