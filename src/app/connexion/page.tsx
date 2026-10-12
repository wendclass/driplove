"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Lock, User, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";

export default function ConnexionPage() {
  const router = useRouter();
  const [pseudonym, setPseudonym] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pseudonym: pseudonym.trim(),
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Identifiants invalides.");
      } else {
        if (data.user.role === "RESPONDER" || data.user.role === "SUPERADMIN") {
          router.push("/admin");
        } else {
          router.push("/etudiant");
        }
      }
    } catch {
      setError("Erreur technique. Vérifie ta connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar showBack backHref="/" title="Connexion sécurisée" />

      <main className="flex-1 max-w-md mx-auto px-4 py-10 w-full flex flex-col justify-center">
        <div className="bg-surface-light dark:bg-surface-dark p-6 sm:p-8 rounded-2xl border border-line-subtle dark:border-line-dark shadow-sm">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-ink-primary dark:text-ink-light mb-1 font-sans">
              Retrouver mes messages
            </h1>
            <p className="text-xs text-ink-secondary dark:text-ink-muted font-body">
              Connecte-toi avec ton pseudonyme pour lire la réponse du Dr IPLOVE.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="pseudonym"
                className="block text-xs font-semibold text-ink-primary dark:text-ink-light mb-1.5 font-sans"
              >
                Ton Pseudonyme :
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-ink-muted absolute left-3.5 top-3.5" />
                <input
                  id="pseudonym"
                  type="text"
                  value={pseudonym}
                  onChange={(e) => setPseudonym(e.target.value)}
                  placeholder="Ex: EtoileCalme_42"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-line-subtle dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-ink-primary dark:text-ink-light text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary font-sans"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-ink-primary dark:text-ink-light mb-1.5 font-sans"
              >
                Mot de passe :
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-ink-muted absolute left-3.5 top-3.5" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-line-subtle dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-ink-primary dark:text-ink-light text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary font-sans"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-ink-muted hover:text-ink-primary dark:hover:text-ink-light"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-state-danger/10 border border-state-danger/20 text-xs text-state-danger">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-semibold text-sm shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50 font-sans"
            >
              <span>{loading ? "Connexion en cours..." : "Accéder à mes échanges"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-zinc-200 dark:border-zinc-800 text-center">
            <span className="text-xs text-zinc-500 block mb-2">
              Pas encore de compte secret ?
            </span>
            <Link
              href="/sas"
              className="text-xs text-black dark:text-white font-semibold hover:underline"
            >
              Créer mon espace avec le pass IPERMIC
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
