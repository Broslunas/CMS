"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2, ChevronRight, ChevronDown, Image as ImageIcon, Calendar, Type, Hash, Loader2, Code2 } from "lucide-react";
import { toast } from "sonner";

// Reusing the conversion logic if possible, or keeping it local
const convertToGitHubRawUrl = (src: string, repoId?: string): string => {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  let baseUrl = 'https://raw.githubusercontent.com/Broslunas/portfolio-old/refs/heads/main';
  if (repoId) {
    baseUrl = `https://raw.githubusercontent.com/${repoId}/refs/heads/main`;
  }
  
  if (src.startsWith('/')) {
    return `${baseUrl}${src}`;
  }
  
  if (!src.startsWith('./') && !src.startsWith('../')) {
    return `${baseUrl}/${src}`;
  }
  
  return src;
};

interface ArrayEditorProps {
    fieldKey: string;
    value: any[];
    onChange: (val: any[]) => void;
    onDelete: () => void;
    metadata?: any;
    triggerUpload?: (target: { type: 'content' | 'metadata', key?: string, index?: number, subKey?: string }) => void;
    isUploading?: boolean;
    uploadTarget?: { type: 'content' | 'metadata', key?: string, index?: number, subKey?: string };
    repoId?: string;
}

export function ArrayEditor({
    fieldKey,
    value,
    onChange,
    onDelete,
    metadata,
    triggerUpload,
    isUploading,
    uploadTarget,
    repoId
}: ArrayEditorProps) {
    const items = Array.isArray(value) ? value : [];
    const [expandedItems, setExpandedItems] = useState<number[]>([0]);
    const [isJsonMode, setIsJsonMode] = useState(false);
    const [jsonText, setJsonText] = useState("");
    const [jsonError, setJsonError] = useState("");

    // Detect schema from all items to be safe, or first item
    const schema = useMemo(() => {
        const keys = new Set<string>();
        items.forEach(item => {
            if (typeof item === 'object' && item !== null) {
                Object.keys(item).forEach(k => keys.add(k));
            }
        });
        
        // If empty, use a default schema or wait for first item
        if (keys.size === 0 && items.length === 0) {
            return ['title', 'src']; // Default example schema
        }
        
        return Array.from(keys).filter(k => k !== 'pubDate');
    }, [items]);

    const toggleExpand = (index: number) => {
        setExpandedItems(prev => 
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const handleUpdateItem = (index: number, subKey: string, newValue: any) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [subKey]: newValue };
        
        // Ensure pubDate is removed from all items
        const cleaned = updated.map(item => {
            if (typeof item === 'object' && item !== null) {
                const { pubDate, ...rest } = item;
                return rest;
            }
            return item;
        });
        onChange(cleaned);
    };

    const handleAddItem = () => {
        const newItem = schema.reduce((acc, key) => ({ ...acc, [key]: "" }), {});
        const newList = [...items, newItem];
        
        // Cleaning is redundant here but good for consistency
        const cleaned = newList.map(item => {
            if (typeof item === 'object' && item !== null) {
                const { pubDate, ...rest } = item;
                return rest;
            }
            return item;
        });
        onChange(cleaned);
        setExpandedItems(prev => [...prev, newList.length - 1]);
    };

    const handleRemoveItem = (index: number) => {
        const updated = items.filter((_, i) => i !== index);
        const cleaned = updated.map(item => {
            if (typeof item === 'object' && item !== null) {
                const { pubDate, ...rest } = item;
                return rest;
            }
            return item;
        });
        onChange(cleaned);
    };

    const toggleJsonMode = () => {
        if (!isJsonMode) {
            setJsonText(JSON.stringify(value, null, 2));
            setIsJsonMode(true);
        } else {
            setIsJsonMode(false);
            setJsonError("");
        }
    };

    const handleJsonSave = () => {
        try {
            const parsed = JSON.parse(jsonText);
            if (!Array.isArray(parsed)) throw new Error("Debe ser un array");
            // Clean pubDate if it exists in JSON
            const cleaned = parsed.map(item => {
                if (typeof item === 'object' && item !== null) {
                    const { pubDate, ...rest } = item;
                    return rest;
                }
                return item;
            });
            onChange(cleaned);
            setIsJsonMode(false);
            setJsonError("");
        } catch (e) {
            setJsonError("JSON inválido: " + (e as Error).message);
        }
    };

    const getFieldType = (key: string, val: any) => {
        const k = key.toLowerCase();
        if (k.includes('date') || k.includes('pubdate')) return 'date';
        if (k.includes('src') || k.includes('image') || k.includes('img') || k.includes('url') || k.includes('icon') || k.includes('avatar') || k.includes('cover')) return 'image';
        if (typeof val === 'number') return 'number';
        if (typeof val === 'boolean') return 'boolean';
        return 'text';
    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between bg-muted/20 p-2 rounded-lg border border-border/50">
                <div className="flex items-center gap-2 px-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-semibold text-foreground/70 uppercase tracking-widest">{items.length} Elementos</span>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={toggleJsonMode}
                        className={`p-2 rounded-lg transition-all ${isJsonMode ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
                        title={isJsonMode ? "Volver al editor visual" : "Editar como JSON"}
                    >
                        <Code2 className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={handleAddItem}
                        className="group relative flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 text-xs font-bold"
                    >
                        <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                        Añadir Nuevo
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {isJsonMode ? (
                    <div className="space-y-3 animate-in fade-in duration-300">
                        <textarea
                            value={jsonText}
                            onChange={(e) => setJsonText(e.target.value)}
                            className="w-full h-[400px] bg-background text-foreground font-mono text-xs p-4 rounded-xl border border-border focus:ring-4 focus:ring-primary/5 focus:border-primary focus:outline-none resize-y"
                            placeholder="Pega tu JSON aquí..."
                            spellCheck={false}
                        />
                        {jsonError && <p className="text-destructive text-xs font-medium px-2">{jsonError}</p>}
                        <div className="flex justify-end gap-3">
                            <button onClick={toggleJsonMode} className="text-xs font-bold text-muted-foreground hover:text-foreground px-4 py-2 uppercase tracking-widest">Cancelar</button>
                            <button onClick={handleJsonSave} className="text-xs font-bold bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 shadow-sm hover:shadow-md transition-all uppercase tracking-widest">Guardar Cambios</button>
                        </div>
                    </div>
                ) : (
                    items.length === 0 ? (
                        <div 
                            onClick={handleAddItem}
                            className="group py-16 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl bg-muted/5 cursor-pointer hover:bg-muted/10 hover:border-primary/30 transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-full bg-muted/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                                <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground">No hay items configurados</p>
                            <p className="text-xs text-muted-foreground/50 mt-1">Pulsa para añadir el primer elemento a la lista</p>
                        </div>
                    ) : (
                        items.map((item, index) => (
                            <div 
                                key={index} 
                                className={`group border rounded-xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md ${
                                    expandedItems.includes(index) 
                                    ? 'border-primary/30 ring-1 ring-primary/10 bg-card' 
                                    : 'border-border bg-card/50 hover:border-border-hover'
                                }`}
                            >
                                {/* Header */}
                                <div 
                                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors select-none"
                                    onClick={() => toggleExpand(index)}
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className={`p-2 rounded-lg transition-colors ${expandedItems.includes(index) ? 'bg-primary/10 text-primary' : 'bg-muted/50 text-muted-foreground'}`}>
                                            {expandedItems.includes(index) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                        </div>
                                        
                                        {/* Preview Image in Header if available */}
                                        {schema.find(k => getFieldType(k, item[k]) === 'image') && item[schema.find(k => getFieldType(k, item[k]) === 'image')!] && (
                                            <div className="w-10 h-10 rounded-md overflow-hidden bg-muted border border-border shrink-0">
                                                <img 
                                                    src={convertToGitHubRawUrl(item[schema.find(k => getFieldType(k, item[k]) === 'image')!], repoId)} 
                                                    alt="" 
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => (e.target as HTMLImageElement).style.opacity = '0'}
                                                />
                                            </div>
                                        )}

                                        <div className="min-w-0">
                                            <h4 className="text-sm font-bold text-foreground truncate max-w-[200px] sm:max-w-md">
                                                {item.title || item.name || item.text || item.label || `Elemento #${index + 1}`}
                                            </h4>
                                            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter opacity-70">
                                                Index {index} • {Object.keys(item).length} Campos
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleRemoveItem(index); }}
                                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            title="Eliminar item"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Body */}
                                {expandedItems.includes(index) && (
                                    <div className="p-6 border-t border-border bg-gradient-to-b from-transparent to-muted/5 space-y-6 animate-in slide-in-from-top-4 duration-300">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {schema.map(subKey => {
                                                const type = getFieldType(subKey, item[subKey]);
                                                return (
                                                    <div key={subKey} className={`space-y-2 ${type === 'image' ? 'md:col-span-2' : ''}`}>
                                                        <label className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                                            {subKey}
                                                        </label>
                                                        
                                                        {type === 'image' ? (
                                                            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                                                                <div className="sm:col-span-3 space-y-3">
                                                                    <div className="relative group/input">
                                                                        <input 
                                                                            type="text" 
                                                                            value={item[subKey] || ""} 
                                                                            onChange={(e) => handleUpdateItem(index, subKey, e.target.value)}
                                                                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary focus:ring-4 focus:ring-primary/5 focus:border-primary focus:outline-none transition-all pr-12"
                                                                            placeholder="https://ejemplo.com/imagen.webp"
                                                                        />
                                                                        <button 
                                                                            type="button"
                                                                            onClick={() => triggerUpload?.({ type: 'metadata', key: fieldKey, index, subKey })}
                                                                            className="absolute right-2 top-2 p-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors"
                                                                            title="Subir archivo"
                                                                        >
                                                                            {isUploading && uploadTarget?.index === index && uploadTarget?.subKey === subKey ? (
                                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                                            ) : (
                                                                                <ImageIcon className="w-4 h-4" />
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                    <p className="text-[10px] text-muted-foreground italic px-1">Ruta absoluta o relativa al repositorio</p>
                                                                </div>
                                                                <div className="sm:col-span-2 flex items-center justify-center sm:justify-end">
                                                                    <div className="relative aspect-video w-full max-w-[200px] rounded-xl overflow-hidden border-2 border-border bg-muted/20 shadow-inner group/preview">
                                                                        <img 
                                                                            src={convertToGitHubRawUrl(item[subKey] || '', repoId)} 
                                                                            alt="Vista previa" 
                                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover/preview:scale-110"
                                                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/121212/333333?text=Sin+Imagen'; }}
                                                                        />
                                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                                                                            <span className="text-[10px] text-white font-bold tracking-widest uppercase">Vista Previa</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : type === 'date' ? (
                                                            <div className="relative">
                                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                                                <input 
                                                                    type="date"
                                                                    value={item[subKey] ? (typeof item[subKey] === 'string' && item[subKey].includes('T') ? item[subKey].split('T')[0] : item[subKey]) : ""}
                                                                    onChange={(e) => handleUpdateItem(index, subKey, e.target.value)}
                                                                    className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none transition-all [color-scheme:dark]"
                                                                />
                                                            </div>
                                                        ) : type === 'number' ? (
                                                            <div className="relative">
                                                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                                                <input 
                                                                    type="number"
                                                                    value={item[subKey] || 0}
                                                                    onChange={(e) => handleUpdateItem(index, subKey, parseFloat(e.target.value))}
                                                                    className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none transition-all"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="relative">
                                                                <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                                                <input 
                                                                    type="text"
                                                                    value={item[subKey] || ""}
                                                                    onChange={(e) => handleUpdateItem(index, subKey, e.target.value)}
                                                                    className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none transition-all"
                                                                    placeholder={`Escribe ${subKey}...`}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )
                )}
            </div>
            
            {!isJsonMode && items.length > 0 && (
                <div className="flex justify-center pt-4">
                    <button 
                        onClick={handleAddItem}
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest"
                    >
                        <Plus className="w-4 h-4" />
                        Añadir otro elemento
                    </button>
                </div>
            )}
        </div>
    );
}
