
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import TripForm from '@/components/trip/TripForm';
import { Compass, MapPin, Globe, CalendarCheck, CreditCard } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-travel-light">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-travel-dark">
                Your AI-Powered Travel Companion
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                Plan your perfect trip with personalized recommendations based on your preferences, budget, and travel style.
              </p>
            </div>
            <div className="space-x-4">
              <Button className="bg-travel-primary hover:bg-travel-primary/90">Get Started</Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-travel-primary/10 p-3 rounded-full">
                      <Compass className="h-6 w-6 text-travel-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Personalized Itineraries</h3>
                  <p className="text-gray-600">
                    Customized travel plans based on your interests, budget, and schedule.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-travel-secondary/10 p-3 rounded-full">
                      <CreditCard className="h-6 w-6 text-travel-secondary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Smart Budget Planning</h3>
                  <p className="text-gray-600">
                    Get detailed cost breakdowns and stay within your travel budget.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-travel-accent/10 p-3 rounded-full">
                      <CalendarCheck className="h-6 w-6 text-travel-accent" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Weather-Aware Planning</h3>
                  <p className="text-gray-600">
                    Activities and packing recommendations based on weather forecasts.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <TripForm />
        </div>
      </section>
      
      <section className="w-full py-12 md:py-24 lg:py-32 bg-travel-primary/5">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-travel-dark">
                How It Works
              </h2>
              <p className="text-gray-600 md:text-lg">
                Our AI-powered trip planner takes the stress out of travel planning by creating personalized itineraries tailored to your preferences.
              </p>
              
              <div className="space-y-4 mt-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-travel-primary/10 p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-travel-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Tell us your destination</h3>
                    <p className="text-gray-600">
                      Share where you're going, when, and your travel preferences.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-travel-primary/10 p-2 rounded-full">
                    <Globe className="h-5 w-5 text-travel-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Our AI does the research</h3>
                    <p className="text-gray-600">
                      We analyze thousands of possibilities, weather patterns, and local events.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-travel-primary/10 p-2 rounded-full">
                    <CalendarCheck className="h-5 w-5 text-travel-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Receive your personalized plan</h3>
                    <p className="text-gray-600">
                      Get a complete day-by-day itinerary with budget breakdown and recommendations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-video rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1501446529957-6226bd447c46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80" 
                  alt="Travel planning"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg p-4 max-w-xs">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="bg-green-100 p-1.5 rounded-full">
                    <CheckIcon className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="font-medium text-gray-800">Plans generated in seconds</p>
                </div>
                <p className="text-sm text-gray-600">
                  Our AI creates detailed travel plans 20x faster than manual planning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="w-full py-12 md:py-24 lg:py-32 bg-travel-dark text-white">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-300 md:text-lg mb-8">
            Create your personalized travel itinerary in minutes, not hours.
          </p>
          <Button className="bg-white text-travel-dark hover:bg-gray-100" size="lg">
            Plan Your Trip Now
          </Button>
        </div>
      </section>
    </Layout>
  );
};

// Simple check icon component
const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default HomePage;
