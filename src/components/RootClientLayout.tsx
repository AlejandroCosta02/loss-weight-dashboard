"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import SidebarShell from "@/components/SidebarShell";
import ProfileModal from "@/components/ProfileModal";

export default function RootClientLayout({ children }: { children: React.ReactNode }) {
  const [profileOpen, setProfileOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onProfileClick={() => setProfileOpen(true)} />
      <SidebarShell onProfileClick={() => setProfileOpen(true)} />
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      <div className="flex-1 flex flex-col">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pl-20 w-full">
          <main className="py-6 sm:py-12">
            {children}
          </main>
        </div>
      </div>
      {/* Footer - outside the constrained container */}
      <footer className="w-full py-4 sm:py-6 text-center text-muted-foreground text-xs sm:text-sm border-t border-border bg-card/50">
        © {new Date().getFullYear()} MiProgreso. Próximamente más enlaces.
      </footer>
    </div>
  );
} 