
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Clock, MapPin, DollarSign, Cloud, Utensils, Luggage, Bed, Bus } from 'lucide-react';

interface Activity {
  time: string;
  name: string;
  description: string;
  location: string;
  cost: number;
  weatherDependent: boolean;
}

interface DayItinerary {
  date: string;
  weather: string;
  morning: Activity[];
  afternoon: Activity[];
  evening: Activity[];
}

interface ItinerarySectionProps {
  itinerary: DayItinerary[];
}

const ItinerarySection: React.FC<ItinerarySectionProps> = ({ itinerary }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-travel-dark">Daily Itinerary</CardTitle>
        <CardDescription>Your personalized daily schedule with activities and time frames.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={itinerary[0]?.date || "day1"} className="w-full">
          <TabsList className="w-full mb-6 overflow-x-auto flex flex-nowrap justify-start space-x-2 pb-1">
            {itinerary.map((day, index) => (
              <TabsTrigger 
                key={day.date} 
                value={day.date}
                className="flex-shrink-0"
              >
                Day {index + 1}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {itinerary.map((day) => (
            <TabsContent key={day.date} value={day.date} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{day.date}</h3>
                <div className="flex items-center space-x-2">
                  <Cloud className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{day.weather}</span>
                </div>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                {/* Morning Activities */}
                <AccordionItem value="morning">
                  <AccordionTrigger className="font-medium text-travel-primary">
                    Morning
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {day.morning.map((activity, index) => (
                        <ActivityCard key={index} activity={activity} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                {/* Afternoon Activities */}
                <AccordionItem value="afternoon">
                  <AccordionTrigger className="font-medium text-travel-primary">
                    Afternoon
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {day.afternoon.map((activity, index) => (
                        <ActivityCard key={index} activity={activity} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                {/* Evening Activities */}
                <AccordionItem value="evening">
                  <AccordionTrigger className="font-medium text-travel-primary">
                    Evening
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {day.evening.map((activity, index) => (
                        <ActivityCard key={index} activity={activity} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

const ActivityCard: React.FC<{ activity: Activity }> = ({ activity }) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{activity.time}</span>
          </div>
          
          {activity.weatherDependent && (
            <Badge variant="outline" className="text-yellow-600 border-yellow-300 bg-yellow-50">
              Weather dependent
            </Badge>
          )}
        </div>
        
        <h4 className="text-lg font-semibold mb-1">{activity.name}</h4>
        <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            {activity.location}
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-1" />
            ${activity.cost.toFixed(2)}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ItinerarySection;
