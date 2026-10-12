"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Trash2,
  LogOut,
  AlertTriangle,
  ShieldCheck,
  Bell,
  Moon,
  ArrowLeft,
} from "lucide-react";

export default function ParametresPage() {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [discreteNotifications, setDiscreteNotifications] = useState(true);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const res = await fetch("/api/student/account/delete", {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Ton compte et toutes tes données ont été définitivement purgés.");
        router.push("/");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Navbar showBack backHref="/etudiant" title="Paramètres du compte" />

      <main className="flex-1 max-w-md mx-auto px-4 py-8 pb-20 w-full">
        <h1 className="text-xl font-bold text-ink-primary dark:text-ink-light mb-6 font-sans">
          Paramètres & Confidentialité
        </h1>

        {/* Préférences */}
        <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl border border-line-subtle dark:border-line-dark shadow-sm mb-6 space-y-4">
          <h2 className="text-xs font-semibold text-ink-muted uppercase tracking-wider font-sans">
            Discrétion & Notifications
          </h2>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-brand-primary dark:text-brand-mint" />
              <div>
                <span className="text-xs font-semibold text-ink-primary dark:text-ink-light block font-sans">
                  Notifications discrètes
                </span>
                <span className="text-[11px] text-ink-muted font-body">
                  Aucun extrait de message affiché sur l&apos;écran verrouillé.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={discreteNotifications}
              onChange={(e) => setDiscreteNotifications(e.target.checked)}
              className="w-4 h-4 accent-brand-primary"
            />
          </div>

          <div className="pt-3 border-t border-line-subtle/50 dark:border-line-dark/50">
            <button
              onClick={handleLogout}
              className="w-full py-2.5 px-3 rounded-xl border border-line-subtle dark:border-line-dark text-xs font-semibold text-ink-secondary dark:text-ink-muted hover:bg-canvas-light dark:hover:bg-canvas-dark flex items-center justify-center gap-2 font-sans transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Se déconnecter de cette session</span>
            </button>
          </div>
        </div>

        {/* Zone de suppression définitive */}
        <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl border border-state-danger/30 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-state-danger">
            <AlertTriangle className="w-4 h-4" />
            <h2 className="text-xs font-bold uppercase tracking-wider font-sans">
              Droit à l&apos;oubli absolu
            </h2>
          </div>

          <p className="text-xs text-ink-secondary dark:text-ink-muted mb-4 font-body leading-relaxed">
            Tu peux effacer définitivement ton pseudonyme et l&apos;ensemble de tes messages en un clic. Cette action détruit tout sans possibilité de restauration.
          </p>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full py-3 px-4 rounded-xl bg-state-danger hover:bg-red-700 text-white font-semibold text-xs shadow flex items-center justify-center gap-2 transition-all font-sans"
          >
            <Trash2 className="w-4 h-4" />
            <span>Supprimer mon compte définitivement</span>
          </button>
        </div>

        {/* Modale de confirmation de suppression de compte */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-surface-light dark:bg-surface-dark max-w-sm w-full p-6 rounded-2xl border border-line-subtle dark:border-line-dark shadow-xl animate-bubble">
              <div className="w-12 h-12 rounded-2xl bg-state-danger/10 text-state-danger flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h3 className="text-base font-bold text-ink-primary dark:text-ink-light mb-2 font-sans">
                Confirmation de suppression
              </h3>

              <p className="text-xs text-ink-secondary dark:text-ink-muted leading-relaxed mb-6 font-body">
                Es-tu certain(e) de vouloir détruire ton compte ? Ton pseudonyme, tous tes messages passés et tes accès seront irrévocablement effacés de nos serveurs.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-line-subtle dark:border-line-dark text-xs font-semibold text-ink-primary dark:text-ink-light hover:bg-canvas-light dark:hover:bg-canvas-dark font-sans"
                >
                  Conserver mon compte
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl bg-state-danger hover:bg-red-700 text-white text-xs font-semibold shadow font-sans disabled:opacity-50"
                >
                  {deleting ? "Purge en cours..." : "Oui, tout détruire"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
