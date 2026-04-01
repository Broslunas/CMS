"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Wand2, Type, List, Plus, Trash2, CheckCircle2, HelpCircle } from "lucide-react";

interface QuizItem {
    question: string;
    options: string[];
    correctAnswer: number;
}

export function QuizEditor({ 
    fieldKey, 
    value, 
    onChange, 
    onDelete,
    content
}: { 
    fieldKey: string, 
    value: QuizItem[], 
    onChange: (val: QuizItem[]) => void, 
    onDelete: () => void,
    content?: string
}) {
    // Safety check
    if (!Array.isArray(value)) return null;

    const [isExpanded, setIsExpanded] = useState(false);
    const [isJsonMode, setIsJsonMode] = useState(false);
    const [jsonText, setJsonText] = useState("");
    const [jsonError, setJsonError] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
  
    const handleUpdate = (index: number, field: keyof QuizItem, newValue: any) => {
      const updated = [...value];
      updated[index] = { ...updated[index], [field]: newValue };
      onChange(updated);
    };
  
    const handleAdd = () => {
      onChange([...value, { question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
      setIsExpanded(true);
    };
  
    const handleRemove = (index: number) => {
      const updated = value.filter((_, i) => i !== index);
      onChange(updated);
    };

    const handleOptionUpdate = (qIndex: number, oIndex: number, newVal: string) => {
        const updated = [...value];
        const newOptions = [...updated[qIndex].options];
        newOptions[oIndex] = newVal;
        updated[qIndex] = { ...updated[qIndex], options: newOptions };
        onChange(updated);
    };

    const handleAddOption = (qIndex: number) => {
        const updated = [...value];
        updated[qIndex] = { ...updated[qIndex], options: [...updated[qIndex].options, ""] };
        onChange(updated);
    };

    const handleRemoveOption = (qIndex: number, oIndex: number) => {
        const updated = [...value];
        if (updated[qIndex].options.length <= 1) return;
        const newOptions = updated[qIndex].options.filter((_, i) => i !== oIndex);
        let newCorrect = updated[qIndex].correctAnswer;
        if (newCorrect >= oIndex && newCorrect > 0) {
            newCorrect--;
        }
        updated[qIndex] = { ...updated[qIndex], options: newOptions, correctAnswer: newCorrect };
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
            if (!Array.isArray(parsed)) throw new Error("Must be an array");
            onChange(parsed);
            setIsJsonMode(false);
            setJsonError("");
        } catch (e) {
            setJsonError("Invalid JSON: " + (e as Error).message);
        }
    };

    const handleGenerateAI = async () => {
        if (!content || content.length < 100) {
            toast.error("Content is too short to generate a quiz.");
            return;
        }

        setIsGenerating(true);
        const toastId = toast.loading("Generating quiz with AI...");

        try {
            const res = await fetch("/api/ai/process", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "quiz",
                    context: content
                })
            });

            if (!res.ok) throw new Error("AI response error");
            const data = await res.json();
            
            if (Array.isArray(data)) {
                if (value.length > 0) {
                    if (confirm("Current quiz questions will be replaced. Continue?")) {
                        onChange(data);
                        toast.success("Quiz generated successfully", { id: toastId });
                    }
                } else {
                    onChange(data);
                    toast.success("Quiz generated successfully", { id: toastId });
                }
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error: any) {
            console.error("AI Quiz generation error:", error);
            toast.error(`Error: ${error.message}`, { id: toastId });
        } finally {
            setIsGenerating(false);
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
                    <div className="flex items-center gap-2">
                         <HelpCircle className="w-4 h-4 text-primary" />
                         <div>
                            <p className="text-sm font-medium text-foreground">Quiz Editor</p>
                            <p className="text-xs text-muted-foreground">{value.length} questions</p>
                         </div>
                    </div>
              </div>
              <div className="flex items-center gap-2">
                 {isExpanded && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleGenerateAI(); }}
                            disabled={isGenerating}
                            className={`text-xs px-2 py-1.5 rounded border flex items-center gap-1.5 transition-colors bg-indigo-500/10 text-indigo-500 border-indigo-500/20 hover:bg-indigo-500/20`}
                        >
                            {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                            Auto-Generate (AI)
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleJsonMode(); }}
                            className={`text-xs px-2 py-1.5 rounded border flex items-center gap-1.5 transition-colors ${isJsonMode ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted'}`}
                        >
                            <Type className="w-3 h-3" />
                            {isJsonMode ? 'Cancel JSON' : 'Edit JSON'}
                        </button>
                    </>
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
                            placeholder="Paste your JSON here..."
                            spellCheck={false}
                        />
                        {jsonError && <p className="text-destructive text-xs">{jsonError}</p>}
                        <div className="flex justify-end gap-2">
                            <button onClick={toggleJsonMode} className="text-xs text-muted-foreground hover:text-foreground px-3 py-1">Cancel</button>
                            <button onClick={handleJsonSave} className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90">Save Changes</button>
                        </div>
                    </div>
                 ) : (
                    <>
                        <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2 pb-4 custom-scrollbar">
                            {value.length === 0 && (
                                <div className="py-12 flex flex-col items-center justify-center border border-dashed border-border rounded-lg bg-muted/20">
                                    <List className="w-8 h-8 text-muted-foreground mb-3 opacity-20" />
                                    <p className="text-sm text-muted-foreground">No questions defined.</p>
                                    <p className="text-xs text-muted-foreground/60 mt-1">Add your first question or use AI generation.</p>
                                </div>
                            )}
                            {value.map((item, qIndex) => (
                            <div key={qIndex} className="bg-card border border-border p-4 rounded-lg group hover:border-input transition-colors relative">
                                <div className="absolute top-4 right-4 group-hover:opacity-100 opacity-0 transition-opacity">
                                    <button
                                        onClick={() => handleRemove(qIndex)}
                                        className="text-muted-foreground hover:text-destructive p-1.5 rounded hover:bg-destructive/10 transition-colors"
                                        title="Delete question"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="pr-8">
                                        <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-1 block">Question {qIndex + 1}</label>
                                        <textarea
                                            value={item.question || ""}
                                            onChange={(e) => handleUpdate(qIndex, "question", e.target.value)}
                                            placeholder="Enter your question here..."
                                            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring min-h-[60px] resize-none whitespace-normal break-words"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-1 block">Options & Correct Answer</label>
                                        <div className="grid gap-2">
                                            {(item.options || []).map((option, oIndex) => (
                                                <div key={oIndex} className="flex gap-2 items-center">
                                                    <button
                                                        onClick={() => handleUpdate(qIndex, "correctAnswer", oIndex)}
                                                        className={`shrink-0 p-1.5 rounded-full transition-colors ${item.correctAnswer === oIndex ? 'bg-green-500/20 text-green-500' : 'text-muted-foreground hover:text-foreground'}`}
                                                        title="Mark as correct answer"
                                                    >
                                                        <CheckCircle2 className={`w-4 h-4 ${item.correctAnswer === oIndex ? 'fill-current' : ''}`} />
                                                    </button>
                                                    <input
                                                        type="text"
                                                        value={option}
                                                        onChange={(e) => handleOptionUpdate(qIndex, oIndex, e.target.value)}
                                                        placeholder={`Option ${oIndex + 1}...`}
                                                        className={`flex-1 bg-background border rounded px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors ${item.correctAnswer === oIndex ? 'border-green-500/50 focus:border-green-500' : 'border-input focus:border-ring'}`}
                                                    />
                                                    <button
                                                        onClick={() => handleRemoveOption(qIndex, oIndex)}
                                                        className="text-muted-foreground hover:text-destructive p-1.5 rounded hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                                                        title="Remove option"
                                                        disabled={(item.options || []).length <= 1}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => handleAddOption(qIndex)}
                                                className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-muted-foreground hover:text-foreground transition-colors mt-1 ml-9 w-fit"
                                            >
                                                <Plus className="w-3 h-3" />
                                                Add Option
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                
                        <button
                            onClick={handleAdd}
                            className="mt-6 w-full py-3 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-input hover:bg-muted/50 transition-all flex items-center justify-center gap-2 font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Add New Question
                        </button>
                    </>
                 )}
            </div>
          )}
        </div>
      </div>
    );
}
