"use client";

import { useState, useMemo } from "react";
import { Play, Type, Video, Plus, X, GripVertical, ExternalLink, Loader2, Youtube, Check } from "lucide-react";
import { getYouTubeVideos } from "@/app/actions/youtube";
import { signIn } from "next-auth/react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Clip {
    title: string;
    url: string;
    [key: string]: any;
}

interface ClipsEditorProps {
    fieldKey: string;
    value: Clip[];
    onChange: (val: Clip[]) => void;
    onDelete: () => void;
}

// Extract video ID from various YouTube URL formats
function getYouTubeVideoId(url: string): string | null {
    if (!url) return null;
    const patterns = [
        /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
        /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
        /youtu\.be\/([a-zA-Z0-9_-]+)/,
        /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

function SortableClipItem({
    id,
    index,
    clip,
    onUpdate,
    onRemove,
}: {
    id: string;
    index: number;
    clip: Clip;
    onUpdate: (index: number, field: string, value: string) => void;
    onRemove: (index: number) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : undefined,
    };

    const [showPreview, setShowPreview] = useState(false);
    const videoId = getYouTubeVideoId(clip.url);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-card border border-border rounded-lg group hover:border-input transition-all ${isDragging ? 'shadow-lg ring-2 ring-primary/20' : ''}`}
        >
            <div className="flex items-start gap-3 p-3">
                {/* Drag Handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="mt-6 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted transition-colors shrink-0"
                    title="Drag to reorder"
                >
                    <GripVertical className="w-4 h-4" />
                </button>

                {/* Fields */}
                <div className="flex-1 space-y-2 min-w-0">
                    {/* Title */}
                    <div>
                        <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-1 block">
                            Title
                        </label>
                        <input
                            type="text"
                            value={clip.title || ""}
                            onChange={(e) => onUpdate(index, "title", e.target.value)}
                            placeholder="Clip title..."
                            className="w-full bg-background border border-input rounded px-3 py-1.5 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                    </div>

                    {/* URL */}
                    <div>
                        <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-1 block">
                            URL
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={clip.url || ""}
                                onChange={(e) => onUpdate(index, "url", e.target.value)}
                                placeholder="https://youtube.com/shorts/..."
                                className="flex-1 bg-background border border-input rounded px-3 py-1.5 text-sm text-foreground font-mono focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                            />
                            {clip.url && (
                                <a
                                    href={clip.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2 py-1.5 text-muted-foreground hover:text-foreground border border-input rounded hover:bg-muted transition-colors shrink-0"
                                    title="Open in new tab"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                            {videoId && (
                                <button
                                    onClick={() => setShowPreview(!showPreview)}
                                    className={`px-2 py-1.5 border rounded transition-colors shrink-0 ${showPreview ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground border-input hover:text-foreground hover:bg-muted'}`}
                                    title={showPreview ? "Hide preview" : "Show preview"}
                                >
                                    <Play className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* YouTube Preview */}
                    {showPreview && videoId && (
                        <div className="mt-2 rounded-lg overflow-hidden border border-border bg-black/5 flex justify-center">
                            <iframe
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title={clip.title || "YouTube Video"}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full max-w-[320px] aspect-[9/16] rounded-lg"
                            />
                        </div>
                    )}
                </div>

                {/* Remove Button */}
                <button
                    onClick={() => onRemove(index)}
                    className="mt-6 text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0"
                    title="Remove clip"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export function ClipsEditor({ fieldKey, value, onChange, onDelete }: ClipsEditorProps) {
    if (!Array.isArray(value)) return null;

    const [isExpanded, setIsExpanded] = useState(false);
    const [isJsonMode, setIsJsonMode] = useState(false);
    const [jsonText, setJsonText] = useState("");
    const [jsonError, setJsonError] = useState("");


    const [activeId, setActiveId] = useState<string | null>(null);

    // YouTube State
    const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
    const [youtubeVideos, setYoutubeVideos] = useState<any[]>([]);
    const [isLoadingYouTube, setIsLoadingYouTube] = useState(false);
    const [youtubeError, setYoutubeError] = useState("");
    const [youtubePageToken, setYoutubePageToken] = useState<string | undefined>(undefined);
    const [selectedVideoIds, setSelectedVideoIds] = useState<Set<string>>(new Set());

    const fetchYouTubeVideos = async (pageToken?: string) => {
        setIsLoadingYouTube(true);
        setYoutubeError("");
        try {
            const result = await getYouTubeVideos(pageToken);
            if (result.error) {
                setYoutubeError(result.error);
            } else if (result.videos) {
                setYoutubeVideos(prev => pageToken ? [...prev, ...result.videos!] : result.videos!);
                setYoutubePageToken(result.nextPageToken);
            }
        } catch (err) {
            setYoutubeError("Failed to fetch videos");
        } finally {
            setIsLoadingYouTube(false);
        }
    };

    const openYouTubeModal = () => {
        setIsYouTubeModalOpen(true);
        setSelectedVideoIds(new Set());
        if (youtubeVideos.length === 0) {
            fetchYouTubeVideos();
        }
    };

    const toggleVideoSelection = (videoId: string) => {
        const newSelected = new Set(selectedVideoIds);
        if (newSelected.has(videoId)) {
            newSelected.delete(videoId);
        } else {
            newSelected.add(videoId);
        }
        setSelectedVideoIds(newSelected);
    };

    const handleAddSelectedVideos = () => {
        const videosToAdd = youtubeVideos.filter(v => selectedVideoIds.has(v.id));
        const newClips = videosToAdd.map(v => ({
            title: v.title,
            url: `https://youtu.be/${v.id}`
        }));
        onChange([...value, ...newClips]);
        setIsYouTubeModalOpen(false);
        setSelectedVideoIds(new Set());
    };

    // Filter out videos that are already in the clips list
    const availableVideos = youtubeVideos.filter(video => !value.some(clip => getYouTubeVideoId(clip.url) === video.id));

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const itemIds = useMemo(
        () => value.map((_, i) => `clip-${i}`),
        [value]
    );

    const handleUpdate = (index: number, field: string, newValue: string) => {
        const updated = [...value];
        updated[index] = { ...updated[index], [field]: newValue };
        onChange(updated);
    };

    const handleAdd = () => {
        onChange([...value, { title: "", url: "" }]);
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
            if (!Array.isArray(parsed)) throw new Error("Must be an array");
            onChange(parsed);
            setIsJsonMode(false);
            setJsonError("");
        } catch (e) {
            setJsonError("Invalid JSON: " + (e as Error).message);
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        if (over && active.id !== over.id) {
            const oldIndex = itemIds.indexOf(active.id as string);
            const newIndex = itemIds.indexOf(over.id as string);
            onChange(arrayMove([...value], oldIndex, newIndex));
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
                            <Video className="w-4 h-4 text-rose-500" />
                            <div>
                                <p className="text-sm font-medium text-foreground">Clips Editor</p>
                                <p className="text-xs text-muted-foreground">{value.length} clip{value.length !== 1 ? 's' : ''}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isExpanded && (
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleJsonMode(); }}
                                className={`text-xs px-2 py-1.5 rounded border flex items-center gap-1.5 transition-colors ${isJsonMode ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted'}`}
                            >
                                <Type className="w-3 h-3" />
                                {isJsonMode ? 'Cancel JSON' : 'Edit JSON'}
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
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragStart={handleDragStart}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                                        <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2 pb-4 custom-scrollbar">
                                            {value.length === 0 && (
                                                <div className="py-12 flex flex-col items-center justify-center border border-dashed border-border rounded-lg bg-muted/20">
                                                    <Video className="w-8 h-8 text-muted-foreground mb-3 opacity-20" />
                                                    <p className="text-sm text-muted-foreground">No clips added yet.</p>
                                                    <p className="text-xs text-muted-foreground/60 mt-1">Add clips with a title and YouTube URL.</p>
                                                </div>
                                            )}
                                            {value.map((clip, index) => (
                                                <SortableClipItem
                                                    key={itemIds[index]}
                                                    id={itemIds[index]}
                                                    index={index}
                                                    clip={clip}
                                                    onUpdate={handleUpdate}
                                                    onRemove={handleRemove}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>

                                <button
                                    onClick={handleAdd}
                                    className="mt-4 w-full py-2 border border-dashed border-border rounded-md text-xs text-muted-foreground hover:text-foreground hover:border-input hover:bg-muted/50 transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-3 h-3" />
                                    Add New Clip
                                </button>
                                
                                <button
                                    onClick={openYouTubeModal}
                                    className="mt-2 w-full py-2 border border-dashed border-red-200 bg-red-50/50 hover:bg-red-50 text-xs text-red-600 hover:text-red-700 hover:border-red-300 rounded-md transition-all flex items-center justify-center gap-2"
                                >
                                    <Youtube className="w-3 h-3" />
                                    Add from YouTube
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* YouTube Modal */}
            {isYouTubeModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-card w-full max-w-2xl max-h-[80vh] rounded-xl shadow-2xl border border-border flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h3 className="font-medium flex items-center gap-2">
                                <Youtube className="w-5 h-5 text-red-600" />
                                Select YouTube Video
                            </h3>
                            <button 
                                onClick={() => setIsYouTubeModalOpen(false)}
                                className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 min-h-[300px]">
                            {isLoadingYouTube && youtubeVideos.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
                                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                    <p>Loading your videos...</p>
                                </div>
                            ) : youtubeError ? (
                                <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                                    <div className="bg-destructive/10 text-destructive p-3 rounded-full mb-3">
                                        <Youtube className="w-6 h-6" />
                                    </div>
                                    <p className="font-medium mb-1">Could not load videos</p>
                                    <p className="text-sm text-muted-foreground mb-4 max-w-xs">{youtubeError}</p>
                                    {youtubeError.includes("connect") || youtubeError.includes("expired") ? (
                                        <button
                                            onClick={() => signIn("google")}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 flex items-center gap-2"
                                        >
                                            <Youtube className="w-4 h-4" />
                                            Connect YouTube Channel
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => fetchYouTubeVideos()}
                                            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-secondary/80"
                                        >
                                            Try Again
                                        </button>
                                    )}
                                </div>
                            ) : availableVideos.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <p>No available videos found on your channel.</p>
                                    {youtubeVideos.length > 0 && <p className="text-xs mt-1">(All fetched videos are already added)</p>}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {availableVideos.map((video) => {
                                        const isSelected = selectedVideoIds.has(video.id);
                                        return (
                                            <button
                                                key={video.id}
                                                onClick={() => toggleVideoSelection(video.id)}
                                                className={`text-left group border rounded-lg overflow-hidden transition-all bg-card relative ${isSelected ? 'border-primary ring-2 ring-primary' : 'border-border hover:border-red-200 hover:ring-1 hover:ring-red-200 hover:bg-muted/30'}`}
                                            >
                                                <div className="aspect-video bg-muted relative overflow-hidden">
                                                    <img 
                                                        src={video.thumbnail} 
                                                        alt={video.title} 
                                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                    />
                                                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${isSelected ? 'opacity-100 bg-primary/20' : 'opacity-0 group-hover:opacity-100 bg-black/20'}`}>
                                                        {isSelected ? (
                                                            <div className="bg-primary text-primary-foreground rounded-full p-2">
                                                                <Check className="w-6 h-6" />
                                                            </div>
                                                        ) : (
                                                            <Plus className="w-8 h-8 text-white drop-shadow-md" />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="p-3">
                                                    <h4 className={`font-medium text-sm line-clamp-2 mb-1 transition-colors ${isSelected ? 'text-primary' : 'group-hover:text-red-600'}`}>
                                                        {video.title}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(video.publishedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                            
                            {/* Load More */}
                            {!isLoadingYouTube && youtubePageToken && (
                                <div className="mt-6 flex justify-center">
                                    <button
                                        onClick={() => fetchYouTubeVideos(youtubePageToken)}
                                        className="px-4 py-2 border border-border rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                    >
                                        Load More Videos
                                    </button>
                                </div>
                            )}
                            
                            {isLoadingYouTube && youtubeVideos.length > 0 && (
                                <div className="py-4 flex justify-center">
                                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        
                        {/* Footer */}
                        <div className="p-4 border-t border-border bg-muted/20 flex justify-end gap-2">
                            <button
                                onClick={() => setIsYouTubeModalOpen(false)}
                                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddSelectedVideos}
                                disabled={selectedVideoIds.size === 0}
                                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add {selectedVideoIds.size} Video{selectedVideoIds.size !== 1 ? 's' : ''}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
