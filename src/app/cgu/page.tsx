import Navbar from "@/components/Navbar";
import MobileTabBar from "@/components/MobileTabBar";
import { AlertTriangle } from "lucide-react";

export default function CGUPage() {
  return (
    <>
      <Navbar showBack backHref="/" title="Conditions d'Utilisation" />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 pb-24 sm:pb-12 w-full space-y-6 font-body text-xs sm:text-sm text-ink-secondary dark:text-ink-muted leading-relaxed">
        <h1 className="text-2xl font-bold text-ink-primary dark:text-ink-light font-sans mb-4">
          Conditions Générales d&apos;Utilisation (CGU)
        </h1>

        {/* Disclaimer Médical Essentiel */}
        <div className="p-4 rounded-xl bg-state-warning/10 border border-state-warning/20 text-xs text-ink-primary dark:text-ink-light flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-state-warning flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-sans block text-state-warning">
              AVERTISSEMENT FORMEL ET LIMITES DE RESPONSABILITÉ :
            </strong>
            <p className="leading-relaxed">
              Le service Dr IPLOVE propose une écoute bénévole entre pairs universitaires. <strong>Il ne constitue ni un diagnostic médical, ni une psychothérapie, ni un conseil juridique formel.</strong> Si tu traverses une détresse vitale ou des violences physiques, contacte immédiatement les services d&apos;urgence officiels répertoriés sur notre page Urgences.
            </p>
          </div>
        </div>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-ink-primary dark:text-ink-light font-sans">
            1. Objet et Adhésion
          </h2>
          <p>
            L&apos;utilisation de Dr IPLOVE implique l&apos;acceptation pleine et sans réserve de la Charte de Confidentialité et des présentes Conditions Générales d&apos;Utilisation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-ink-primary dark:text-ink-light font-sans">
            2. Engagements de l&apos;Utilisateur
          </h2>
          <p>L&apos;étudiant s&apos;engage à :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Utiliser le service dans un esprit de sincérité et de respect mutuel.</li>
            <li>Ne pas tenter d&apos;identifier les répondants ou d&apos;autres étudiants utilisant le service.</li>
            <li>Ne pas utiliser la plateforme à des fins d&apos;injures, de menaces, d&apos;apologie de la violence, de harcèlement ou de partage non consenti de contenus intimes (*revenge porn*).</li>
            <li>Ne pas inonder la file de messages (spam) ni tenter d&apos;attaque informatique.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-ink-primary dark:text-ink-light font-sans">
            3. Sanctions en cas d&apos;abus
          </h2>
          <p>
            Tout compte se livrant à des comportements haineux, malveillants ou délictueux sera suspendu sans préavis par le Super-Administrateur, et la session immédiatement révoquée.
          </p>
        </section>
      </main>

      <MobileTabBar />
    </>
  );
}
