"use client";

import { useState, useEffect } from "react";

interface ChartData {
  fecha: string;
  consumidas: number;
  quemadas: number;
  balance: number;
}

interface ProgressRingChartProps {
  data: ChartData[];
  caloriesGoal: number;
}

export default function ProgressRingChart({ data, caloriesGoal }: ProgressRingChartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const selectedData = data[selectedDay] || data[data.length - 1];
  
  // Calculate percentages
  const consumedPercent = Math.min((selectedData.consumidas / caloriesGoal) * 100, 100);
  const burnedPercent = Math.min((selectedData.quemadas / 500) * 100, 100); // Assuming 500 cal exercise goal
  const netBalance = selectedData.consumidas - caloriesGoal - selectedData.quemadas;
  
  // Calculate ring parameters
  const radius = 80;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  
  const consumedStrokeDasharray = (consumedPercent / 100) * circumference;
  const burnedStrokeDasharray = (burnedPercent / 100) * circumference;

  return (
    <div className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Day selector */}
      <div className="flex justify-center gap-2 mb-6">
        {data.map((day, index) => {
          const [year, month, dayNum] = day.fecha.split('-').map(Number);
          const date = new Date(year, month - 1, dayNum);
          const dayOfWeek = date.toLocaleDateString('es-ES', { weekday: 'short' });
          const monthDay = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
          
          return (
            <button
              key={index}
              onClick={() => setSelectedDay(index)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedDay === index
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {dayOfWeek} {monthDay}
            </button>
          );
        })}
      </div>

      {/* Progress rings */}
      <div className="flex justify-center">
        <div className="relative">
          {/* Background rings */}
          <svg width="200" height="200" className="transform -rotate-90">
            {/* Consumed calories ring */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="hsl(var(--border))"
              strokeWidth={strokeWidth}
              fill="none"
              opacity={0.3}
            />
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="#f97316"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - consumedStrokeDasharray}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
            
            {/* Burned calories ring */}
            <circle
              cx="100"
              cy="100"
              r={radius - strokeWidth - 4}
              stroke="hsl(var(--border))"
              strokeWidth={strokeWidth}
              fill="none"
              opacity={0.3}
            />
            <circle
              cx="100"
              cy="100"
              r={radius - strokeWidth - 4}
              stroke="#22c55e"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - burnedStrokeDasharray}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {netBalance > 0 ? '+' : ''}{netBalance}
              </div>
              <div className="text-xs text-muted-foreground">cal netas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center">
          <div className="text-lg font-bold text-orange-500">
            {selectedData.consumidas}
          </div>
          <div className="text-xs text-muted-foreground">Consumidas</div>
          <div className="text-xs text-muted-foreground">
            {consumedPercent.toFixed(0)}% del objetivo
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-green-500">
            {selectedData.quemadas}
          </div>
          <div className="text-xs text-muted-foreground">Quemadas</div>
          <div className="text-xs text-muted-foreground">
            {burnedPercent.toFixed(0)}% del objetivo
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-blue-500">
            {caloriesGoal}
          </div>
          <div className="text-xs text-muted-foreground">Objetivo</div>
          <div className="text-xs text-muted-foreground">
            Calorías diarias
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center items-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span className="text-muted-foreground">Consumidas</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-muted-foreground">Quemadas</span>
        </div>
      </div>
    </div>
  );
} 