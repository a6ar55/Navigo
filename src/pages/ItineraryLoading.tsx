import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ItineraryLoading: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Check if we have trip data
    const tripData = localStorage.getItem('tripData');
    if (!tripData) {
      navigate('/');
      return;
    }

    // Set up progress simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        return newProgress >= 98 ? 98 : newProgress;
      });
    }, 600);

    // Set a timeout to navigate to the itinerary page
    const timer = setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        navigate('/itinerary');
      }, 500);
    }, 60000); // Increased to 60 seconds for more complex itineraries

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [navigate]);

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-lg mx-auto">
          <CardContent className="pt-10 pb-10 flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-travel-primary animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-center mb-2">Generating Your Perfect Itinerary</h2>
            <p className="text-gray-600 text-center mb-6">
              Gemma 7B is working to create your personalized travel plan.
            </p>
            
            <div className="w-full max-w-sm">
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div 
                    className="h-full bg-travel-primary rounded"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-center text-gray-500">{progress}% Complete</p>
              </div>
            </div>
            
            <div className="mt-6 space-y-4 w-full">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
              
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="mt-8"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          This usually takes about 30-45 seconds. The model is processing your travel preferences!
        </div>
      </div>

      <style>
        {`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          .loading-bar {
            position: relative;
            overflow: hidden;
            border-radius: 0.25rem;
          }
          
          .loading-bar::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.4),
              transparent
            );
            animation: loading 1.5s infinite;
          }
        `}
      </style>
    </Layout>
  );
};

export default ItineraryLoading;
