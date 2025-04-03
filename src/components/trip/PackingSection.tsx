import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sun, Umbrella, CreditCard, Shirt, Heart, Plug } from 'lucide-react';

interface PackingItem {
  name: string;
  essential: boolean;
  weatherConsideration?: string | null;
  packingTip?: string | null;
}

interface PackingCategory {
  category: string;
  icon: React.ReactNode;
  items: PackingItem[];
  categoryNotes?: string | null;
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
        <Tabs defaultValue={categories[0]?.category || "essentials"} className="w-full">
          <TabsList className="w-full mb-6 grid grid-cols-3 md:grid-cols-6">
            {categories.map((cat) => (
              <TabsTrigger 
                key={cat.category} 
                value={cat.category}
                className="flex flex-col items-center py-3 px-2 space-y-2 text-xs"
              >
                {cat.icon}
                <span>{cat.category}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map((cat) => (
            <TabsContent key={cat.category} value={cat.category} className="space-y-4">
              {cat.categoryNotes && (
                <div className="mb-4 p-3 bg-gray-50 border rounded-md text-sm text-gray-700">
                  <p className="font-medium mb-1">Category Tips:</p>
                  <p>{cat.categoryNotes}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cat.items.map((item, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start space-x-3 p-3 rounded-md transition-colors
                      ${checkedItems[`${cat.category}-${item.name}`] 
                        ? 'bg-gray-50' 
                        : item.essential 
                          ? 'bg-amber-50 border border-amber-100' 
                          : 'bg-white border'
                      }`}
                  >
                    <Checkbox 
                      id={`${cat.category}-${item.name}`}
                      checked={checkedItems[`${cat.category}-${item.name}`] || false}
                      onCheckedChange={() => handleItemCheck(cat.category, item.name)}
                    />
                    <div className="space-y-1 w-full">
                      <div className="flex justify-between items-start">
                        <Label 
                          htmlFor={`${cat.category}-${item.name}`}
                          className={`font-medium ${item.essential ? 'text-amber-800' : ''}`}
                        >
                          {item.name}
                          {item.essential && (
                            <span className="ml-2 text-xs text-amber-600 font-normal">Essential</span>
                          )}
                        </Label>
                      </div>
                      
                      {(item.weatherConsideration || item.packingTip) && (
                        <div className="text-xs mt-1 space-y-1">
                          {item.weatherConsideration && (
                            <div className="flex items-start">
                              <span className="text-blue-500 mr-1 font-medium">Weather:</span>
                              <p className="text-gray-600">{item.weatherConsideration}</p>
                            </div>
                          )}
                          {item.packingTip && (
                            <div className="flex items-start">
                              <span className="text-emerald-500 mr-1 font-medium">Tip:</span>
                              <p className="text-gray-600">{item.packingTip}</p>
                            </div>
                          )}
                        </div>
                      )}
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
