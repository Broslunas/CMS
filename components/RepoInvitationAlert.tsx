"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface GitHubInvitation {
  id: number;
  repository: {
    full_name: string;
    html_url: string;
    description?: string;
  };
  inviter: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
}

interface RepoInvitationAlertProps {
  repoId: string;
}

export function RepoInvitationAlert({ repoId }: RepoInvitationAlertProps) {
  const [invitation, setInvitation] = useState<GitHubInvitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    checkForInvitation();
  }, [repoId]);

  const checkForInvitation = async () => {
    try {
      const res = await fetch("/api/github/invitations");
      if (res.ok) {
        const data = await res.json();
        // Find invitation for this specific repo
        const matchingInvitation = data.invitations?.find(
          (inv: GitHubInvitation) => inv.repository.full_name === repoId
        );
        
        if (matchingInvitation) {
          setInvitation(matchingInvitation);
          // Auto-accept if requested by logic
          await acceptInvitation(matchingInvitation.id);
        }
      }
    } catch (error) {
      console.error("Error checking invitations:", error);
    } finally {
      setLoading(false);
    }
  };

  const acceptInvitation = async (id?: number) => {
    const inviteId = id || invitation?.id;
    if (!inviteId) return;

    setAccepting(true);
    try {
      const res = await fetch("/api/github/invitations/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId: inviteId }),
      });

      if (res.ok) {
        setAccepted(true);
        toast.success("¡Invitación aceptada! Ahora puedes publicar cambios en GitHub.");
        // Wait a bit then hide the alert
        setTimeout(() => setInvitation(null), 3000);
      } else {
        const error = await res.json();
        toast.error(error.error || "Error al aceptar la invitación");
      }
    } catch (error) {
      toast.error("Error al aceptar la invitación");
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return null; // Don't show anything while loading
  }

  if (!invitation || accepted) {
    return null;
  }

  return (
    <Card className="border-blue-500/50 bg-blue-500/10">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-blue-500/20 p-2">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Invitación Pendiente de GitHub
              </h3>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">{invitation.inviter.login}</span> te ha invitado a colaborar en{" "}
                <span className="font-medium font-mono text-xs">{invitation.repository.full_name}</span>.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Necesitas aceptar esta invitación para poder publicar cambios en GitHub.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => acceptInvitation()}
                disabled={accepting}
                className="gap-2"
              >
                {accepting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Aceptando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Aceptar Invitación
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                asChild
              >
                <a
                  href={invitation.repository.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  Ver en GitHub
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
