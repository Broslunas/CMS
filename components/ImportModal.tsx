"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import { Button } from "@/components/ui/button";
import { Loader2, Github } from "lucide-react";

interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  updated_at: string;
}

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState<{ step: string; message: string; completed?: number; total?: number }>({
    step: "idle",
    message: "",
  });
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      fetchRepos();
      setProgress({ step: "idle", message: "" });
    }
  }, [isOpen]);

  const fetchRepos = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/repos");
      if (response.ok) {
        const data = await response.json();
        setRepos(data);
      }
    } catch (error) {
      console.error("Error fetching repos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (repo: Repo) => {
    setImporting(true);
    setSelectedRepo(repo.full_name);
    setProgress({ step: "starting", message: "Starting import..." });

    try {
      const [owner, repoName] = repo.full_name.split("/");
      const response = await fetch("/api/import-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner,
          repo: repoName,
          name: repo.name,
          description: repo.description,
        }),
      });

      if (!response.ok) {
        throw new Error("Server response error");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter(Boolean);

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.type === "progress") {
              setProgress({
                step: data.step,
                message: data.message || progress.message,
                completed: data.completed,
                total: data.total,
              });
            } else if (data.type === "complete") {
              console.log(`✅ Imported: ${data.imported} files`);
              onClose();
              router.refresh();
              return;
            } else if (data.type === "error") {
              throw new Error(data.error);
            }
          } catch (e) {
            console.error("Error parsing chunk:", e);
          }
        }
      }
    } catch (error: any) {
      console.error("Import error:", error);
      alert(`Import error: ${error.message}`);
    } finally {
      setImporting(false);
      setSelectedRepo(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import Repository"
      description="Select an Astro repository to import to your dashboard."
      footer={
        <Button variant="ghost" onClick={onClose} disabled={importing}>
          Cancel
        </Button>
      }
    >
      <div className="max-h-[60vh] overflow-y-auto pr-2">
        {importing ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <div className="text-center">
              <p className="font-medium text-lg">{progress.message || "Importing..."}</p>
              {progress.total && progress.total > 0 && (
                <div className="mt-4 w-64 space-y-2">
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300" 
                      style={{ width: `${((progress.completed || 0) / progress.total) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {progress.completed} of {progress.total} files processed
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : repos.length === 0 ? (
          <div className="text-center py-12">
            <Github className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No Astro repositories found</p>
            <p className="text-xs text-muted-foreground/70 mt-2">Make sure you have Astro repositories in your GitHub account</p>
          </div>
        ) : (
          <div className="space-y-3">
            {repos.map((repo) => (
              <div
                key={repo.id}
                className="bg-card rounded-lg p-4 border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {repo.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 font-mono text-xs">
                      {repo.full_name}
                    </p>
                    {repo.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {repo.description}
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={() => handleImport(repo)}
                    disabled={importing}
                    size="sm"
                    className="shrink-0"
                  >
                    {importing && selectedRepo === repo.full_name ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      "Import"
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
