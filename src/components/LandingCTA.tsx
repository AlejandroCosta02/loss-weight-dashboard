"use client";
export default function LandingCTA() {
  return (
    <button
      onClick={() => window.location.href = "/api/auth/signin"}
      className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-3 rounded-full font-bold text-base sm:text-lg shadow-lg transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
    >
      Comenzar ahora
    </button>
  );
} 