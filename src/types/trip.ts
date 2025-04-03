
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
  morning: Activity[];
  afternoon: Activity[];
  evening: Activity[];
}

export interface Activity {
  time: string;
  name: string;
  description: string;
  location: string;
  cost: number;
  weatherDependent: boolean;
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
}

export interface TransportOptions {
  flight?: TransportOption[];
  train?: TransportOption[];
  car?: TransportOption[];
  bus?: TransportOption[];
  publicTransit?: TransportOption[];
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
}

export interface BudgetBreakdown {
  totalBudget: number;
  totalSpent: number;
  categories: {
    name: string;
    amount: number;
    percentage: number;
  }[];
  contingencyAmount: number;
}

export interface PackingCategory {
  name: string;
  icon: ReactNode;
  items: {
    name: string;
    essential: boolean;
  }[];
}
