import Navbar from "@/components/Navbar";
import MobileTabBar from "@/components/MobileTabBar";
import { ShieldCheck } from "lucide-react";

export default function ChartePage() {
  const engagements = [
    {
      num: 1,
      title: "Tu restes anonyme, par conception",
      desc: "Aucune pièce d'identité, aucun nom, aucun numéro de téléphone ni e-mail personnel n'est obligatoire. L'appartenance à l'IPERMIC est attestée par un code saisonnier partagé, mathématiquement indépendant de ton profil.",
    },
    {
      num: 2,
      title: "Tes messages sont lus uniquement par l'équipe d'écoute",
      desc: "Seuls les membres désignés de l'équipe d'écoute, formés à l'écoute attentive et liés par un serment écrit de secret absolu, ont accès aux dossiers. Côté étudiant, la réponse porte toujours la signature collective unique « Dr IPLOVE ».",
    },
    {
      num: 3,
      title: "Rien n'est publié sans ton accord formel",
      desc: "Aucun extrait de message n'est partagé ou publié sans ton accord préalable. Si une situation présente un intérêt pour les Chroniques, une version entièrement anonymisée t'est soumise pour validation préalable : tu es libre de refuser sans conséquence.",
    },
    {
      num: 4,
      title: "Aucune surveillance ni ingérence relationnelle",
      desc: "Le Dr IPLOVE refuse toute demande visant à surveiller, espionner, tester la fidélité ou violer la vie privée d'un partenaire ou d'un camarade. La vie privée des tiers est inviolable.",
    },
    {
      num: 5,
      title: "Droit à l'oubli réel et conservation limitée à 30 jours",
      desc: "Tu disposes d'un bouton de suppression immédiate. De plus, toute conversation close est automatiquement et irrévocablement purgée de nos serveurs après un délai strict de 30 jours.",
    },
    {
      num: 6,
      title: "Zéro monétisation, zéro traceur publicitaire",
      desc: "Le service est bénévole et sans but lucratif. Il ne contient aucun cookie publicitaire, aucun pixel de réseau social, et ne vendra jamais la moindre donnée.",
    },
    {
      num: 7,
      title: "Seule limite : la protection vitale",
      desc: "La confidentialité ne cède que devant un péril vital imminent ou une situation de violence extrême où une vie est en danger immédiat. Même dans ce cas rare, tu es toujours informé(e) en priorité des démarches d'orientation vers les secours officiels.",
    },
    {
      num: 8,
      title: "Écoute entre pairs et non consultation médicale",
      desc: "Les répondants du Dr IPLOVE sont des étudiants engagés, pas des médecins, des psychologues ou des avocats. Notre mission est d'écouter, réconforter et orienter vers les structures habilitées de l'université.",
    },
    {
      num: 9,
      title: "Respect inconditionnel et bienveillance",
      desc: "Quels que soient tes choix amoureux, tes doutes ou tes erreurs, tu es accueilli(e) avec considération, sans le moindre jugement moral.",
    },
  ];

  return (
    <>
      <Navbar showBack backHref="/" title="Charte de Confidentialité" />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 pb-28 sm:pb-14 w-full space-y-6 font-body">
        <div className="text-center max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white font-sans mb-2">
            La Charte de Confidentialité
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Notre contrat d&apos;honneur en 9 engagements tenus par la technique. Conservation maximale de 30 jours.
          </p>
        </div>

        <div className="space-y-4">
          {engagements.map((e) => (
            <div
              key={e.num}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1.5"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-black text-white dark:bg-white dark:text-black text-[11px] font-bold flex items-center justify-center font-sans">
                  {e.num}
                </span>
                <h2 className="text-sm sm:text-base font-bold text-black dark:text-white font-sans">
                  {e.title}
                </h2>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pl-8 font-body">
                {e.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      <MobileTabBar />
    </>
  );
}
