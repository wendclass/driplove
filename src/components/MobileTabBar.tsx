"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, BookOpen, ShieldAlert } from "lucide-react";

export default function MobileTabBar() {
  const pathname = usePathname();

  const tabs = [
    { label: "Accueil", href: "/", icon: Home },
    { label: "Échanges", href: "/etudiant", icon: MessageSquare },
    { label: "Chroniques", href: "/chroniques", icon: BookOpen },
    { label: "Urgences", href: "/aide-urgence", icon: ShieldAlert },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md border-t border-line-subtle dark:border-line-dark safe-bottom">
      <div className="grid grid-cols-4 h-16 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center h-full transition-colors ${
                isActive
                  ? "text-black dark:text-white font-bold"
                  : "text-zinc-400 hover:text-black dark:hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-2"}`} />
              <span className="text-[11px] mt-1 font-sans">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
