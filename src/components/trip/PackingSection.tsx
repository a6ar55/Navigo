
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sun, Umbrella, CreditCard, Shirt, Heart, Plug } from 'lucide-react';

interface PackingCategory {
  name: string;
  icon: React.ReactNode;
  items: {
    name: string;
    essential: boolean;
  }[];
}

interface PackingSectionProps {
  categories: PackingCategory[];
  weatherSummary: string;
}

const PackingSection: React.FC<PackingSectionProps> = ({ categories, weatherSummary }) => {
  const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({});

  const handleItemCheck = (categoryName: string, itemName: string) => {
    const key = `${categoryName}-${itemName}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-travel-dark">Packing Suggestions</CardTitle>
        <CardDescription>
          Personalized packing list based on your destination, activities, and weather.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Weather Summary */}
        <Card className="mb-6 bg-gradient-to-br from-blue-50 to-sky-50 border-blue-100">
          <CardContent className="pt-4">
            <div className="flex items-start space-x-4">
              <Sun className="h-8 w-8 text-amber-500 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-lg mb-1">Weather Considerations</h3>
                <p className="text-gray-700">{weatherSummary}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Packing Categories */}
        <Tabs defaultValue={categories[0]?.name || "essentials"} className="w-full">
          <TabsList className="w-full mb-6 grid grid-cols-3 md:grid-cols-6">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.name} 
                value={category.name}
                className="flex flex-col items-center py-3 px-2 space-y-2 text-xs"
              >
                {category.icon}
                <span>{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map((category) => (
            <TabsContent key={category.name} value={category.name} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.items.map((item, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start space-x-3 p-3 rounded-md transition-colors
                      ${checkedItems[`${category.name}-${item.name}`] 
                        ? 'bg-gray-50' 
                        : item.essential 
                          ? 'bg-amber-50 border border-amber-100' 
                          : 'bg-white border'
                      }`}
                  >
                    <Checkbox 
                      id={`${category.name}-${item.name}`}
                      checked={checkedItems[`${category.name}-${item.name}`] || false}
                      onCheckedChange={() => handleItemCheck(category.name, item.name)}
                    />
                    <div className="space-y-1">
                      <Label 
                        htmlFor={`${category.name}-${item.name}`}
                        className={`font-medium ${item.essential ? 'text-amber-800' : ''}`}
                      >
                        {item.name}
                        {item.essential && (
                          <span className="ml-2 text-xs text-amber-600 font-normal">Essential</span>
                        )}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button 
            className="text-sm text-travel-primary font-medium hover:underline"
            onClick={() => setCheckedItems({})}
          >
            Reset List
          </button>
          <button 
            className="text-sm px-3 py-1 bg-travel-primary text-white rounded-md hover:bg-travel-primary/90"
          >
            Print Packing List
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PackingSection;
