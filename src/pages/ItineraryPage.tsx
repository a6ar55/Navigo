import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ItinerarySection from '@/components/trip/ItinerarySection';
import AccommodationSection from '@/components/trip/AccommodationSection';
import TransportationSection from '@/components/trip/TransportationSection';
import BudgetSection from '@/components/trip/BudgetSection';
import PackingSection from '@/components/trip/PackingSection';
import ShareItinerary from '@/components/trip/ShareItinerary';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Loader2, AlertTriangle, CalendarDays, MapPin, Users, Calendar, Plane, 
  BadgeCheck, Clock, ArrowLeft, Wifi, Coffee, Car, Sun, Umbrella, CreditCard, 
  Shirt, Heart, Plug, Check, Wind, Tv, Waves, Dumbbell, Backpack, Droplets, 
  Smartphone, FileText, Pill, Utensils, Tent, Bug, Code
} from 'lucide-react';
import { 
  GeneratedItinerary, 
  TripData, 
  generateItinerary 
} from '@/services/openaiService';
import { useToast } from '@/hooks/use-toast';
import { 
  Accordion, AccordionContent, AccordionItem, AccordionTrigger 
} from '@/components/ui/accordion';

const ItineraryPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<string | null>(null);

  useEffect(() => {
    const loadItinerary = async () => {
      try {
        setLoading(true);
        setError(null);
        setRawResponse(null);
        
        const tripDataString = localStorage.getItem('tripData');
        
        if (!tripDataString) {
          toast({
            title: "No trip data found",
            description: "Please start by planning a new trip.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        
        const tripData = JSON.parse(tripDataString) as TripData;
        
        tripData.startDate = new Date(tripData.startDate);
        tripData.endDate = new Date(tripData.endDate);
        
        console.log('Starting itinerary generation with trip data:', JSON.stringify(tripData, null, 2));
        
        toast({
          title: "Generating your itinerary",
          description: "This may take up to a minute. Using AI to create your perfect trip...",
        });
        
        try {
          const generatedItinerary = await generateItinerary(tripData);
          
          if (!generatedItinerary) {
            throw new Error("Failed to generate itinerary - received empty response");
          }
          
          try {
            // Wrap the icon processing in its own try/catch to isolate those errors
        const processedItinerary = processItineraryIcons(generatedItinerary);
            console.log('Final processed itinerary with icons:', JSON.stringify(processedItinerary, null, 2));
            
            setItinerary(processedItinerary);
            
            const hasRealData = 
              generatedItinerary.dailyItinerary && 
              generatedItinerary.dailyItinerary.length > 0 &&
              generatedItinerary.dailyItinerary[0].morning &&
              generatedItinerary.dailyItinerary[0].morning.length > 0 &&
              !generatedItinerary.dailyItinerary[0].morning[0].name.includes("not available") &&
              !generatedItinerary.dailyItinerary[0].morning[0].name.includes("Error");
            
            if (hasRealData) {
              toast({
                title: "Itinerary ready!",
                description: "Your personalized travel plan has been created.",
              });
            } else {
              toast({
                title: "Partial itinerary available",
                description: "Some data could not be generated. You may want to try again later.",
                variant: "warning",
              });
            }
          } catch (iconError) {
            console.error("Error processing icons:", iconError);
            setError(`Error processing itinerary icons: ${iconError instanceof Error ? iconError.message : 'Unknown error'}`);
            // Still set the itinerary without icons
            setItinerary(generatedItinerary);
          }
        } catch (apiError) {
          console.error("API Error:", apiError);
          
          // Extract the raw response if it exists in the error message
          const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
          setError(errorMessage);
          
          // Check if the error message contains a raw API response
          const rawResponseMatch = errorMessage.match(/Raw response: (.*)/);
          if (rawResponseMatch && rawResponseMatch[1]) {
            setRawResponse(rawResponseMatch[1]);
          }
          
          toast({
            title: "Error generating itinerary",
            description: "We encountered an error. See details below.",
            variant: "destructive",
          });
          
          try {
            const tripDataString = localStorage.getItem('tripData');
            if (tripDataString) {
              const tripData = JSON.parse(tripDataString) as TripData;
              tripData.startDate = new Date(tripData.startDate);
              tripData.endDate = new Date(tripData.endDate);
              
              const minimal = createMinimalErrorItinerary(tripData);
              const processedMinimal = processItineraryIcons(minimal);
              setItinerary(processedMinimal);
            }
          } catch (e) {
            console.error("Failed to create minimal error itinerary:", e);
          }
        }
      } catch (generalError) {
        console.error("General error in loadItinerary function:", generalError);
        setError(generalError instanceof Error ? generalError.message : "Unknown error occurred");
        
        toast({
          title: "Error",
          description: "Something went wrong loading the itinerary.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadItinerary();
  }, [navigate, toast]);

  // Function to properly handle displaying the raw response
  const formatRawResponse = (raw: string) => {
    try {
      // Try to parse it as JSON for better display
      const parsed = JSON.parse(raw);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      // If it's not valid JSON, return as is
      return raw;
    }
  };

  // Create a minimal itinerary with error messages
  const createMinimalErrorItinerary = (tripData: TripData): GeneratedItinerary => {
    // ... existing code ...
  };

  // Process the itinerary to add icon components
  const processItineraryIcons = (itinerary: GeneratedItinerary): GeneratedItinerary => {
    try {
      // Deep copy the itinerary to avoid mutation
      const processedItinerary = JSON.parse(JSON.stringify(itinerary));
      
      // Process accommodation amenities with safe string handling
      if (processedItinerary.accommodations && Array.isArray(processedItinerary.accommodations)) {
        processedItinerary.accommodations = processedItinerary.accommodations.map((acc: any) => {
          if (acc.amenities && Array.isArray(acc.amenities)) {
            acc.amenities = acc.amenities.map((amenity: any) => {
              let iconComponent = null;
              
              // Safely get the amenity name, defaulting to empty string if undefined
              const amenityName = (amenity?.name || '').toLowerCase();
              
              // Match icons based on keywords
              if (amenityName.includes('wifi') || amenityName.includes('internet')) {
                iconComponent = <Wifi className="h-4 w-4" />;
              } else if (amenityName.includes('breakfast') || amenityName.includes('meal')) {
                iconComponent = <Coffee className="h-4 w-4" />;
              } else if (amenityName.includes('pool') || amenityName.includes('swim')) {
                iconComponent = <Waves className="h-4 w-4" />;
              } else if (amenityName.includes('gym') || amenityName.includes('fitness')) {
                iconComponent = <Dumbbell className="h-4 w-4" />;
              } else if (amenityName.includes('parking') || amenityName.includes('garage')) {
                iconComponent = <Car className="h-4 w-4" />;
              } else if (amenityName.includes('tv') || amenityName.includes('television')) {
                iconComponent = <Tv className="h-4 w-4" />;
              } else if (amenityName.includes('air') || amenityName.includes('conditioning')) {
                iconComponent = <Wind className="h-4 w-4" />;
              } else {
                iconComponent = <Check className="h-4 w-4" />;
              }
              
              return {
                ...amenity,
                icon: iconComponent
              };
            });
          }
          return acc;
        });
      }
      
      // Process packing list categories with safe string handling
      if (processedItinerary.packingList && Array.isArray(processedItinerary.packingList)) {
        processedItinerary.packingList = processedItinerary.packingList.map((category: any) => {
          let iconComponent = null;
          
          // Safely get the category name, defaulting to empty string if undefined
          const categoryName = (category?.category || '').toLowerCase();
          
          // Match icons based on keywords
          if (categoryName.includes('cloth') || categoryName.includes('wear')) {
            iconComponent = <Shirt className="h-5 w-5" />;
          } else if (categoryName.includes('toilet') || categoryName.includes('hygiene')) {
            iconComponent = <Droplets className="h-5 w-5" />;
          } else if (categoryName.includes('tech') || categoryName.includes('electronic')) {
            iconComponent = <Smartphone className="h-5 w-5" />;
          } else if (categoryName.includes('document') || categoryName.includes('passport')) {
            iconComponent = <FileText className="h-5 w-5" />;
          } else if (categoryName.includes('medicine') || categoryName.includes('health')) {
            iconComponent = <Pill className="h-5 w-5" />;
          } else if (categoryName.includes('food') || categoryName.includes('snack')) {
            iconComponent = <Utensils className="h-5 w-5" />;
          } else if (categoryName.includes('outdoor') || categoryName.includes('camping')) {
            iconComponent = <Tent className="h-5 w-5" />;
          } else {
            iconComponent = <Backpack className="h-5 w-5" />;
          }
          
          return {
            ...category,
            icon: iconComponent
          };
        });
      }
      
      return processedItinerary;
    } catch (error) {
      console.error("Error processing icons:", error);
      // Return the original itinerary if processing fails
      return itinerary;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="h-16 w-16 animate-spin text-travel-primary mb-4" />
            <h2 className="text-2xl font-semibold text-travel-dark mb-2">
              Creating Your Perfect Trip
            </h2>
            <p className="text-gray-600 text-center max-w-md">
              Our AI is designing a personalized itinerary based on your preferences. This may take a minute...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-4xl mx-auto">
            <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-semibold text-travel-dark mb-2">
              Error Generating Itinerary
            </h2>
            <p className="text-gray-600 mb-4 text-center">{error}</p>
            
            {rawResponse && (
              <div className="w-full mb-6">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Bug className="h-5 w-5 mr-2" />
                  Raw API Response (for debugging)
                </h3>
                <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
                  <pre className="text-xs">{formatRawResponse(rawResponse)}</pre>
                </div>
              </div>
            )}
            
            <div className="flex gap-4 mt-4">
              <Button 
                onClick={() => navigate('/')}
                className="bg-travel-primary hover:bg-travel-primary/90"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Try Again
            </Button>
              
              {itinerary && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setError(null);
                    setRawResponse(null);
                  }}
                >
                  <Code className="mr-2 h-4 w-4" />
                  Show Partial Itinerary
                </Button>
              )}
                </div>
              </div>
        ) : itinerary ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-travel-dark mb-2">
                Your {itinerary.destination} Itinerary
              </h1>
                  <p className="text-gray-600">
                {itinerary.startDate} to {itinerary.endDate} · {itinerary.travelers} Travelers
                  </p>
            </div>
          
            {/* Tab navigation for different itinerary sections */}
            <Tabs defaultValue="itinerary" className="mb-12">
              <TabsList className="mb-8">
                <TabsTrigger value="itinerary">Daily Itinerary</TabsTrigger>
                <TabsTrigger value="accommodation">Accommodations</TabsTrigger>
                <TabsTrigger value="transportation">Transportation</TabsTrigger>
                <TabsTrigger value="budget">Budget</TabsTrigger>
                <TabsTrigger value="packing">Packing List</TabsTrigger>
          </TabsList>
          
              <TabsContent value="itinerary">
                <ItinerarySection itinerary={itinerary.dailyItinerary || []} />
          </TabsContent>
          
              <TabsContent value="accommodation">
                <AccommodationSection accommodations={itinerary.accommodations || []} />
          </TabsContent>
          
              <TabsContent value="transportation">
                <TransportationSection transportOptions={itinerary.transportOptions || {}} />
          </TabsContent>
          
              <TabsContent value="budget">
                <BudgetSection
                  totalBudget={itinerary.budgetBreakdown?.totalBudget || 0} 
                  totalSpent={itinerary.budgetBreakdown?.totalSpent || 0}
                  categories={itinerary.budgetBreakdown?.categories || []}
                  contingencyAmount={itinerary.budgetBreakdown?.contingencyAmount || 0}
                  localCurrencyInfo={itinerary.budgetBreakdown?.localCurrencyInfo}
                />
              </TabsContent>
          
              <TabsContent value="packing">
            <PackingSection 
                  categories={itinerary.packingList || []} 
                  weatherSummary={itinerary.weatherSummary || "Weather information not available"} 
            />
          </TabsContent>
            </Tabs>
          
            <ShareItinerary />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
            <h2 className="text-2xl font-semibold text-travel-dark mb-2">
              No Itinerary Data Found
            </h2>
            <p className="text-gray-600 text-center max-w-md mb-6">
              We couldn't find any itinerary data. Try generating a new itinerary.
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-travel-primary hover:bg-travel-primary/90"
            >
              Create New Itinerary
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ItineraryPage;
