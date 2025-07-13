"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import SidebarShell from "@/components/SidebarShell";
import ProfileModal from "@/components/ProfileModal";

export default function RootClientLayout({ children }: { children: React.ReactNode }) {
  const [profileOpen, setProfileOpen] = useState(false);
  return (
    <>
      <Navbar onProfileClick={() => setProfileOpen(true)} />
      <SidebarShell />
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pl-20">
        <main className="py-6 sm:py-12">
          {children}
        </main>
      </div>
    </>
  );
} 