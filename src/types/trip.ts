import { ReactNode } from 'react';

export interface TripData {
  startLocation: string;
  destination: string;
  budget: number;
  tripStyle: string;
  startDate: Date;
  endDate: Date;
  travelers: number;
  preferences: string[];
  dietaryRestrictions?: string[];
  accessibility?: string[];
  transportation: string[];
}

export interface GeneratedItinerary {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  weatherSummary: string;
  dailyItinerary: DayItinerary[];
  accommodations: Accommodation[];
  transportOptions: TransportOptions;
  budgetBreakdown: BudgetBreakdown;
  packingList: PackingCategory[];
}

export interface DayItinerary {
  date: string;
  weather: string;
  activities: Activity[];
}

export interface Activity {
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
  mealSuggestion?: MealSuggestion;
}

export interface MealSuggestion {
  name: string;
  cuisine: string;
  dietaryOptions: string[];
  priceRange: string;
  specialties: string;
  walkingDistance?: string;
  bestTimeToBeat?: string;
}

export interface Accommodation {
  name: string;
  description: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  amenities: {
    name: string;
    icon: ReactNode;
  }[];
  nearbyAttractions?: string[];
  transportationOptions?: string[];
}

export interface TransportOptions {
  flight?: TransportOption[];
  train?: TransportOption[];
  car?: TransportOption[];
  bus?: TransportOption[];
  publicTransit?: TransportOption[];
  localTransportation?: LocalTransportation[];
}

export interface TransportOption {
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

export interface LocalTransportation {
  type: string;
  coverage: string;
  costPerTrip: number;
  dayPassOption: number;
  frequency: string;
  operatingHours: string;
  accessibility: string;
  tipsForTravelers: string;
}

export interface BudgetBreakdown {
  totalBudget: number;
  totalSpent: number;
  categories: BudgetCategory[];
  contingencyAmount: number;
  localCurrencyInfo?: LocalCurrencyInfo;
}

export interface BudgetCategory {
  name: string;
  amount: number;
  percentage: number;
  itemizedCosts?: ItemizedCost[];
  savingTips?: string;
}

export interface ItemizedCost {
  item: string;
  cost: number;
}

export interface LocalCurrencyInfo {
  currency: string;
  exchangeRate: string;
  paymentTips: string;
}

export interface PackingCategory {
  category: string;
  icon: ReactNode;
  items: PackingItem[];
  categoryNotes?: string;
}

export interface PackingItem {
  name: string;
  essential: boolean;
  weatherConsideration?: string | null;
  packingTip?: string;
}
