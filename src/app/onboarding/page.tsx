"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, HeartHandshake, KeyRound, ArrowRight, CheckCircle2 } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      router.push("/etudiant/nouvelle-question");
    }
  };

  const handleSkip = () => {
    router.push("/etudiant");
  };

  return (
    <main className="min-h-screen flex flex-col justify-between max-w-md mx-auto px-6 py-10 w-full">
      {/* Barre supérieure */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleSkip}
          className="text-xs text-ink-muted hover:text-ink-primary dark:hover:text-ink-light font-sans font-semibold"
        >
          Passer
        </button>

        {/* Indicateur de progression 1/3, 2/3, 3/3 */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s === step
                  ? "w-6 bg-brand-primary dark:bg-brand-mint"
                  : "w-2 bg-line-subtle dark:bg-line-dark"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Contenu de chaque écran */}
      <div className="my-auto py-8">
        {step === 1 && (
          <div className="animate-bubble text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-brand-primary/10 dark:bg-brand-mint/10 text-brand-primary dark:text-brand-mint flex items-center justify-center mb-6 shadow-sm">
              <HeartHandshake className="w-10 h-10" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-ink-primary dark:text-ink-light mb-3 font-sans">
              Un refuge pour déposer ce qui pèse
            </h1>

            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-body">
              Chagrin d&apos;amour, doutes sur toi-même, relation ambiguë ou conflit amical : ici, tu peux tout exprimer sans craindre d&apos;être jugé(e) ni reconnu(e).
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="animate-bubble text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-brand-accent-soft text-brand-accent-hover dark:bg-brand-accent-dark/20 dark:text-brand-accent-dark flex items-center justify-center mb-6 shadow-sm">
              <ShieldCheck className="w-10 h-10" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-ink-primary dark:text-ink-light mb-3 font-sans">
              Zéro jugement, zéro espionnage
            </h1>

            <ul className="text-xs sm:text-sm text-ink-secondary dark:text-ink-muted space-y-2 text-left max-w-xs mx-auto font-body">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-mint flex-shrink-0" />
                <span>Nous ne jugeons aucune de tes émotions.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-mint flex-shrink-0" />
                <span>Nous refusons d&apos;espionner des couples.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-mint flex-shrink-0" />
                <span>Tes mots restent strictement confidentiels.</span>
              </li>
            </ul>
          </div>
        )}

        {step === 3 && (
          <div className="animate-bubble text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-brand-primary/10 dark:bg-brand-mint/10 text-brand-primary dark:text-brand-mint flex items-center justify-center mb-6 shadow-sm">
              <KeyRound className="w-10 h-10" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-ink-primary dark:text-ink-light mb-3 font-sans">
              C&apos;est toi qui contrôles tout
            </h1>

            <p className="text-sm text-ink-secondary dark:text-ink-muted leading-relaxed font-body">
              Tu peux supprimer ta conversation dès que tu as reçu ton conseil. Et quoi qu&apos;il arrive, tout est automatiquement détruit 30 jours après la clôture.
            </p>
          </div>
        )}
      </div>

      {/* Bouton de progression */}
      <div>
        <button
          onClick={handleNext}
          className="w-full py-4 px-6 rounded-2xl bg-brand-primary hover:bg-brand-primary-light text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 font-sans"
        >
          <span>{step === 3 ? "Commencer en confiance" : "Continuer"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </main>
  );
}
