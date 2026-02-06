"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { parseMarkdown } from "@/lib/markdown";

interface Commit {
  sha: string;
  message: string;
  author: string;
  date: string;
  html_url: string;
}

interface VersionHistoryProps {
  owner: string;
  repo: string;
  path: string;
  postId: string;
  isOpen: boolean;
  onClose: () => void;
  onRestore: (metadata: any, content: string, newSha: string) => void;
}

export function VersionHistory({
  owner,
  repo,
  path,
  postId,
  isOpen,
  onClose,
  onRestore,
}: VersionHistoryProps) {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && owner && repo && path) {
      loadCommits();
    }
  }, [isOpen, owner, repo, path]);

  const loadCommits = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/commits?owner=${owner}&repo=${repo}&path=${encodeURIComponent(path)}`
      );
      if (res.ok) {
        const data = await res.json();
        setCommits(data);
      } else {
        toast.error("Error loading history");
      }
    } catch (e) {
      console.error(e);
      toast.error("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (sha: string) => {
    if (!confirm("Are you sure you want to restore this version? A new commit will be created replacing the current content.")) {
        return;
    }

    setRestoring(sha);
    const toastId = toast.loading("Restoring version...");

    try {
      const res = await fetch("/api/commits/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner,
          repo,
          path,
          postId,
          sha,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Version restored successfully", { id: toastId });
        onRestore(data.metadata, data.content, data.newSha); // Actualizar editor y SHA
        onClose(); // Cerrar modal
      } else {
        const error = await res.json();
        toast.error(`Error: ${error.error}`, { id: toastId });
      }
    } catch (e) {
      console.error(e);
      toast.error("Error restoring", { id: toastId });
    } finally {
      setRestoring(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-card border border-border rounded-lg shadow-lg flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold">Version History</h2>
            <p className="text-sm text-muted-foreground truncate">{path}</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-muted/50 rounded-md animate-pulse"
                />
              ))}
            </div>
          ) : commits.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No history available for this file.
            </div>
          ) : (
            <div className="space-y-3">
              {commits.map((commit) => (
                <div
                  key={commit.sha}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        {commit.sha.substring(0, 7)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(commit.date), {
                          addSuffix: true,
                        })}
                      </span>
                      <span className="text-xs text-muted-foreground mx-1">
                        •
                      </span>
                      <span className="text-xs font-medium text-foreground">
                        {commit.author}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/90 line-clamp-2">
                       {commit.message}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleRestore(commit.sha)}
                      disabled={restoring === commit.sha}
                      className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                      {restoring === commit.sha ? "Restoring..." : "Restore"}
                    </button>
                    <a
                      href={commit.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium border border-border text-muted-foreground rounded-md hover:text-foreground hover:bg-muted transition-colors"
                    >
                      View on GitHub
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
