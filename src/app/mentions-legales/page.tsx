import Navbar from "@/components/Navbar";
import MobileTabBar from "@/components/MobileTabBar";

export default function MentionsLegalesPage() {
  return (
    <>
      <Navbar showBack backHref="/" title="Mentions Légales" />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 pb-28 sm:pb-14 w-full space-y-6 font-body text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        <h1 className="text-2xl font-extrabold text-black dark:text-white font-sans mb-4">
          Mentions Légales
        </h1>

        <section className="space-y-2 p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-base font-bold text-black dark:text-white font-sans">
            1. Éditeur de la Plateforme
          </h2>
          <p>
            La plateforme web « Dr IPLOVE » est un service bénévole d&apos;utilité étudiante administré par l&apos;équipe d&apos;écoute et d&apos;orientation de :
          </p>
          <p className="font-semibold text-black dark:text-white">
            IPERMIC (Institut Panafricain d&apos;Étude et de Recherche sur les Médias, l&apos;Information et la Communication)<br />
            Université Joseph Ki-Zerbo (UJKZ)<br />
            Ouagadougou, Burkina Faso.
          </p>
        </section>

        <section className="space-y-2 p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-base font-bold text-black dark:text-white font-sans">
            2. Responsable de la Publication
          </h2>
          <p>
            L&apos;équipe de coordination éditoriale et de médiation étudiante du Dr IPLOVE.
          </p>
        </section>

        <section className="space-y-2 p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-base font-bold text-black dark:text-white font-sans">
            3. Hébergement & Sécurité
          </h2>
          <p>
            L&apos;application est déployée sur une infrastructure de serveur virtuel dédié durci (VPS) avec chiffrement complet des flux et disques, sous certificat TLS/SSL délivré par l&apos;autorité Let&apos;s Encrypt.
          </p>
        </section>

        <section className="space-y-2 p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-base font-bold text-black dark:text-white font-sans">
            4. Propriété intellectuelle & Conservation limitée à 30 jours
          </h2>
          <p>
            Le nom « Dr IPLOVE », les éléments graphiques et la charte éditoriale sont la propriété de l&apos;équipe d&apos;écoute étudiante de l&apos;IPERMIC. Les données des conversations sont automatiquement et irréversiblement détruites après 30 jours conformément à notre politique de confidentialité.
          </p>
        </section>
      </main>

      <MobileTabBar />
    </>
  );
}
