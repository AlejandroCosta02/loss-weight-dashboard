"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar({ onProfileClick }: { onProfileClick?: () => void }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <nav className="bg-card/50 backdrop-blur-sm border-b border-border shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-lg sm:text-xl font-bold text-foreground hover:text-primary transition-colors">
              MiProgreso
            </Link>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <ThemeToggle />
            {status === "loading" ? (
              <div className="animate-pulse bg-muted h-8 w-16 sm:w-20 rounded-md"></div>
            ) : session ? (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                  title="Inicio"
                >
                  <Image
                    src={'/home.png'}
                    alt="Inicio"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-cover"
                  />
                </button>
                <button
                  onClick={onProfileClick}
                  className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                  title="Perfil"
                >
                  <Image
                    src={'/user.png'}
                    alt="Perfil"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-cover"
                  />
                </button>
                <button
                  onClick={() => signOut()}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors shadow-sm cursor-pointer"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={() => signIn("google")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors shadow-sm cursor-pointer"
                >
                  Entrar
                </button>
                <button
                  onClick={() => signIn("google")}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors shadow-sm cursor-pointer"
                >
                  Registro
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 