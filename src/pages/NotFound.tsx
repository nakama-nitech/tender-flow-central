
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();

  useEffect(() => {
    // Log the 404 error
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // Check if the user is trying to access /dashboard 
    // This is a common error after registration, so let's handle it
    if (location.pathname === "/dashboard" && user) {
      if (userRole === "supplier") {
        navigate("/supplier/dashboard");
      } else if (userRole === "admin") {
        navigate("/admin");
      }
    }
  }, [location.pathname, user, userRole, navigate]);

  const handleGoHome = () => {
    // If user is authenticated, redirect to appropriate dashboard
    if (user) {
      if (userRole === "supplier") {
        navigate("/supplier/dashboard");
      } else if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-xl">
        <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          Oops! The page you're looking for cannot be found
        </p>
        <div className="space-y-2">
          <Button onClick={handleGoHome} className="w-full">
            Return to Home
          </Button>
          {user && (
            <Button 
              variant="outline" 
              onClick={() => navigate(userRole === "admin" ? "/admin" : "/supplier/dashboard")} 
              className="w-full"
            >
              Go to Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
