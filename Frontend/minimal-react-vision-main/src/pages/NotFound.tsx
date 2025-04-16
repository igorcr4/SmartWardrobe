
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-wardrobe-blue">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Pagina nu a fost găsită</p>
        <Button asChild>
          <Link to="/">Înapoi la pagina principală</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
