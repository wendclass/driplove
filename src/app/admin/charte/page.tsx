"use client";

import Link from "next/link";
import { ShieldCheck, ArrowLeft, CheckCircle2, Lock } from "lucide-react";

export default function AdminChartePage() {
  return (
    <div className="p-4 sm:p-6 max-w-4xl w-full mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b border-line-subtle dark:border-line-dark">
        <Link
          href="/admin"
          className="p-2 rounded-xl hover:bg-canvas-light dark:hover:bg-canvas-dark text-ink-secondary"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-ink-primary dark:text-ink-light font-sans flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-black dark:text-white" />
            <span>Charte Déontologique des Répondants IPERMIC</span>
          </h1>
          <p className="text-xs text-zinc-500 font-body">
            Engagement solennel d&apos;honneur liant chaque membre de l&apos;équipe d&apos;écoute Dr IPLOVE.
          </p>
        </div>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark p-6 sm:p-8 rounded-2xl border border-line-subtle dark:border-line-dark shadow-sm space-y-6 font-body text-xs sm:text-sm text-ink-secondary dark:text-ink-muted leading-relaxed">
        {/* Serment */}
        <div className="p-5 rounded-xl bg-brand-primary/5 dark:bg-brand-mint/5 border border-brand-primary/15 dark:border-brand-mint/15">
          <span className="text-xs font-bold text-brand-primary dark:text-brand-mint uppercase tracking-wider block mb-2 font-sans">
            Serment d&apos;Honneur du Répondant
          </span>
          <p className="italic font-body text-ink-primary dark:text-ink-light leading-relaxed">
            « En intégrant la cellule d&apos;écoute du Dr IPLOVE, je m&apos;engage solennellement sur l&apos;honneur à garder le secret absolu sur l&apos;ensemble des confidences, doutes et souffrances dont j&apos;aurai connaissance. Je jure de ne jamais tenter d&apos;identifier l&apos;auteur d&apos;un message, de ne réaliser aucune capture d&apos;écran, et de répondre avec un respect fraternel et inconditionnel, sous la seule signature collective Dr IPLOVE. »
          </p>
        </div>

        {/* 5 Principes cardinaux */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-ink-primary dark:text-ink-light font-sans">
            Les 5 Règles d&apos;Or du Travail d&apos;Équipe
          </h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-brand-mint flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-ink-primary dark:text-ink-light font-sans block">
                  1. Une seule voix : Dr IPLOVE
                </strong>
                <span>
                  L&apos;étudiant ne s&apos;adresse pas à un individu, mais à un collectif protecteur. Toutes les réponses sont signées « Dr IPLOVE ».
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-brand-mint flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-ink-primary dark:text-ink-light font-sans block">
                  2. Zéro enquête, zéro déduction
                </strong>
                <span>
                  Il est formellement interdit de chercher à deviner qui écrit à partir d&apos;un style, d&apos;une anecdote ou d&apos;un horaire. L&apos;anonymat est sacré.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-brand-mint flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-ink-primary dark:text-ink-light font-sans block">
                  3. La règle des 4 yeux sur les cas sensibles
                </strong>
                <span>
                  Tout message présentant des signaux de détresse sévère, de violences ou d&apos;idées sombres doit être relu et validé par un second membre de l&apos;équipe avant envoi.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-brand-mint flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-ink-primary dark:text-ink-light font-sans block">
                  4. Orientation vers les professionnels
                </strong>
                <span>
                  Nous écoutons et déculpabilisons, mais nous ne remplaçons ni un médecin, ni un psychologue, ni un avocat. Transmettre les coordonnées du Centre Médico-Social de l&apos;UJKZ quand la situation l&apos;exige.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-brand-mint flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-ink-primary dark:text-ink-light font-sans block">
                  5. Prévention de l&apos;usure compassionnelle
                </strong>
                <span>
                  Si une confidence te touche de trop près ou devient trop lourde émotionnellement, transfère immédiatement le dossier à un pair avec une note de relais.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-line-subtle dark:border-line-dark flex items-center justify-between">
          <span className="text-xs text-state-success font-semibold flex items-center gap-1.5 font-sans">
            <CheckCircle2 className="w-4 h-4" />
            <span>Engagement actif et horodaté</span>
          </span>

          <Link
            href="/admin"
            className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primary-light font-sans"
          >
            Retourner à la file
          </Link>
        </div>
      </div>
    </div>
  );
}
