"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { KeyRound, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";

export default function SasPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!code.trim()) {
      setError("Merci de saisir le pass étudiant fourni.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Pass invalide.");
      } else {
        sessionStorage.setItem("dr_club_pass", code.trim());
        router.push("/inscription");
      }
    } catch {
      setError("Erreur technique. Vérifie ta connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar showBack backHref="/" title="Sas d'accès étudiant" />

      <main className="flex-1 max-w-md mx-auto px-4 py-12 w-full flex flex-col justify-center">
        <div className="bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white flex items-center justify-center mb-5 border border-zinc-200 dark:border-zinc-800">
            <KeyRound className="w-6 h-6" />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-2 font-sans">
            Clé d&apos;accès IPERMIC
          </h1>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-6 font-body leading-relaxed">
            La plateforme est réservée à la communauté étudiante de l&apos;IPERMIC. Saisis le pass saisonnier partagé par l&apos;équipe.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="code"
                className="block text-xs font-semibold text-black dark:text-white mb-1.5 font-sans"
              >
                Pass d&apos;accès :
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ex: IPERMIC-2026"
                className="w-full px-3.5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white font-mono uppercase tracking-wider"
                required
              />
              <span className="text-[11px] text-zinc-500 mt-1.5 block">
                Code d&apos;accès actif : <code className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded text-black dark:text-white">IPERMIC-2026</code>
              </span>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs text-black dark:text-white">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-semibold text-sm shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50 font-sans"
            >
              <span>{loading ? "Vérification..." : "Valider mon accès"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-start gap-2.5 text-xs text-zinc-500">
              <ShieldCheck className="w-4 h-4 text-black dark:text-white flex-shrink-0 mt-0.5" />
              <span>
                <strong>Garantie absolue d&apos;anonymat</strong> : Ce mot de passe partagé ne permet en aucun cas d&apos;identifier qui l&apos;utilise. Conservation maximale de 30 jours.
              </span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-500 mt-6">
          Déjà un compte ?{" "}
          <Link
            href="/connexion"
            className="text-black dark:text-white font-semibold hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </main>
    </>
  );
}
