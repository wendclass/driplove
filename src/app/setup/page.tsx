"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  User,
  Mail,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

export default function SetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form states
  const [pseudonym, setPseudonym] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [internalEmail, setInternalEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 2FA states
  const [totpSecret, setTotpSecret] = useState("");
  const [totpUri, setTotpUri] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [totpCode, setTotpCode] = useState("");
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Jeton de configuration absent. Utilisez le lien complet fourni.");
      setLoading(false);
      return;
    }

    const initSetup = async () => {
      try {
        const res = await fetch(`/api/setup/init?token=${encodeURIComponent(token)}`);
        if (res.status === 404) {
          // Si le superadmin existe déjà, la page n'existe plus
          notFound();
          return;
        }
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Jeton de configuration invalide ou expiré.");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setTotpSecret(data.totpSecret);
        setTotpUri(data.totpUri);
        setBackupCodes(data.backupCodes || []);
        setLoading(false);
      } catch {
        setError("Erreur technique lors de la vérification du jeton.");
        setLoading(false);
      }
    };

    initSetup();
  }, [token]);

  // Password rules validation
  const hasMinLength = password.length >= 10;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isPasswordValid =
    hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial && passwordsMatch;

  const handleCopySecret = () => {
    if (!totpSecret) return;
    navigator.clipboard.writeText(totpSecret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleCopyBackupCodes = () => {
    if (backupCodes.length === 0) return;
    navigator.clipboard.writeText(backupCodes.join("\n"));
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid) {
      setError("Veuillez respecter l'ensemble des critères de sécurité du mot de passe.");
      return;
    }

    if (!totpCode || totpCode.trim().length !== 6) {
      setError("Veuillez saisir le code de vérification à 6 chiffres généré par votre application 2FA.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/setup/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          pseudonym: pseudonym.trim(),
          displayName: displayName.trim(),
          internalEmail: internalEmail.trim(),
          password,
          totpSecret,
          totpCode: totpCode.trim(),
          backupCodes,
        }),
      });

      if (res.status === 404) {
        notFound();
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de la configuration.");
        setSubmitting(false);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin");
        }, 1500);
      }
    } catch {
      setError("Erreur technique de communication avec le serveur.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-black text-black dark:text-white">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-zinc-500 font-mono">Vérification du jeton d&apos;initialisation...</p>
        </div>
      </main>
    );
  }

  if (error && !totpSecret) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-black text-black dark:text-white">
        <div className="max-w-md w-full p-6 sm:p-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto text-black dark:text-white border border-zinc-200 dark:border-zinc-800">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-bold">Accès non autorisé</h1>
          <p className="text-xs text-zinc-500 leading-relaxed">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 bg-zinc-50 dark:bg-black text-black dark:text-white font-sans">
      <div className="max-w-xl w-full mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Premier Démarrage • Zéro Donnée Initiale</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Configuration du Super-Administrateur
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
            Créez votre compte maître. Dès sa validation, cette page sera définitivement désactivée.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold">Initialisation réussie</h2>
              <p className="text-xs text-zinc-500">
                Votre compte Super-Administrateur est configuré. Redirection vers le back-office...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1 : Identité */}
              <div className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                  1. Identité et Connexion
                </h2>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Identifiant interne secret :
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={pseudonym}
                      onChange={(e) => setPseudonym(e.target.value)}
                      placeholder="Ex: Responsable_Principal"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                      required
                    />
                  </div>
                  <span className="text-[11px] text-zinc-500 mt-1 block">
                    Utilisé pour vous connecter. Jamais visible des étudiants.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Nom affiché en interne :
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Ex: Direction Écoute"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Email professionnel interne :
                    </label>
                    <input
                      type="email"
                      value={internalEmail}
                      onChange={(e) => setInternalEmail(e.target.value)}
                      placeholder="contact@dr-iplove.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 2 : Mot de passe fort */}
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                  2. Mot de Passe Robuste
                </h2>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Mot de passe maître :
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-zinc-400 hover:text-black dark:hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Confirmer le mot de passe :
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    required
                  />
                </div>

                {/* Checklist de sécurité mot de passe */}
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] space-y-1">
                  <div className="flex items-center gap-2">
                    {hasMinLength ? <CheckCircle2 className="w-3.5 h-3.5 text-black dark:text-white" /> : <span className="w-3.5 h-3.5 rounded-full border border-zinc-400 inline-block" />}
                    <span className={hasMinLength ? "font-semibold" : "text-zinc-500"}>Au moins 10 caractères</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasUpper ? <CheckCircle2 className="w-3.5 h-3.5 text-black dark:text-white" /> : <span className="w-3.5 h-3.5 rounded-full border border-zinc-400 inline-block" />}
                    <span className={hasUpper ? "font-semibold" : "text-zinc-500"}>Au moins une lettre majuscule</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasLower ? <CheckCircle2 className="w-3.5 h-3.5 text-black dark:text-white" /> : <span className="w-3.5 h-3.5 rounded-full border border-zinc-400 inline-block" />}
                    <span className={hasLower ? "font-semibold" : "text-zinc-500"}>Au moins une lettre minuscule</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasNumber ? <CheckCircle2 className="w-3.5 h-3.5 text-black dark:text-white" /> : <span className="w-3.5 h-3.5 rounded-full border border-zinc-400 inline-block" />}
                    <span className={hasNumber ? "font-semibold" : "text-zinc-500"}>Au moins un chiffre</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasSpecial ? <CheckCircle2 className="w-3.5 h-3.5 text-black dark:text-white" /> : <span className="w-3.5 h-3.5 rounded-full border border-zinc-400 inline-block" />}
                    <span className={hasSpecial ? "font-semibold" : "text-zinc-500"}>Au moins un symbole spécial (!@#$%...)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordsMatch ? <CheckCircle2 className="w-3.5 h-3.5 text-black dark:text-white" /> : <span className="w-3.5 h-3.5 rounded-full border border-zinc-400 inline-block" />}
                    <span className={passwordsMatch ? "font-semibold" : "text-zinc-500"}>Les deux mots de passe correspondent</span>
                  </div>
                </div>
              </div>

              {/* Section 3 : 2FA Obligatoire */}
              <div className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                  3. Double Authentification Obligatoire (2FA)
                </h2>

                <p className="text-xs text-zinc-500 leading-relaxed">
                  Ajoutez ce compte dans votre application d&apos;authentification (Google Authenticator, Microsoft Authenticator, Bitwarden, Apple Passwords).
                </p>

                {/* Clé secrète 2FA */}
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase">Clé secrète Base32 :</span>
                    <button
                      type="button"
                      onClick={handleCopySecret}
                      className="text-xs flex items-center gap-1 font-semibold hover:underline"
                    >
                      {copiedSecret ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSecret ? "Copié !" : "Copier la clé"}</span>
                    </button>
                  </div>
                  <code className="block text-xs font-mono font-bold tracking-widest break-all bg-white dark:bg-zinc-950 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    {totpSecret}
                  </code>
                </div>

                {/* Codes de secours */}
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase">Codes de secours d&apos;urgence (8 codes) :</span>
                    <button
                      type="button"
                      onClick={handleCopyBackupCodes}
                      className="text-xs flex items-center gap-1 font-semibold hover:underline"
                    >
                      {copiedCodes ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCodes ? "Copié !" : "Copier tout"}</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono text-[11px] font-bold text-center">
                    {backupCodes.map((c, i) => (
                      <span key={i} className="p-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-500 block">
                    Conservez ces codes en lieu sûr. Ils permettent d&apos;accéder au compte en cas de perte de téléphone.
                  </span>
                </div>

                {/* Saisie code 2FA pour valider */}
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Code 2FA généré (6 chiffres) :
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      maxLength={6}
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="000000"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !isPasswordValid}
                className="w-full py-3.5 px-4 rounded-xl bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-semibold text-sm shadow transition-all flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <span>{submitting ? "Initialisation en cours..." : "Créer le Super-Administrateur & Verrouiller"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
