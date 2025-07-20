export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  weight: number;
  height: number;
  age: number;
  gender: string;
  activityLevel: string;
  dietType: string;
  preferences?: string;
  goal: string;
  theme?: string;
}

export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
}

export interface WaterEntry {
  id: string;
  date: string;
  amount: number; // in milliliters
}

export interface WorkoutEntry {
  id: string;
  date: string;
  duration: number; // in minutes
  activity: string;
  intensity: string;
  calories: number;
}

export interface MealEntry {
  id: string;
  date: string;
  time: string;
  type: string; // desayuno, almuerzo, cena, etc.
  calories: number;
  foods: FoodItem[];
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  gramsPerUnit?: number;
  unit?: string;
  amount: number;
} 