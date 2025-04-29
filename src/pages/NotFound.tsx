
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // If it looks like a redirect path from auth, redirect to the auth page
    if (location.pathname.includes("callback") || location.pathname.includes("auth")) {
      console.log("Detected auth redirect path, redirecting to /auth");
      setTimeout(() => {
        navigate("/auth");
      }, 1500);
    }
  }, [location.pathname, navigate]);

  const goToHome = () => navigate("/");
  const goBack = () => navigate(-1);
  const goToAuth = () => navigate("/auth");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <p className="text-gray-500 mb-8">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={goToHome}
            className="flex items-center gap-2"
          >
            <Home size={16} />
            Return to Home
          </Button>
          <Button 
            onClick={goToAuth}
            className="flex items-center gap-2"
          >
            Login / Register
          </Button>
          <Button 
            variant="outline"
            onClick={goBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
