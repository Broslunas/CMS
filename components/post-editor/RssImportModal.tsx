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
  Type, FileText, AlignLeft, Calendar, Headphones, ImageIcon, Plus, Trash
} from "lucide-react";

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
  const [flatFields, setFlatFields] = useState<Record<string, string>>({});
  
  // mappings: Target Field Key -> Source RSS Key
  const [mappings, setMappings] = useState<Record<string, string>>({});
  
  // Custom fields added by the user dynamically [ { id: 'field1', key: 'customKey', source: '' } ]
  const [customTargets, setCustomTargets] = useState<{ id: string, key: string }[]>([]);

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
      
      const initialMappings: Record<string, string> = {
          title: "", content: "", description: "", date: "", image: "", episodeUrl: ""
      };

      // Smart defaults logic looking into flattened keys
      for (const key of Object.keys(flattened)) {
          const lk = key.toLowerCase();
          const val = flattened[key];
          
          if (lk === 'title' && !initialMappings.title) initialMappings.title = key;
          else if ((lk === 'pubdate' || lk === 'isodate') && !initialMappings.date) initialMappings.date = key;
          else if ((lk === 'contentencoded' || lk === 'content') && !initialMappings.content) initialMappings.content = key;
          else if ((lk === 'itunessummary' || lk === 'contentsnippet' || lk === 'description') && !initialMappings.description) initialMappings.description = key;
          else if ((lk === 'enclosure.url' || lk === 'url')) {
              if (val.includes('.mp3') || val.includes('.m4a') || val.includes('.wav')) initialMappings.episodeUrl = key;
              else if (val.includes('.jpg') || val.includes('.png')) initialMappings.image = key;
          }
          else if ((lk === 'itunesimage.href' || lk === 'href') && (val.includes('.jpg') || val.includes('.png'))) {
              initialMappings.image = key;
          }
      }

      setMappings(initialMappings);
      setCustomTargets([]);
      setSelectedItem(item);
  };

  const handleApplyImport = () => {
    const newMetadata: any = {};
    let newContent = "";

    // Apply standard
    for (const tgt of STANDARD_TARGETS) {
        const sourceKey = mappings[tgt.key];
        if (!sourceKey) continue;
        let val = flatFields[sourceKey];
        if (!val) continue;

        if (tgt.key === 'date') {
             try { val = new Date(val).toISOString(); } catch(e) {}
        }

        if (tgt.key === 'content') {
            newContent = val;
        } else {
            newMetadata[tgt.key] = val;
        }
    }

    // Apply custom targets
    for (const ct of customTargets) {
        if (!ct.key.trim()) continue;
        const sourceKey = mappings[ct.id];
        if (!sourceKey) continue;
        let val = flatFields[sourceKey];
        if (typeof val === 'string' && val) {
            newMetadata[ct.key] = val;
        }
    }

    onImport({ metadata: newMetadata, content: newContent.trim() });
  };

  const addCustomTarget = () => {
      const id = `custom_${Date.now()}`;
      setCustomTargets([...customTargets, { id, key: '' }]);
      setMappings(prev => ({ ...prev, [id]: '' }));
  };

  const updateMapping = (target: string, source: string) => {
      setMappings(prev => ({ ...prev, [target]: source }));
  };

  const removeCustomTarget = (id: string) => {
      setCustomTargets(customTargets.filter(c => c.id !== id));
      const newMap = { ...mappings };
      delete newMap[id];
      setMappings(newMap);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Import from RSS">
      <div className="flex flex-col h-[75vh]">
        {!selectedItem ? (
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
                    <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={() => setSelectedItem(null)}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="min-w-0">
                        <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-0.5">Map Data</p>
                        <h3 className="text-sm font-medium truncate" title={selectedItem.title}>{selectedItem.title}</h3>
                    </div>
                </div>

                <ScrollArea className="flex-1 overflow-auto pr-3 relative">
                    <div className="space-y-4 pb-8">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Standard Targets */}
                            {STANDARD_TARGETS.map(tgt => {
                                const selectedSource = mappings[tgt.key] || "";
                                const valPreview = selectedSource ? flatFields[selectedSource] : null;
                                const Icon = tgt.icon;
                                
                                return (
                                    <div key={tgt.key} className={`border rounded-xl p-4 transition-all duration-200 ${selectedSource ? 'border-primary/30 bg-primary/[0.02] shadow-sm' : 'border-border bg-card'}`}>
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${selectedSource ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm leading-none">{tgt.label}</h4>
                                                <p className="text-[10px] text-muted-foreground mt-1">{tgt.desc}</p>
                                            </div>
                                        </div>
                                        <Select value={selectedSource} onChange={(e) => updateMapping(tgt.key, e.target.value)}>
                                            <option value="">-- Do not import --</option>
                                            {Object.keys(flatFields).map(k => (
                                                <option key={k} value={k}>{k}</option>
                                            ))}
                                        </Select>
                                        
                                        {valPreview && (
                                            <div className="mt-3 text-[11px] bg-background/50 border border-border/50 p-2.5 rounded-md line-clamp-2 text-muted-foreground relative overflow-hidden group">
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/40 rounded-l-md"></div>
                                                <span className="font-semibold text-foreground/80 mr-1">{selectedSource}:</span> 
                                                <span className="italic">{valPreview}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            
                            {/* Custom Targets */}
                            {customTargets.map((ct) => {
                                const selectedSource = mappings[ct.id] || "";
                                const valPreview = selectedSource ? flatFields[selectedSource] : null;
                                
                                return (
                                    <div key={ct.id} className="border rounded-xl p-4 border-dashed bg-card/50">
                                        <div className="flex items-start justify-between gap-2 mb-3">
                                            <div className="flex-1">
                                                <label className="text-[10px] uppercase font-semibold text-muted-foreground mb-1 block">Custom target field</label>
                                                <Input 
                                                    placeholder="e.g. author, guest..." 
                                                    value={ct.key} 
                                                    onChange={(e) => {
                                                        const newVal = e.target.value;
                                                        setCustomTargets(customTargets.map(c => c.id === ct.id ? { ...c, key: newVal } : c));
                                                    }}
                                                    className="h-8 text-sm"
                                                />
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0 mt-5" onClick={() => removeCustomTarget(ct.id)}>
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Select value={selectedSource} onChange={(e) => updateMapping(ct.id, e.target.value)}>
                                            <option value="">-- Select Source Field --</option>
                                            {Object.keys(flatFields).map(k => (
                                                <option key={k} value={k}>{k}</option>
                                            ))}
                                        </Select>
                                        {valPreview && (
                                            <div className="mt-3 text-[11px] bg-background/50 border border-border/50 p-2.5 rounded-md line-clamp-2 text-muted-foreground relative overflow-hidden">
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/40 rounded-l-md"></div>
                                                <span className="font-semibold text-foreground/80 mr-1">{selectedSource}:</span> 
                                                <span className="italic">{valPreview}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="pt-2 flex justify-center">
                            <Button variant="outline" size="sm" onClick={addCustomTarget} className="gap-2 border-dashed bg-card hover:bg-accent">
                                <Plus className="h-4 w-4" /> Add Custom Field
                            </Button>
                        </div>
                    </div>
                </ScrollArea>

                <div className="pt-4 mt-2 border-t flex justify-end items-center bg-background z-10 gap-3">
                    <Button variant="ghost" onClick={() => setSelectedItem(null)}>Back to List</Button>
                    <Button onClick={handleApplyImport} className="gap-2">
                        <ArrowRight className="h-4 w-4" /> Import Mapped Data
                    </Button>
                </div>
            </div>
        )}
      </div>
    </Modal>
  );
}
