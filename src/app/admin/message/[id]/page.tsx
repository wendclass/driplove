"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Lock,
  Unlock,
  AlertTriangle,
  Send,
  Eye,
  FileText,
  Clock,
  Heart,
  CheckCircle,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { DecryptedConversation, ResponseTemplate } from "@/types";

export default function AdminMessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [conversation, setConversation] =
    useState<DecryptedConversation | null>(null);
  const [notes, setNotes] = useState<
    Array<{ id: string; authorName: string; text: string; createdAt: string }>
  >([]);
  const [currentAdmin, setCurrentAdmin] = useState<{ id: string; name: string } | null>(null);

  const [lockStatus, setLockStatus] = useState<{
    isLockedByMe: boolean;
    lockedByName?: string;
    expiresAt?: string;
  }>({ isLockedByMe: false });

  const [activeTab, setActiveTab] = useState<"RESPOND" | "NOTES">("RESPOND");
  const [responseText, setResponseText] = useState("");
  const [newNoteText, setNewNoteText] = useState("");
  const [templates, setTemplates] = useState<ResponseTemplate[]>([]);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [addingNote, setAddingNote] = useState(false);
  const [requestingReview, setRequestingReview] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Chargement des données et tentative de verrouillage
  const loadData = async () => {
    try {
      const res = await fetch(`/api/admin/message/${id}`);
      if (!res.ok) {
        if (res.status === 403) router.push("/connexion");
        return;
      }
      const data = await res.json();
      setConversation(data.conversation);
      setNotes(data.notes || []);
      setCurrentAdmin(data.currentAdmin);

      // Tenter d'acquérir le verrou
      const lockRes = await fetch(`/api/admin/message/${id}/lock`, {
        method: "POST",
      });
      const lockData = await lockRes.json();

      if (lockRes.ok) {
        setLockStatus({
          isLockedByMe: true,
          lockedByName: data.currentAdmin?.name,
          expiresAt: lockData.lock?.expiresAt,
        });
      } else {
        setLockStatus({
          isLockedByMe: false,
          lockedByName: lockData.lock?.lockedByName || "Un autre répondant",
          expiresAt: lockData.lock?.expiresAt,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const res = await fetch("/api/admin/templates");
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.templates || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
    loadTemplates();
  }, [id]);

  const handleSelectTemplate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tmplId = e.target.value;
    if (!tmplId) return;
    const tmpl = templates.find((t) => t.id === tmplId);
    if (tmpl) {
      setResponseText(tmpl.content);
    }
  };

  const handleReleaseLock = async () => {
    try {
      await fetch(`/api/admin/message/${id}/lock`, { method: "DELETE" });
      setLockStatus({ isLockedByMe: false });
      setNotification("Verrou libéré. Un autre répondant peut maintenant intervenir.");
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendResponse = async () => {
    if (!responseText.trim() || sending) return;
    setSending(true);
    setNotification(null);

    try {
      const res = await fetch(`/api/admin/message/${id}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responseText: responseText.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Erreur lors de l'envoi");
      } else {
        alert("Réponse officielle 'Dr IPLOVE' envoyée avec succès à l'étudiant !");
        router.push("/admin");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || addingNote) return;
    setAddingNote(true);

    try {
      const res = await fetch(`/api/admin/message/${id}/note`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: newNoteText.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setNotes([
          ...notes,
          {
            id: data.note.id,
            authorName: data.note.authorName,
            text: newNoteText.trim(),
            createdAt: data.note.createdAt,
          },
        ]);
        setNewNoteText("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAddingNote(false);
    }
  };

  const handleRequestReview = async () => {
    if (!responseText.trim() || requestingReview) {
      alert("Rédige d'abord un projet de réponse avant de demander une relecture.");
      return;
    }

    setRequestingReview(true);
    try {
      const res = await fetch(`/api/admin/message/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftText: responseText.trim() }),
      });

      if (res.ok) {
        alert("Demande de relecture soumise à l'équipe avec succès. Statut passé à 'En relecture'.");
        router.push("/admin");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRequestingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-ink-muted">
        <Clock className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-primary" />
        <span>Vérification du verrou et déchiffrement du dossier...</span>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="p-8 text-center text-xs text-ink-muted">
        Dossier introuvable.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl w-full mx-auto space-y-4">
      {/* Barre d'en-tête et Statut du verrou */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line-subtle dark:border-line-dark">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-xl hover:bg-canvas-light dark:hover:bg-canvas-dark text-ink-secondary"
            title="Retour à la file"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-ink-primary dark:text-ink-light font-sans">
              Dossier #{conversation.id.slice(-4)} • {conversation.title || "Question confidentielle"}
            </h1>
            <span className="text-[11px] text-ink-muted font-body">
              Catégorie : {conversation.category} • Statut : {conversation.status}
            </span>
          </div>
        </div>

        {/* Badge Anti-Collision */}
        <div className="flex items-center gap-2">
          {lockStatus.isLockedByMe ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary dark:text-brand-mint text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>Verrouillé par moi (Expire dans 20m)</span>
              <button
                onClick={handleReleaseLock}
                className="ml-2 text-[11px] underline hover:text-brand-accent"
              >
                Libérer
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-state-warning/15 border border-state-warning/30 text-state-warning text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>
                Pris en charge par <strong>{lockStatus.lockedByName}</strong> (Lecture seule)
              </span>
            </div>
          )}
        </div>
      </div>

      {notification && (
        <div className="p-3 rounded-xl bg-state-info/10 text-state-info text-xs">
          {notification}
        </div>
      )}

      {/* Grille deux colonnes : Messages à gauche, Réponse & Notes à droite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Colonne Gauche : Échanges (7 colonnes) */}
        <div className="lg:col-span-7 space-y-4 bg-surface-light dark:bg-surface-dark p-5 rounded-2xl border border-line-subtle dark:border-line-dark shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-line-subtle dark:border-line-dark">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted font-sans">
              Échanges avec l&apos;étudiant(e)
            </h2>
            {conversation.isSensitive && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-state-danger px-2.5 py-0.5 rounded-full bg-state-danger/10">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Cas Sensible Détecté</span>
              </span>
            )}
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
            {conversation.messages.map((m) => {
              const isStudent = m.senderType === "STUDENT";
              return (
                <div
                  key={m.id}
                  className={`p-4 rounded-xl text-xs font-body leading-relaxed ${
                    isStudent
                      ? "bg-canvas-light dark:bg-canvas-dark border border-line-subtle dark:border-line-dark"
                      : "bg-brand-primary/5 dark:bg-brand-mint/5 border border-brand-primary/15 dark:border-brand-mint/15"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-ink-primary dark:text-ink-light font-sans">
                      {isStudent ? "Étudiant (Pseudonyme protégé)" : "Réponse officielle « Dr IPLOVE »"}
                    </span>
                    <span className="text-[10px] text-ink-muted">
                      {new Date(m.createdAt).toLocaleString("fr-FR")}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-ink-primary dark:text-ink-light">
                    {m.content}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Colonne Droite : Traitement, Modèles & Notes (5 colonnes) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl border border-line-subtle dark:border-line-dark shadow-xs space-y-4">
            {/* Onglets Rédaction vs Notes */}
            <div className="flex items-center gap-2 p-1 bg-canvas-light dark:bg-canvas-dark rounded-xl border border-line-subtle dark:border-line-dark">
              <button
                onClick={() => setActiveTab("RESPOND")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all ${
                  activeTab === "RESPOND"
                    ? "bg-surface-light dark:bg-surface-dark text-brand-primary dark:text-brand-mint shadow-xs"
                    : "text-ink-muted hover:text-ink-primary"
                }`}
              >
                Réponse Officielle
              </button>
              <button
                onClick={() => setActiveTab("NOTES")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "NOTES"
                    ? "bg-surface-light dark:bg-surface-dark text-brand-primary dark:text-brand-mint shadow-xs"
                    : "text-ink-muted hover:text-ink-primary"
                }`}
              >
                <span>Notes Internes</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-line-subtle dark:bg-line-dark">
                  {notes.length}
                </span>
              </button>
            </div>

            {/* Onglet Rédaction */}
            {activeTab === "RESPOND" && (
              <div className="space-y-4">
                {/* Sélecteur de Modèles */}
                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1 font-sans">
                    Insérer un modèle pré-validé :
                  </label>
                  <select
                    onChange={handleSelectTemplate}
                    disabled={!lockStatus.isLockedByMe}
                    className="w-full p-2.5 rounded-xl border border-line-subtle dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-xs text-ink-primary dark:text-ink-light focus:outline-none focus:ring-2 focus:ring-brand-primary font-sans disabled:opacity-50"
                  >
                    <option value="">-- Choisir un modèle d&apos;écoute --</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Zone de texte de la réponse */}
                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1 font-sans">
                    Texte de la réponse (signé « Dr IPLOVE ») :
                  </label>
                  <textarea
                    rows={8}
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Rédige avec bienveillance et respect de la charte..."
                    disabled={!lockStatus.isLockedByMe}
                    className="w-full p-3 rounded-xl border border-line-subtle dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-xs text-ink-primary dark:text-ink-light focus:outline-none focus:ring-2 focus:ring-brand-primary font-body leading-relaxed resize-y disabled:opacity-50"
                  />
                  <span className="text-[10px] text-ink-muted mt-1 block">
                    Côté étudiant : signé uniquement <strong>« Dr IPLOVE »</strong>. Ton nom réel est tracé dans le journal d&apos;audit.
                  </span>
                </div>

                {/* Actions Réponse */}
                {lockStatus.isLockedByMe ? (
                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={handleSendResponse}
                      disabled={sending || !responseText.trim()}
                      className="w-full py-3 px-4 rounded-xl bg-brand-primary hover:bg-brand-primary-light text-white font-semibold text-xs shadow flex items-center justify-center gap-2 disabled:opacity-50 font-sans"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{sending ? "Envoi..." : "Envoyer sous « Dr IPLOVE »"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRequestReview}
                      disabled={requestingReview || !responseText.trim()}
                      className="w-full py-2.5 px-3 rounded-xl border border-brand-accent text-brand-accent hover:bg-brand-accent/5 font-semibold text-xs flex items-center justify-center gap-2 disabled:opacity-50 font-sans"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Demander relecture à 4 yeux (Cas sensible)</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-canvas-light dark:bg-canvas-dark text-center text-xs text-ink-muted">
                    Pour rédiger une réponse, tu dois détenir le verrou exclusif.
                  </div>
                )}
              </div>
            )}

            {/* Onglet Notes Internes */}
            {activeTab === "NOTES" && (
              <div className="space-y-4">
                <div className="space-y-2.5 max-h-56 overflow-y-auto">
                  {notes.length === 0 ? (
                    <p className="text-xs text-ink-muted text-center py-4">
                      Aucune note pour ce dossier. Ajoute tes observations pour l&apos;équipe.
                    </p>
                  ) : (
                    notes.map((n) => (
                      <div
                        key={n.id}
                        className="p-3 rounded-xl bg-canvas-light dark:bg-canvas-dark border border-line-subtle dark:border-line-dark text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-bold text-[11px] text-ink-primary dark:text-ink-light">
                          <span>{n.authorName}</span>
                          <span className="text-[10px] text-ink-muted font-normal">
                            {new Date(n.createdAt).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-ink-secondary dark:text-ink-muted font-body">
                          {n.text}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-line-subtle dark:border-line-dark">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Ajouter une note d'équipe confidentielle..."
                    className="w-full px-3 py-2 rounded-xl border border-line-subtle dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-xs text-ink-primary dark:text-ink-light focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                  <button
                    type="submit"
                    disabled={addingNote || !newNoteText.trim()}
                    className="w-full py-2 rounded-xl bg-elevated-light dark:bg-elevated-dark border border-line-subtle dark:border-line-dark hover:bg-canvas-light text-xs font-semibold font-sans disabled:opacity-50"
                  >
                    {addingNote ? "Enregistrement..." : "Enregistrer la note"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
