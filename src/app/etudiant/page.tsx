import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import Navbar from "@/components/Navbar";
import MobileTabBar from "@/components/MobileTabBar";
import {
  PenSquare,
  MessageSquare,
  Clock,
  CheckCircle,
  HelpCircle,
  Settings,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export default async function StudentDashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/connexion");
  }

  const conversations = db.getStudentConversations(session.userId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-accent-soft text-brand-accent-hover dark:bg-brand-accent-dark/20 dark:text-brand-accent-dark">
            <Clock className="w-3 h-3" />
            <span>Envoyé • En attente</span>
          </span>
        );
      case "IN_PROGRESS":
      case "UNDER_REVIEW":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-state-info/10 text-state-info">
            <Clock className="w-3 h-3 animate-spin" />
            <span>En cours de réflexion</span>
          </span>
        );
      case "ANSWERED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-state-success/15 text-state-success font-sans">
            <CheckCircle className="w-3 h-3" />
            <span>Réponse disponible !</span>
          </span>
        );
      case "CLOSED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-line-subtle text-ink-muted">
            <span>Clos (purge programmée)</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "COUPLE":
        return "Couple & Sentiments";
      case "FRIENDSHIP":
        return "Amitié";
      case "FAMILY":
        return "Famille";
      case "SELF_ESTEEM":
        return "Estime de soi";
      default:
        return "Autre sujet";
    }
  };

  return (
    <>
      <Navbar
        userPseudonym={session.pseudonym}
        role={session.role}
        title="Espace Privé Étudiant"
      />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-6 pb-24 sm:pb-12 w-full">
        {/* Bandeau de bienvenue discret */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-ink-primary dark:text-ink-light font-sans">
              Mes Échanges Secrets
            </h1>
            <p className="text-xs text-ink-secondary dark:text-ink-muted font-body">
              Connecté en tant que{" "}
              <strong className="text-brand-primary dark:text-brand-mint font-sans">
                {session.pseudonym}
              </strong>
            </p>
          </div>

          <Link
            href="/etudiant/parametres"
            className="p-2.5 rounded-xl border border-line-subtle dark:border-line-dark hover:bg-canvas-light dark:hover:bg-canvas-dark text-ink-secondary dark:text-ink-muted transition-colors"
            title="Paramètres et suppression"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>

        {/* Bouton d'action principal */}
        <div className="mb-6">
          <Link
            href="/etudiant/nouvelle-question"
            className="w-full py-3.5 px-4 rounded-xl bg-brand-primary hover:bg-brand-primary-light text-white font-semibold text-sm shadow transition-all flex items-center justify-center gap-2 font-sans"
          >
            <PenSquare className="w-4 h-4" />
            <span>Poser une nouvelle question au Dr IPLOVE</span>
          </Link>
        </div>

        {/* Indicateur de délai */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-light dark:bg-surface-dark border border-line-subtle dark:border-line-dark text-xs text-ink-muted mb-6">
          <Clock className="w-4 h-4 text-brand-accent flex-shrink-0" />
          <span>
            Délai de réponse moyen actuel : <strong>24h à 48h</strong>. Les messages sensibles sont traités en priorité.
          </span>
        </div>

        {/* Liste des conversations */}
        {conversations.length === 0 ? (
          <div className="p-8 sm:p-12 text-center rounded-2xl bg-surface-light dark:bg-surface-dark border border-line-subtle dark:border-line-dark shadow-sm">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-primary/10 dark:bg-brand-mint/10 text-brand-primary dark:text-brand-mint flex items-center justify-center mb-4">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h2 className="text-base font-bold text-ink-primary dark:text-ink-light mb-1.5 font-sans">
              Aucune question pour l&apos;instant
            </h2>
            <p className="text-xs text-ink-secondary dark:text-ink-muted max-w-sm mx-auto mb-6 font-body leading-relaxed">
              Le Dr IPLOVE est là pour toi. Dépose tes doutes ou tes interrogations en toute sérénité dès que tu te sens prêt(e).
            </p>
            <Link
              href="/etudiant/nouvelle-question"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-semibold shadow hover:bg-brand-primary-light transition-all font-sans"
            >
              <PenSquare className="w-3.5 h-3.5" />
              <span>Poser ma première question</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conv) => {
              const lastMsg = conv.messages[conv.messages.length - 1];
              const dateStr = new Date(conv.updatedAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <Link
                  key={conv.id}
                  href={`/etudiant/conversation/${conv.id}`}
                  className="block p-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-line-subtle dark:border-line-dark hover:border-brand-primary/40 dark:hover:border-brand-mint/40 shadow-sm transition-all group"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider font-sans">
                      {getCategoryLabel(conv.category)}
                    </span>
                    {getStatusBadge(conv.status)}
                  </div>

                  <h3 className="text-sm font-bold text-ink-primary dark:text-ink-light mb-1 group-hover:text-brand-primary dark:group-hover:text-brand-mint transition-colors font-sans line-clamp-1">
                    {conv.title || "Question confidentielle"}
                  </h3>

                  {lastMsg && (
                    <p className="text-xs text-ink-secondary dark:text-ink-muted line-clamp-2 mb-3 font-body">
                      {lastMsg.senderType === "DR_IPLOVE" ? (
                        <strong className="text-brand-primary dark:text-brand-mint font-sans">
                          Dr IPLOVE :{" "}
                        </strong>
                      ) : (
                        <span>Moi : </span>
                      )}
                      {lastMsg.content}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-line-subtle/50 dark:border-line-dark/50 text-[11px] text-ink-muted">
                    <span>Dernière activité : {dateStr}</span>
                    <span className="flex items-center gap-1 font-semibold text-brand-primary dark:text-brand-mint group-hover:translate-x-0.5 transition-transform">
                      <span>Ouvrir l&apos;échange</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <MobileTabBar />
    </>
  );
}
