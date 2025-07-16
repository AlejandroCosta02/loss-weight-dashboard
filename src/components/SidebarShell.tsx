"use client";

import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { useFloating, offset, shift, Placement } from '@floating-ui/react';
import { motion, AnimatePresence } from "framer-motion";
import DashboardContent from "@/components/DashboardContent";
import MealsContent from "@/components/MealsContent";
import WorkoutContent from "@/components/WorkoutContent";
import WaterContent from "@/components/WaterContent";
import MainContent from "@/components/MainContent";

type ActiveTab = 'main' | 'progress' | 'meals' | 'workout' | 'water';

function Sidebar({ activeTab, onTabChange }: { activeTab: ActiveTab; onTabChange: (tab: ActiveTab) => void }) {
  useTheme();
  const sidebarRef = useRef<HTMLDivElement>(null);
  useFloating({
    placement: 'left-start' as Placement,
    middleware: [offset(0), shift()],
    strategy: 'fixed',
  });

  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.classList.add('opacity-0', 'translate-x-[-20px]');
      setTimeout(() => {
        sidebarRef.current?.classList.remove('opacity-0', 'translate-x-[-20px]');
        sidebarRef.current?.classList.add('opacity-100', 'translate-x-0');
      }, 10);
    }
  }, []);

  const items = [
    { icon: activeTab === 'main' ? '/main-active.png' : '/main.png', label: 'Principal', tab: 'main' as ActiveTab },
    { icon: activeTab === 'progress' ? '/chart-active.png' : '/chart.png', label: 'Progreso', tab: 'progress' as ActiveTab },
    { icon: activeTab === 'meals' ? '/food-active.png' : '/food.png', label: 'Comidas', tab: 'meals' as ActiveTab },
    { icon: activeTab === 'workout' ? '/workout-active.png' : '/workout.png', label: 'Entrenamiento', tab: 'workout' as ActiveTab },
    { icon: activeTab === 'water' ? '/water-active.png' : '/water.png', label: 'Agua', tab: 'water' as ActiveTab },
  ];

  return (
    <>
      {/* Desktop sidebar - new design */}
      <div className="hidden lg:flex fixed left-4 top-1/2 h-[80vh] w-20 bg-card shadow-xl rounded-2xl flex-col items-center py-4 -translate-y-1/2">
        <div className="flex flex-col flex-1 justify-between w-full items-center">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => onTabChange(item.tab)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${
                activeTab === item.tab 
                  ? 'bg-primary/10 shadow-md text-primary scale-110' 
                  : 'text-muted-foreground hover:bg-primary/5 hover:scale-105'
              }`}
              title={item.label}
            >
              <Image 
                src={item.icon} 
                alt={item.label} 
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </button>
          ))}
        </div>
      </div>
      {/* Mobile bottom nav */}
      <div className="fixed lg:hidden bottom-0 left-0 w-full z-40 flex justify-around bg-card shadow-xl py-2 transition-all duration-300">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => onTabChange(item.tab)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 ${
              activeTab === item.tab
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-primary/5'
            }`}
            title={item.label}
          >
            <Image 
              src={item.icon} 
              alt={item.label} 
              width={28}
              height={28}
              className="w-7 h-7"
            />
            <span className="text-xs transition-colors">{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}

export default function SidebarShell({ onProfileClick }: { onProfileClick?: () => void }) {
  const pathname = usePathname();
  const showSidebar = pathname.startsWith('/dashboard');
  const [activeTab, setActiveTab] = useState<ActiveTab>('main');

  if (!showSidebar) return null;

  let ContentComponent;
  if (activeTab === 'main') ContentComponent = MainContent;
  else if (activeTab === 'progress') ContentComponent = DashboardContent;
  else if (activeTab === 'meals') ContentComponent = MealsContent;
  else if (activeTab === 'workout') ContentComponent = WorkoutContent;
  else if (activeTab === 'water') ContentComponent = WaterContent;
  else ContentComponent = MainContent;

  return (
    <>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pl-24 pt-4 pb-8 min-h-[60vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <ContentComponent onProfileClick={onProfileClick} />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
} 