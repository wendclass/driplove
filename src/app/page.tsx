import Link from "next/link";
import Navbar from "@/components/Navbar";
import MobileTabBar from "@/components/MobileTabBar";
import HeroVisual from "@/components/HeroVisual";
import { getSession } from "@/lib/session";
import {
  ShieldCheck,
  Users,
  Clock,
  ArrowRight,
  PenSquare,
  MessageCircle,
  HelpCircle,
  Lock,
  Sparkles,
  CheckCircle2,
  Heart,
  EyeOff,
} from "lucide-react";

export default async function HomePage() {
  const session = await getSession();

  return (
    <>
      <Navbar
        userPseudonym={session?.pseudonym}
        role={session?.role}
      />

      <div className="relative overflow-hidden bg-dot-grid">
        {/* Halo lumineux subtil pour le contraste */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-zinc-100 to-transparent dark:from-zinc-900/40 pointer-events-none -z-10 blur-3xl opacity-60" />

        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-28 sm:pb-20 w-full">
          {/* Badge de statut animé */}
          <div className="text-center mb-6 animate-fade-in">
            <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-medium bg-white/90 dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 shadow-xs backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Cellule d&apos;écoute active • 100% Anonyme & Gratuit</span>
            </span>
          </div>

          {/* Hero Section & Message Directeur */}
          <section className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-black dark:text-white mb-6 leading-[1.12] animate-fade-in-up">
              « Ici, tu parles librement. <br />
              <span className="text-zinc-400 dark:text-zinc-500">
                Personne ne saura que c&apos;est toi. »
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6 max-w-xl mx-auto font-body animate-fade-in-up">
              Une écoute bienveillante, confidentielle et sans jugement pour tes questions de cœur, tes relations d&apos;amitié, ta famille ou ton estime de toi.
            </p>

            {/* Illustration Héro Animée Centrale */}
            <div className="my-6 animate-fade-in">
              <HeroVisual />
            </div>

            {/* Actions principales avec micro-interactions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto mt-8">
              <Link
                href={session ? "/etudiant/nouvelle-question" : "/sas"}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-semibold text-sm shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                <PenSquare className="w-4 h-4" />
                <span>Écrire au Dr IPLOVE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href={session ? "/etudiant" : "/connexion"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/90 dark:bg-zinc-950/90 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold text-sm hover:border-black dark:hover:border-white hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-sm"
              >
                <MessageCircle className="w-4 h-4 text-zinc-500" />
                <span>Mes messages</span>
              </Link>
            </div>
          </section>

          {/* SIMULATION VISUELLE WAOUH : Aperçu d'une discussion confidentielle */}
          <section className="mb-16 sm:mb-20">
            <div className="max-w-lg mx-auto p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-zinc-950/90 border border-zinc-200 dark:border-zinc-800 shadow-xl hover:shadow-2xl hover:border-black dark:hover:border-white transition-all duration-500 backdrop-blur-md">
              {/* Entête de la fenêtre de chat */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-100 dark:border-zinc-900 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  </div>
                  <span className="font-bold text-black dark:text-white flex items-center gap-1.5 ml-2">
                    <Lock className="w-3 h-3" />
                    Dr IPLOVE
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 font-medium">
                  Canal chiffré
                </span>
              </div>

              {/* Message de l'étudiant */}
              <div className="space-y-3 mb-4">
                <div className="flex flex-col items-end">
                  <div className="max-w-[85%] p-3.5 rounded-2xl rounded-tr-xs bg-zinc-100 dark:bg-zinc-900 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed">
                    « Je vis une rupture très difficile et je n&apos;ose en parler à personne... Je me sens totalement submergé(e). »
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-1 mr-1">
                    Toi (pseudonyme) • Lu
                  </span>
                </div>

                {/* Réponse du Dr IPLOVE */}
                <div className="flex flex-col items-start">
                  <div className="max-w-[88%] p-4 rounded-2xl rounded-tl-xs bg-black text-white dark:bg-white dark:text-black text-xs leading-relaxed shadow-sm">
                    <strong className="block mb-1 text-[11px] opacity-80">
                      Dr IPLOVE • Réponse fraternelle
                    </strong>
                    « Bonjour. Ce que tu ressens est douloureux et profondément légitime. Tu n&apos;es pas seul(e) avec ce vide. Prenons le temps d&apos;en parler ensemble, à ton rythme et sans aucun jugement... »
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-1 ml-1">
                    Équipe d&apos;écoute • Signature collective
                  </span>
                </div>
              </div>

              {/* Barre de réassurance technique sous le chat */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-900 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-500 font-mono">
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-black dark:text-white" />
                  Chiffré AES-256
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-black dark:text-white" />
                  Purgé sous 30 jours
                </span>
                <span className="inline-flex items-center gap-1">
                  <EyeOff className="w-3.5 h-3.5 text-black dark:text-white" />
                  Zéro nom civil
                </span>
              </div>
            </div>
          </section>

          {/* 3 Piliers d'Honneur — Cartes Élevées avec Hover Staggered */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16 sm:mb-20">
            <div className="group p-6 rounded-3xl bg-white/90 dark:bg-zinc-950/90 border border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-white hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white flex items-center justify-center mb-4 border border-zinc-200 dark:border-zinc-800 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-black dark:text-white mb-2">
                100% Anonyme
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-body">
                Zéro nom civil, zéro numéro de téléphone, aucune adresse IP enregistrée. Un simple pseudonyme suffit pour déposer ton fardeau en paix.
              </p>
            </div>

            <div className="group p-6 rounded-3xl bg-white/90 dark:bg-zinc-950/90 border border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-white hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white flex items-center justify-center mb-4 border border-zinc-200 dark:border-zinc-800 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-black dark:text-white mb-2">
                Écoute 100% Humaine
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-body">
                Aucun robot, aucun algorithme froid. Une équipe d&apos;écoutants formés à l&apos;écoute attentive, liée par un serment écrit de secret absolu.
              </p>
            </div>

            <div className="group p-6 rounded-3xl bg-white/90 dark:bg-zinc-950/90 border border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-white hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white flex items-center justify-center mb-4 border border-zinc-200 dark:border-zinc-800 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-black dark:text-white mb-2">
                Stockage Limité à 30 Jours
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-body">
                Tes confidences ne restent pas pour toujours : suppression automatique garantie après 30 jours, ou effacement immédiat d&apos;un simple clic.
              </p>
            </div>
          </section>

          {/* Parcours en 3 étapes avec ligne directrice */}
          <section className="mb-16 sm:mb-20 p-7 sm:p-9 rounded-3xl bg-zinc-50/80 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm">
            <div className="max-w-xl mx-auto text-center mb-8">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                Limpide & Sans Friction
              </span>
              <h3 className="text-xl font-extrabold text-black dark:text-white">
                Comment se déroule un échange ?
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
              <div className="space-y-2 p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold text-xs flex items-center justify-center">
                    01
                  </span>
                  <strong className="text-xs sm:text-sm text-black dark:text-white">
                    Tu poses ta question
                  </strong>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Choisis une catégorie et décris ce qui te pèse sous ton pseudonyme en toute tranquillité.
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold text-xs flex items-center justify-center">
                    02
                  </span>
                  <strong className="text-xs sm:text-sm text-black dark:text-white">
                    Tu reçois un éclairage
                  </strong>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Une réponse humaine et respectueuse sous signature collective « Dr IPLOVE » sous 24 à 48h.
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold text-xs flex items-center justify-center">
                    03
                  </span>
                  <strong className="text-xs sm:text-sm text-black dark:text-white">
                    Tu gardes le contrôle
                  </strong>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Poursuis la conversation ou détruis-la en un clic. Purge définitive sous 30 jours sans trace.
                </p>
              </div>
            </div>
          </section>

          {/* Section Transparence "Qui répond ?" (SANS MENTION IPERMIC/UJKZ POUR L'ÉQUIPE) */}
          <section className="mb-16 sm:mb-20 p-7 rounded-3xl bg-white/90 dark:bg-zinc-950/90 border border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-white transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2 text-black dark:text-white font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Transparence absolue</span>
                </div>
                <h3 className="text-lg font-extrabold text-black dark:text-white">
                  Qui est derrière le Dr IPLOVE ?
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-body">
                  Ce n&apos;est ni une personne isolée, ni une intelligence artificielle. C&apos;est une cellule d&apos;écoutants formés à l&apos;écoute attentive, à la neutralité et au non-jugement, unis sous une seule signature commune et soumis à une charte de secret absolu.
                </p>
              </div>

              <Link
                href="/qui-repond"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-black hover:text-white dark:bg-zinc-900 dark:hover:bg-white dark:hover:text-black text-black dark:text-white transition-all duration-200 flex-shrink-0 border border-zinc-200 dark:border-zinc-800"
              >
                <span>En savoir plus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* Accès discret aux Urgences */}
          <section className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-xs sm:text-sm font-bold text-black dark:text-white block">
                  Besoin d&apos;une aide urgente ou médicale immédiate ?
                </strong>
                <span className="text-[11px] text-zinc-500">
                  Ligne verte nationale d&apos;assistance, pompiers et services de santé d&apos;urgence.
                </span>
              </div>
            </div>
            <Link
              href="/aide-urgence"
              className="text-xs font-bold text-black dark:text-white hover:underline flex-shrink-0 px-3 py-1.5"
            >
              Consulter &rarr;
            </Link>
          </section>

          {/* Footer Minimaliste */}
          <footer className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500">
            <div className="flex flex-wrap justify-center gap-5 mb-4 font-medium">
              <Link href="/comment-ca-marche" className="hover:text-black dark:hover:text-white transition-colors">
                Comment ça marche
              </Link>
              <Link href="/qui-repond" className="hover:text-black dark:hover:text-white transition-colors">
                Qui répond ?
              </Link>
              <Link href="/chroniques" className="hover:text-black dark:hover:text-white transition-colors">
                Chroniques
              </Link>
              <Link href="/charte" className="hover:text-black dark:hover:text-white transition-colors">
                Charte d&apos;honneur
              </Link>
              <Link href="/faq" className="hover:text-black dark:hover:text-white transition-colors">
                FAQ
              </Link>
              <Link href="/politique-confidentialite" className="hover:text-black dark:hover:text-white transition-colors">
                Confidentialité (30 jours)
              </Link>
            </div>
            <p className="text-[11px] text-zinc-400">
              Dr IPLOVE • Espace d&apos;écoute anonyme et confidentiel • Conservation maximale de 30 jours
            </p>
          </footer>
        </main>
      </div>

      <MobileTabBar />
    </>
  );
}
