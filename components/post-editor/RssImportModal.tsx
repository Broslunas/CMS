"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import Modal from "../Modal";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Rss } from "lucide-react";
import { toast } from "sonner";

interface RssImportModalProps {
  repoId: string;
  onClose: () => void;
  onImport: (item: any) => void;
}

export function RssImportModal({ repoId, onClose, onImport }: RssImportModalProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRss() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/repo/rss?repoId=${encodeURIComponent(repoId)}`);
        const data = await res.json();
        
        if (!res.ok) {
          setError(data.error || "Failed to load RSS feed.");
          return;
        }

        setItems(data.items || []);
      } catch (err: any) {
        setError(err.message || "Network error loading RSS.");
      } finally {
        setLoading(false);
      }
    }

    fetchRss();
  }, [repoId]);

  return (
    <Modal isOpen={true} onClose={onClose} title="Import from RSS">
      <div className="flex flex-col h-[60vh]">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Fetching RSS feed...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center px-4">
            <Rss className="h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-red-500 font-medium">{error}</p>
            <p className="text-xs text-muted-foreground">
              Make sure you have configured an RSS URL in your repository settings.
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">No items found in this feed.</p>
          </div>
        ) : (
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-3 pb-6">
              {items.map((item, idx) => (
                <div 
                  key={item.guid || item.link || idx}
                  className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => onImport(item)}
                >
                  <h3 className="font-medium text-sm line-clamp-2">{item.title}</h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    {item.pubDate && <span>{format(new Date(item.pubDate), 'MMM d, yyyy')}</span>}
                    {item.creator && <span>• {item.creator}</span>}
                  </div>
                  {item.contentSnippet && (
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                      {item.contentSnippet}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        <div className="pt-4 border-t flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}
