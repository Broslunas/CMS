"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Modal from "./Modal";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface SyncButtonProps {
  repoId: string;
}

export default function SyncButton({ repoId }: SyncButtonProps) {
  const [syncing, setSyncing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleSync = async () => {
    setShowConfirm(false);
    setSyncing(true);
    const [owner, repo] = repoId.split("/");

    const toastId = toast.loading("Sincronizando repositorio...");

    try {
      const response = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repo }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`Sincronización completada: ${result.imported} archivos procesados`, {
          id: toastId,
        });
        router.refresh();
      } else {
        toast.error(`Error al sincronizar: ${result.error}`, {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("Sync error:", error);
      toast.error("Error de conexión", {
        id: toastId,
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowConfirm(true)}
        disabled={syncing}
        variant="outline"
        className="gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
        {syncing ? "Sincronizando..." : "Sincronizar"}
      </Button>

      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Sincronizar Repositorio"
        description="Esta acción buscará archivos nuevos y actualizados en GitHub. Si hay cambios locales no guardados, podrían sobrescribirse."
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setShowConfirm(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSync}
            >
              Confirmar Sincronización
            </Button>
          </>
        }
      />
    </>
  );
}
