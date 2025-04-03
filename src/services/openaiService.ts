import { TripData, GeneratedItinerary, DayItinerary } from '@/types/trip';
import { getEnvVariable } from '@/utils/env';

export const generateItinerary = async (tripData: TripData): Promise<GeneratedItinerary> => {
  console.log('Generating itinerary based on:', JSON.stringify(tripData, null, 2));
  
  // Get the API key from environment variable
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  
  if (!geminiApiKey) {
    console.error('Gemini API key is missing');
    throw new Error('API key is required for Gemini model access. Please check your environment variables.');
  }

  // Create a structured prompt for the Gemini model
  const prompt = createGeminiPrompt(tripData);
  console.log('Sending prompt to Gemini API...');
  
  try {
    // Call the Gemini API - updated to store the raw response for debugging
    let rawResponseText = '';
    
    // Call the Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        }),
      }
    );

    console.log('Response status:', response.status);
    
    // Store the raw response text for debugging
    rawResponseText = await response.text();
    console.log('Raw response text:', rawResponseText);
    
    if (!response.ok) {
      console.error('Gemini API error response:', rawResponseText);
      
      if (response.status === 401) {
        throw new Error(`Invalid API key. Please check your Gemini API key and try again. Raw response: ${rawResponseText}`);
      } else if (response.status === 429) {
        throw new Error(`Rate limit exceeded. Please try again later. Raw response: ${rawResponseText}`);
      } else {
        throw new Error(`API error (${response.status}): ${response.statusText}. Raw response: ${rawResponseText}`);
      }
    }

    // Parse the raw response text to JSON
    let responseData;
    try {
      responseData = JSON.parse(rawResponseText);
      console.log('Gemini API parsed response:', JSON.stringify(responseData, null, 2));
    } catch (parseError) {
      console.error('Failed to parse API response as JSON:', parseError);
      throw new Error(`Failed to parse API response: ${rawResponseText}`);
    }
    
    // Extract the text content from the Gemini response format
    let generatedText = '';
    
    if (responseData.candidates && responseData.candidates.length > 0 && 
        responseData.candidates[0].content && 
        responseData.candidates[0].content.parts && 
        responseData.candidates[0].content.parts.length > 0) {
      generatedText = responseData.candidates[0].content.parts[0].text || '';
    } else {
      throw new Error(`Unexpected response format from Gemini API. Raw response: ${rawResponseText}`);
    }
    
    if (!generatedText) {
      throw new Error(`Received empty text from Gemini API. Raw response: ${rawResponseText}`);
    }
    
    console.log('Extracted generated text:', generatedText);
    
    // Process the response into our required format
    const processedItinerary = parseResponseToItinerary(generatedText, tripData);
    console.log('Successfully processed itinerary:', JSON.stringify(processedItinerary, null, 2));
    
    return processedItinerary;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Append the raw API response to the error if available
    throw error;
  }
};

// Create a structured prompt for the Gemini model 
const createGeminiPrompt = (tripData: TripData): string => {
  const daysCount = Math.round((tripData.endDate.getTime() - tripData.startDate.getTime()) / (1000 * 3600 * 24)) + 1;
  
  return `
You are an expert travel planner. I need a detailed travel itinerary in JSON format for the following trip:

Destination: ${tripData.destination}
Dates: ${tripData.startDate.toLocaleDateString()} to ${tripData.endDate.toLocaleDateString()} (${daysCount} days)
Travelers: ${tripData.travelers} people
Budget: $${tripData.budget}
Trip Style: ${tripData.tripStyle}
Preferences: ${tripData.preferences.join(', ')}
${tripData.dietaryRestrictions ? `Dietary Restrictions: ${tripData.dietaryRestrictions.join(', ')}` : ''}
${tripData.accessibility ? `Accessibility Needs: ${tripData.accessibility.join(', ')}` : ''}
Transportation: ${tripData.transportation.join(', ')}

IMPORTANT PLANNING STRATEGY:
1. First, identify the key attractions and points of interest in ${tripData.destination}, prioritizing based on:
   - Popularity and significance
   - Alignment with traveler preferences
   - Variety of experiences

2. For each attraction, determine:
   - Average visit duration
   - Best time of day to visit
   - Proximity to other attractions
   - Required travel time between locations

3. Create a logical daily plan by:
   - Grouping nearby attractions to minimize travel time
   - Balancing must-see major attractions with lesser-known experiences
   - Considering opening hours and peak/off-peak times
   - Allocating appropriate time for each attraction based on its size and significance
   - Including strategic meal breaks at optimal times with local food recommendations

4. Instead of rigidly dividing each day into morning/afternoon/evening:
   - Create a dynamic, flowing schedule that respects the natural timing each activity requires
   - Space activities to avoid rushing while maintaining an engaging pace
   - Include buffer time for spontaneous exploration and rest
   - Balance busy days with more relaxed ones

5. Ensure each day's plan is:
   - Geographically logical to minimize unnecessary travel
   - Varied in terms of activities (mix of cultural, historical, natural, etc.)
   - Realistic in terms of timing and energy levels
   - Adaptable to weather conditions where relevant

6. Ensure accommodations are conveniently located near planned activities
7. Provide detailed transportation options between locations
8. Create a realistic budget breakdown based on actual costs
9. Craft a comprehensive packing list tailored to the destination's climate, planned activities, and trip duration

IMPORTANT: Respond with a valid JSON object that follows this exact structure:

{
  "destination": "${tripData.destination}",
  "startDate": "${tripData.startDate.toLocaleDateString()}",
  "endDate": "${tripData.endDate.toLocaleDateString()}",
  "travelers": ${tripData.travelers},
  "weatherSummary": "Comprehensive weather summary for the trip period, including temperature ranges, precipitation forecasts, and seasonal considerations",
  "dailyItinerary": [
    {
      "date": "Day 1 - ${tripData.startDate.toLocaleDateString()}",
      "weather": "Detailed weather forecast for this specific day",
      "activities": [
        {
          "time": "8:00 AM - 10:30 AM",
          "name": "Activity name",
          "description": "Detailed description including historical/cultural significance, what to expect, and insider tips",
          "location": "Precise location with neighborhood or area",
          "cost": 25,
          "duration": "2.5 hours",
          "popularityScore": 9.2,
          "category": "Museum",
          "weatherDependent": true,
          "bestTimeToVisit": "Early morning to avoid crowds",
          "tips": "Don't miss the special exhibit on the third floor",
          "mealSuggestion": {
            "name": "Local restaurant or meal suggestion",
            "cuisine": "Type of cuisine",
            "dietaryOptions": ["Vegetarian", "Gluten-free"],
            "priceRange": "$$",
            "specialties": "Signature dishes to try",
            "walkingDistance": "5 minutes from the attraction"
          }
        },
        {
          "time": "11:00 AM - 12:30 PM",
          "name": "Another activity",
          "description": "Detailed description",
          "location": "Precise location",
          "cost": 15,
          "duration": "1.5 hours",
          "popularityScore": 8.5,
          "category": "Historical Site",
          "weatherDependent": false,
          "bestTimeToVisit": "Midday for best lighting",
          "tips": "The guided tour is worth the extra cost"
        },
        {
          "time": "12:30 PM - 2:00 PM",
          "name": "Lunch break",
          "description": "Relaxing lunch at a popular local spot",
          "location": "Restaurant location",
          "cost": 25,
          "duration": "1.5 hours",
          "category": "Dining",
          "mealSuggestion": {
            "name": "Restaurant name",
            "cuisine": "Local cuisine",
            "dietaryOptions": ["Vegetarian", "Gluten-free"],
            "priceRange": "$$",
            "specialties": "Signature dishes",
            "bestTimeToBeat": "Before 12:30 PM to avoid the lunch rush"
          }
        }
      ]
    }
  ],
  "accommodations": [
    {
      "name": "Hotel name",
      "description": "Comprehensive description of hotel, including why it was selected for this trip",
      "location": "Address with proximity to key attractions",
      "price": 150,
      "rating": 4.5,
      "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      "amenities": [
        {
          "name": "Free WiFi"
        },
        {
          "name": "Breakfast included"
        }
      ],
      "nearbyAttractions": ["Attraction 1", "Attraction 2"],
      "transportationOptions": ["5-minute walk to metro station", "Bus stop outside hotel"]
    }
  ],
  "transportOptions": {
    "flight": [
      {
        "type": "flight",
        "provider": "Airline name",
        "departureTime": "10:00 AM",
        "arrivalTime": "12:00 PM",
        "duration": "2 hours",
        "price": 300,
        "departureLocation": "Origin airport with terminal information",
        "arrivalLocation": "Destination airport with terminal information",
        "details": "Comprehensive flight details including baggage allowance, in-flight amenities, and transfer information",
        "recommendedBookingTime": "2-3 months in advance for best rates"
      }
    ],
    "localTransportation": [
      {
        "type": "metro",
        "coverage": "Areas covered by this transportation option",
        "costPerTrip": 2.50,
        "dayPassOption": 10.00,
        "frequency": "Every 5-10 minutes",
        "operatingHours": "5:00 AM - 12:00 AM",
        "accessibility": "Wheelchair accessible at most stations",
        "tipsForTravelers": "Purchase a multi-day pass to save money"
      }
    ],
    "train": [],
    "car": [],
    "bus": [],
    "publicTransit": []
  },
  "budgetBreakdown": {
    "totalBudget": ${tripData.budget},
    "totalSpent": 0,
    "categories": [
      {
        "name": "Accommodation",
        "amount": 500,
        "percentage": 50,
        "itemizedCosts": [
          {"item": "Hotel for 5 nights", "cost": 400},
          {"item": "Airport hotel 1 night", "cost": 100}
        ],
        "savingTips": "Book in advance for 15% discount"
      },
      {
        "name": "Food",
        "amount": 300,
        "percentage": 30,
        "itemizedCosts": [
          {"item": "Breakfast (included in hotel)", "cost": 0},
          {"item": "Lunch (avg $15/person/day)", "cost": 150},
          {"item": "Dinner (avg $25/person/day)", "cost": 150}
        ],
        "savingTips": "Lunch specials offer best value"
      },
      {
        "name": "Activities",
        "amount": 200,
        "percentage": 20,
        "itemizedCosts": [
          {"item": "Museum passes", "cost": 80},
          {"item": "Guided tour", "cost": 120}
        ],
        "savingTips": "City Pass offers 20% discount on major attractions"
      }
    ],
    "contingencyAmount": 100,
    "localCurrencyInfo": {
      "currency": "Euro",
      "exchangeRate": "1 USD = 0.92 EUR",
      "paymentTips": "Credit cards widely accepted, but carry some cash for small vendors"
    }
  },
  "packingList": [
    {
      "category": "Clothing",
      "items": [
        {
          "name": "T-shirts (5)",
          "essential": true,
          "weatherConsideration": "Lightweight, breathable fabric for warm weather",
          "packingTip": "Roll instead of fold to save space"
        },
        {
          "name": "Pants (2)",
          "essential": true,
          "weatherConsideration": "One lightweight, one warmer for evenings",
          "packingTip": "Wear the heavier pair during travel to save luggage space"
        }
      ],
      "categoryNotes": "Choose moisture-wicking, quick-dry items that can be layered"
    },
    {
      "category": "Electronics",
      "items": [
        {
          "name": "Universal power adapter",
          "essential": true,
          "weatherConsideration": null,
          "packingTip": "Check voltage compatibility with your devices"
        }
      ],
      "categoryNotes": "Keep in carry-on luggage, not checked bags"
    }
  ]
}

The JSON must be valid. Include realistic, detailed, and accurate data for ${tripData.destination} with appropriate costs, activities, and accommodations for a ${tripData.budget} budget. Create daily activities for all ${daysCount} days of the trip. Prioritize attractions based on popularity and relevance, and organize days efficiently to minimize travel time. Structure each day with a dynamic schedule based on the natural duration and optimal timing for each activity. Include specific local food recommendations that respect any dietary restrictions.
`;
};

// Parse the LLM response to our expected itinerary format
const parseResponseToItinerary = (response: any, tripData: TripData): GeneratedItinerary => {
  try {
    // Find JSON content in the response
    let jsonContent = response;
    
    // Try to extract JSON if it's embedded in text
    if (typeof response === 'string') {
      const jsonRegex = /{[\s\S]*}/;
      const match = response.match(jsonRegex);
      
      if (match && match[0]) {
        jsonContent = match[0];
      }
    }
    
    // Parse the JSON content
    let parsedData;
    try {
      parsedData = typeof jsonContent === 'string' ? JSON.parse(jsonContent) : jsonContent;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      throw new Error('Failed to parse itinerary data from API response');
    }
    
    // Create default activities for fallback
    const defaultActivity = {
      time: "Not specified",
      name: "Activity data not available",
      description: "No details available",
      location: "Location not specified",
      cost: 0,
      duration: "Not specified",
      category: "Activity",
      weatherDependent: false,
      mealSuggestion: null
    };
    
    // Ensure activities have the correct format
    const ensureActivitiesFormat = (activities: any[]): any[] => {
      return activities.map(activity => ({
        time: activity.time || "Time not specified",
        name: activity.name || "Activity name not available",
        description: activity.description || "No description available",
        location: activity.location || "Location not specified",
        cost: typeof activity.cost === 'number' ? activity.cost : 0,
        duration: activity.duration || null,
        popularityScore: typeof activity.popularityScore === 'number' ? activity.popularityScore : null,
        category: activity.category || null,
        weatherDependent: Boolean(activity.weatherDependent),
        bestTimeToVisit: activity.bestTimeToVisit || null,
        tips: activity.tips || null,
        mealSuggestion: activity.mealSuggestion ? {
          name: activity.mealSuggestion.name || "Restaurant not specified",
          cuisine: activity.mealSuggestion.cuisine || "Cuisine not specified",
          dietaryOptions: Array.isArray(activity.mealSuggestion.dietaryOptions) ? 
            activity.mealSuggestion.dietaryOptions : [],
          priceRange: activity.mealSuggestion.priceRange || "$$",
          specialties: activity.mealSuggestion.specialties || "Not specified",
          walkingDistance: activity.mealSuggestion.walkingDistance || null,
          bestTimeToBeat: activity.mealSuggestion.bestTimeToBeat || null
        } : null
      }));
    };
    
    // Create default daily itinerary if needed
    const startDate = new Date(tripData.startDate);
    const endDate = new Date(tripData.endDate);
    const dayCount = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;
    
    const defaultDailyItinerary: DayItinerary[] = [];
    
    for (let i = 0; i < dayCount; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      defaultDailyItinerary.push({
        date: `Day ${i + 1} - ${currentDate.toLocaleDateString()}`,
        weather: "Weather data not available",
        activities: [defaultActivity]
      });
    }
    
    // Process accommodations to ensure they have the right structure
    const processAccommodations = (accommodations: any[]): any[] => {
      return accommodations.map(acc => ({
        name: acc.name || "Accommodation data not available",
        description: acc.description || "Description not available",
        location: acc.location || "Location not specified",
        price: typeof acc.price === 'number' ? acc.price : 0,
        rating: typeof acc.rating === 'number' ? acc.rating : 0,
        image: acc.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        amenities: (acc.amenities || []).map((amenity: any) => ({
          name: typeof amenity === 'string' ? amenity : (amenity.name || "Amenity"),
          icon: null // Will be processed later
        })),
        nearbyAttractions: Array.isArray(acc.nearbyAttractions) ? acc.nearbyAttractions : [],
        transportationOptions: Array.isArray(acc.transportationOptions) ? acc.transportationOptions : []
      }));
    };
    
    // Process budget categories to ensure they have the right structure
    const processBudgetCategories = (categories: any[]): any[] => {
      return categories.map(category => ({
        name: category.name || "Budget category",
        amount: typeof category.amount === 'number' ? category.amount : 0,
        percentage: typeof category.percentage === 'number' ? category.percentage : 0,
        itemizedCosts: Array.isArray(category.itemizedCosts) ? category.itemizedCosts.map((item: any) => ({
          item: item.item || "Item not specified",
          cost: typeof item.cost === 'number' ? item.cost : 0
        })) : undefined,
        savingTips: category.savingTips || undefined
      }));
    };
    
    // Process packing list to ensure it has the right structure
    const processPackingList = (packingList: any[]): any[] => {
      return packingList.map(category => {
        // Process items based on whether they're simple strings or complex objects
        const processedItems = Array.isArray(category.items) ? category.items.map((item: any) => {
          if (typeof item === 'string') {
            // Convert simple string items to the new format
            return {
              name: item,
              essential: false,
              weatherConsideration: null,
              packingTip: null
            };
          } else {
            // Process complex object items
            return {
              name: item.name || "Item not specified",
              essential: Boolean(item.essential),
              weatherConsideration: item.weatherConsideration || null,
              packingTip: item.packingTip || null
            };
          }
        }) : [{ name: "Data not available", essential: false, weatherConsideration: null, packingTip: null }];
        
        return {
          category: category.category || category.name || "Packing category",
          items: processedItems,
          icon: null, // Will be processed later
          categoryNotes: category.categoryNotes || null
        };
      });
    };
    
    // Handle local transportation
    const processLocalTransportation = (localTransport: any[]): any[] => {
      if (!Array.isArray(localTransport)) return [];
      
      return localTransport.map(transport => ({
        type: transport.type || "Not specified",
        coverage: transport.coverage || "Not specified",
        costPerTrip: typeof transport.costPerTrip === 'number' ? transport.costPerTrip : 0,
        dayPassOption: typeof transport.dayPassOption === 'number' ? transport.dayPassOption : 0,
        frequency: transport.frequency || "Not specified",
        operatingHours: transport.operatingHours || "Not specified",
        accessibility: transport.accessibility || "Not specified",
        tipsForTravelers: transport.tipsForTravelers || "Not specified"
      }));
    };
    
    // Build the itinerary object with fallbacks for missing data
    const itinerary: GeneratedItinerary = {
      destination: parsedData.destination || tripData.destination,
      startDate: parsedData.startDate || tripData.startDate.toLocaleDateString(),
      endDate: parsedData.endDate || tripData.endDate.toLocaleDateString(),
      travelers: parsedData.travelers || tripData.travelers,
      weatherSummary: parsedData.weatherSummary || "Weather data not available",
      
      // Use either the parsed dailyItinerary or our default one
      dailyItinerary: parsedData.dailyItinerary?.length ? 
        parsedData.dailyItinerary.map((day: any) => ({
          date: day.date || "Date not specified",
          weather: day.weather || "Weather data not available",
          activities: day.activities?.length 
            ? ensureActivitiesFormat(day.activities)
            : // Fallback: Try to combine old morning/afternoon/evening format if available
              Array.isArray(day.morning) || Array.isArray(day.afternoon) || Array.isArray(day.evening)
              ? [
                  ...(Array.isArray(day.morning) ? ensureActivitiesFormat(day.morning) : []),
                  ...(Array.isArray(day.afternoon) ? ensureActivitiesFormat(day.afternoon) : []),
                  ...(Array.isArray(day.evening) ? ensureActivitiesFormat(day.evening) : [])
                ] 
              : [defaultActivity]
        })) : 
        defaultDailyItinerary,
      
      // Accommodations with appropriate fallbacks
      accommodations: parsedData.accommodations?.length ? 
        processAccommodations(parsedData.accommodations) : 
        [{
          name: "Accommodation data not available",
          description: "Accommodation details could not be generated",
          location: tripData.destination,
          price: 0,
          rating: 0,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
          amenities: [{ name: "Data not available", icon: null }],
          nearbyAttractions: [],
          transportationOptions: []
        }],
      
      // Transport options with fallbacks
      transportOptions: {
        flight: parsedData.transportOptions?.flight || [],
        train: parsedData.transportOptions?.train || [],
        car: parsedData.transportOptions?.car || [],
        bus: parsedData.transportOptions?.bus || [],
        publicTransit: parsedData.transportOptions?.publicTransit || [],
        localTransportation: parsedData.transportOptions?.localTransportation ? 
          processLocalTransportation(parsedData.transportOptions.localTransportation) : []
      },
      
      // Budget breakdown with fallbacks
      budgetBreakdown: {
        totalBudget: parsedData.budgetBreakdown?.totalBudget || tripData.budget,
        totalSpent: parsedData.budgetBreakdown?.totalSpent || 0,
        categories: parsedData.budgetBreakdown?.categories?.length ? 
          processBudgetCategories(parsedData.budgetBreakdown.categories) : 
          [
            { name: "Accommodation", amount: 0, percentage: 0 },
            { name: "Food", amount: 0, percentage: 0 },
            { name: "Activities", amount: 0, percentage: 0 },
            { name: "Transportation", amount: 0, percentage: 0 },
            { name: "Data not available", amount: tripData.budget, percentage: 100 }
          ],
        contingencyAmount: parsedData.budgetBreakdown?.contingencyAmount || 0,
        localCurrencyInfo: parsedData.budgetBreakdown?.localCurrencyInfo ? {
          currency: parsedData.budgetBreakdown.localCurrencyInfo.currency || "USD",
          exchangeRate: parsedData.budgetBreakdown.localCurrencyInfo.exchangeRate || "Not available",
          paymentTips: parsedData.budgetBreakdown.localCurrencyInfo.paymentTips || "Not available"
        } : undefined
      },
      
      // Packing list with fallbacks
      packingList: parsedData.packingList?.length ? 
        processPackingList(parsedData.packingList) : 
        [
          { category: "Essentials", items: [{ name: "Data not available", essential: false, weatherConsideration: null, packingTip: null }], icon: null },
          { category: "Clothing", items: [{ name: "Data not available", essential: false, weatherConsideration: null, packingTip: null }], icon: null },
          { category: "Other", items: [{ name: "Packing list data could not be generated", essential: false, weatherConsideration: null, packingTip: null }], icon: null }
        ]
    };
    
    return itinerary;
  } catch (error) {
    console.error('Error parsing response:', error);
    
    // Instead of throwing an error, return a minimal itinerary with "data not available" messages
    const startDate = new Date(tripData.startDate);
    const endDate = new Date(tripData.endDate);
    const dayCount = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;
    
    const defaultDailyItinerary: DayItinerary[] = [];
    
    for (let i = 0; i < dayCount; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      defaultDailyItinerary.push({
        date: `Day ${i + 1} - ${currentDate.toLocaleDateString()}`,
        weather: "Weather data not available",
        activities: [{
          time: "Not available",
          name: "Data not available",
          description: "Activity details could not be generated",
          location: "N/A",
          cost: 0,
          weatherDependent: false
        }]
      });
    }
    
    return {
      destination: tripData.destination,
      startDate: tripData.startDate.toLocaleDateString(),
      endDate: tripData.endDate.toLocaleDateString(),
      travelers: tripData.travelers,
      weatherSummary: "An error occurred while generating weather data",
      dailyItinerary: defaultDailyItinerary,
      accommodations: [{
        name: "Error generating accommodation data",
        description: "There was a problem generating accommodation details",
        location: tripData.destination,
        price: 0,
        rating: 0,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        amenities: [{ name: "Error", icon: null }]
      }],
      transportOptions: {
        flight: [],
        train: [],
        car: [],
        bus: [],
        publicTransit: [],
        localTransportation: []
      },
      budgetBreakdown: {
        totalBudget: tripData.budget,
        totalSpent: 0,
        categories: [
          { name: "Error", amount: tripData.budget, percentage: 100 }
        ],
        contingencyAmount: 0
      },
      packingList: [
        { category: "Error", items: [{ name: "There was an error generating packing list data", essential: false, weatherConsideration: null, packingTip: null }], icon: null }
      ]
    };
  }
};

export type { GeneratedItinerary, TripData };

