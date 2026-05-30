"use client";

import { JsonFieldEditor } from "./JsonFieldEditor";
import { TranscriptionEditor } from "./TranscriptionEditor";
import { SectionsEditor } from "./SectionsEditor";
import { ClipsEditor } from "./ClipsEditor";
import { QuizEditor } from "./QuizEditor";
import { ArrayEditor } from "./ArrayEditor";
import { SocialLinksEditor } from "../SocialLinksEditor";
import { GuestsEditor } from "./GuestsEditor";
import { DateTimePicker } from "./DateTimePicker";
import { Switch } from "../ui/switch";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ValidatedDateField } from "./ValidatedDateField";
import { Sparkles, Wand2, X } from "lucide-react";
import { YouTubeUploader } from "./YouTubeUploader";

// Function to convert relative paths to raw GitHub URLs
const convertToGitHubRawUrl = (src: string, repoId?: string): string => {
  // If it's already a full URL, do nothing
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // Build the base URL dynamically from repoId
  let baseUrl = 'https://raw.githubusercontent.com/Broslunas/portfolio-old/refs/heads/main';
  if (repoId) {
    // repoId comes in "owner/repo" format
    baseUrl = `https://raw.githubusercontent.com/${repoId}/refs/heads/main`;
  }

  // If it's a relative path starting with /
  if (src.startsWith('/')) {
    return `${baseUrl}${src}`;
  }

  // If it's a relative path without a leading /
  if (!src.startsWith('./') && !src.startsWith('../')) {
    return `${baseUrl}/${src}`;
  }

  return src;
};

interface MetadataFieldProps {
    fieldKey: string;
    value: any;
    content: string; // Passed from parent
    metadata: any; // Added
    onUpdate: (key: string, value: any) => void;
    onDelete: (key: string) => void;
    triggerUpload: (target: { type: 'content' | 'metadata', key?: string, index?: number, subKey?: string }) => void;
    isUploading: boolean;
    uploadTarget: { type: 'content' | 'metadata', key?: string, index?: number, subKey?: string };
    suggestedFields: Record<string, any>;
    repoId: string;
    postId?: string;
    onSaveBeforeAuth?: () => Promise<void>;
}

export function MetadataField({
    fieldKey,
    value,
    content,
    metadata, // Added
    onUpdate,
    onDelete,
    triggerUpload,
    isUploading,
    uploadTarget,
    suggestedFields,
    repoId,
    postId,
    onSaveBeforeAuth
}: MetadataFieldProps) {
    const key = fieldKey;
    const [isGenerating, setIsGenerating] = useState(false);


    const handleAiGenerate = async () => {
        if (!content || content.length < 50) {
            toast.warning("Content is too short to generate AI suggestions.");
            return;
        }

        setIsGenerating(true);

        if (fieldKey === 'seo' || fieldKey === 'title' || fieldKey === 'description') {
            const loadingId = toast.loading(`Generating ${fieldKey === 'seo' ? 'SEO' : fieldKey}...`);
            try {
                const res = await fetch("/api/ai/process", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: "seo", context: content }),
                });
                if (!res.ok) throw new Error("Error generating SEO");
                const data = await res.json();

                if (fieldKey === 'title') {
                     const apiTitle = data.title || data.Title || data.TITLE;
                     if (apiTitle && typeof apiTitle === 'string') {
                        onUpdate('title', apiTitle);
                        toast.success("Title generated!", { id: loadingId });
                     } else {
                        toast.warning("Could not generate title", { id: loadingId });
                     }
                } else if (fieldKey === 'description') {
                     const apiDesc = data.description || data.Description || data.DESCRIPTION;
                     if (apiDesc && typeof apiDesc === 'string') {
                        onUpdate('description', apiDesc);
                        toast.success("Description generated!", { id: loadingId });
                     } else {
                        toast.warning("Could not generate description", { id: loadingId });
                     }
                } else if (fieldKey === 'seo') {
                    // Handle SEO object
                    if (data.meta || data.metaTitle || data.metaDescription) {
                        const updates: any = {};
                        if (data.metaTitle) updates.title = data.metaTitle;
                        if (data.metaDescription) updates.description = data.metaDescription;
                        if (data.keywords) updates.keywords = data.keywords;
                        if (Object.keys(updates).length > 0) {
                            onUpdate('seo', { ...(value || {}), ...updates });
                            toast.success("SEO generated!", { id: loadingId });
                        } else {
                            toast.warning("Could not generate SEO", { id: loadingId });
                        }
                    } else {
                        toast.warning("Could not generate SEO", { id: loadingId });
                    }
                }
            } catch (error) {
                console.error("Error generating AI:", error);
                toast.error("Failed to generate AI suggestions", { id: loadingId });
            } finally {
                setIsGenerating(false);
            }
        } else {
            setIsGenerating(false);
        }
    };

    // Check if this is a string field that could have a YouTube URL
    const isVideoUrl = typeof value === 'string' && (
        value.includes('youtube.com') ||
        value.includes('youtu.be') ||
        value.includes('youtube.googleapis.com')
    );

    // --- Boolean fields ---
    if (typeof value === 'boolean') {
        return (
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border group hover:border-primary/20 transition-all">
                <div className="flex items-center gap-3">
                    <Switch
                        checked={value}
                        onCheckedChange={(checked) => onUpdate(key, checked)}
                    />
                    <label className="text-sm font-medium text-foreground capitalize cursor-pointer select-none" onClick={() => onUpdate(key, !value)}>
                        {key}
                    </label>
                </div>
                <button
                    onClick={() => onDelete(key)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-2 hover:bg-destructive/10 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title={`Delete field ${key}`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            </div>
        );
    }

    // --- Date fields ---
    if (fieldKey.toLowerCase().includes('date') || fieldKey.toLowerCase().includes('published') || fieldKey.toLowerCase().includes('publish')) {
        return (
            <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground capitalize">{key}</label>
                    <button onClick={() => onDelete(key)} className="text-muted-foreground hover:text-destructive transition-colors p-1" title={`Delete field ${key}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
                <ValidatedDateField
                    fieldKey={key}
                    value={value}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                />
            </div>
        );
    }

    // --- Social Links (object with platform keys) ---
    if (typeof value === 'object' && value !== null && !Array.isArray(value) &&
        (fieldKey.toLowerCase().includes('social') || fieldKey.toLowerCase().includes('links'))) {
        return (
            <div key={key} className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground capitalize">{key}</label>
                    <button onClick={() => onDelete(key)} className="text-muted-foreground hover:text-destructive transition-colors p-1" title={`Delete field ${key}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
                <SocialLinksEditor
                    value={value}
                    onChange={(val) => onUpdate(key, val)}
                />
            </div>
        );
    }

    // --- Transcription (special rich editor) ---
    if (fieldKey.toLowerCase().includes('transcription') || fieldKey.toLowerCase().includes('transcrip')) {
        return (
           <div key={key}>
              <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground capitalize">{key}</label>
                  <button onClick={() => onDelete(key)} className="text-muted-foreground hover:text-destructive transition-colors p-1" title={`Delete field ${key}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
              </div>
              <TranscriptionEditor fieldKey={key} value={value} onChange={(val) => onUpdate(key, val)} onDelete={() => onDelete(key)} metadata={metadata} />
           </div>
        );
    }

    const isSections = (Array.isArray(value) && value.length > 0 &&
                         value.every(item => typeof item === 'object' && item !== null && 'time' in item && 'title' in item)) ||
                         (['sections', 'capitulos', 'chapters', 'secciones'].includes(key.toLowerCase()));

    if (isSections) {
        return (
           <div key={key}>
              <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground capitalize">{key}</label>
                  <button onClick={() => onDelete(key)} className="text-muted-foreground hover:text-destructive transition-colors p-1" title={`Delete field ${key}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
              </div>
              <SectionsEditor fieldKey={key} value={value} onChange={(val) => onUpdate(key, val)} onDelete={() => onDelete(key)} metadata={metadata} />
           </div>
        );
    }

    const isClips = (Array.isArray(value) && value.length > 0 &&
                       value.every(item => typeof item === 'object' && item !== null && 'title' in item && 'url' in item) &&
                       value.some(item => typeof item.url === 'string' && (item.url.includes('youtube.com') || item.url.includes('youtu.be')))) ||
                      (['clips', 'shorts', 'reels', 'highlights'].includes(key.toLowerCase()));

    if (isClips) {
        return (
           <div key={key}>
              <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground capitalize">{key}</label>
                  <button onClick={() => onDelete(key)} className="text-muted-foreground hover:text-destructive transition-colors p-1" title={`Delete field ${key}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
              </div>
              <ClipsEditor fieldKey={key} value={value} onChange={(val) => onUpdate(key, val)} onDelete={() => onDelete(key)} />
           </div>
        );
    }

    const isQuiz = (Array.isArray(value) && value.length > 0 &&
                        value.every(item => typeof item === 'object' && item !== null && 'question' in item)) ||
                       (['quiz', 'quizzes', 'cuestionario', 'test', 'questions', 'preguntas'].includes(key.toLowerCase()));

    if (isQuiz) {
        return (
           <div key={key}>
              <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground capitalize">{key}</label>
                  <button onClick={() => onDelete(key)} className="text-muted-foreground hover:text-destructive transition-colors p-1" title={`Delete field ${key}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
              </div>
              <QuizEditor fieldKey={key} value={value} onChange={(val) => onUpdate(key, val)} onDelete={() => onDelete(key)} content={content} />
           </div>
        );
    }

    const isComplexArray = (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) ||
                             (['images', 'galeria', 'items', 'list', 'links'].includes(key.toLowerCase()));

    if (isComplexArray) {
        return (
          <div key={key}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground capitalize">{key}</label>
              <button onClick={() => onDelete(key)} className="text-muted-foreground hover:text-destructive transition-colors p-1" title={`Delete field ${key}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
            <ArrayEditor
                fieldKey={key}
                value={value}
                onChange={(val: any) => onUpdate(key, val)}
                onDelete={() => onDelete(key)}
                triggerUpload={triggerUpload}
                isUploading={isUploading}
                uploadTarget={uploadTarget}
                repoId={repoId}
            />
          </div>
        );
    }

    // --- Participants / Guests (special rich editor) ---
    const isParticipantsKey = [
      'participants', 'invitados', 'guests', 'panelists', 'panelistas',
    ].includes(key.toLowerCase()) || key.toLowerCase().includes('participant') || key.toLowerCase().includes('guest');

    if (Array.isArray(value) && isParticipantsKey && value.every((v) => typeof v === 'string')) {
      return (
        <div key={key}>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-foreground capitalize">{key}</label>
            <button onClick={() => onDelete(key)} className="text-muted-foreground hover:text-destructive transition-colors p-1" title={`Delete field ${key}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
          <GuestsEditor
            value={value as string[]}
            onChange={(val) => onUpdate(key, val)}
            onDelete={() => onDelete(key)}
            repoId={repoId}
          />
        </div>
      );
    }

    // --- Standard Array (strings, numbers, or simple objects) ---
    if (Array.isArray(value) && value.length > 0) {
        // Suggest AI generation for relevant fields
        const canGenerate = ['title', 'description', 'seo', 'tags', 'keywords'].includes(key.toLowerCase());
        const showAiButton = canGenerate && suggestedFields && Object.keys(suggestedFields).length > 0;

        return (
            <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground capitalize">{key}</label>
                    <div className="flex items-center gap-2">
                        {showAiButton && (
                            <button
                                onClick={handleAiGenerate}
                                disabled={isGenerating}
                                className="text-xs flex items-center gap-1 px-2 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 rounded transition-colors"
                                title="Generate with AI"
                            >
                                {isGenerating ? (
                                    <div className="w-3 h-3 border border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Sparkles className="w-3 h-3" />
                                )}
                                AI
                            </button>
                        )}
                        <button onClick={() => onDelete(key)} className="text-muted-foreground hover:text-destructive transition-colors p-1" title={`Delete field ${key}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                </div>
                <JsonFieldEditor
                    value={value}
                    onChange={(val) => onUpdate(key, val)}
                    onSave={() => {}}
                />
            </div>
        );
    }

    // --- Objects (excluding special types handled above) ---
    if (typeof value === 'object' && value !== null) {
        return (
            <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground capitalize">{key}</label>
                    <button onClick={() => onDelete(key)} className="text-muted-foreground hover:text-destructive transition-colors p-1" title={`Delete field ${key}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
                <JsonFieldEditor
                    value={value}
                    onChange={(val) => onUpdate(key, val)}
                    onSave={() => {}}
                />
            </div>
        );
    }

    // --- Standard string field ---
    if (typeof value === 'string') {
        // Check if it looks like an image URL
        const isImage = /https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg|avif|apng)/i.test(value);
        const trimmedValue = value.trim();

        // Determine if we should show AI button
        const canGenerate = ['title', 'description', 'seo', 'tags', 'keywords'].includes(key.toLowerCase());
        const showAiButton = canGenerate && suggestedFields && Object.keys(suggestedFields).length > 0;

        return (
            <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground capitalize">{key}</label>
                    <div className="flex items-center gap-2">
                        {showAiButton && (
                            <button
                                onClick={handleAiGenerate}
                                disabled={isGenerating}
                                className="text-xs flex items-center gap-1 px-2 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 rounded transition-colors"
                                title="Generate with AI"
                            >
                                {isGenerating ? (
                                    <div className="w-3 h-3 border border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Sparkles className="w-3 h-3" />
                                )}
                                AI
                            </button>
                        )}
                        <button onClick={() => onDelete(key)} className="text-muted-foreground hover:text-destructive transition-colors p-1" title={`Delete field ${key}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <input type="text" value={value} onChange={(e) => onUpdate(key, e.target.value)} className="flex-1 px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
                        {isImage && (
                            <button type="button" onClick={() => triggerUpload({ type: 'metadata', key })} className="px-3 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md text-sm font-medium transition-colors flex items-center gap-2 border border-border" title="Upload image">
                                {isUploading && uploadTarget.key === key ? <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" /> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>} <span className="hidden sm:inline">Upload</span>
                            </button>
                        )}
                        {isVideoUrl && (
                            <YouTubeUploader onSuccess={(url) => onUpdate(key, url)} metadata={metadata} repoId={repoId} postId={postId} onSaveBeforeAuth={onSaveBeforeAuth} />
                        )}
                    </div>
                    {isImage && trimmedValue.length > 0 && (
                        <div className="relative group w-fit">
                            <div className="rounded-lg overflow-hidden border border-border bg-muted/50 max-w-xs">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img key={trimmedValue} src={convertToGitHubRawUrl(trimmedValue, repoId)} alt={`Preview of ${key}`} className="max-h-48 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} onLoad={(e) => { (e.target as HTMLImageElement).style.display = 'block'; }} />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none"><span className="text-xs text-white bg-black/70 px-2 py-1 rounded">Preview</span></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- Standard non-string field ---
    return (
        <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground capitalize">{key}</label>
                <button onClick={() => onDelete(key)} className="text-muted-foreground hover:text-destructive transition-colors p-1" title={`Delete field ${key}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => {
                    const newVal = typeof value === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
                    onUpdate(key, newVal);
                }}
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
        </div>
    );
}
