import Navbar from "@/components/Navbar";
import MobileTabBar from "@/components/MobileTabBar";

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <Navbar showBack backHref="/" title="Politique de Confidentialité" />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 pb-28 sm:pb-14 w-full space-y-6 font-body text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        <h1 className="text-2xl font-extrabold text-black dark:text-white font-sans mb-4">
          Politique de Confidentialité & Conservation (30 Jours)
        </h1>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <strong className="text-black dark:text-white font-sans block">
            Cadre légal applicable au Burkina Faso :
          </strong>
          <p>
            Cette politique est conforme à la <strong>Loi n° 001-2021/AN du 30 mars 2021 portant protection des données à caractère personnel au Burkina Faso</strong> et s&apos;aligne rigoureusement sur les recommandations de la <strong>Commission de l&apos;Informatique et des Libertés (CIL)</strong>.
          </p>
        </div>

        <section className="space-y-2 p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-base font-bold text-black dark:text-white font-sans">
            1. Données collectées et principe de minimisation
          </h2>
          <p>
            En application du principe de minimisation absolue, la plateforme ne collecte que le strict nécessaire :
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Obligatoire</strong> : Un pseudonyme (libre), un mot de passe (haché via scrypt), les messages de tes conversations (chiffrés au repos en AES-256-GCM).</li>
            <li><strong>Facultatif</strong> : Une adresse e-mail de secours (chiffrée et isolée) pour réinitialiser ton mot de passe.</li>
            <li><strong>Non collecté</strong> : Aucun nom, prénom, numéro de téléphone, matricule d&apos;étudiant ni adresse IP n&apos;est enregistré.</li>
          </ul>
        </section>

        <section className="space-y-2 p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-base font-bold text-black dark:text-white font-sans">
            2. Durée de conservation stricte : 30 jours
          </h2>
          <p>
            Par principe de précaution et d&apos;hygiène numérique :
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Toute conversation est conservée pour une durée maximale de <strong>30 jours</strong> après son dernier échange.</li>
            <li>Passé ce délai, les messages et données associées sont automatiquement et irréversiblement détruits par un script de purge.</li>
            <li>Tu peux à tout moment devancer cette purge et supprimer immédiatement ta conversation ou ton compte entier depuis tes paramètres.</li>
          </ul>
        </section>

        <section className="space-y-2 p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-base font-bold text-black dark:text-white font-sans">
            3. Sécurité et Chiffrement
          </h2>
          <p>
            Les communications sont protégées en transit par HTTPS (TLS 1.3). Au repos, les messages sont scellés par un chiffrement symétrique AES-256-GCM avec vecteur d&apos;initialisation aléatoire unique. Même en cas d&apos;intrusion physique sur la base de données, les textes restent illisibles sans la clé maîtresse applicative.
          </p>
        </section>

        <section className="space-y-2 p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-base font-bold text-black dark:text-white font-sans">
            4. Contact et Réclamations
          </h2>
          <p>
            Pour toute question relative à tes données, tu peux contacter l&apos;équipe d&apos;écoute et de protection des données de l&apos;IPERMIC ou saisir la Commission de l&apos;Informatique et des Libertés (CIL) du Burkina Faso.
          </p>
        </section>
      </main>

      <MobileTabBar />
    </>
  );
}
