"use client";

import { useState } from "react";

export function SectionsEditor({ fieldKey, value, onChange, onDelete }: { fieldKey: string, value: any[], onChange: (val: any[]) => void, onDelete: () => void }) {
    // Verificación de seguridad
    if (!Array.isArray(value)) return null;

    const [isExpanded, setIsExpanded] = useState(false);
    const [isJsonMode, setIsJsonMode] = useState(false);
    const [jsonText, setJsonText] = useState("");
    const [jsonError, setJsonError] = useState("");
  
    const handleUpdate = (index: number, field: string, newValue: string) => {
      const updated = [...value];
      updated[index] = { ...updated[index], [field]: newValue };
      onChange(updated);
    };
  
    const handleAdd = () => {
      onChange([...value, { time: "00:00", title: "" }]);
      setIsExpanded(true);
    };
  
    const handleRemove = (index: number) => {
      const updated = value.filter((_, i) => i !== index);
      onChange(updated);
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
            onChange(parsed);
            setIsJsonMode(false);
            setJsonError("");
        } catch (e) {
            setJsonError("JSON inválido: " + (e as Error).message);
        }
    };
  
    return (
      <div key={fieldKey} className="w-full">
        <div className="bg-muted/30 border border-border rounded-lg overflow-hidden transition-all">
          {/* Header */}
          <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="flex items-center gap-3">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <svg className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <div>
                         <p className="text-sm font-medium text-foreground">Editor de Secciones</p>
                         <p className="text-xs text-muted-foreground">{value.length} secciones</p>
                    </div>
              </div>
              <div className="flex items-center gap-2">
                 {isExpanded && (
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleJsonMode(); }}
                        className={`text-xs px-2 py-1 rounded border transition-colors ${isJsonMode ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted'}`}
                    >
                        {isJsonMode ? 'Cancelar JSON' : 'Importar/Editar JSON'}
                    </button>
                 )}
            </div>
          </div>
          
          {isExpanded && (
            <div className="p-4 border-t border-border bg-card/30">
                 {isJsonMode ? (
                    <div className="space-y-3">
                        <textarea
                            value={jsonText}
                            onChange={(e) => setJsonText(e.target.value)}
                            className="w-full h-64 bg-background text-foreground font-mono text-xs p-3 rounded border border-input focus:outline-none focus:border-ring resize-y"
                            placeholder="Pega tu JSON aquí..."
                            spellCheck={false}
                        />
                        {jsonError && <p className="text-destructive text-xs">{jsonError}</p>}
                        <div className="flex justify-end gap-2">
                            <button onClick={toggleJsonMode} className="text-xs text-muted-foreground hover:text-foreground px-3 py-1">Cancelar</button>
                            <button onClick={handleJsonSave} className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90">Guardar Cambios</button>
                        </div>
                    </div>
                 ) : (
                    <>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {value.map((item, index) => (
                            <div key={index} className="flex gap-3 bg-card border border-border p-3 rounded-md group hover:border-input transition-colors items-center">
                                <div className="w-24 shrink-0">
                                <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-1 block">Tiempo</label>
                                <input
                                    type="text"
                                    value={item.time || ""}
                                    onChange={(e) => handleUpdate(index, "time", e.target.value)}
                                    placeholder="00:00"
                                    className="w-full bg-background border border-input rounded px-2 py-1.5 text-xs text-foreground font-mono focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                                />
                                </div>
                                <div className="flex-1">
                                <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-1 block">Título</label>
                                <input
                                    type="text"
                                    value={item.title || ""}
                                    onChange={(e) => handleUpdate(index, "title", e.target.value)}
                                    placeholder="Título de la sección..."
                                    className="w-full bg-background border border-input rounded px-3 py-1.5 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                                />
                                </div>
                                <button
                                onClick={() => handleRemove(index)}
                                className="mt-4 text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                                title="Eliminar sección"
                                >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            ))}
                        </div>
                
                        <button
                            onClick={handleAdd}
                            className="mt-4 w-full py-2 border border-dashed border-border rounded-md text-xs text-muted-foreground hover:text-foreground hover:border-input hover:bg-muted/50 transition-all flex items-center justify-center gap-2"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Añadir Nueva Sección
                        </button>
                    </>
                 )}
            </div>
          )}
        </div>
      </div>
    );
  }
