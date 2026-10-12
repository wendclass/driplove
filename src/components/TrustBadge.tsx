import { Lock, ShieldCheck } from "lucide-react";

interface TrustBadgeProps {
  variant?: "inline" | "banner";
  className?: string;
}

export default function TrustBadge({
  variant = "inline",
  className = "",
}: TrustBadgeProps) {
  if (variant === "banner") {
    return (
      <div
        className={`flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 ${className}`}
      >
        <ShieldCheck className="w-4 h-4 text-black dark:text-white flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-black dark:text-white block mb-0.5 font-sans">
            Zone 100% confidentielle & chiffrée
          </strong>
          <span>
            Aucun nom civil, numéro ou adresse IP n&apos;est enregistré. Seul ton pseudonyme est transmis à l&apos;équipe d&apos;écoute du Dr IPLOVE. Données purgées sous 30 jours.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 ${className}`}
    >
      <Lock className="w-3.5 h-3.5 text-black dark:text-white flex-shrink-0" />
      <span>Confidentiel : ton identité réelle reste invisible.</span>
    </div>
  );
}
