"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import WelcomeModal from "@/components/WelcomeModal";
import DashboardContent from "@/components/DashboardContent";
import MealsContent from "@/components/MealsContent";
import WorkoutContent from "@/components/WorkoutContent";
import WaterContent from "@/components/WaterContent";
import { useFloating, offset, shift, Placement } from '@floating-ui/react';
import { useTheme } from "@/context/ThemeContext";

type ActiveTab = 'progress' | 'meals' | 'workout' | 'water';

// Remove Sidebar and activeTab state management

export default function Dashboard() {
  // All dashboard content is now handled by SidebarShell and the layout.
  return null;
} 