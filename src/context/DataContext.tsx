import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WeightEntry, WaterEntry, WorkoutEntry, MealEntry, UserProfile } from '../types/data';

interface DataContextType {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  weights: WeightEntry[];
  addWeight: (entry: WeightEntry) => void;
  water: WaterEntry[];
  addWater: (entry: WaterEntry) => void;
  workouts: WorkoutEntry[];
  addWorkout: (entry: WorkoutEntry) => void;
  meals: MealEntry[];
  addMeal: (entry: MealEntry) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [water, setWater] = useState<WaterEntry[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);
  const [meals, setMeals] = useState<MealEntry[]>([]);

  const addWeight = (entry: WeightEntry) => setWeights(prev => [entry, ...prev]);
  const addWater = (entry: WaterEntry) => setWater(prev => [entry, ...prev]);
  const addWorkout = (entry: WorkoutEntry) => setWorkouts(prev => [entry, ...prev]);
  const addMeal = (entry: MealEntry) => setMeals(prev => [entry, ...prev]);

  return (
    <DataContext.Provider value={{
      userProfile,
      setUserProfile,
      weights,
      addWeight,
      water,
      addWater,
      workouts,
      addWorkout,
      meals,
      addMeal,
    }}>
      {children}
    </DataContext.Provider>
  );
}; 