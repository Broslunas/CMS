"use client";

import { useState, useRef, useEffect } from "react";
import Modal from "@/components/Modal";
import { Youtube, Upload, Loader2, Play, Check, X, Video, Globe, Lock, EyeOff, PlusCircle } from "lucide-react";
import { createYouTubeUploadSession } from "@/app/actions/youtube";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

interface ClipItem {
  id: string; // internal id for React keys
  file: File;
  title: string;
  privacy: "public" | "private" | "unlisted";
  previewUrl: string;
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
  videoId?: string;
  errorMsg?: string;
}

interface BulkClipsUploaderProps {
  onSuccess: (clips: { title: string; url: string }[]) => void;
}

export function BulkClipsUploader({ onSuccess }: BulkClipsUploaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [clips, setClips] = useState<ClipItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [authError, setAuthError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up previews on unmount
  useEffect(() => {
    return () => {
      clips.forEach((c) => URL.revokeObjectURL(c.previewUrl));
    };
  }, [clips]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const newClips: ClipItem[] = selectedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      title: file.name.replace(/\.[^/.]+$/, ""), // remove extension
      privacy: "unlisted", // default to unlisted for clips
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      status: "idle",
    }));

    setClips((prev) => [...prev, ...newClips]);
    
    // Reset input so the same files can be selected again if needed
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const removeClip = (id: string) => {
    if (isUploading) return;
    setClips((prev) => {
      const clip = prev.find((c) => c.id === id);
      if (clip) URL.revokeObjectURL(clip.previewUrl);
      return prev.filter((c) => c.id !== id);
    });
  };

  const updateClip = (id: string, updates: Partial<ClipItem>) => {
    setClips((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const uploadClip = async (clip: ClipItem): Promise<{ title: string; url: string } | null> => {
    updateClip(clip.id, { status: "uploading", progress: 0, errorMsg: "" });

    try {
      const { uploadUrl, error } = await createYouTubeUploadSession({
        title: clip.title,
        description: "",
        privacyStatus: clip.privacy,
      });

      if (error || !uploadUrl) {
        if (error?.toLowerCase().includes("connect") || error?.toLowerCase().includes("expired")) {
          setAuthError(true);
        }
        updateClip(clip.id, { status: "error", errorMsg: error || "Initialization failed" });
        return null;
      }

      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader("Content-Type", clip.file.type || "video/mp4");

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = (e.loaded / e.total) * 100;
            updateClip(clip.id, { progress: pct });
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            const videoId = response.id;
            updateClip(clip.id, { status: "success", progress: 100, videoId });
            resolve({ title: clip.title, url: `https://youtu.be/${videoId}` });
          } else {
            updateClip(clip.id, { status: "error", errorMsg: "Upload failed" });
            resolve(null);
          }
        };

        xhr.onerror = () => {
          updateClip(clip.id, { status: "error", errorMsg: "Network error" });
          resolve(null);
        };

        xhr.send(clip.file);
      });
    } catch (e: any) {
      updateClip(clip.id, { status: "error", errorMsg: e.message || "Failed" });
      return null;
    }
  };

  const startBulkUpload = async () => {
    if (clips.length === 0) return;
    
    // Check if any clips are idle or error, only upload those
    const clipsToUpload = clips.filter((c) => c.status === "idle" || c.status === "error");
    if (clipsToUpload.length === 0) return;

    setIsUploading(true);
    setAuthError(false);

    const uploadedClips: { title: string; url: string }[] = [];

    // Upload sequentially to avoid throttling/network saturation
    for (const clip of clipsToUpload) {
      const result = await uploadClip(clip);
      if (result) {
        uploadedClips.push(result);
      }
    }

    setIsUploading(false);

    if (uploadedClips.length > 0) {
      toast.success(`Successfully uploaded ${uploadedClips.length} clips`);
      onSuccess(uploadedClips);
      
      // Remove successfully uploaded clips from the list
      setClips(prev => prev.filter(c => c.status !== "success"));
      
      // If all succeeded, close modal
      if (uploadedClips.length === clipsToUpload.length) {
          resetAndClose();
      }
    } else {
        toast.error("Failed to upload clips");
    }
  };

  const resetAndClose = () => {
    if (isUploading) return;
    setIsOpen(false);
    clips.forEach((c) => URL.revokeObjectURL(c.previewUrl));
    setClips([]);
    setAuthError(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-2 w-full py-2 border border-dashed border-red-200 bg-red-50/50 hover:bg-red-50 text-xs text-red-600 hover:text-red-700 hover:border-red-300 rounded-md transition-all flex items-center justify-center gap-2"
      >
        <Upload className="w-3 h-3" />
        Mass Upload Clips
      </button>

      <Modal
        isOpen={isOpen}
        onClose={resetAndClose}
        title="Mass Upload Clips to YouTube"
      >
        <div className="flex flex-col h-full min-h-[500px] max-h-[80vh]">
          {authError && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex flex-col items-center gap-3 text-center">
              <p className="text-xs text-red-500">YouTube authorization expired.</p>
              <button onClick={() => signIn("google")} className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold shadow-lg">Reconnect YouTube</button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 pb-20">
            {clips.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-border rounded-xl bg-muted/20">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium mb-1">Upload Multiple Clips</h3>
                <p className="text-sm text-muted-foreground mb-4">Select multiple videos at once</p>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                    Select Files
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-sm p-2 z-10 border-b border-border mb-2">
                    <p className="text-sm font-medium">{clips.length} clip{clips.length !== 1 ? 's' : ''} ready</p>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="text-xs text-primary font-medium hover:underline flex items-center gap-1 disabled:opacity-50"
                    >
                        <PlusCircle className="w-3 h-3" /> Add More
                    </button>
                </div>
                {clips.map((clip) => (
                  <div key={clip.id} className="p-3 border border-border rounded-xl bg-card flex flex-col sm:flex-row gap-4 relative overflow-hidden group">
                    
                    {/* Progress Bar Background */}
                    {clip.status === "uploading" && (
                        <div 
                            className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-300 ease-out"
                            style={{ width: `${clip.progress}%` }}
                        />
                    )}

                    {/* Preview */}
                    <div className="w-full sm:w-32 shrink-0 aspect-video bg-black rounded-lg overflow-hidden relative">
                        <video src={clip.previewUrl} className="w-full h-full object-contain" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={(e) => {
                                const v = e.currentTarget.previousElementSibling as HTMLVideoElement;
                                v.paused ? v.play() : v.pause();
                            }} className="p-2 rounded-full bg-white/20 text-white backdrop-blur-sm">
                                <Play className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="flex-1 space-y-3 min-w-0">
                      <div>
                        <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-1 block">Title</label>
                        <input
                          type="text"
                          value={clip.title}
                          onChange={(e) => updateClip(clip.id, { title: e.target.value })}
                          disabled={isUploading && clip.status === "uploading"}
                          className="w-full bg-background border border-input rounded px-2 py-1.5 text-sm outline-none focus:border-primary disabled:opacity-50"
                        />
                      </div>
                      
                      <div>
                        <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-1 block">Privacy</label>
                        <div className="flex gap-2">
                            {[
                                { val: "public", icon: Globe, label: "Public" },
                                { val: "unlisted", icon: EyeOff, label: "Unlisted" },
                                { val: "private", icon: Lock, label: "Private" },
                            ].map((p) => (
                                <button
                                    key={p.val}
                                    onClick={() => updateClip(clip.id, { privacy: p.val as any })}
                                    disabled={isUploading && clip.status === "uploading"}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs border transition-colors disabled:opacity-50 ${clip.privacy === p.val ? 'bg-primary/10 border-primary text-primary' : 'bg-muted border-transparent hover:bg-muted/80 text-muted-foreground'}`}
                                >
                                    <p.icon className="w-3 h-3" />
                                    <span>{p.label}</span>
                                </button>
                            ))}
                        </div>
                      </div>

                      {/* Status Messages */}
                      {clip.status === "uploading" && (
                        <div className="flex items-center gap-2 text-xs text-primary">
                            <Loader2 className="w-3 h-3 animate-spin" /> Uploading {Math.round(clip.progress)}%
                        </div>
                      )}
                      {clip.status === "success" && (
                        <div className="flex items-center gap-2 text-xs text-green-500">
                            <Check className="w-3 h-3" /> Uploaded successfully
                        </div>
                      )}
                      {clip.status === "error" && (
                        <div className="flex items-center gap-2 text-xs text-red-500">
                            <X className="w-3 h-3" /> {clip.errorMsg}
                        </div>
                      )}
                    </div>

                    {/* Remove Button */}
                    {!isUploading && (
                        <button
                            onClick={() => removeClip(clip.id)}
                            className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Action */}
          {clips.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-card border-t border-border flex justify-end gap-3 rounded-b-xl">
                  <button
                      onClick={resetAndClose}
                      disabled={isUploading}
                      className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
                  >
                      Cancel
                  </button>
                  <button
                      onClick={startBulkUpload}
                      disabled={isUploading || !clips.some(c => c.status === "idle" || c.status === "error")}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-bold shadow-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                  >
                      {isUploading ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                      ) : (
                          <><Upload className="w-4 h-4" /> Upload All</>
                      )}
                  </button>
              </div>
          )}

          {/* Hidden File Input */}
          <input
            type="file"
            accept="video/*"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </Modal>
    </>
  );
}
