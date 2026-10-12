"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import MobileTabBar from "@/components/MobileTabBar";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Est-ce que mes camarades ou mes professeurs peuvent savoir que j'ai écrit ?",
      a: "Non, c'est strictement impossible. Tu n'utilises aucun identifiant civil réel (ni nom, ni matricule, ni e-mail obligatoire), et tes échanges ne sont visibles que par l'équipe d'astreinte sur un back-office chiffré.",
    },
    {
      q: "Le Dr IPLOVE est-il une intelligence artificielle ?",
      a: "Absolument pas. Chaque réponse est pensée et rédigée par un être humain, écoutant formé à l'écoute bienveillante et au non-jugement.",
    },
    {
      q: "Combien de temps faut-il pour recevoir une réponse ?",
      a: "Nous répondons généralement sous 24 à 48 heures. En période d'examens ou de congés universitaires, ce délai peut légèrement s'étendre, mais nous mettons un point d'honneur à ne laisser personne sans écoute.",
    },
    {
      q: "Combien de temps mes données sont-elles conservées ?",
      a: "Tes données sont conservées pendant un délai strict de 30 jours maximum. Tu peux également supprimer n'importe quelle discussion ou ton compte entier immédiatement. Après 30 jours d'inactivité, une purge automatique irréversible efface tout de la base.",
    },
    {
      q: "Pourquoi me demande-t-on un pass étudiant au départ ?",
      a: "Ce code partagé sert uniquement à s'assurer que le service reste réservé à la communauté de l'IPERMIC sans avoir à collecter ton nom ou ta carte d'étudiant.",
    },
    {
      q: "Puis-je continuer la discussion après la première réponse ?",
      a: "Oui. Le Dr IPLOVE fonctionne comme une messagerie : tu peux répondre, poser des questions complémentaires ou donner des nouvelles tant que la conversation n'est pas close.",
    },
    {
      q: "Qui choisit les questions publiées dans les Chroniques ?",
      a: "Seules les situations porteuses d'un enseignement général peuvent être proposées. Mais attention : RIEN n'est publié sans que tu aies relu la version anonymisée et cliqué sur « J'accepte la publication ».",
    },
    {
      q: "Et si je refuse qu'on publie mon histoire ?",
      a: "Elle ne sera JAMAIS publiée. Ton refus est un droit absolu et ne change absolument rien à la qualité de l'écoute que tu reçois.",
    },
    {
      q: "Que faire si j'oublie mon mot de passe ?",
      a: "Si tu n'as pas renseigné d'adresse e-mail de secours facultative, ton mot de passe est irrécupérable (pour protéger ton anonymat). Tu devras alors recréer un nouveau pseudonyme.",
    },
    {
      q: "Peut-on vous poser des questions sur la sexualité ou la santé intime ?",
      a: "Oui, avec respect et sincérité. Nous répondrons sur le plan affectif et relationnel, et nous t'orienterons vers le centre médico-social de l'UJKZ pour toute question médicale ou de contraception.",
    },
    {
      q: "Puis-je vous demander de surveiller quelqu'un ou de me dire si mon partenaire me trompe ?",
      a: "Non. Le Dr IPLOVE n'intervient jamais dans la surveillance ou l'espionnage de tiers. Nous t'aiderons en revanche à réfléchir à la confiance et à la communication dans ton couple.",
    },
    {
      q: "Comment puis-je effacer mes traces ?",
      a: "Dans ta conversation, clique sur l'icône corbeille pour la supprimer immédiatement. Dans tes paramètres, tu peux aussi détruire définitivement l'ensemble de ton compte en un clic.",
    },
    {
      q: "Que se passe-t-il après les 30 jours de clôture ?",
      a: "La conversation est automatiquement détruite par un script de purge irréversible de nos serveurs, y compris dans nos sauvegardes.",
    },
    {
      q: "Y a-t-il des sujets que vous ne traitez pas ?",
      a: "Nous ne traitons pas les questions scolaires/académiques (notes, cours), les transactions financières, ni les messages injurieux ou de spam.",
    },
    {
      q: "Que faites-vous si quelqu'un est en grand danger ?",
      a: "Nous prenons le message en priorité absolue, nous apportons un soutien immédiat et nous fournissons les coordonnées directes des services d'urgence et de soutien médical qualifiés.",
    },
  ];

  return (
    <>
      <Navbar showBack backHref="/" title="Foire aux questions" />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 pb-28 sm:pb-14 w-full space-y-6 font-body">
        <div className="text-center max-w-xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white font-sans mb-3">
            Foire Aux Questions (FAQ)
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Tout ce que tu dois savoir sur le fonctionnement, l&apos;anonymat, la conservation pendant 30 jours et la sécurité du Dr IPLOVE.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-black dark:text-white font-sans hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  <span>{f.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-black dark:text-white flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-zinc-600 dark:text-zinc-400 font-body leading-relaxed border-t border-zinc-100 dark:border-zinc-900">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <MobileTabBar />
    </>
  );
}
