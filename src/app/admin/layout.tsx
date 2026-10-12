import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import {
  Inbox,
  ShieldCheck,
  FileText,
  Users,
  LogOut,
  Heart,
  AlertTriangle,
  BookOpen,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (
    !session ||
    (session.role !== "RESPONDER" && session.role !== "SUPERADMIN")
  ) {
    redirect("/connexion");
  }

  const isSuperAdmin = session.role === "SUPERADMIN";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-canvas-light dark:bg-canvas-dark text-ink-primary dark:text-ink-light">
      {/* Barre Latérale Desktop (260px) */}
      <aside className="w-full md:w-64 bg-surface-light dark:bg-surface-dark border-r border-line-subtle dark:border-line-dark flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Header Back-Office */}
          <div className="p-4 border-b border-line-subtle dark:border-line-dark flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-primary flex items-center justify-center text-white">
                <Heart className="w-4 h-4 fill-brand-accent text-brand-accent" />
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight text-brand-primary dark:text-brand-mint font-sans block">
                  Dr IPLOVE
                </span>
                <span className="text-[10px] text-ink-muted uppercase font-sans tracking-wider block">
                  Back-Office Répondants
                </span>
              </div>
            </Link>
          </div>

          {/* Profil Répondant Actif & Astreinte */}
          <div className="p-4 bg-elevated-light dark:bg-elevated-dark border-b border-line-subtle dark:border-line-dark">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-ink-primary dark:text-ink-light font-sans">
                {session.adminDisplayName || session.pseudonym}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-state-success/15 text-state-success">
                <span className="w-1.5 h-1.5 rounded-full bg-state-success animate-pulse" />
                <span>En service</span>
              </span>
            </div>
            <span className="text-[11px] text-zinc-500 block font-body">
              Rôle : {session.role === "SUPERADMIN" ? "Super-Administrateur" : "Écoutant Répondant"}
            </span>
          </div>

          {/* Navigation Menu */}
          <nav className="p-3 space-y-1">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-brand-primary dark:text-brand-mint bg-brand-primary/10 dark:bg-brand-mint/10 font-sans transition-colors"
            >
              <Inbox className="w-4 h-4" />
              <span>File des messages (Pool)</span>
            </Link>

            <Link
              href="/admin/charte"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-ink-secondary dark:text-ink-muted hover:bg-canvas-light dark:hover:bg-canvas-dark font-sans transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-brand-mint" />
              <span>Charte & Serment d&apos;écoute</span>
            </Link>

            {isSuperAdmin && (
              <>
                <Link
                  href="/admin/equipe"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-ink-secondary dark:text-ink-muted hover:bg-canvas-light dark:hover:bg-canvas-dark font-sans transition-colors"
                >
                  <Users className="w-4 h-4 text-brand-mint" />
                  <span>Équipe & Invitations</span>
                </Link>

                <Link
                  href="/admin/audit"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-ink-secondary dark:text-ink-muted hover:bg-canvas-light dark:hover:bg-canvas-dark font-sans transition-colors"
                >
                  <FileText className="w-4 h-4 text-brand-accent" />
                  <span>Journal d&apos;Audit inaltérable</span>
                </Link>
              </>
            )}

            <div className="pt-3 mt-3 border-t border-line-subtle dark:border-line-dark">
              <span className="px-3 text-[10px] uppercase font-bold text-ink-muted tracking-wider block mb-1">
                Rappels Déontologiques
              </span>
              <div className="px-3 py-2 text-[11px] text-ink-secondary dark:text-ink-muted leading-relaxed font-body bg-canvas-light dark:bg-canvas-dark rounded-xl">
                • Signature unique « Dr IPLOVE »<br />
                • Zéro tentative d&apos;identification<br />
                • Relecture 4 yeux obligatoire si sensible
              </div>
            </div>
          </nav>
        </div>

        {/* Footer Navigation */}
        <div className="p-3 border-t border-line-subtle dark:border-line-dark space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-ink-muted hover:text-ink-primary dark:hover:text-ink-light transition-colors"
          >
            <span>Voir le site étudiant</span>
          </Link>
        </div>
      </aside>

      {/* Contenu Principal */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
