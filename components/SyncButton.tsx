"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Modal from "./Modal";

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
      <button
        onClick={() => setShowConfirm(true)}
        disabled={syncing}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
          ${syncing 
            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
            : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white border border-zinc-700"}
        `}
      >
        <svg
          className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        {syncing ? "Sincronizando..." : "Sincronizar"}
      </button>

      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Sincronizar Repositorio"
        description="Esta acción buscará archivos nuevos y actualizados en GitHub. Si hay cambios locales no guardados, podrían sobrescribirse."
        footer={
          <>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSync}
              className="px-4 py-2 text-sm font-medium bg-white text-black hover:bg-zinc-200 rounded-md transition-colors"
            >
              Confirmar Sincronización
            </button>
          </>
        }
      />
    </>
  );
}
