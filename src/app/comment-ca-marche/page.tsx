import Navbar from "@/components/Navbar";
import MobileTabBar from "@/components/MobileTabBar";
import Link from "next/link";
import { KeyRound, PenSquare, MessageCircle, Trash2, ArrowRight } from "lucide-react";

export default function CommentCaMarchePage() {
  const steps = [
    {
      num: "01",
      icon: KeyRound,
      title: "Accède avec le pass étudiant",
      desc: "Saisis le pass saisonnier partagé. Il atteste ton appartenance à la communauté de l'IPERMIC sans jamais demander ton nom ni ta carte d'étudiant.",
    },
    {
      num: "02",
      icon: PenSquare,
      title: "Choisis un pseudo et pose ta question",
      desc: "Prends un pseudonyme anonyme (ou laisse le générateur t'en proposer un). Écris ce que tu ressens en toute liberté.",
    },
    {
      num: "03",
      icon: MessageCircle,
      title: "Reçois une réponse humaine en 24h à 48h",
      desc: "Un membre formé de notre équipe analyse ta situation avec attention. La réponse apparaît sous la signature collective « Dr IPLOVE ».",
    },
    {
      num: "04",
      icon: Trash2,
      title: "Garde le contrôle ou efface tout",
      desc: "Tu peux poursuivre la discussion, supprimer la conversation quand tu veux, ou laisser la purge automatique détruire tout après 30 jours.",
    },
  ];

  return (
    <>
      <Navbar showBack backHref="/" title="Comment ça marche ?" />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 pb-28 sm:pb-14 w-full space-y-8 font-body">
        <div className="text-center max-w-xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white font-sans mb-3">
            Comment ça marche ?
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Un processus simple, rapide et confidentiel conçu pour préserver ton intimité à 100%.
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((s) => {
            return (
              <div
                key={s.num}
                className="flex items-start gap-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white flex items-center justify-center flex-shrink-0 font-bold font-sans text-sm">
                  {s.num}
                </div>
                <div className="space-y-1">
                  <h2 className="text-sm sm:text-base font-bold text-black dark:text-white font-sans">
                    {s.title}
                  </h2>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-body">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <Link
            href="/sas"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-semibold text-sm shadow font-sans transition-all"
          >
            <span>Faire le premier pas (Anonyme)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <MobileTabBar />
    </>
  );
}
