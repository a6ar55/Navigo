import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, Star, Wifi, Coffee, Car, Landmark, Bus } from 'lucide-react';

interface Amenity {
  name: string;
  icon: React.ReactNode;
}

interface Accommodation {
  name: string;
  description: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  amenities: Amenity[];
  nearbyAttractions?: string[];
  transportationOptions?: string[];
}

interface AccommodationSectionProps {
  accommodations: Accommodation[];
}

const AccommodationSection: React.FC<AccommodationSectionProps> = ({ accommodations }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-travel-dark">Accommodations</CardTitle>
        <CardDescription>Recommended places to stay based on your preferences and budget.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accommodations.map((accommodation, index) => (
            <AccommodationCard key={index} accommodation={accommodation} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const AccommodationCard: React.FC<{ accommodation: Accommodation }> = ({ accommodation }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <img
          src={accommodation.image}
          alt={accommodation.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-white text-travel-dark hover:bg-gray-100">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
            {accommodation.rating.toFixed(1)}
          </Badge>
        </div>
      </div>
      
      <div className="p-4">
        <h4 className="text-lg font-semibold mb-1">{accommodation.name}</h4>
        
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1 text-travel-primary" />
          {accommodation.location}
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{accommodation.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {accommodation.amenities.map((amenity, index) => (
            <Badge key={index} variant="outline" className="flex items-center gap-1 py-1 px-2">
              {amenity.icon}
              <span>{amenity.name}</span>
            </Badge>
          ))}
        </div>
        
        {/* Nearby Attractions */}
        {accommodation.nearbyAttractions && accommodation.nearbyAttractions.length > 0 && (
          <div className="mt-3 border-t pt-3">
            <h5 className="text-sm font-medium flex items-center mb-2">
              <Landmark className="h-4 w-4 text-indigo-500 mr-2" />
              Nearby Attractions
            </h5>
            <ul className="grid grid-cols-1 gap-2">
              {accommodation.nearbyAttractions.map((attraction, index) => (
                <li key={index} className="text-xs text-gray-600 flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  {attraction}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Transportation Options */}
        {accommodation.transportationOptions && accommodation.transportationOptions.length > 0 && (
          <div className="mt-3 border-t pt-3">
            <h5 className="text-sm font-medium flex items-center mb-2">
              <Bus className="h-4 w-4 text-emerald-500 mr-2" />
              Transportation Access
            </h5>
            <ul className="grid grid-cols-1 gap-2">
              {accommodation.transportationOptions.map((option, index) => (
                <li key={index} className="text-xs text-gray-600 flex items-start">
                  <span className="text-emerald-600 mr-2">•</span>
                  {option}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <div className="font-semibold text-travel-dark">
            <DollarSign className="h-4 w-4 inline mr-1" />
            ${accommodation.price} <span className="text-sm font-normal text-gray-500">/ night</span>
          </div>
          <button className="text-sm text-travel-primary hover:underline">
            View details
          </button>
        </div>
      </div>
    </Card>
  );
};

export default AccommodationSection;
