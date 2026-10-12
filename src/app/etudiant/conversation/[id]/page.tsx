"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Send,
  Trash2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Heart,
  CheckCheck,
} from "lucide-react";
import { DecryptedConversation } from "@/types";

export default function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [conversation, setConversation] =
    useState<DecryptedConversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversation = async () => {
    try {
      const res = await fetch(`/api/student/conversations/${id}`);
      if (!res.ok) {
        if (res.status === 401) router.push("/connexion");
        return;
      }
      const data = await res.json();
      setConversation(data.conversation);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversation();
    const interval = setInterval(fetchConversation, 10000); // Polling doux 10s
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch(`/api/student/conversations/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyText.trim() }),
      });
      if (res.ok) {
        setReplyText("");
        await fetchConversation();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/student/conversations/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/etudiant");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar showBack backHref="/etudiant" title="Chargement..." />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-xs text-ink-muted">
            <Clock className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-primary" />
            <span>Déchiffrement sécurisé de ta discussion...</span>
          </div>
        </main>
      </>
    );
  }

  if (!conversation) {
    return (
      <>
        <Navbar showBack backHref="/etudiant" title="Erreur" />
        <main className="flex-1 max-w-md mx-auto p-8 text-center">
          <p className="text-sm text-ink-secondary mb-4">
            Cette conversation est introuvable ou a déjà été supprimée.
          </p>
          <Link
            href="/etudiant"
            className="text-xs font-semibold text-brand-primary hover:underline"
          >
            Retourner à mes échanges
          </Link>
        </main>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas-light dark:bg-canvas-dark">
      {/* En-tête sécurisé de la conversation */}
      <header className="sticky top-0 z-40 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md border-b border-line-subtle dark:border-line-dark">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Link
              href="/etudiant"
              className="p-1.5 -ml-1.5 rounded-full hover:bg-canvas-light dark:hover:bg-canvas-dark text-ink-secondary"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h2 className="text-sm font-bold text-ink-primary dark:text-ink-light font-sans line-clamp-1">
                {conversation.title || "Fil confidentiel"}
              </h2>
              <span className="text-[10px] text-brand-primary dark:text-brand-mint flex items-center gap-1 font-sans">
                <ShieldCheck className="w-3 h-3" />
                <span>Dr IPLOVE • Secret scellé</span>
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-2 text-state-danger hover:bg-state-danger/10 rounded-xl transition-colors"
            title="Supprimer cette discussion"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Corps du fil de messages */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 space-y-4 pb-28">
        {/* Badge d'accueil confidentiel */}
        <div className="text-center my-3">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] bg-elevated-light dark:bg-elevated-dark text-ink-muted border border-line-subtle dark:border-line-dark font-sans">
            Échange privé et chiffré au repos
          </span>
        </div>

        {conversation.messages.map((msg) => {
          const isStudent = msg.senderType === "STUDENT";
          const timeStr = new Date(msg.createdAt).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${
                isStudent ? "items-end" : "items-start"
              } animate-bubble`}
            >
              {/* Badge émetteur pour Dr IPLOVE */}
              {!isStudent && (
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <div className="w-4 h-4 rounded-full bg-brand-primary text-white flex items-center justify-center">
                    <Heart className="w-2.5 h-2.5 fill-brand-accent text-brand-accent" />
                  </div>
                  <span className="text-[11px] font-bold text-brand-primary dark:text-brand-mint font-sans">
                    Dr IPLOVE
                  </span>
                </div>
              )}

              {/* Bulle de texte */}
              <div
                className={`max-w-[88%] sm:max-w-[80%] p-4 rounded-bubble text-sm leading-relaxed whitespace-pre-wrap font-body shadow-sm ${
                  isStudent
                    ? "bg-brand-primary text-white rounded-br-none"
                    : "bg-surface-light dark:bg-surface-dark text-ink-primary dark:text-ink-light border border-line-subtle dark:border-line-dark rounded-bl-none"
                }`}
              >
                {msg.content}

                <div
                  className={`flex items-center justify-end gap-1 text-[10px] mt-2 ${
                    isStudent ? "text-white/75" : "text-ink-muted"
                  }`}
                >
                  <span>{timeStr}</span>
                  {isStudent && <CheckCheck className="w-3 h-3 text-brand-mint" />}
                </div>
              </div>
            </div>
          );
        })}

        {/* État : Réflexion en cours */}
        {conversation.status === "IN_PROGRESS" ||
        conversation.status === "UNDER_REVIEW" ? (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-light dark:bg-surface-dark border border-line-subtle dark:border-line-dark text-xs text-ink-secondary">
            <Clock className="w-4 h-4 text-brand-accent animate-spin" />
            <span>Un membre de l&apos;équipe est en train d&apos;étudier ton message avec attention...</span>
          </div>
        ) : null}

        <div ref={messagesEndRef} />
      </main>

      {/* Barre de saisie en bas */}
      <footer className="fixed bottom-0 left-0 right-0 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md border-t border-line-subtle dark:border-line-dark p-3 safe-bottom">
        <form
          onSubmit={handleSendReply}
          className="max-w-2xl mx-auto flex items-center gap-2"
        >
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Poursuivre la discussion avec le Dr IPLOVE..."
            className="flex-1 px-4 py-2.5 rounded-full border border-line-subtle dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-ink-primary dark:text-ink-light text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary font-body"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!replyText.trim() || sending}
            className="w-10 h-10 rounded-full bg-brand-primary hover:bg-brand-primary-light disabled:opacity-40 text-white flex items-center justify-center shadow transition-all flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </footer>

      {/* Modale de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-light dark:bg-surface-dark max-w-sm w-full p-6 rounded-2xl border border-line-subtle dark:border-line-dark shadow-xl animate-bubble">
            <div className="w-12 h-12 rounded-2xl bg-state-danger/10 text-state-danger flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-ink-primary dark:text-ink-light mb-2 font-sans">
              Supprimer cette conversation ?
            </h3>

            <p className="text-xs text-ink-secondary dark:text-ink-muted leading-relaxed mb-6 font-body">
              Cette action est irréversible. Tous les messages de ce fil seront immédiatement effacés de nos serveurs.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-line-subtle dark:border-line-dark text-xs font-semibold text-ink-primary dark:text-ink-light hover:bg-canvas-light dark:hover:bg-canvas-dark font-sans"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-state-danger hover:bg-red-700 text-white text-xs font-semibold shadow font-sans disabled:opacity-50"
              >
                {deleting ? "Suppression..." : "Oui, supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
