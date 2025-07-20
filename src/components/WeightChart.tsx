"use client";

import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Customized, ReferenceDot
} from 'recharts';
import { format, subDays, subMonths, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTheme } from "../context/ThemeContext";

interface WeightEntry {
  id: string;
  date: string;
  weight: number;
}

interface WeightChartProps {
  data: WeightEntry[];
  goalWeight: number;
  currentWeight: number;
}

type TimeFilter = '15d' | '1m' | '3m' | '6m' | 'all';

interface TrophySVGProps {
  x?: number;
  y?: number;
  [key: string]: unknown;
}

function TrophySVG(props: TrophySVGProps) {
  // Renderiza el SVG del trofeo centrado
  return (
    <g {...props}>
      <g transform="scale(0.065) translate(12,12)">
        <path fill="#FFD700" d="M497.679,53.348c-9.285-10.52-22.496-16.551-36.246-16.551h-47.01c-2.358-33.432-25.059-28.785-33.9-28.785
        c-9.33,0-124.522,0-124.522,0s-115.191,0-124.521,0c-8.842,0-31.547-4.646-33.904,28.785h-47.01
        c-13.748,0-26.959,6.033-36.246,16.551C3.064,66.1-1.793,84.503,0.594,105.255c0.442,9.219,5.098,56.574,54.09,90.256
        c24.898,17.117,48.828,25.844,70.598,30.285c4.771,1.031,9.598,1.957,14.545,2.68c0.068,0.076,0.135,0.154,0.205,0.229
        c101.859,107.191,89.42,45.18,89.42,143.435c0,38.092-52.771,25.762-52.771,55c0,29.236-41.129,5.174-37.322,39.863
        c2.332,21.264,65.318,37.205,116.644,37.205c51.322,0,114.312-15.942,116.644-37.205c3.805-34.689-37.326-10.627-37.326-39.863
        c0-29.238-52.768-16.908-52.768-55c0-98.256-12.44-36.244,89.42-143.435c0.14-0.149,0.27-0.307,0.41-0.457
        c25.365-3.285,54.457-11.779,84.938-32.736c48.988-33.682,53.644-81.037,54.086-90.256
        C513.794,84.503,508.935,66.098,497.679,53.348z M471.214,101.165l-0.184,0.992l0.025,1.353
        c-0.096,2.625-2.006,34.916-36.621,58.715c-9.467,6.51-18.627,11.444-27.535,15.276c-2.014,0.816-4.024,1.633-6.084,2.344
        c12.162-34.25,14.137-72.558,14.172-102.654h46.445c1.558,0,3.857,0.502,5.965,2.888C470.99,84.149,472.382,91.833,471.214,101.165
        z M227.514,204.143c-3.805,4.799-9.436,7.299-15.117,7.299c-4.198,0-8.424-1.363-11.967-4.174
        c-48.381-38.371-52.434-91.045-52.434-137.404c0-10.646,8.633-19.277,19.279-19.277c10.646,0,19.277,8.631,19.277,19.277
        c0,40.676,2.895,79.482,37.836,107.195C232.73,183.676,234.129,195.802,227.514,204.143z M77.566,162.225
        c-34.584-23.777-36.524-56.029-36.623-58.707l0.022-0.92l-0.18-1.434c-1.168-9.33,0.224-17.016,3.818-21.086
        c2.108-2.386,4.406-2.888,5.963-2.888h46.445c0.031,25.693,1.533,57.357,9.52,87.386c1.332,5.178,2.808,10.326,4.543,15.385
        C100.31,175.89,89.16,170.196,77.566,162.225z"/>
      </g>
    </g>
  );
}

export default function WeightChart({ data, goalWeight, currentWeight }: WeightChartProps) {
  const { theme } = useTheme();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  // Elimina el useState/useEffect de theme local
  // Forzar re-render cuando cambia el tema
  useEffect(() => {}, [theme]);

  // Filter data based on time filter
  const getFilteredData = () => {
    const now = startOfDay(new Date());
    let filterDate: Date;
    switch (timeFilter) {
      case '15d': filterDate = subDays(now, 15); break;
      case '1m': filterDate = subMonths(now, 1); break;
      case '3m': filterDate = subMonths(now, 3); break;
      case '6m': filterDate = subMonths(now, 6); break;
      case 'all': default: return data;
    }
    return data.filter(entry => new Date(entry.date) >= filterDate);
  };
  const filteredData = getFilteredData();
  // Sort data by date and format for chart
  const chartData = filteredData
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(entry => ({
      ...entry,
      formattedDate: format(new Date(entry.date), 'dd/MM', { locale: es }),
      fullDate: format(new Date(entry.date), 'EEEE, d \'de\' MMMM', { locale: es })
    }));
  // Calculate chart domain
  const weights = chartData.map(d => d.weight);
  const minWeight = weights.length > 0 ? Math.min(...weights, goalWeight) : goalWeight;
  const maxWeight = weights.length > 0 ? Math.max(...weights, goalWeight) : goalWeight;
  const padding = (maxWeight - minWeight) * 0.1;

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: unknown[] }) => {
    if (active && payload && Array.isArray(payload) && payload.length) {
      const first = payload[0];
      if (typeof first === 'object' && first !== null && 'payload' in first) {
        const dataPoint = (first as { payload: { date: string; weight: number } }).payload;
        return (
          <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
            <div className="font-semibold text-foreground">
              {format(new Date(dataPoint.date), "EEEE, d 'de' MMMM", { locale: undefined })}
            </div>
            <div className="text-primary font-bold text-lg">
              {dataPoint.weight} kg
            </div>
            {goalWeight > 0 && (
              <p className="text-muted-foreground text-sm mt-1">
                Diferencia con objetivo: {(dataPoint.weight - goalWeight).toFixed(1)} kg
              </p>
            )}
          </div>
        );
      }
    }
    return null;
  };

  // Custom trofeo en el objetivo (al final del eje X, siempre visible)
  interface TrophyMarkerProps {
    yAxisMap?: Record<string, { scale: (value: number) => number }>;
    width?: number;
    height?: number;
  }

  const TrophyMarker = (props: TrophyMarkerProps) => {
    const { yAxisMap, width, height } = props;
    if (!yAxisMap) return null;
    const yAxis = yAxisMap[Object.keys(yAxisMap)[0]];
    const y = yAxis.scale(goalWeight);
    // Si no hay width, fallback al centro
    const x = width ? Math.min(width - 32, width - 1) : 150;
    // Si y es NaN, fallback al centro vertical
    const yPos = isNaN(y) ? (height ? height / 2 : 60) : y;
    return <TrophySVG x={x} y={yPos} />;
  };

  // DEBUG: Log theme value at every render
  console.log('WeightChart theme:', theme);

  return (
    <div className="w-full">
      {/* Time Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {[
          { key: '15d', label: '15 días' },
          { key: '1m', label: '1 mes' },
          { key: '3m', label: '3 meses' },
          { key: '6m', label: '6 meses' },
          { key: 'all', label: 'Todo' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTimeFilter(key as TimeFilter)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              timeFilter === key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%" key={theme}>
          <LineChart data={chartData} margin={{ top: 20, right: 50, left: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            {/* Trofeo como ReferenceDot personalizado */}
            {chartData.length > 0 && (
              <ReferenceDot
                x={(() => {
                  // Fecha del último punto + 1 día
                  const last = chartData[chartData.length - 1];
                  const lastDate = new Date(last.date);
                  const nextDate = new Date(lastDate.getTime() + 24*60*60*1000);
                  return format(nextDate, 'dd/MM', { locale: es });
                })()}
                y={goalWeight}
                r={32}
                shape={<TrophySVG />}
              />
            )}
            {/* Línea de peso actual centrada */}
            {false && (
              <ReferenceLine
                y={currentWeight}
                stroke={theme === 'dark' ? '#fff' : '#111'}
                strokeDasharray="3 3"
                strokeWidth={2}
                label={{
                  value: `Actual: ${currentWeight} kg`,
                  position: 'center',
                  fill: theme === 'dark' ? '#fff' : '#111',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              />
            )}
            {/* Línea de objetivo */}
            <ReferenceLine
              y={goalWeight}
              stroke="#FFD700"
              strokeDasharray="6 4"
              strokeWidth={2}
              label={{
                value: `${goalWeight} kg`,
                position: 'right',
                fill: '#FFD700',
                fontSize: 13,
                fontWeight: 700
              }}
            />
            <XAxis 
              dataKey="formattedDate" 
              stroke="#3b82f6"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={({ x, y, payload }) => (
                <text
                  x={x}
                  y={y}
                  dy={16}
                  textAnchor="middle"
                  fontWeight={600}
                  fontSize={12}
                  fill="#3b82f6"
                >
                  {payload.value}
                </text>
              )}
            />
            <YAxis 
              stroke="#3b82f6"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[minWeight - padding, maxWeight + padding]}
              tickFormatter={(value) => Number(value).toFixed(1)}
              allowDecimals={true}
              tickCount={4}
              tick={({ x, y, payload }) => (
                <text
                  x={x}
                  y={y}
                  dy={4}
                  textAnchor="end"
                  fontWeight={600}
                  fontSize={12}
                  fill="#3b82f6"
                >
                  {payload.value}
                </text>
              )}
              label={({ viewBox }: { viewBox?: { y: number; height: number } }) => {
                const { y = 0, height = 0 } = viewBox || {};
                return (
                  <text
                    x={-40}
                    y={y + height / 2}
                    textAnchor="middle"
                    fontWeight={500}
                    fontSize={14}
                    fill="#3b82f6"
                    transform={`rotate(-90, -40, ${y + height / 2})`}
                  >
                    kg
                  </text>
                );
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="linear"
              dataKey="weight"
              stroke="#3b82f6"
              strokeWidth={3}
              connectNulls={true}
              dot={{
                fill: '#3b82f6',
                strokeWidth: 2,
                r: 4
              }}
              activeDot={{
                r: 6,
                fill: '#3b82f6',
                stroke: 'hsl(var(--background))',
                strokeWidth: 2
              }}
            />
            {/* Trofeo en el objetivo */}
            <Customized component={TrophyMarker} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Leyenda */}
      <div className="flex justify-center items-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="text-muted-foreground">Tu peso</span>
        </div>
        <div className="flex items-center gap-2" style={{ paddingLeft: 6 }}>
          {/* Trophy SVG icon for legend, fondo transparente */}
          <svg width="22" height="22" viewBox="0 0 56 56" style={{ display: 'block' }}>
            <g transform="scale(0.11) translate(12,12)">
              <path fill="#FFD700" d="M497.679,53.348c-9.285-10.52-22.496-16.551-36.246-16.551h-47.01c-2.358-33.432-25.059-28.785-33.9-28.785
        c-9.33,0-124.522,0-124.522,0s-115.191,0-124.521,0c-8.842,0-31.547-4.646-33.904,28.785h-47.01
        c-13.748,0-26.959,6.033-36.246,16.551C3.064,66.1-1.793,84.503,0.594,105.255c0.442,9.219,5.098,56.574,54.09,90.256
        c24.898,17.117,48.828,25.844,70.598,30.285c4.771,1.031,9.598,1.957,14.545,2.68c0.068,0.076,0.135,0.154,0.205,0.229
        c101.859,107.191,89.42,45.18,89.42,143.435c0,38.092-52.771,25.762-52.771,55c0,29.236-41.129,5.174-37.322,39.863
        c2.332,21.264,65.318,37.205,116.644,37.205c51.322,0,114.312-15.942,116.644-37.205c3.805-34.689-37.326-10.627-37.326-39.863
        c0-29.238-52.768-16.908-52.768-55c0-98.256-12.44-36.244,89.42-143.435c0.14-0.149,0.27-0.307,0.41-0.457
        c25.365-3.285,54.457-11.779,84.938-32.736c48.988-33.682,53.644-81.037,54.086-90.256
        C513.794,84.503,508.935,66.098,497.679,53.348z M471.214,101.165l-0.184,0.992l0.025,1.353
        c-0.096,2.625-2.006,34.916-36.621,58.715c-9.467,6.51-18.627,11.444-27.535,15.276c-2.014,0.816-4.024,1.633-6.084,2.344
        c12.162-34.25,14.137-72.558,14.172-102.654h46.445c1.558,0,3.857,0.502,5.965,2.888C470.99,84.149,472.382,91.833,471.214,101.165
        z M227.514,204.143c-3.805,4.799-9.436,7.299-15.117,7.299c-4.198,0-8.424-1.363-11.967-4.174
        c-48.381-38.371-52.434-91.045-52.434-137.404c0-10.646,8.633-19.277,19.279-19.277c10.646,0,19.277,8.631,19.277,19.277
        c0,40.676,2.895,79.482,37.836,107.195C232.73,183.676,234.129,195.802,227.514,204.143z M77.566,162.225
        c-34.584-23.777-36.524-56.029-36.623-58.707l0.022-0.92l-0.18-1.434c-1.168-9.33,0.224-17.016,3.818-21.086
        c2.108-2.386,4.406-2.888,5.963-2.888h46.445c0.031,25.693,1.533,57.357,9.52,87.386c1.332,5.178,2.808,10.326,4.543,15.385
        C100.31,175.89,89.16,170.196,77.566,162.225z"/>
            </g>
          </svg>
          <span className="text-muted-foreground">Objetivo</span>
        </div>
        {currentWeight > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-secondary rounded-full"></div>
            <span className="text-muted-foreground">Peso actual</span>
          </div>
        )}
      </div>
      {/* No data message */}
      {chartData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No hay datos para mostrar en el período seleccionado
          </p>
        </div>
      )}
    </div>
  );
} 