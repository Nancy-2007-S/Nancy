import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Roadmap from "./components/Roadmap";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
  const location = useLocation();
  const hideNavbarOnAuthPages =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/onboarding" ||
    location.pathname === "/dashboard" ||
    location.pathname === "/roadmap";

  return (
    <div className="min-h-screen bg-slate-100 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <ThemeToggle />
      {!hideNavbarOnAuthPages && <Navbar />}
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Dashboard />} />
        <Route
          path="/dashboard"
          element={<Navigate to="/onboarding" replace />}
        />
        <Route
          path="/roadmap"
          element={<Roadmap />}
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}
