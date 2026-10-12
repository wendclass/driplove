import Link from "next/link";
import Navbar from "@/components/Navbar";
import MobileTabBar from "@/components/MobileTabBar";
import { ArrowLeft, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Navbar showBack backHref="/" title="Page introuvable" />

      <main className="flex-1 max-w-md mx-auto px-4 py-16 w-full flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white flex items-center justify-center mb-5">
          <HelpCircle className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-extrabold text-black dark:text-white font-sans mb-2">
          Page introuvable
        </h1>

        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-8 max-w-xs leading-relaxed">
          Le lien que tu as suivi n&apos;existe pas ou la conversation a été effacée.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-semibold text-sm shadow transition-all font-sans"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l&apos;accueil</span>
        </Link>
      </main>

      <MobileTabBar />
    </>
  );
}
