"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import TrustBadge from "@/components/TrustBadge";
import { Send, AlertCircle, Heart, Users, Home, Smile, HelpCircle } from "lucide-react";
import { ConversationCategory } from "@/types";

export default function NouvelleQuestionPage() {
  const router = useRouter();
  const [category, setCategory] = useState<ConversationCategory>("COUPLE");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restauration du brouillon local
  useEffect(() => {
    const draft = sessionStorage.getItem("dr_draft_message");
    if (draft) setMessage(draft);
    const draftTitle = sessionStorage.getItem("dr_draft_title");
    if (draftTitle) setTitle(draftTitle);
  }, []);

  // Sauvegarde automatique du brouillon
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setMessage(val);
    sessionStorage.setItem("dr_draft_message", val);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    sessionStorage.setItem("dr_draft_title", val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (message.trim().length < 5) {
      setError("Merci de détailler un peu plus ta situation (au moins 5 caractères).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/student/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          title: title.trim() || undefined,
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Impossible d'envoyer la question.");
      } else {
        sessionStorage.removeItem("dr_draft_message");
        sessionStorage.removeItem("dr_draft_title");
        router.push(`/etudiant/conversation/${data.conversationId}`);
      }
    } catch {
      setError("Erreur de connexion. Ton brouillon reste sauvegardé.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "COUPLE", label: "Couple & Sentiments", icon: Heart },
    { id: "FRIENDSHIP", label: "Amitié", icon: Users },
    { id: "FAMILY", label: "Famille", icon: Home },
    { id: "SELF_ESTEEM", label: "Estime de soi", icon: Smile },
    { id: "OTHER", label: "Autre sujet", icon: HelpCircle },
  ];

  return (
    <>
      <Navbar showBack backHref="/etudiant" title="Poser une question" />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-6 pb-20 w-full">
        <div className="bg-surface-light dark:bg-surface-dark p-5 sm:p-7 rounded-2xl border border-line-subtle dark:border-line-dark shadow-sm">
          <div className="mb-5">
            <h1 className="text-xl sm:text-2xl font-bold text-ink-primary dark:text-ink-light mb-1 font-sans">
              Nouvelle Question au Dr IPLOVE
            </h1>
            <p className="text-xs text-ink-secondary dark:text-ink-muted font-body">
              Prends tout ton temps. Aucun jugement ne sera porté sur ce que tu ressens.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Sélection de Catégorie */}
            <div>
              <label className="block text-xs font-semibold text-ink-primary dark:text-ink-light mb-2 font-sans">
                Thématique de ta question :
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id as ConversationCategory)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all font-sans ${
                        isSelected
                          ? "bg-brand-primary text-white shadow-sm"
                          : "bg-canvas-light dark:bg-canvas-dark text-ink-secondary dark:text-ink-muted border border-line-subtle dark:border-line-dark hover:border-brand-primary/50"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sujet court */}
            <div>
              <label
                htmlFor="title"
                className="block text-xs font-semibold text-ink-primary dark:text-ink-light mb-1.5 font-sans"
              >
                Titre ou résumé court (Facultatif) :
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Ex: Comment lui parler sans conflit ?"
                className="w-full px-3.5 py-2.5 rounded-xl border border-line-subtle dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-ink-primary dark:text-ink-light text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary font-sans"
              />
            </div>

            {/* Champ message */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="message"
                  className="block text-xs font-semibold text-ink-primary dark:text-ink-light font-sans"
                >
                  Ton message en toute franchise :
                </label>
                <span className="text-[11px] text-ink-muted font-mono">
                  {message.length} / 2000
                </span>
              </div>
              <textarea
                id="message"
                rows={7}
                maxLength={2000}
                value={message}
                onChange={handleMessageChange}
                placeholder="Bonjour Dr IPLOVE, voilà ce qui me pèse en ce moment..."
                className="w-full p-3.5 rounded-xl border border-line-subtle dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-ink-primary dark:text-ink-light text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary font-body leading-relaxed resize-y"
                required
              />
            </div>

            <TrustBadge variant="banner" />

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-state-danger/10 border border-state-danger/20 text-xs text-state-danger">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-brand-primary hover:bg-brand-primary-light text-white font-semibold text-sm shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50 font-sans"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? "Chiffrement et envoi..." : "Confier ma question au Dr IPLOVE"}</span>
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
