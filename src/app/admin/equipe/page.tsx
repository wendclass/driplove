"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  ArrowLeft,
  Copy,
  Check,
  Trash2,
  Power,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Clock,
} from "lucide-react";
import { AdminInvitation, UserRole } from "@/types";

interface AdminUserRow {
  user: {
    id: string;
    pseudonym: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
  };
  profile?: {
    displayName: string;
    internalEmail: string;
    isOnDuty: boolean;
    charterAcceptedAt?: string;
  };
}

export default function AdminEquipePage() {
  const [admins, setAdmins] = useState<AdminUserRow[]>([]);
  const [invitations, setInvitations] = useState<AdminInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Invite generation state
  const [inviteRole, setInviteRole] = useState<"RESPONDER" | "SUPERADMIN">("RESPONDER");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [generating, setGenerating] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resUsers, resInvs] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/invitations"),
      ]);

      if (resUsers.ok) {
        const d = await resUsers.json();
        setAdmins(d.admins || []);
      }
      if (resInvs.ok) {
        const d = await resInvs.json();
        setInvitations(d.invitations || []);
      }
    } catch {
      setError("Erreur technique de chargement.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerateInvite = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: inviteRole }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Impossible de générer l'invitation.");
      } else {
        const origin = window.location.origin;
        const fullLink = `${origin}/invitation?token=${data.invitation.token}`;
        setGeneratedLink(fullLink);
        fetchData();
      }
    } catch {
      setError("Erreur lors de la création de l'invitation.");
    } finally {
      setGenerating(false);
    }
  };

  const handleRevokeInvite = async (invId: string) => {
    if (!confirm("Voulez-vous révoquer définitivement cette invitation ?")) return;
    try {
      const res = await fetch(`/api/admin/invitations/${invId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    const action = currentStatus ? "désactiver" : "réactiver";
    if (!confirm(`Confirmez-vous vouloir ${action} ce compte immédiatement ?`)) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isActive: !currentStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Action impossible.");
      } else {
        fetchData();
      }
    } catch {
      alert("Erreur réseau.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("ATTENTION : Cette action supprimera définitivement cet administrateur et invalidera ses accès immédiatement. Confirmer ?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Suppression impossible.");
      } else {
        fetchData();
      }
    } catch {
      alert("Erreur réseau.");
    }
  };

  const handleCopyLink = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl w-full mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-line-subtle dark:border-line-dark">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-xl hover:bg-canvas-light dark:hover:bg-canvas-dark text-ink-secondary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-black dark:text-white" />
              <span>Gouvernance de l&apos;Équipe & Accès</span>
            </h1>
            <p className="text-xs text-zinc-500 font-body">
              Gestion stricte des écoutants, invitations à usage unique (48h) et révocation immédiate des sessions.
            </p>
          </div>
        </div>

        <button
          onClick={fetchData}
          className="p-2 text-zinc-500 hover:text-black dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          title="Actualiser"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Bloc 1 : Génération d'invitation 48H */}
      <section className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-black dark:text-white" />
          <h2 className="text-sm font-bold uppercase tracking-wider">
            Inviter un Nouveau Membre dans l&apos;Équipe
          </h2>
        </div>
        <p className="text-xs text-zinc-500 font-body leading-relaxed max-w-2xl">
          Génère un lien secret à usage unique valable <strong>48 heures</strong>. L&apos;invité choisira lui-même son mot de passe robuste, activera sa double authentification (2FA) et signera la charte de confidentialité.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as "RESPONDER" | "SUPERADMIN")}
            className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          >
            <option value="RESPONDER">Rôle : Écoutant Répondant</option>
            <option value="SUPERADMIN">Rôle : Super-Administrateur</option>
          </select>

          <button
            onClick={handleGenerateInvite}
            disabled={generating}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{generating ? "Génération..." : "Générer le lien d'invitation"}</span>
          </button>
        </div>

        {generatedLink && (
          <div className="mt-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <span className="text-[11px] font-bold text-zinc-500 uppercase block">
              Lien d&apos;invitation généré (Valable 48h - Usage unique) :
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={generatedLink}
                className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono text-xs select-all"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold flex items-center gap-1.5"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? "Copié !" : "Copier"}</span>
              </button>
            </div>
            <span className="text-[11px] text-zinc-500 font-body block">
              Transmettez ce lien de façon confidentielle à la personne concernée. Dès son utilisation, il sera désactivé.
            </span>
          </div>
        )}
      </section>

      {/* Bloc 2 : Liste des membres actifs */}
      <section className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider">
          Membres Actifs de la Cellule ({admins.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Nom / Affichage</th>
                <th className="py-3 px-3">Identifiant</th>
                <th className="py-3 px-3">Email interne</th>
                <th className="py-3 px-3">Rôle</th>
                <th className="py-3 px-3">Statut</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 font-body">
              {admins.map(({ user, profile }) => (
                <tr key={user.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                  <td className="py-3 px-3 font-semibold font-sans">
                    {profile?.displayName || user.pseudonym}
                  </td>
                  <td className="py-3 px-3 font-mono text-zinc-500">
                    {user.pseudonym}
                  </td>
                  <td className="py-3 px-3 text-zinc-500">
                    {profile?.internalEmail || "—"}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200">
                      {user.role === "SUPERADMIN" ? "Super-Admin" : "Écoutant"}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {user.isActive ? (
                      <span className="inline-flex items-center gap-1.5 text-black dark:text-white font-medium text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white" />
                        Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-zinc-400 font-medium text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                        Désactivé
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button
                      onClick={() => handleToggleStatus(user.id, user.isActive)}
                      className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                      title={user.isActive ? "Désactiver le compte" : "Réactiver le compte"}
                    >
                      <Power className={`w-3.5 h-3.5 ${user.isActive ? "text-zinc-500" : "text-black dark:text-white"}`} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                      title="Supprimer définitivement"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bloc 3 : Invitations en attente ou passées */}
      {invitations.length > 0 && (
        <section className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider">
            Historique des Invitations ({invitations.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Rôle</th>
                  <th className="py-3 px-3">Statut</th>
                  <th className="py-3 px-3">Expiration</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 font-body">
                {invitations.map((inv) => {
                  const isExpired = new Date(inv.expiresAt).getTime() < Date.now();
                  return (
                    <tr key={inv.id}>
                      <td className="py-3 px-3 font-mono text-zinc-500">
                        {new Date(inv.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3 px-3">
                        {inv.role === "SUPERADMIN" ? "Super-Admin" : "Écoutant"}
                      </td>
                      <td className="py-3 px-3">
                        {inv.isUsed ? (
                          <span className="text-zinc-500">Utilisée</span>
                        ) : isExpired ? (
                          <span className="text-zinc-400">Expirée (48h)</span>
                        ) : (
                          <span className="font-semibold text-black dark:text-white">Active</span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-zinc-500">
                        {new Date(inv.expiresAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {!inv.isUsed && !isExpired && (
                          <button
                            onClick={() => handleRevokeInvite(inv.id)}
                            className="text-[11px] font-semibold text-zinc-400 hover:text-black dark:hover:text-white"
                          >
                            Révoquer
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
