import Navbar from "@/components/Navbar";
import MobileTabBar from "@/components/MobileTabBar";
import Link from "next/link";
import { Users, ShieldCheck, HeartHandshake, Eye, ArrowRight, BotOff, Award } from "lucide-react";

export default function QuiRepondPage() {
  return (
    <>
      <Navbar showBack backHref="/" title="Qui répond ?" />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 pb-28 sm:pb-14 w-full space-y-8 font-body">
        {/* Titre & Chapeau */}
        <div className="text-center max-w-xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white border border-zinc-200 dark:border-zinc-800 font-sans mb-3">
            <HeartHandshake className="w-3.5 h-3.5" />
            Transparence Radicale
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white font-sans mb-3">
            Qui est derrière le Dr IPLOVE ?
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Tu te demandes qui lit tes mots ? C&apos;est légitime. Pour te confier en paix, tu as le droit de savoir exactement comment notre équipe fonctionne.
          </p>
        </div>

        {/* 4 Piliers d'Honnêteté */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
              <BotOff className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-black dark:text-white font-sans">
              Zéro Intelligence Artificielle
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Le Dr IPLOVE n&apos;est pas un algorithme froid ni un chatbot. Chaque message est lu, médité et rédigé par un être humain bienveillant.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-black dark:text-white font-sans">
              Une Équipe Collective
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Ce n&apos;est pas une personne isolée ni un &quot;gourou&quot;. C&apos;est un collectif d&apos;écoutants formés à l&apos;écoute attentive et bienveillante, unis sous une seule signature commune.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-black dark:text-white font-sans">
              Liés par Serment Écrit
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Chaque répondant a signé un engagement de secret absolu interdisant formellement de chercher à t&apos;identifier, de faire des captures ou d&apos;ébruiter tes confidences.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
              <Eye className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-black dark:text-white font-sans">
              La Règle des 4 Yeux
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Pour les situations délicates, les réponses sont relues et validées à deux en interne avant envoi pour t&apos;apporter le conseil le plus sage et protecteur.
            </p>
          </div>
        </div>

        {/* Cadre de limites */}
        <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <h2 className="text-base font-bold text-black dark:text-white font-sans flex items-center gap-2">
            <Award className="w-5 h-5 text-black dark:text-white" />
            <span>Notre Rôle et Nos Limites</span>
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Nous sommes des pairs formés à l&apos;écoute active, à la déculpabilisation et à la reformulation. Cependant, nous ne sommes ni psychologues cliniciens, ni médecins, ni magistrats. Notre rôle est de t&apos;écouter avec fraternité et de t&apos;orienter vers les professionnels habilités lorsque ta situation l&apos;exige.
          </p>
          <div className="pt-2">
            <Link
              href="/aide-urgence"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-black dark:text-white hover:underline font-sans"
            >
              <span>Consulter l&apos;annuaire des services d&apos;urgence et de santé</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <MobileTabBar />
    </>
  );
}
