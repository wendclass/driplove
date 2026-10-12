import Navbar from "@/components/Navbar";
import MobileTabBar from "@/components/MobileTabBar";
import {
  ShieldAlert,
  Phone,
  HeartPulse,
  AlertTriangle,
  Hospital,
  MapPin,
} from "lucide-react";

export default function AideUrgencePage() {
  return (
    <>
      <Navbar showBack backHref="/" title="Urgences & Écoute" />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 pb-24 sm:pb-12 w-full space-y-6 font-body">
        <div className="text-center max-w-xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-state-danger/10 text-state-danger font-sans mb-3">
            <HeartPulse className="w-3.5 h-3.5" />
            Accès Permanent 24h/24
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary dark:text-ink-light font-sans mb-3">
            Ressources d&apos;Urgence & Écoute Locale
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary dark:text-ink-muted leading-relaxed">
            Si toi ou un camarade traversez une crise grave, des violences ou un danger immédiat, contacte sans attendre ces services officiels gratuits.
          </p>
        </div>

        {/* Avertissement limites */}
        <div className="p-4 rounded-2xl bg-state-warning/10 border border-state-warning/20 text-xs text-ink-primary dark:text-ink-light flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-state-warning flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-sans block text-state-warning">
              Rappel essentiel de responsabilité :
            </strong>
            <p className="leading-relaxed">
              Le service Dr IPLOVE est une écoute bénévole entre pairs. Il ne remplace ni un médecin, ni un service psychiatrique d&apos;urgence, ni une assistance juridique ou policière.
            </p>
          </div>
        </div>

        {/* 1. Numéros d'urgence nationaux */}
        <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-line-subtle dark:border-line-dark shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-ink-primary dark:text-ink-light font-sans flex items-center gap-2">
            <Phone className="w-4 h-4 text-brand-primary dark:text-brand-mint" />
            <span>Numéros d&apos;Urgence Gratuits (Burkina Faso)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-canvas-light dark:bg-canvas-dark border border-line-subtle dark:border-line-dark">
              <span className="text-[11px] text-ink-muted uppercase font-sans font-bold block mb-1">
                Violences Basées sur le Genre & Écoute
              </span>
              <a
                href="tel:80001111"
                className="text-lg font-bold text-brand-primary dark:text-brand-mint hover:underline font-mono"
              >
                80 00 11 11
              </a>
              <span className="text-[11px] text-ink-muted block mt-1">
                Ligne verte nationale gratuite d&apos;assistance
              </span>
            </div>

            <div className="p-4 rounded-xl bg-canvas-light dark:bg-canvas-dark border border-line-subtle dark:border-line-dark">
              <span className="text-[11px] text-ink-muted uppercase font-sans font-bold block mb-1">
                Sapeurs-Pompiers (Urgences Vitales)
              </span>
              <a
                href="tel:18"
                className="text-lg font-bold text-state-danger hover:underline font-mono"
              >
                18
              </a>
              <span className="text-[11px] text-ink-muted block mt-1">
                Secours d&apos;urgence et accidents
              </span>
            </div>

            <div className="p-4 rounded-xl bg-canvas-light dark:bg-canvas-dark border border-line-subtle dark:border-line-dark">
              <span className="text-[11px] text-ink-muted uppercase font-sans font-bold block mb-1">
                Police Nationale (Secours)
              </span>
              <a
                href="tel:17"
                className="text-lg font-bold text-ink-primary dark:text-ink-light hover:underline font-mono"
              >
                17
              </a>
              <span className="text-[11px] text-ink-muted block mt-1">
                Assistance et sécurité publique
              </span>
            </div>

            <div className="p-4 rounded-xl bg-canvas-light dark:bg-canvas-dark border border-line-subtle dark:border-line-dark">
              <span className="text-[11px] text-ink-muted uppercase font-sans font-bold block mb-1">
                Gendarmerie Nationale
              </span>
              <a
                href="tel:16"
                className="text-lg font-bold text-ink-primary dark:text-ink-light hover:underline font-mono"
              >
                16
              </a>
              <span className="text-[11px] text-ink-muted block mt-1">
                Intervention et secours
              </span>
            </div>
          </div>
        </div>

        {/* 2. Structures Universitaires UJKZ */}
        <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-line-subtle dark:border-line-dark shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-ink-primary dark:text-ink-light font-sans flex items-center gap-2">
            <Hospital className="w-4 h-4 text-brand-mint" />
            <span>Santé & Soutien sur le Campus UJKZ</span>
          </h2>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-canvas-light dark:bg-canvas-dark border border-line-subtle dark:border-line-dark space-y-1">
              <strong className="text-xs font-bold text-ink-primary dark:text-ink-light font-sans block">
                Centre Médico-Social de l&apos;Université Joseph Ki-Zerbo (CMS)
              </strong>
              <p className="text-xs text-ink-secondary dark:text-ink-muted">
                Consultations médicales générales, santé sexuelle et reproductive, soins infirmiers gratuits et discrets pour les étudiants inscrits.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-ink-muted pt-1">
                <MapPin className="w-3.5 h-3.5 text-brand-accent" />
                <span>Campus Central UJKZ, Ouagadougou</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-canvas-light dark:bg-canvas-dark border border-line-subtle dark:border-line-dark space-y-1">
              <strong className="text-xs font-bold text-ink-primary dark:text-ink-light font-sans block">
                Cellule d&apos;Écoute Psychologique & CENOU
              </strong>
              <p className="text-xs text-ink-secondary dark:text-ink-muted">
                Accompagnement par des conseillers d&apos;orientation et psychologues du Centre National des Œuvres Universitaires pour le stress des examens ou le mal-être affectif.
              </p>
            </div>
          </div>
        </div>
      </main>

      <MobileTabBar />
    </>
  );
}
