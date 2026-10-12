"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, ArrowLeft, ShieldCheck, RefreshCw, Lock } from "lucide-react";
import { AuditLog } from "@/types";

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/admin/audit");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-6xl w-full mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4 pb-3 border-b border-line-subtle dark:border-line-dark">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-xl hover:bg-canvas-light dark:hover:bg-canvas-dark text-ink-secondary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-ink-primary dark:text-ink-light font-sans flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-accent" />
              <span>Journal d&apos;Audit Inaltérable (Super-Admin)</span>
            </h1>
            <p className="text-xs text-ink-secondary dark:text-ink-muted font-body">
              Registre chronologique des accès et des réponses, conforme aux prescriptions de la CIL.
            </p>
          </div>
        </div>

        <button
          onClick={fetchLogs}
          className="p-2 text-ink-muted hover:text-ink-primary rounded-lg hover:bg-canvas-light transition-colors"
          title="Rafraîchir"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Bannière de conformité */}
      <div className="p-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-line-subtle dark:border-line-dark text-xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-brand-mint flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-ink-primary dark:text-ink-light block font-sans mb-0.5">
            Protection de l&apos;anonymat des étudiants garantie
          </strong>
          <span className="text-ink-secondary dark:text-ink-muted font-body">
            Ce registre trace les actions internes des administrateurs (qui a répondu, qui a posé un verrou) mais ne conserve **aucun extrait textuel de confidence étudiante** afin de préserver l&apos;intimité absolue des membres du club.
          </span>
        </div>
      </div>

      {/* Tableau d'Audit */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-line-subtle dark:border-line-dark shadow-xs overflow-hidden">
        {logs.length === 0 ? (
          <div className="p-10 text-center text-xs text-ink-muted">
            Aucun événement journalisé pour le moment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-canvas-light dark:bg-canvas-dark border-b border-line-subtle dark:border-line-dark text-[11px] font-bold text-ink-muted uppercase font-sans">
                <tr>
                  <th className="p-3.5 pl-4">Date & Heure</th>
                  <th className="p-3.5">Administrateur</th>
                  <th className="p-3.5">Action Réalisée</th>
                  <th className="p-3.5">Ressource</th>
                  <th className="p-3.5 pr-4">Métadonnées Sanitisées</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-subtle/50 dark:divide-line-dark/50 font-body">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-canvas-light/40">
                    <td className="p-3.5 pl-4 whitespace-nowrap text-ink-muted font-mono text-[11px]">
                      {new Date(log.createdAt).toLocaleString("fr-FR")}
                    </td>
                    <td className="p-3.5 whitespace-nowrap font-bold text-ink-primary dark:text-ink-light font-sans">
                      {log.adminName}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-brand-primary/10 text-brand-primary dark:bg-brand-mint/10 dark:text-brand-mint font-mono">
                        {log.actionType}
                      </span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap text-ink-muted font-mono text-[11px]">
                      {log.targetResourceType} #{log.targetResourceId.slice(-4)}
                    </td>
                    <td className="p-3.5 pr-4 text-ink-secondary dark:text-ink-muted font-mono text-[11px]">
                      {log.metadataSanitized ? JSON.stringify(log.metadataSanitized) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
