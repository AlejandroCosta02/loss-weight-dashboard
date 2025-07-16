"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';

interface ChartData {
  fecha: string;
  consumidas: number;
  quemadas: number;
  balance: number;
}

interface LineChartMultiMetricsProps {
  data: ChartData[];
  caloriesGoal: number;
}

export default function LineChartMultiMetrics({ data, caloriesGoal }: LineChartMultiMetricsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
    if (active && payload && payload.length) {
      const consumed = payload.find(p => p.dataKey === 'consumidas')?.value || 0;
      const burned = payload.find(p => p.dataKey === 'quemadas')?.value || 0;
      const net = consumed - caloriesGoal - burned;
      
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <div className="font-semibold text-foreground mb-2">{label}</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Consumidas:</span>
              <span className="font-medium text-orange-500">{consumed} cal</span>
            </div>
            <div className="flex justify-between">
              <span>Quemadas:</span>
              <span className="font-medium text-green-500">{burned} cal</span>
            </div>
            <div className="flex justify-between">
              <span>Meta diaria:</span>
              <span className="font-medium text-blue-500">{caloriesGoal} cal</span>
            </div>
            <div className="border-t pt-1 mt-1">
              <div className="flex justify-between font-semibold">
                <span>Balance:</span>
                <span className={net < 0 ? 'text-green-500' : 'text-red-500'}>
                  {net > 0 ? '+' : ''}{net} cal
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            
            {/* Goal line */}
            <ReferenceLine 
              y={caloriesGoal} 
              stroke="#3b82f6" 
              strokeDasharray="6 4" 
              strokeWidth={2}
              label={{
                value: `Meta diaria: ${caloriesGoal} cal`,
                position: 'top',
                fill: '#3b82f6',
                fontSize: 12,
                fontWeight: 600
              }}
            />
            
            <XAxis 
              dataKey="fecha" 
              tick={({ x, y, payload }) => {
                const text = payload.value;
                const lines = text.split('\n');
                return (
                  <g>
                    <text
                      x={x}
                      y={y}
                      dy={-8}
                      textAnchor="middle"
                      fontSize={12}
                      fontWeight={600}
                      fill="currentColor"
                    >
                      {lines[0]}
                    </text>
                    <text
                      x={x}
                      y={y}
                      dy={8}
                      textAnchor="middle"
                      fontSize={10}
                      fontWeight={400}
                      fill="currentColor"
                      opacity={0.7}
                    >
                      {lines[1]}
                    </text>
                  </g>
                );
              }}
            />
            
            <YAxis 
              tickFormatter={(value) => `${value} cal`}
              fontSize={12}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            {/* Consumed calories line */}
            <Line 
              type="monotone" 
              dataKey="consumidas" 
              stroke="#f97316" 
              strokeWidth={3}
              dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 2, fill: '#fff' }}
              name="Consumidas"
            />
            
            {/* Burned calories line */}
            <Line 
              type="monotone" 
              dataKey="quemadas" 
              stroke="#22c55e" 
              strokeWidth={3}
              dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2, fill: '#fff' }}
              name="Quemadas"
            />
            
            <Legend 
              verticalAlign="top" 
              height={36}
              wrapperStyle={{
                paddingBottom: '10px'
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-muted/30 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-bold text-orange-500">
            {data.reduce((sum, day) => sum + day.consumidas, 0)}
          </div>
          <div className="text-xs text-muted-foreground">Total Consumidas</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-green-500">
            {data.reduce((sum, day) => sum + day.quemadas, 0)}
          </div>
          <div className="text-xs text-muted-foreground">Total Quemadas</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-blue-500">
            {data.reduce((sum, day) => sum + day.balance, 0)}
          </div>
          <div className="text-xs text-muted-foreground">Balance Semanal</div>
        </div>
      </div>
    </div>
  );
} 