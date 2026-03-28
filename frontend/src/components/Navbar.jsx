import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login", { replace: true });
  };

  return (
    <header className="bg-white shadow-sm transition-colors duration-300 dark:bg-slate-800 dark:shadow-slate-900/50">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Auth Dashboard
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/dashboard" className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">
            Home
          </Link>
          {token ? (
            <button
              onClick={handleLogout}
              className="rounded bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

