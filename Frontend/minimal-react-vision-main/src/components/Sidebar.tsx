// src/components/Sidebar.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, BarChart, Calendar, Palette, LogIn, UserPlus, Settings, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState<boolean>(false);

  // La montare și când se schimbă locația, verificăm dacă există token
  useEffect(() => {
    setIsAuth(!!localStorage.getItem("token"));
  }, [location]);

  const isActive = (path: string) =>
    location.pathname === path ? "active" : "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    navigate("/login");
  };

  return (
    <div className="bg-sidebar h-screen w-64 flex flex-col">
      <div className="p-6">
        <h1 className="text-white text-2xl font-bold">Smart</h1>
      </div>

      <nav className="flex flex-col flex-grow">
        <Link to="/recomandari" className={`sidebar-link ${isActive("/recomandari")}`}>
          <User size={20} />
          <span>Recomandări</span>
        </Link>
        <Link to="/planner" className={`sidebar-link ${isActive("/planner")}`}>
          <Calendar size={20} />
          <span>Planner</span>
        </Link>
        <Link to="/statistici" className={`sidebar-link ${isActive("/statistici")}`}>
          <BarChart size={20} />
          <span>Statistici</span>
        </Link>
        <Link to="/settings" className={`sidebar-link ${isActive("/settings")}`}>
          <Settings size={20} />
          <span>Setări</span>
        </Link>
      </nav>

      <div className="mt-auto mb-6 px-4">
        {isAuth ? (
          // dacă ești autentificat, afișăm butonul de logout
          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-left"
          >
            <LogOut size={18} />
            <span>Ieșire</span>
          </button>
        ) : (
          // dacă nu ești autentificat, afișăm login/register
          <div className="flex flex-col gap-2">
            <Link to="/login" className="sidebar-link">
              <LogIn size={18} />
              <span>Conectare</span>
            </Link>
            <Link to="/register" className="sidebar-link">
              <UserPlus size={18} />
              <span>Înregistrare</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

