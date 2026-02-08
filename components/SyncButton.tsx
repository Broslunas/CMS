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

    const toastId = toast.loading("Syncing repository...");

    try {
      const response = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repo }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`Synchronization complete: ${result.imported} files processed`, {
          id: toastId,
        });
        router.refresh();
      } else {
        toast.error(`Error syncing: ${result.error}`, {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("Sync error:", error);
      toast.error("Connection error", {
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
        {syncing ? "Syncing..." : "Sync"}
      </Button>

      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Sync Repository"
        description="This action will fetch new and updated files from GitHub. If there are unsaved local changes, they might be overwritten."
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSync}
            >
              Confirm Synchronization
            </Button>
          </>
        }
      />
    </>
  );
}
