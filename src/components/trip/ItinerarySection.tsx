import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, DollarSign, Cloud, Utensils, Star, Info, Calendar, Clock3 } from 'lucide-react';

interface MealSuggestion {
  name: string;
  cuisine: string;
  dietaryOptions: string[];
  priceRange: string;
  specialties: string;
  walkingDistance?: string;
  bestTimeToBeat?: string;
}

interface Activity {
  time: string;
  name: string;
  description: string;
  location: string;
  cost: number;
  duration?: string;
  popularityScore?: number;
  category?: string;
  weatherDependent: boolean;
  bestTimeToVisit?: string;
  tips?: string;
  mealSuggestion?: MealSuggestion | null;
}

interface DayItinerary {
  date: string;
  weather: string;
  activities: Activity[];
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">{day.date}</h3>
                <div className="flex items-center space-x-2">
                  <Cloud className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{day.weather}</span>
                </div>
              </div>
              
              <div className="relative">
                {/* Left timeline */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                {/* Activities */}
                <div className="space-y-8">
                  {day.activities.map((activity, index) => (
                    <div key={index} className="relative pl-14">
                      {/* Timeline dot */}
                      <div className="absolute left-4 top-1.5 w-4 h-4 rounded-full bg-travel-primary border-4 border-white"></div>
                      
                      <ActivityCard activity={activity} />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

const ActivityCard: React.FC<{ activity: Activity }> = ({ activity }) => {
  const [expanded, setExpanded] = useState(false);

  // Determine if it's a meal activity
  const isMeal = activity.category?.toLowerCase().includes('dining') || 
                activity.name.toLowerCase().includes('breakfast') || 
                activity.name.toLowerCase().includes('lunch') || 
                activity.name.toLowerCase().includes('dinner') ||
                activity.name.toLowerCase().includes('brunch') ||
                activity.name.toLowerCase().includes('meal');

  // Get category badge color
  const getCategoryColor = () => {
    if (!activity.category) return "bg-gray-100 text-gray-800";
    
    const category = activity.category.toLowerCase();
    if (category.includes('museum') || category.includes('gallery')) {
      return "bg-purple-100 text-purple-800";
    } else if (category.includes('park') || category.includes('garden') || category.includes('nature')) {
      return "bg-green-100 text-green-800";
    } else if (category.includes('historic') || category.includes('monument')) {
      return "bg-amber-100 text-amber-800";
    } else if (category.includes('shopping')) {
      return "bg-pink-100 text-pink-800";
    } else if (category.includes('dining') || category.includes('restaurant')) {
      return "bg-orange-100 text-orange-800";
    } else if (category.includes('entertainment') || category.includes('theater')) {
      return "bg-indigo-100 text-indigo-800";
    } else {
      return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <Card className={`overflow-hidden ${isMeal ? 'border-orange-200' : ''}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{activity.time}</span>
          </div>
          
          <div className="flex gap-2">
            {activity.duration && (
              <Badge variant="outline" className="text-purple-600 border-purple-300 bg-purple-50">
                <Clock3 className="h-3 w-3 mr-1" />
                {activity.duration}
              </Badge>
            )}
            
            {activity.weatherDependent && (
              <Badge variant="outline" className="text-yellow-600 border-yellow-300 bg-yellow-50">
                Weather dependent
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <h4 className="text-lg font-semibold">{activity.name}</h4>
          {activity.popularityScore && activity.popularityScore > 8 && (
            <div className="flex items-center text-xs bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">
              <Star className="h-3 w-3 mr-0.5 fill-amber-500 text-amber-500" />
              {activity.popularityScore}/10
            </div>
          )}
        </div>
        
        {activity.category && (
          <div className="mb-3">
            <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor()}`}>
              {activity.category}
            </span>
          </div>
        )}
        
        <div className={`text-sm text-gray-600 mb-3 ${expanded ? '' : 'line-clamp-3'}`}>
          {activity.description}
        </div>
        
        {!expanded && activity.description.length > 150 && (
          <button 
            className="text-xs text-travel-primary mb-3"
            onClick={() => setExpanded(true)}
          >
            Read more
          </button>
        )}
        
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            {activity.location}
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-1" />
            ${activity.cost.toFixed(2)}
          </div>
        </div>

        {(activity.bestTimeToVisit || activity.tips) && (
          <div className="mb-3 bg-blue-50 p-2 rounded-md text-xs text-blue-700">
            <div className="flex">
              <Info className="h-3 w-3 mr-1 flex-shrink-0 mt-0.5" />
              <div>
                {activity.bestTimeToVisit && (
                  <p><span className="font-medium">Best time:</span> {activity.bestTimeToVisit}</p>
                )}
                {activity.tips && (
                  <p className="mt-1"><span className="font-medium">Tip:</span> {activity.tips}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activity.mealSuggestion && (
          <div className="mt-3 border-t pt-3">
            <div className="flex items-center mb-2">
              <Utensils className="h-4 w-4 text-orange-500 mr-2" />
              <h5 className="text-sm font-medium">Meal Suggestion</h5>
            </div>
            <div className="bg-orange-50 rounded-md p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-orange-800">{activity.mealSuggestion.name}</span>
                <span className="text-xs text-gray-500">{activity.mealSuggestion.priceRange}</span>
              </div>
              <div className="text-xs text-gray-600 mb-2">
                <span className="text-orange-700 font-medium mr-1">Cuisine:</span> 
                {activity.mealSuggestion.cuisine}
              </div>
              {activity.mealSuggestion.specialties && (
                <div className="text-xs text-gray-600 mb-2">
                  <span className="text-orange-700 font-medium mr-1">Try:</span> 
                  {activity.mealSuggestion.specialties}
                </div>
              )}
              {activity.mealSuggestion.walkingDistance && (
                <div className="text-xs text-gray-600 mb-2">
                  <span className="text-orange-700 font-medium mr-1">Distance:</span> 
                  {activity.mealSuggestion.walkingDistance}
                </div>
              )}
              {activity.mealSuggestion.bestTimeToBeat && (
                <div className="text-xs text-gray-600 mb-2">
                  <span className="text-orange-700 font-medium mr-1">Timing tip:</span> 
                  {activity.mealSuggestion.bestTimeToBeat}
                </div>
              )}
              {activity.mealSuggestion.dietaryOptions && activity.mealSuggestion.dietaryOptions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {activity.mealSuggestion.dietaryOptions.map((option, i) => (
                    <Badge key={i} variant="outline" className="bg-white text-xs py-0">
                      {option}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ItinerarySection;
