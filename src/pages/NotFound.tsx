
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { ArrowLeft, Compass } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleBack = () => {
    navigate("/");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="mb-6 bg-travel-primary/10 p-5 rounded-full">
          <Compass className="h-16 w-16 text-travel-primary" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-travel-dark">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! It seems you've wandered off the map.
        </p>
        
        <p className="text-gray-600 mb-8 max-w-md">
          The destination you're looking for doesn't exist or has been moved to a new location.
        </p>
        
        <Button
          onClick={handleBack}
          className="flex items-center bg-travel-primary hover:bg-travel-primary/90"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Home
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
