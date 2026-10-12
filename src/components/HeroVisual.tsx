"use client";

import { Heart, Lock, ShieldCheck, Sparkles, Clock, EyeOff } from "lucide-react";

export default function HeroVisual() {
  return (
    <div className="relative w-full max-w-lg mx-auto py-6 sm:py-10 flex flex-col items-center justify-center select-none">
      {/* Halo de lueur radiale arrière */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-zinc-200/50 dark:bg-zinc-800/20 blur-3xl -z-10 pointer-events-none" />

      {/* Anneaux orbitaux concentriques avec rotation */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
        {/* Anneau externe en pointillés avec rotation lente */}
        <div className="absolute inset-0 rounded-full border border-dashed border-zinc-300 dark:border-zinc-700 animate-[spin_40s_linear_infinite]" />

        {/* Anneau intermédiaire pulsé */}
        <div className="absolute inset-6 rounded-full border border-zinc-200 dark:border-zinc-800 animate-pulse-ring" />

        {/* Anneau intérieur de protection */}
        <div className="absolute inset-12 rounded-full border border-zinc-300/80 dark:border-zinc-700/80 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xs" />

        {/* Cœur central battant & Emblème de sécurité */}
        <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-black text-white dark:bg-white dark:text-black shadow-2xl flex flex-col items-center justify-center animate-heartbeat transition-transform">
          <div className="relative">
            <Heart className="w-10 h-10 sm:w-12 sm:h-12 fill-current transition-transform" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock className="w-4 h-4 text-black dark:text-white" />
            </div>
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase mt-1 opacity-90 font-mono">
            IPLOVE
          </span>
        </div>

        {/* Badge Flottant 1 (Haut Gauche) : Anonymat */}
        <div className="absolute -top-2 left-0 sm:-left-6 z-20 animate-float">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md text-[11px] font-semibold text-zinc-800 dark:text-zinc-200">
            <EyeOff className="w-3.5 h-3.5 text-black dark:text-white" />
            <span>100% Anonyme</span>
          </div>
        </div>

        {/* Badge Flottant 2 (Haut Droite) : Écoute Humaine */}
        <div className="absolute top-4 -right-2 sm:-right-6 z-20 animate-float-delayed">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md text-[11px] font-semibold text-zinc-800 dark:text-zinc-200">
            <Sparkles className="w-3.5 h-3.5 text-black dark:text-white" />
            <span>Écoute humaine • Zéro IA</span>
          </div>
        </div>

        {/* Badge Flottant 3 (Bas Droite) : Purge 30 jours */}
        <div className="absolute -bottom-2 right-2 sm:-right-4 z-20 animate-float">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md text-[11px] font-semibold text-zinc-800 dark:text-zinc-200">
            <Clock className="w-3.5 h-3.5 text-black dark:text-white" />
            <span>Effacement sous 30j</span>
          </div>
        </div>
      </div>

      {/* Barres d'égaliseur audio de présence humaine animées */}
      <div className="mt-5 flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm shadow-xs">
        <div className="flex items-end gap-1 h-5 px-1">
          <span className="w-1 bg-black dark:bg-white rounded-full animate-soundwave-1" />
          <span className="w-1 bg-black dark:bg-white rounded-full animate-soundwave-2" />
          <span className="w-1 bg-black dark:bg-white rounded-full animate-soundwave-3" />
          <span className="w-1 bg-black dark:bg-white rounded-full animate-soundwave-4" />
          <span className="w-1 bg-black dark:bg-white rounded-full animate-soundwave-2" />
        </div>
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Cellule d&apos;écoute bienveillante attentive
        </span>
      </div>
    </div>
  );
}
