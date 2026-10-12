"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Inbox,
  AlertTriangle,
  Lock,
  Clock,
  Eye,
  CheckCircle,
  FileEdit,
  RefreshCw,
  Search,
} from "lucide-react";

interface QueueItem {
  id: string;
  studentPseudonym: string;
  category: string;
  status: string;
  priority: string;
  isSensitive: boolean;
  title?: string;
  updatedAt: string;
  assignedToName?: string;
  isLockedByMe: boolean;
  notesCount: number;
  messages: Array<{ content: string; senderType: string; createdAt: string }>;
}

export default function AdminQueuePage() {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "UNASSIGNED" | "MINE" | "SENSITIVE">("ALL");

  const fetchQueue = async () => {
    try {
      let url = "/api/admin/queue?";
      if (filter === "UNASSIGNED") url += "unassigned=true";
      if (filter === "MINE") url += "assignedToMe=true";
      if (filter === "SENSITIVE") url += "sensitive=true";

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setItems(data.queue || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000); // Polling temps réel anti-collision
    return () => clearInterval(interval);
  }, [filter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-accent-soft text-brand-accent-hover dark:bg-brand-accent-dark/20 dark:text-brand-accent-dark font-sans">
            Nouveau
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-state-info/10 text-state-info font-sans">
            En cours
          </span>
        );
      case "UNDER_REVIEW":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 font-sans">
            En relecture (4 yeux)
          </span>
        );
      case "ANSWERED":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-state-success/10 text-state-success font-sans">
            Répondu
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-line-subtle text-ink-muted font-sans">
            {status}
          </span>
        );
    }
  };

  const sensitiveCount = items.filter((i) => i.isSensitive).length;

  return (
    <div className="p-4 sm:p-6 max-w-6xl w-full mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-primary dark:text-ink-light font-sans flex items-center gap-2">
            <span>File des Messages Partagée</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary dark:bg-brand-mint/10 dark:text-brand-mint">
              {items.length} dossier(s)
            </span>
          </h1>
          <p className="text-xs text-ink-secondary dark:text-ink-muted font-body">
            Pool collaboratif multi-administrateurs avec protection anti-collision active.
          </p>
        </div>

        {sensitiveCount > 0 && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-state-warning/15 border border-state-warning/30 text-state-warning text-xs font-semibold animate-pulse">
            <AlertTriangle className="w-4 h-4" />
            <span>{sensitiveCount} message(s) sensible(s) prioritaire(s)</span>
          </div>
        )}
      </div>

      {/* Barre de filtres */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-light dark:bg-surface-dark p-3 rounded-xl border border-line-subtle dark:border-line-dark shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all ${
              filter === "ALL"
                ? "bg-brand-primary text-white shadow-xs"
                : "text-ink-secondary hover:bg-canvas-light dark:hover:bg-canvas-dark"
            }`}
          >
            Tous les messages
          </button>
          <button
            onClick={() => setFilter("UNASSIGNED")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all ${
              filter === "UNASSIGNED"
                ? "bg-brand-primary text-white shadow-xs"
                : "text-ink-secondary hover:bg-canvas-light dark:hover:bg-canvas-dark"
            }`}
          >
            Non assignés
          </button>
          <button
            onClick={() => setFilter("MINE")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all ${
              filter === "MINE"
                ? "bg-brand-primary text-white shadow-xs"
                : "text-ink-secondary hover:bg-canvas-light dark:hover:bg-canvas-dark"
            }`}
          >
            Pris en charge par moi
          </button>
          <button
            onClick={() => setFilter("SENSITIVE")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all ${
              filter === "SENSITIVE"
                ? "bg-state-danger text-white shadow-xs"
                : "text-state-danger hover:bg-state-danger/10"
            }`}
          >
            Sensibles / Alertes ({sensitiveCount})
          </button>
        </div>

        <button
          onClick={fetchQueue}
          className="p-2 text-ink-muted hover:text-ink-primary dark:hover:text-ink-light rounded-lg hover:bg-canvas-light dark:hover:bg-canvas-dark transition-colors"
          title="Actualiser la file"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Tableau de la file */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-line-subtle dark:border-line-dark shadow-sm overflow-hidden">
        {items.length === 0 ? (
          <div className="p-12 text-center text-xs text-ink-muted">
            <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Aucun message ne correspond aux critères sélectionnés.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-canvas-light dark:bg-canvas-dark border-b border-line-subtle dark:border-line-dark text-[11px] font-bold text-ink-muted uppercase font-sans">
                <tr>
                  <th className="p-3.5 pl-4">Statut</th>
                  <th className="p-3.5">Priorité</th>
                  <th className="p-3.5">Sujet & Extrait Anonyme</th>
                  <th className="p-3.5">Catégorie</th>
                  <th className="p-3.5">Prise en Charge (Anti-Collision)</th>
                  <th className="p-3.5 text-right pr-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-subtle/50 dark:divide-line-dark/50">
                {items.map((item) => {
                  const lastMsg = item.messages[item.messages.length - 1];
                  const timeAgo = new Date(item.updatedAt).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-canvas-light/50 dark:hover:bg-canvas-dark/50 transition-colors ${
                        item.isSensitive ? "bg-state-warning/5" : ""
                      }`}
                    >
                      {/* Statut */}
                      <td className="p-3.5 pl-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>

                      {/* Priorité */}
                      <td className="p-3.5 whitespace-nowrap">
                        {item.isSensitive ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-state-danger px-2 py-0.5 rounded-full bg-state-danger/10">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Sensible</span>
                          </span>
                        ) : (
                          <span className="text-ink-muted font-body">Normale</span>
                        )}
                      </td>

                      {/* Sujet & Extrait */}
                      <td className="p-3.5 max-w-xs sm:max-w-md">
                        <div className="font-bold text-ink-primary dark:text-ink-light font-sans line-clamp-1 mb-0.5">
                          {item.title || "Message sans titre"}
                        </div>
                        <p className="text-[11px] text-ink-secondary dark:text-ink-muted line-clamp-1 font-body">
                          {lastMsg ? lastMsg.content : "Nouveau fil..."}
                        </p>
                      </td>

                      {/* Catégorie */}
                      <td className="p-3.5 whitespace-nowrap text-ink-muted font-body">
                        {item.category}
                      </td>

                      {/* État Anti-Collision */}
                      <td className="p-3.5 whitespace-nowrap">
                        {item.assignedToName ? (
                          <div className="flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-brand-accent flex-shrink-0" />
                            <span
                              className={`text-[11px] font-semibold ${
                                item.isLockedByMe
                                  ? "text-brand-primary dark:text-brand-mint font-bold"
                                  : "text-ink-secondary dark:text-ink-muted"
                              }`}
                            >
                              {item.isLockedByMe
                                ? "Moi (Verrouillé)"
                                : item.assignedToName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-state-success font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-state-success" />
                            <span>Libre / Non assigné</span>
                          </span>
                        )}
                      </td>

                      {/* Bouton Action */}
                      <td className="p-3.5 text-right pr-4 whitespace-nowrap">
                        <Link
                          href={`/admin/message/${item.id}`}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all ${
                            item.isLockedByMe
                              ? "bg-brand-primary text-white hover:bg-brand-primary-light"
                              : item.assignedToName
                              ? "border border-line-subtle dark:border-line-dark text-ink-muted hover:bg-canvas-light"
                              : "bg-brand-mint text-ink-primary font-bold hover:bg-brand-mint/90 shadow-xs"
                          }`}
                        >
                          {item.isLockedByMe ? (
                            <>
                              <FileEdit className="w-3.5 h-3.5" />
                              <span>Traiter</span>
                            </>
                          ) : item.assignedToName ? (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>Consulter</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5" />
                              <span>Prendre en charge</span>
                            </>
                          )}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
