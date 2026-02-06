"use client";

import { useState } from "react";

export function TranscriptionEditor({ fieldKey, value, onChange, onDelete }: { fieldKey: string, value: any[], onChange: (val: any[]) => void, onDelete: () => void }) {
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
    onChange([...value, { time: "00:00", text: "" }]);
    setIsExpanded(true); // Auto-expand when adding
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

  const handleImport = () => {
      // Intentar primero como JSON
      try {
          const parsed = JSON.parse(jsonText);
          if (Array.isArray(parsed)) {
            onChange(parsed);
            setIsJsonMode(false);
            setJsonError("");
            return;
          }
      } catch (e) {
         // Silently fail JSON parse, try text parse
      }

      // Intentar Parseo de Texto ([00:00] Speaker: Text)
      try {
          const lines = jsonText.split('\n');
          const transcription: any[] = [];
          const regex = /^\[(\d{1,2}:\d{2})\]\s*(?:[^:]+:\s*)?(.*)/;

          let hasMatches = false;

          lines.forEach(line => {
              const cleanLine = line.trim();
              if (!cleanLine) return;

              const match = cleanLine.match(regex);
              if (match) {
                  hasMatches = true;
                  const time = match[1];
                  const textContent = match[2] ? match[2].trim() : "";
                  
                  // Simple unescape if user pasted stringified text by mistake, otherwise keep distinct
                  transcription.push({
                      time: time,
                      text: textContent
                  });
              }
          });

          if (hasMatches && transcription.length > 0) {
              onChange(transcription);
              setIsJsonMode(false);
              setJsonError("");
              return;
          }

          throw new Error("No se pudo detectar formato JSON ni Texto válido ([00:00] ...)");
      } catch (e) {
          setJsonError((e as Error).message);
      }
  };

  return (
    <div key={fieldKey} className="w-full">
      <div className="bg-muted/30 border border-border rounded-lg overflow-hidden transition-all">
        {/* Header - Always visible & clickable to toggle */}
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
                    <p className="text-sm font-medium text-foreground">Editor de Transcripción</p>
                    <p className="text-xs text-muted-foreground">{value.length} segmentos</p>
                 </div>
            </div>
            
            <div className="flex items-center gap-2">
                 {isExpanded && (
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleJsonMode(); }}
                        className={`text-xs px-2 py-1 rounded border transition-colors ${isJsonMode ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted'}`}
                    >
                        {isJsonMode ? 'Cancelar Importación' : 'Importar JSON/Texto'}
                    </button>
                 )}
            </div>
        </div>
        
        {/* Content Body */}
        {isExpanded && (
            <div className="p-4 border-t border-border bg-card/30">
                {isJsonMode ? (
                    <div className="space-y-3">
                        <textarea
                            value={jsonText}
                            onChange={(e) => setJsonText(e.target.value)}
                            className="w-full h-64 bg-background text-foreground font-mono text-xs p-3 rounded border border-input focus:outline-none focus:border-ring resize-y"
                            placeholder="Pega tu JSON o Texto con formato [00:00] Speaker: ... aquí..."
                            spellCheck={false}
                        />
                        {jsonError && <p className="text-destructive text-xs">{jsonError}</p>}
                        <div className="flex justify-end gap-2">
                            <button onClick={toggleJsonMode} className="text-xs text-muted-foreground hover:text-foreground px-3 py-1">Cancelar</button>
                            <button onClick={handleImport} className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90">Procesar e Importar</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {value.map((item, index) => (
                            <div key={index} className="flex gap-3 bg-card border border-border p-3 rounded-md group hover:border-input transition-colors">
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
                                <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-1 block">Texto</label>
                                <textarea
                                value={item.text || ""}
                                onChange={(e) => handleUpdate(index, "text", e.target.value)}
                                placeholder="Escribe la transcripción..."
                                rows={2}
                                className="w-full bg-background border border-input rounded px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring resize-y min-h-[60px]"
                                />
                            </div>
                            <button
                                onClick={() => handleRemove(index)}
                                className="self-start mt-6 text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                                title="Eliminar segmento"
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
                        Añadir Nuevo Segmento
                        </button>
                    </>
                )}
            </div>
        )}
      </div>
    </div>
  );
}
