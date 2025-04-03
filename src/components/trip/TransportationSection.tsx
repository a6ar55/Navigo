
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plane, Train, Car, Bus, Clock, DollarSign, MapPin } from 'lucide-react';

interface TransportOption {
  type: 'flight' | 'train' | 'car' | 'bus' | 'publicTransit';
  provider: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  departureLocation: string;
  arrivalLocation: string;
  details: string;
}

interface TransportationSectionProps {
  transportOptions: {
    flight?: TransportOption[];
    train?: TransportOption[];
    car?: TransportOption[];
    bus?: TransportOption[];
    publicTransit?: TransportOption[];
  };
}

const TransportationSection: React.FC<TransportationSectionProps> = ({ transportOptions }) => {
  // Determine the default tab based on available options
  const getDefaultTab = () => {
    if (transportOptions.flight && transportOptions.flight.length > 0) return 'flight';
    if (transportOptions.train && transportOptions.train.length > 0) return 'train';
    if (transportOptions.car && transportOptions.car.length > 0) return 'car';
    if (transportOptions.bus && transportOptions.bus.length > 0) return 'bus';
    if (transportOptions.publicTransit && transportOptions.publicTransit.length > 0) return 'publicTransit';
    return 'flight'; // Default fallback
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-travel-dark">Transportation</CardTitle>
        <CardDescription>Recommended travel options based on your preferences and budget.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={getDefaultTab()} className="w-full">
          <TabsList className="w-full mb-6">
            {transportOptions.flight && transportOptions.flight.length > 0 && (
              <TabsTrigger value="flight" className="flex items-center space-x-2">
                <Plane className="h-4 w-4" />
                <span>Flights</span>
              </TabsTrigger>
            )}
            {transportOptions.train && transportOptions.train.length > 0 && (
              <TabsTrigger value="train" className="flex items-center space-x-2">
                <Train className="h-4 w-4" />
                <span>Trains</span>
              </TabsTrigger>
            )}
            {transportOptions.car && transportOptions.car.length > 0 && (
              <TabsTrigger value="car" className="flex items-center space-x-2">
                <Car className="h-4 w-4" />
                <span>Car</span>
              </TabsTrigger>
            )}
            {transportOptions.bus && transportOptions.bus.length > 0 && (
              <TabsTrigger value="bus" className="flex items-center space-x-2">
                <Bus className="h-4 w-4" />
                <span>Bus</span>
              </TabsTrigger>
            )}
            {transportOptions.publicTransit && transportOptions.publicTransit.length > 0 && (
              <TabsTrigger value="publicTransit" className="flex items-center space-x-2">
                <Bus className="h-4 w-4" />
                <span>Public Transit</span>
              </TabsTrigger>
            )}
          </TabsList>
          
          {/* Flights Tab */}
          {transportOptions.flight && transportOptions.flight.length > 0 && (
            <TabsContent value="flight" className="space-y-4">
              {transportOptions.flight.map((option, index) => (
                <TransportCard key={index} option={option} />
              ))}
            </TabsContent>
          )}
          
          {/* Trains Tab */}
          {transportOptions.train && transportOptions.train.length > 0 && (
            <TabsContent value="train" className="space-y-4">
              {transportOptions.train.map((option, index) => (
                <TransportCard key={index} option={option} />
              ))}
            </TabsContent>
          )}
          
          {/* Car Tab */}
          {transportOptions.car && transportOptions.car.length > 0 && (
            <TabsContent value="car" className="space-y-4">
              {transportOptions.car.map((option, index) => (
                <TransportCard key={index} option={option} />
              ))}
            </TabsContent>
          )}
          
          {/* Bus Tab */}
          {transportOptions.bus && transportOptions.bus.length > 0 && (
            <TabsContent value="bus" className="space-y-4">
              {transportOptions.bus.map((option, index) => (
                <TransportCard key={index} option={option} />
              ))}
            </TabsContent>
          )}
          
          {/* Public Transit Tab */}
          {transportOptions.publicTransit && transportOptions.publicTransit.length > 0 && (
            <TabsContent value="publicTransit" className="space-y-4">
              {transportOptions.publicTransit.map((option, index) => (
                <TransportCard key={index} option={option} />
              ))}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

const TransportCard: React.FC<{ option: TransportOption }> = ({ option }) => {
  const getIcon = () => {
    switch (option.type) {
      case 'flight':
        return <Plane className="h-5 w-5 text-travel-primary" />;
      case 'train':
        return <Train className="h-5 w-5 text-travel-primary" />;
      case 'car':
        return <Car className="h-5 w-5 text-travel-primary" />;
      case 'bus':
      case 'publicTransit':
        return <Bus className="h-5 w-5 text-travel-primary" />;
      default:
        return <Plane className="h-5 w-5 text-travel-primary" />;
    }
  };

  return (
    <Card className="overflow-hidden border-l-4 border-l-travel-primary">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getIcon()}
            <div>
              <h4 className="font-semibold">{option.provider}</h4>
              <Badge variant="outline" className="text-xs">
                {option.type.charAt(0).toUpperCase() + option.type.slice(1)}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-travel-dark">${option.price.toFixed(2)}</div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              {option.duration}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mb-4">
          <div className="text-center flex-1">
            <div className="text-sm text-gray-500">Departure</div>
            <div className="text-lg font-medium">{option.departureTime}</div>
            <div className="text-sm flex items-center justify-center text-gray-600">
              <MapPin className="h-3 w-3 mr-1" />
              {option.departureLocation}
            </div>
          </div>
          
          <div className="flex items-center px-4">
            <div className="w-16 h-0.5 bg-gray-300"></div>
          </div>
          
          <div className="text-center flex-1">
            <div className="text-sm text-gray-500">Arrival</div>
            <div className="text-lg font-medium">{option.arrivalTime}</div>
            <div className="text-sm flex items-center justify-center text-gray-600">
              <MapPin className="h-3 w-3 mr-1" />
              {option.arrivalLocation}
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 mt-2">{option.details}</div>
        
        <div className="mt-4 flex justify-end">
          <button className="text-sm text-travel-primary hover:underline">
            View details
          </button>
        </div>
      </div>
    </Card>
  );
};

export default TransportationSection;
