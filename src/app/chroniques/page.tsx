import Navbar from "@/components/Navbar";
import MobileTabBar from "@/components/MobileTabBar";
import { db } from "@/lib/db";
import { BookOpen, Sparkles, Heart, ShieldCheck } from "lucide-react";

export default function ChroniquesPage() {
  const chronicles = db.getPublicChronicles();

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "COUPLE":
        return "Couple & Relations";
      case "FRIENDSHIP":
        return "Amitié";
      case "SELF_ESTEEM":
        return "Estime de Soi";
      default:
        return "Vie étudiante";
    }
  };

  return (
    <>
      <Navbar showBack backHref="/" title="Chroniques Dr IPLOVE" />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 pb-24 sm:pb-12 w-full space-y-6 font-body">
        <div className="text-center max-w-xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-accent-soft text-brand-accent-hover dark:bg-brand-accent-dark/20 dark:text-brand-accent-dark font-sans mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Partages d&apos;Expériences
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary dark:text-ink-light font-sans mb-3">
            Les Chroniques du Dr IPLOVE
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary dark:text-ink-muted leading-relaxed">
            Des questionnements réels d&apos;étudiants, transformés en leçons collectives avec leur accord explicite pour aider l&apos;ensemble de la communauté.
          </p>
        </div>

        {/* Rappel éthique */}
        <div className="p-3.5 rounded-xl bg-surface-light dark:bg-surface-dark border border-line-subtle dark:border-line-dark flex items-center gap-2.5 text-xs text-ink-muted">
          <ShieldCheck className="w-4 h-4 text-brand-mint flex-shrink-0" />
          <span>
            Rien n&apos;est publié sans accord formel : l&apos;étudiant valide chaque mot de la version anonymisée avant toute mise en ligne.
          </span>
        </div>

        {/* Liste des Chroniques */}
        <div className="space-y-6">
          {chronicles.map((c) => (
            <article
              key={c.id}
              className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-line-subtle dark:border-line-dark shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary dark:bg-brand-mint/10 dark:text-brand-mint font-sans uppercase">
                  {getCategoryLabel(c.category)}
                </span>
                <span className="text-[11px] text-ink-muted">
                  {new Date(c.publishedAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-ink-primary dark:text-ink-light font-sans">
                {c.title}
              </h2>

              {/* Question anonymisée */}
              <div className="p-4 rounded-xl bg-canvas-light dark:bg-canvas-dark border border-line-subtle dark:border-line-dark text-xs text-ink-secondary dark:text-ink-muted leading-relaxed italic">
                <span className="font-bold text-ink-primary dark:text-ink-light not-italic block mb-1 font-sans">
                  La question posée (anonymisée) :
                </span>
                « {c.anonymizedQuestion} »
              </div>

              {/* Réponse du Dr IPLOVE */}
              <div className="p-4 rounded-xl bg-brand-primary/5 dark:bg-brand-mint/5 border border-brand-primary/10 dark:border-brand-mint/10 text-xs text-ink-primary dark:text-ink-light leading-relaxed space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-brand-primary dark:text-brand-mint font-sans">
                  <Heart className="w-3.5 h-3.5 fill-brand-accent text-brand-accent" />
                  <span>L&apos;éclairage du Dr IPLOVE :</span>
                </div>
                <p>{c.anonymizedResponse}</p>
              </div>
            </article>
          ))}
        </div>
      </main>

      <MobileTabBar />
    </>
  );
}
