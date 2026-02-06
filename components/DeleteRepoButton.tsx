"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import Modal from "./Modal";

interface DeleteRepoButtonProps {
  projectId: string;
  repoName: string;
}

export default function DeleteRepoButton({ projectId, repoName }: DeleteRepoButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const toastId = toast.loading(`Deleting ${repoName}...`);

    try {
      const response = await fetch("/api/repos/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }),
      });

      if (response.ok) {
        toast.success("Repository deleted successfully", { id: toastId });
        setShowConfirm(false);
        router.refresh();
      } else {
        const error = await response.json();
        toast.error(`Error: ${error.error}`, { id: toastId });
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error deleting repository", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowConfirm(true);
        }}
        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200"
        title="Delete repository"
        disabled={isDeleting}
      >
        <Trash2 className="h-5 w-5" />
      </button>

      <Modal
        isOpen={showConfirm}
        onClose={() => !isDeleting && setShowConfirm(false)}
        title="Delete Project?"
        description="This action will unlink the repository from your dashboard."
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-bold bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-all shadow-lg shadow-destructive/20"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Yes, delete project"}
            </button>
          </div>
        }
      >
        <div className="space-y-4 py-2">
            <div className="flex items-start gap-4 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl">
                <AlertTriangle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="text-sm font-bold text-destructive">Warning</p>
                    <p className="text-xs text-destructive/80 leading-relaxed">
                        All local posts and configurations for <strong>{repoName}</strong> will be deleted. 
                        Your files on GitHub will remain intact.
                    </p>
                </div>
            </div>
            <p className="text-sm text-muted-foreground">
                Are you sure you want to continue? This action cannot be undone.
            </p>
        </div>
      </Modal>
    </>
  );
}
