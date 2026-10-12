"use client";

import Link from "next/link";
import { ShieldCheck, Heart, Moon, Sun, Lock } from "lucide-react";
import { useState, useEffect } from "react";

interface NavbarProps {
  userPseudonym?: string;
  role?: string;
  showBack?: boolean;
  backHref?: string;
  title?: string;
}

export default function Navbar({
  userPseudonym,
  role,
  showBack,
  backHref = "/",
  title,
}: NavbarProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
    }
  }, []);

  const toggleTheme = () => {
    if (typeof window !== "undefined") {
      const isCurrentlyDark = document.documentElement.classList.contains("dark");
      if (isCurrentlyDark) {
        document.documentElement.classList.remove("dark");
        setIsDark(false);
      } else {
        document.documentElement.classList.add("dark");
        setIsDark(true);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md border-b border-line-subtle dark:border-line-dark transition-colors">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <Link
              href={backHref}
              className="p-1.5 -ml-1.5 rounded-full hover:bg-canvas-light dark:hover:bg-canvas-dark text-ink-secondary dark:text-ink-muted transition-colors"
              aria-label="Retour"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
          )}

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shadow-sm group-hover:scale-105 transition-transform">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-black dark:text-white font-sans">
                Dr IPLOVE
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-zinc-500 font-medium">
                • IPERMIC
              </span>
            </div>
          </Link>
        </div>

        {title && (
          <div className="hidden md:flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800">
            <Lock className="w-3 h-3 text-zinc-700 dark:text-zinc-300" />
            <span>{title}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {userPseudonym ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700">
                {userPseudonym}
              </span>
              {role === "RESPONDER" || role === "SUPERADMIN" ? (
                <Link
                  href="/admin"
                  className="text-xs bg-black dark:bg-white text-white dark:text-black font-semibold px-2.5 py-1 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Back-Office
                </Link>
              ) : null}
            </div>
          ) : (
            <Link
              href="/connexion"
              className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:underline px-2 py-1"
            >
              Connexion
            </Link>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            aria-label="Basculer le thème"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
