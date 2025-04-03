
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Define the form schema with Zod
const tripFormSchema = z.object({
  startLocation: z.string().min(2, { message: "Starting location is required" }),
  destination: z.string().min(2, { message: "Destination is required" }),
  budget: z.number().min(100, { message: "Budget must be at least $100" }).max(50000, { message: "Budget cannot exceed $50,000" }),
  tripStyle: z.enum(["luxury", "balanced", "budget"], { required_error: "Please select a trip style" }),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  travelers: z.number().min(1, { message: "At least 1 traveler is required" }).max(20, { message: "Cannot exceed 20 travelers" }),
  preferences: z.array(z.string()).refine((value) => value.length > 0, { message: "Select at least one preference" }),
  dietaryRestrictions: z.array(z.string()).optional(),
  accessibility: z.array(z.string()).optional(),
  transportation: z.array(z.string()).refine((value) => value.length > 0, { message: "Select at least one transportation method" }),
});

// Form types
type TripFormValues = z.infer<typeof tripFormSchema>;

// preference options
const preferenceOptions = [
  { id: "outdoorActivities", label: "Outdoor Activities" },
  { id: "culturalExperiences", label: "Cultural Experiences" },
  { id: "relaxation", label: "Relaxation" },
  { id: "adventure", label: "Adventure" },
  { id: "shopping", label: "Shopping" },
  { id: "nightlife", label: "Nightlife" },
  { id: "foodTours", label: "Food Tours" },
];

// dietary restrictions options
const dietaryOptions = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "glutenFree", label: "Gluten-Free" },
  { id: "dairyFree", label: "Dairy-Free" },
  { id: "nutAllergy", label: "Nut Allergy" },
  { id: "kosher", label: "Kosher" },
  { id: "halal", label: "Halal" },
];

// accessibility options
const accessibilityOptions = [
  { id: "wheelchairAccessible", label: "Wheelchair Accessible" },
  { id: "limitedMobility", label: "Limited Mobility" },
  { id: "hearingImpaired", label: "Hearing Impaired" },
  { id: "visuallyImpaired", label: "Visually Impaired" },
  { id: "noStairs", label: "No Stairs" },
];

// transportation options
const transportationOptions = [
  { id: "airplane", label: "Airplane" },
  { id: "train", label: "Train" },
  { id: "car", label: "Car" },
  { id: "bus", label: "Bus" },
  { id: "publicTransit", label: "Public Transit" },
  { id: "walking", label: "Walking" },
];

// Default form values
const defaultValues: Partial<TripFormValues> = {
  budget: 2000,
  tripStyle: "balanced",
  travelers: 2,
  preferences: [],
  dietaryRestrictions: [],
  accessibility: [],
  transportation: ["airplane"],
};

const TripForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Initialize react-hook-form
  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripFormSchema),
    defaultValues,
  });

  // On form submission
  const onSubmit = async (data: TripFormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real application, this would be sent to an API
      console.log("Form submission:", data);
      
      // Store in localStorage for now (as a placeholder for actual API integration)
      localStorage.setItem("tripData", JSON.stringify(data));
      
      // Show success toast
      toast({
        title: "Trip information submitted",
        description: "Generating your personalized itinerary...",
      });
      
      // Navigate to loading page, which will then redirect to the itinerary
      // In a real app, you would wait for the API response here
      setTimeout(() => {
        navigate("/generating-itinerary");
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission failed",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl text-travel-dark">Plan Your Perfect Trip</CardTitle>
        <CardDescription>Fill in the details below to generate your personalized travel itinerary.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Starting location */}
              <FormField
                control={form.control}
                name="startLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Starting Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., New York, NY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Destination */}
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Paris, France" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Budget */}
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Budget (USD)</FormLabel>
                    <div className="space-y-2">
                      <Slider
                        min={100}
                        max={10000}
                        step={100}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="py-4"
                      />
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">$100</span>
                        <span className="text-sm font-medium">${field.value}</span>
                        <span className="text-sm text-gray-500">$10,000+</span>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Trip Style */}
              <FormField
                control={form.control}
                name="tripStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trip Style</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select trip style" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="luxury">Luxury - Premium experiences</SelectItem>
                        <SelectItem value="balanced">Balanced - Mix of comfort and value</SelectItem>
                        <SelectItem value="budget">Budget - Cost-effective options</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Number of Travelers */}
              <FormField
                control={form.control}
                name="travelers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Travelers</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={20}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Travel Dates */}
              <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* End Date */}
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const startDate = form.watch("startDate");
                              return date < new Date() || (startDate && date < startDate);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Preferences */}
              <FormField
                control={form.control}
                name="preferences"
                render={() => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <div className="mb-4">
                      <FormLabel>Traveler Preferences</FormLabel>
                      <FormDescription>
                        Select the activities and experiences you're interested in.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {preferenceOptions.map((option) => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="preferences"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, option.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dietary Restrictions */}
              <FormField
                control={form.control}
                name="dietaryRestrictions"
                render={() => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <div className="mb-4">
                      <FormLabel>Dietary Restrictions (Optional)</FormLabel>
                      <FormDescription>
                        Select any dietary restrictions or preferences.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {dietaryOptions.map((option) => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="dietaryRestrictions"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, option.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                  </FormItem>
                )}
              />

              {/* Accessibility Requirements */}
              <FormField
                control={form.control}
                name="accessibility"
                render={() => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <div className="mb-4">
                      <FormLabel>Accessibility Requirements (Optional)</FormLabel>
                      <FormDescription>
                        Select any accessibility needs.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {accessibilityOptions.map((option) => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="accessibility"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, option.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                  </FormItem>
                )}
              />

              {/* Transportation Preferences */}
              <FormField
                control={form.control}
                name="transportation"
                render={() => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <div className="mb-4">
                      <FormLabel>Transportation Preferences</FormLabel>
                      <FormDescription>
                        Select your preferred methods of transportation.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {transportationOptions.map((option) => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="transportation"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, option.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <CardFooter className="flex justify-end px-0 pt-4">
              <Button 
                type="submit" 
                className="bg-travel-primary hover:bg-travel-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Itinerary"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TripForm;
