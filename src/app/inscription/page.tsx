"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import TrustBadge from "@/components/TrustBadge";
import {
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  User,
  Mail,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

const SUGGESTED_PSEUDOS = [
  "EtoileCalme",
  "VentDoux",
  "HorizonSerein",
  "FlammeDiscrete",
  "OasisSecrete",
  "AubeClaire",
  "OmbreBienveillante",
  "RefugePaisible",
];

export default function InscriptionPage() {
  const router = useRouter();
  const [clubPass, setClubPass] = useState("");
  const [pseudonym, setPseudonym] = useState("");
  const [password, setPassword] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedPass = sessionStorage.getItem("dr_club_pass");
    if (!savedPass) {
      router.push("/sas");
    } else {
      setClubPass(savedPass);
    }
  }, [router]);

  const handleSuggestPseudo = () => {
    const random =
      SUGGESTED_PSEUDOS[Math.floor(Math.random() * SUGGESTED_PSEUDOS.length)];
    const number = Math.floor(Math.random() * 90 + 10);
    setPseudonym(`${random}_${number}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (pseudonym.trim().length < 3) {
      setError("Le pseudonyme doit comporter au moins 3 caractères.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit comporter au moins 6 caractères.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clubPass,
          pseudonym: pseudonym.trim(),
          password,
          recoveryEmail: recoveryEmail.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de l'inscription.");
      } else {
        router.push("/onboarding");
      }
    } catch {
      setError("Erreur réseau. Merci de réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar showBack backHref="/sas" title="Création de profil anonyme" />

      <main className="flex-1 max-w-md mx-auto px-4 py-8 w-full flex flex-col justify-center">
        <div className="bg-surface-light dark:bg-surface-dark p-6 sm:p-8 rounded-2xl border border-line-subtle dark:border-line-dark shadow-sm">
          <div className="mb-6">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-primary/10 text-brand-primary dark:bg-brand-mint/10 dark:text-brand-mint">
              Pass validé : {clubPass}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-ink-primary dark:text-ink-light mt-3 mb-1 font-sans">
              Créer mon pseudonyme
            </h1>
            <p className="text-xs text-ink-secondary dark:text-ink-muted font-body">
              Ne donne aucun indice sur ton nom réel ou ta promotion.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Pseudonyme */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="pseudonym"
                  className="block text-xs font-semibold text-ink-primary dark:text-ink-light font-sans"
                >
                  Ton Pseudonyme secret :
                </label>
                <button
                  type="button"
                  onClick={handleSuggestPseudo}
                  className="text-[11px] text-brand-primary dark:text-brand-mint font-semibold flex items-center gap-1 hover:underline font-sans"
                >
                  <Sparkles className="w-3 h-3 text-brand-accent" />
                  <span>M&apos;en suggérer un</span>
                </button>
              </div>
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

            {/* Mot de passe */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-ink-primary dark:text-ink-light mb-1.5 font-sans"
              >
                Mot de passe secret :
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-ink-muted absolute left-3.5 top-3.5" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Au moins 6 caractères"
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

            {/* E-mail de secours facultatif */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-ink-primary dark:text-ink-light mb-1 font-sans"
              >
                E-mail de secours (Facultatif & Chiffré) :
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-ink-muted absolute left-3.5 top-3.5" />
                <input
                  id="email"
                  type="email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="Pour réinitialiser ton mot de passe"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-line-subtle dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-ink-primary dark:text-ink-light text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary font-sans"
                />
              </div>
              <span className="text-[11px] text-ink-muted mt-1 block">
                Stocké de manière chiffrée, jamais associé à tes questions.
              </span>
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
              className="w-full py-3.5 px-4 rounded-xl bg-brand-primary hover:bg-brand-primary-light text-white font-semibold text-sm shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50 font-sans"
            >
              <span>{loading ? "Création du profil..." : "Créer mon espace privé"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-line-subtle dark:border-line-dark">
            <TrustBadge variant="banner" />
          </div>
        </div>
      </main>
    </>
  );
}
