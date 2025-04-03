import { TripData, GeneratedItinerary, DayItinerary } from '@/types/trip';
import { getEnvVariable } from '@/utils/env';

export const generateItinerary = async (tripData: TripData): Promise<GeneratedItinerary> => {
  console.log('Generating itinerary based on:', JSON.stringify(tripData, null, 2));
  
  // Get the API key from environment variable
  const geminiApiKey = 'AIzaSyAH8E1coLcuG43ZnCKfILipJgA5Fj5uewI';
  
  if (!geminiApiKey) {
    console.error('Gemini API key is missing');
    throw new Error('API key is required for Gemini model access');
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

IMPORTANT: Respond with a valid JSON object that follows this exact structure:

{
  "destination": "${tripData.destination}",
  "startDate": "${tripData.startDate.toLocaleDateString()}",
  "endDate": "${tripData.endDate.toLocaleDateString()}",
  "travelers": ${tripData.travelers},
  "weatherSummary": "Brief weather summary for the trip",
  "dailyItinerary": [
    {
      "date": "Day 1 - ${tripData.startDate.toLocaleDateString()}",
      "weather": "Weather forecast for this day",
      "morning": [
        {
          "time": "8:00 AM - 10:00 AM",
          "name": "Activity name",
          "description": "Detailed description",
          "location": "Location name",
          "cost": 25,
          "weatherDependent": true
        }
      ],
      "afternoon": [
        {
          "time": "12:00 PM - 2:00 PM",
          "name": "Activity name",
          "description": "Detailed description",
          "location": "Location name",
          "cost": 30,
          "weatherDependent": false
        }
      ],
      "evening": [
        {
          "time": "7:00 PM - 9:00 PM",
          "name": "Activity name",
          "description": "Detailed description",
          "location": "Location name",
          "cost": 45,
          "weatherDependent": false
        }
      ]
    }
  ],
  "accommodations": [
    {
      "name": "Hotel name",
      "description": "Description of hotel",
      "location": "Address",
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
      ]
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
        "departureLocation": "Origin airport",
        "arrivalLocation": "Destination airport",
        "details": "Flight details"
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
        "percentage": 50
      },
      {
        "name": "Food",
        "amount": 300,
        "percentage": 30
      },
      {
        "name": "Activities",
        "amount": 200,
        "percentage": 20
      }
    ],
    "contingencyAmount": 100
  },
  "packingList": [
    {
      "category": "Clothing",
      "items": ["T-shirts", "Pants", "Underwear", "Socks"]
    },
    {
      "category": "Toiletries",
      "items": ["Toothbrush", "Toothpaste", "Shampoo"]
    }
  ]
}

The JSON must be valid. Include realistic data for ${tripData.destination} with appropriate costs, activities, and accommodations for a ${tripData.budget} budget. Create daily activities for all ${daysCount} days of the trip.
`;
};

// Parse the LLM response to our expected itinerary format
const parseResponseToItinerary = (response: any, tripData: TripData): GeneratedItinerary => {
  try {
    console.log('Parsing LLM response...');
    
    // Extract the text content from the response
    let textContent = '';
    
    if (typeof response === 'string') {
      textContent = response;
    } else if (Array.isArray(response)) {
      textContent = response[0]?.text || JSON.stringify(response);
    } else if (response && typeof response.text === 'string') {
      textContent = response.text;
    } else {
      textContent = JSON.stringify(response);
    }
    
    console.log('Extracted text content length:', textContent.length);
    console.log('Sample of content:', textContent.substring(0, 300) + '...');
    
    // Different regex patterns to try
    const patterns = [
      /```json\s*([\s\S]*?)\s*```/,   // JSON in code block with json tag
      /```\s*([\s\S]*?)\s*```/,       // JSON in code block without tag
      /(\{[\s\S]*\})/,                // Find content between curly braces
    ];
    
    let jsonText = '';
    let foundMatch = false;
    
    // Try each pattern until we find a match
    for (const pattern of patterns) {
      const match = textContent.match(pattern);
      if (match && match[1]) {
        jsonText = match[1].trim();
        console.log(`Found match with pattern: ${pattern}`);
        foundMatch = true;
        break;
      }
    }
    
    // If no pattern matched, use the entire text
    if (!foundMatch) {
      console.log('No regex pattern matched, using entire text');
      jsonText = textContent.trim();
    }
    
    // Clean up common issues
    jsonText = jsonText
      .replace(/\\"/g, '"')  // Replace escaped quotes
      .replace(/\\n/g, ' ')  // Replace newlines
      .replace(/\\t/g, ' ')  // Replace tabs
      .replace(/\s*"\s*:\s*"/g, '":"')  // Fix spacing in key-value pairs
      .replace(/\s*"\s*:\s*\{/g, '":{')
      .replace(/\s*"\s*:\s*\[/g, '":[')
      .replace(/\s*"\s*:\s*([0-9])/g, '":$1');
      
    // Attempt to fix common JSON syntax issues
    if (!jsonText.startsWith('{')) {
      console.log('Adding starting brace');
      jsonText = '{' + jsonText;
    }
    if (!jsonText.endsWith('}')) {
      console.log('Adding ending brace');
      jsonText = jsonText + '}';
    }
    
    console.log('Cleaned JSON text:', jsonText.substring(0, 300) + '...');
    
    // Try to parse the JSON
    let parsedData: any = {};
    try {
      parsedData = JSON.parse(jsonText);
      console.log('Successfully parsed JSON');
    } catch (parseError) {
      console.error('Failed to parse JSON, error:', parseError);
      
      // If parsing fails, attempt more aggressive cleaning
      try {
        console.log('Attempting to fix malformed JSON');
        // Sometimes the model adds extra text after the JSON
        const fixedJson = jsonText.replace(/\}\s*[\s\S]*$/, '}');
        parsedData = JSON.parse(fixedJson);
        console.log('Successfully parsed JSON after fixing');
      } catch (secondError) {
        console.error('All parsing attempts failed.');
        console.error('JSON text that failed parsing:', jsonText);
        
        // Instead of throwing, proceed with an empty object
        parsedData = {};
        console.log('Proceeding with empty data object');
      }
    }
    
    // Create a minimal daily itinerary if none exists
    const startDate = new Date(tripData.startDate);
    const endDate = new Date(tripData.endDate);
    const dayCount = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;
    
    const defaultDailyItinerary: DayItinerary[] = [];
    for (let i = 0; i < dayCount; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      defaultDailyItinerary.push({
        date: `Day ${i + 1} - ${currentDate.toLocaleDateString()}`,
        weather: "Data not available",
        morning: [{
          time: "Morning",
          name: "Data not available",
          description: "Data could not be generated. Please try again later.",
          location: "N/A",
          cost: 0,
          weatherDependent: false
        }],
        afternoon: [{
          time: "Afternoon",
          name: "Data not available",
          description: "Data could not be generated. Please try again later.",
          location: "N/A",
          cost: 0,
          weatherDependent: false
        }],
        evening: [{
          time: "Evening",
          name: "Data not available",
          description: "Data could not be generated. Please try again later.",
          location: "N/A",
          cost: 0,
          weatherDependent: false
        }]
      });
    }
    
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
          morning: day.morning?.length ? ensureActivitiesFormat(day.morning) : [{
            time: "Morning",
            name: "Data not available",
            description: "Activity details could not be generated",
            location: "N/A",
            cost: 0,
            weatherDependent: false
          }],
          afternoon: day.afternoon?.length ? ensureActivitiesFormat(day.afternoon) : [{
            time: "Afternoon",
            name: "Data not available",
            description: "Activity details could not be generated",
            location: "N/A",
            cost: 0,
            weatherDependent: false
          }],
          evening: day.evening?.length ? ensureActivitiesFormat(day.evening) : [{
            time: "Evening",
            name: "Data not available",
            description: "Activity details could not be generated",
            location: "N/A",
            cost: 0,
            weatherDependent: false
          }]
        })) : 
        defaultDailyItinerary,
      
      // Accommodations with appropriate fallbacks
      accommodations: parsedData.accommodations?.length ? 
        parsedData.accommodations.map((acc: any) => ({
          name: acc.name || "Accommodation data not available",
          description: acc.description || "Description not available",
          location: acc.location || "Location not specified",
          price: acc.price || 0,
          rating: acc.rating || 0,
          image: acc.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945",
          amenities: (acc.amenities || []).map((amenity: any) => ({
            name: typeof amenity === 'string' ? amenity : (amenity.name || "Amenity"),
            icon: null // Will be processed later
          }))
        })) : 
        [{
          name: "Accommodation data not available",
          description: "Accommodation details could not be generated",
          location: tripData.destination,
          price: 0,
          rating: 0,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
          amenities: [{ name: "Data not available", icon: null }]
        }],
      
      // Transport options with fallbacks
      transportOptions: parsedData.transportOptions || {
        flight: [],
        train: [],
        car: [],
        bus: [],
        publicTransit: []
      },
      
      // Budget breakdown with fallbacks
      budgetBreakdown: parsedData.budgetBreakdown || {
        totalBudget: tripData.budget,
        totalSpent: 0,
        categories: [
          { name: "Accommodation", amount: 0, percentage: 0 },
          { name: "Food", amount: 0, percentage: 0 },
          { name: "Activities", amount: 0, percentage: 0 },
          { name: "Transportation", amount: 0, percentage: 0 },
          { name: "Data not available", amount: tripData.budget, percentage: 100 }
        ],
        contingencyAmount: 0
      },
      
      // Packing list with fallbacks
      packingList: parsedData.packingList?.length ? 
        parsedData.packingList.map((category: any) => ({
          category: category.category || "Packing category",
          items: category.items || ["Data not available"],
          icon: null // Will be processed later
        })) : 
        [
          { category: "Essentials", items: ["Data not available"], icon: null },
          { category: "Clothing", items: ["Data not available"], icon: null },
          { category: "Other", items: ["Packing list data could not be generated"], icon: null }
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
        weather: "Data not available",
        morning: [{
          time: "Morning",
          name: "Error occurred",
          description: "There was an error generating this data. Please try again later.",
          location: "N/A",
          cost: 0,
          weatherDependent: false
        }],
        afternoon: [{
          time: "Afternoon",
          name: "Error occurred",
          description: "There was an error generating this data. Please try again later.",
          location: "N/A",
          cost: 0,
          weatherDependent: false
        }],
        evening: [{
          time: "Evening",
          name: "Error occurred",
          description: "There was an error generating this data. Please try again later.",
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
        publicTransit: []
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
        { category: "Error", items: ["There was an error generating packing list data"], icon: null }
      ]
    };
  }
};

// Helper function to ensure activities have the correct format
const ensureActivitiesFormat = (activities: any[]): any[] => {
  if (!activities || !Array.isArray(activities) || activities.length === 0) {
    return [{
      time: "Time not specified",
      name: "Data not available",
      description: "Activity details could not be generated",
      location: "N/A",
      cost: 0,
      weatherDependent: false
    }];
  }
  
  return activities.map(activity => {
    // Ensure activity is an object
    if (!activity || typeof activity !== 'object') {
      return {
        time: "Time not specified",
        name: "Invalid activity data",
        description: "Activity details could not be generated",
        location: "N/A",
        cost: 0,
        weatherDependent: false
      };
    }
    
    return {
      time: activity.time ?? "Time not specified",
      name: activity.name ?? "Activity name not available",
      description: activity.description ?? "No description available",
      location: activity.location ?? "Location not specified",
      cost: typeof activity.cost === 'number' ? activity.cost : 0,
      weatherDependent: typeof activity.weatherDependent === 'boolean' ? activity.weatherDependent : false
    };
  });
};

export type { GeneratedItinerary, TripData };

