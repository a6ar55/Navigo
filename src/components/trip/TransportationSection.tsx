import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plane, Train, Car, Bus, Clock, DollarSign, MapPin, Calendar, Info, AlertCircle, Ticket, Clock3 } from 'lucide-react';

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
  recommendedBookingTime?: string;
}

interface LocalTransportation {
  type: string;
  coverage: string;
  costPerTrip: number;
  dayPassOption: number;
  frequency: string;
  operatingHours: string;
  accessibility: string;
  tipsForTravelers: string;
}

interface TransportationSectionProps {
  transportOptions: {
    flight?: TransportOption[];
    train?: TransportOption[];
    car?: TransportOption[];
    bus?: TransportOption[];
    publicTransit?: TransportOption[];
    localTransportation?: LocalTransportation[];
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
    if (transportOptions.localTransportation && transportOptions.localTransportation.length > 0) return 'localTransportation';
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
            {transportOptions.localTransportation && transportOptions.localTransportation.length > 0 && (
              <TabsTrigger value="localTransportation" className="flex items-center space-x-2">
                <Ticket className="h-4 w-4" />
                <span>Local Options</span>
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
          
          {/* Local Transportation Tab */}
          {transportOptions.localTransportation && transportOptions.localTransportation.length > 0 && (
            <TabsContent value="localTransportation" className="space-y-4">
              {transportOptions.localTransportation.map((option, index) => (
                <LocalTransportCard key={index} option={option} />
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
        
        {option.recommendedBookingTime && (
          <div className="mt-3 flex items-start text-xs text-amber-700 bg-amber-50 p-2 rounded-md">
            <Calendar className="h-3 w-3 text-amber-600 mt-0.5 mr-1 flex-shrink-0" />
            <span>Recommended booking: {option.recommendedBookingTime}</span>
          </div>
        )}
        
        <div className="mt-4 flex justify-end">
          <button className="text-sm text-travel-primary hover:underline">
            View details
          </button>
        </div>
      </div>
    </Card>
  );
};

const LocalTransportCard: React.FC<{ option: LocalTransportation }> = ({ option }) => {
  return (
    <Card className="overflow-hidden border-l-4 border-l-emerald-500">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-100 p-2 rounded-full">
              {option.type.toLowerCase().includes('train') || option.type.toLowerCase().includes('metro') ? (
                <Train className="h-5 w-5 text-emerald-600" />
              ) : option.type.toLowerCase().includes('bus') ? (
                <Bus className="h-5 w-5 text-emerald-600" />
              ) : (
                <Ticket className="h-5 w-5 text-emerald-600" />
              )}
            </div>
            <div>
              <h4 className="font-semibold capitalize">{option.type}</h4>
              <div className="text-sm text-gray-600">{option.coverage}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">
              <span className="font-bold text-emerald-700">${option.costPerTrip.toFixed(2)}</span> per trip
            </div>
            <div className="text-sm font-medium">
              <span className="font-bold text-emerald-700">${option.dayPassOption.toFixed(2)}</span> day pass
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <Clock3 className="h-4 w-4 mr-2 text-gray-500" />
              Schedule Information
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Frequency:</span>
                <span className="font-medium">{option.frequency}</span>
              </div>
              <div className="flex justify-between">
                <span>Operating Hours:</span>
                <span className="font-medium">{option.operatingHours}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-md">
            <div className="flex items-center text-sm font-medium text-blue-700 mb-1">
              <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
              Accessibility
            </div>
            <div className="text-xs text-blue-600">
              {option.accessibility}
            </div>
          </div>
        </div>

        <div className="bg-amber-50 p-3 rounded-md mb-4">
          <div className="flex items-center text-sm font-medium text-amber-700 mb-1">
            <Info className="h-4 w-4 mr-2 text-amber-500" />
            Traveler Tips
          </div>
          <div className="text-xs text-amber-600">
            {option.tipsForTravelers}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TransportationSection;
