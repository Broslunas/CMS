"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import Modal from "../Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Loader2, Rss, ArrowLeft, ArrowRight,
  Type, FileText, AlignLeft, Calendar, Headphones, ImageIcon, Plus, Trash,
  CheckCircle2
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface RssImportModalProps {
  repoId: string;
  onClose: () => void;
  onImport: (result: { metadata: any, content: string }) => void;
}

function flattenObject(obj: any, prefix = ""): Record<string, string> {
  let result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) continue;
    if (typeof value === "object" && !Array.isArray(value)) {
      if (key === '$') {
         result = { ...result, ...flattenObject(value, `${prefix}`) };
      } else {
         result = { ...result, ...flattenObject(value, `${prefix}${key}.`) };
      }
    } else if (typeof value === "string" || typeof value === "number") {
      result[`${prefix}${key}`] = String(value);
    }
  }
  return result;
}

// Predefined target fields configuration
const STANDARD_TARGETS = [
  { key: "title", label: "Title", desc: "Main heading of the post", icon: Type },
  { key: "content", label: "Page Content", desc: "Markdown body text", icon: FileText },
  { key: "description", label: "Description / Excerpt", desc: "Short summary", icon: AlignLeft },
  { key: "date", label: "Publish Date", desc: "When it goes live", icon: Calendar },
  { key: "image", label: "Featured Image", desc: "URL of the cover art", icon: ImageIcon },
  { key: "episodeUrl", label: "Audio/Video URL", desc: "Media enclosure link", icon: Headphones },
];

export function RssImportModal({ repoId, onClose, onImport }: RssImportModalProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [innerStep, setInnerStep] = useState<"list" | "selection" | "mapping">("list");
  const [flatFields, setFlatFields] = useState<Record<string, string>>({});
  
  // mappings: Source RSS Key -> { target: string, customKey: string, enabled: boolean }
  const [mappings, setMappings] = useState<Record<string, { target: string, customKey: string, enabled: boolean }>>({});

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

  const handleSelectItem = (item: any) => {
      const flattened = flattenObject(item);
      setFlatFields(flattened);
      
      const newMappings: Record<string, { target: string, customKey: string, enabled: boolean }> = {};

      // Initialize all fields as disabled and mapping to themselves as custom by default
      for (const key of Object.keys(flattened)) {
          newMappings[key] = {
              target: "custom",
              customKey: key, // Use the exact name from the flattened JSON/RSS item
              enabled: false
          };
      }

      // Pre-calculate smart defaults targets, but DO NOT enable them yet as per user request
      for (const key of Object.keys(flattened)) {
          const lk = key.toLowerCase();
          const val = flattened[key];
          
          if (lk === 'title') {
              newMappings[key].target = "title";
          }
          else if ((lk === 'pubdate' || lk === 'isodate')) {
              newMappings[key].target = "date";
          }
          else if ((lk === 'contentencoded' || lk === 'content')) {
              newMappings[key].target = "content";
          }
          else if ((lk === 'itunessummary' || lk === 'contentsnippet' || lk === 'description')) {
              newMappings[key].target = "description";
          }
          else if (lk === 'enclosure.url' || lk === 'url') {
              if (val.includes('.mp3') || val.includes('.m4a') || val.includes('.wav')) {
                  newMappings[key].target = "episodeUrl";
              } else if (val.includes('.jpg') || val.includes('.png')) {
                  newMappings[key].target = "image";
              }
          }
          else if ((lk === 'itunesimage.href' || lk === 'href') && (val.includes('.jpg') || val.includes('.png'))) {
              newMappings[key].target = "image";
          }
      }

      setMappings(newMappings);
      setSelectedItem(item);
      setInnerStep("selection");
  };

  const handleApplyImport = () => {
    const newMetadata: any = {};
    let newContent = "";

    for (const [sourceKey, map] of Object.entries(mappings)) {
        if (!map.enabled) continue;
        
        let val = flatFields[sourceKey];
        if (!val) continue;

        if (map.target === 'date') {
             try { val = new Date(val).toISOString(); } catch(e) {}
        }

        if (map.target === 'content') {
            const separator = newContent.trim() ? "\n\n" : "";
            newContent += separator + val;
        } else if (map.target === 'custom') {
            if (map.customKey.trim()) {
                newMetadata[map.customKey.trim()] = val;
            }
        } else if (map.target !== 'ignore') {
            newMetadata[map.target] = val;
        }
    }

    onImport({ metadata: newMetadata, content: newContent.trim() });
  };

  const updateMapping = (sourceKey: string, field: string, value: any) => {
      setMappings(prev => ({
          ...prev,
          [sourceKey]: { ...prev[sourceKey], [field]: value }
      }));
  };

  const toggleField = (sourceKey: string) => {
      setMappings(prev => ({
          ...prev,
          [sourceKey]: { ...prev[sourceKey], enabled: !prev[sourceKey].enabled }
      }));
  };

  const enabledCount = Object.values(mappings).filter(m => m.enabled).length;

  return (
    <Modal isOpen={true} onClose={onClose} title="Import from RSS" className="max-w-2xl">
      <div className="flex flex-col h-[85vh]">
        {innerStep === "list" ? (
            <>
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
                        className="p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => handleSelectItem(item)}
                        >
                        <h3 className="font-medium text-[15px] leading-tight line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3>
                        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                                {item.pubDate && <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> {format(new Date(item.pubDate), 'MMM d, yyyy')}</span>}
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10 text-primary hover:bg-primary/20">
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                        {item.contentSnippet && (
                            <p className="mt-3 text-sm text-muted-foreground/80 line-clamp-2">
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
            </>
        ) : (
            <div className="flex flex-col h-full overflow-hidden">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 shrink-0" 
                        onClick={() => {
                            if (innerStep === "selection") {
                                setInnerStep("list");
                                setSelectedItem(null);
                            } else {
                                setInnerStep("selection");
                            }
                        }}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="min-w-0">
                        <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-0.5">
                            {innerStep === "selection" ? "Step 1: Select Elements" : "Step 2: Map Fields"}
                        </p>
                        <h3 className="text-sm font-medium truncate" title={selectedItem.title}>{selectedItem.title}</h3>
                    </div>
                </div>

                <div className="mb-4 px-1">
                    <p className="text-xs text-muted-foreground">
                        {innerStep === "selection" 
                            ? "Toggle the elements you want to include in your import." 
                            : "Choose where each selected element should be saved in your CMS."}
                    </p>
                </div>

                <ScrollArea className="flex-1 overflow-auto pr-3 relative">
                    <div className="space-y-3 pb-8">
                        {Object.keys(flatFields).map((sourceKey) => {
                            const map = mappings[sourceKey];
                            if (!map) return null;
                            
                            // In mapping step, only show enabled fields
                            if (innerStep === "mapping" && !map.enabled) return null;

                            const valPreview = flatFields[sourceKey];

                            return (
                                <div 
                                    key={sourceKey} 
                                    className={`group border rounded-xl p-3 transition-all duration-200 ${map.enabled ? 'border-primary/40 bg-primary/[0.03] shadow-sm' : 'border-border bg-card/60 opacity-80 hover:opacity-100'}`}
                                >
                                    <div className="flex items-start gap-4">
                                        {innerStep === "selection" && (
                                            <div className="pt-1.5 shrink-0">
                                                <Checkbox 
                                                    checked={map.enabled} 
                                                    onCheckedChange={() => toggleField(sourceKey)}
                                                />
                                            </div>
                                        )}
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col gap-3 mb-3">
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-xs font-bold font-mono px-2 py-1 rounded-md border ${map.enabled ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-muted-foreground border-border'}`}>
                                                        {sourceKey}
                                                    </span>
                                                    
                                                    {innerStep === "selection" && map.enabled && (
                                                        <span className="text-[10px] bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                                            Selected
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                {innerStep === "mapping" && (
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-muted/30 p-2.5 rounded-xl border border-border/50">
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                                                                <ArrowRight className="w-3 h-3 text-primary" />
                                                            </div>
                                                            <span className="text-[10px] uppercase font-bold text-muted-foreground whitespace-nowrap">Import as:</span>
                                                        </div>
                                                        <div className="flex-1 flex gap-2 min-w-0">
                                                            <Select 
                                                                className="h-9 text-xs flex-1 bg-background" 
                                                                value={map.target} 
                                                                onChange={(e) => updateMapping(sourceKey, "target", e.target.value)}
                                                            >
                                                                <option value="ignore">-- Skip --</option>
                                                                {STANDARD_TARGETS.map(t => (
                                                                    <option key={t.key} value={t.key}>{t.label}</option>
                                                                ))}
                                                                <option value="custom">Custom Metadata</option>
                                                            </Select>
                                                            
                                                            {map.target === "custom" && (
                                                                <Input 
                                                                    placeholder="e.g. author"
                                                                    value={map.customKey}
                                                                    onChange={(e) => updateMapping(sourceKey, "customKey", e.target.value)}
                                                                    className="h-9 text-xs w-32 bg-background font-mono"
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="text-[11px] text-muted-foreground bg-background/50 p-3 rounded-lg border border-border/30 italic leading-relaxed group-hover:border-border/60 transition-colors">
                                                {valPreview ? (
                                                    <span className="line-clamp-4">{valPreview}</span>
                                                ) : (
                                                    <span className="opacity-40 select-none">No value available for this element</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>

                <div className="pt-4 mt-2 border-t flex justify-end items-center bg-background z-10 gap-3">
                    <Button 
                        variant="ghost" 
                        onClick={() => {
                            if (innerStep === "selection") {
                                setInnerStep("list");
                                setSelectedItem(null);
                            } else {
                                setInnerStep("selection");
                            }
                        }}
                    >
                        Back
                    </Button>
                    
                    {innerStep === "selection" ? (
                        <Button 
                            onClick={() => setInnerStep("mapping")} 
                            className="gap-2" 
                            disabled={enabledCount === 0}
                        >
                            Next: Map Fields ({enabledCount}) <ArrowRight className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={handleApplyImport} className="gap-2">
                            <ArrowRight className="h-4 w-4" /> Finalize Import
                        </Button>
                    )}
                </div>
            </div>
        )}
      </div>
    </Modal>
  );
}
