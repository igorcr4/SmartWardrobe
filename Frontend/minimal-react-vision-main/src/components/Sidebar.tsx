import { Link, useLocation } from "react-router-dom";
import { User, ListChecks, BarChart, Calendar, Palette, LogIn, UserPlus } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? "active" : "";
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

        <Link to="/inspiratie" className={`sidebar-link ${isActive("/inspiratie")}`}>
          <Palette size={20} />
          <span>Inspirație</span>
        </Link>
      </nav>

      <div className="mt-auto mb-6 px-4">
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
      </div>
    </div>
  );
};

export default Sidebar;
