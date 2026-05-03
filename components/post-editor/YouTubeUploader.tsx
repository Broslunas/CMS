"use client";

import { useState, useRef } from "react";
import Modal from "@/components/Modal";
import { Youtube, Upload, Loader2, Link, Settings, Image as ImageIcon } from "lucide-react";
import { createYouTubeUploadSession, uploadYouTubeThumbnail } from "@/app/actions/youtube";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

interface YouTubeUploaderProps {
  onSuccess: (url: string) => void;
  metadata: any;
  repoId?: string;
}

// Function to convert relative paths to raw GitHub URLs
const convertToGitHubRawUrl = (src: string, repoId?: string): string => {
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  let baseUrl = 'https://raw.githubusercontent.com/Broslunas/portfolio-old/refs/heads/main';
  if (repoId) {
    baseUrl = `https://raw.githubusercontent.com/${repoId}/refs/heads/main`;
  }
  if (src.startsWith('/')) return `${baseUrl}${src}`;
  if (!src.startsWith('./') && !src.startsWith('../')) return `${baseUrl}/${src}`;
  return src;
};

export function YouTubeUploader({ onSuccess, metadata, repoId }: YouTubeUploaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const defaultImage = metadata?.image || metadata?.thumbnail || metadata?.cover || metadata?.ogImage;
  const [useAutoThumbnail, setUseAutoThumbnail] = useState(!!defaultImage);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  
  const [title, setTitle] = useState(metadata?.title || "");
  const [description, setDescription] = useState(metadata?.description || "");
  const [tags, setTags] = useState("");
  const [categoryId, setCategoryId] = useState("22"); // Default People & Blogs
  const [madeForKids, setMadeForKids] = useState(false);
  const [license, setLicense] = useState<"youtube" | "creativeCommon">("youtube");
  const [embeddable, setEmbeddable] = useState(true);
  const [notifySubscribers, setNotifySubscribers] = useState(true);
  const [privacy, setPrivacy] = useState<"public" | "private" | "unlisted">("public");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isPremiere, setIsPremiere] = useState(false);
  
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [authError, setAuthError] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a video file");
      return;
    }
    if (!title) {
      toast.error("Title is required");
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setAuthError(false);

    try {
      let publishAt;
      if (privacy === "private" && scheduleDate && scheduleTime) {
        const dateObj = new Date(`${scheduleDate}T${scheduleTime}`);
        publishAt = dateObj.toISOString();
      }

      // Initialize session
      const { uploadUrl, error } = await createYouTubeUploadSession({
        title,
        description,
        privacyStatus: privacy,
        publishAt,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        categoryId,
        madeForKids,
        license,
        embeddable,
        notifySubscribers,
      });

      if (error || !uploadUrl) {
        if (error?.toLowerCase().includes("connect") || error?.toLowerCase().includes("reconnect") || error?.toLowerCase().includes("expired")) {
            setAuthError(true);
        }
        toast.error(error || "Failed to initialize upload. Check your connection or Google authorization.");
        setIsUploading(false);
        return;
      }

      // Do the resumable upload
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl, true);
      xhr.setRequestHeader("Content-Type", file.type || "video/mp4");

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setProgress(percentComplete);
        }
      };

      xhr.onload = async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            const videoId = response.id;
            
            // Handle Thumbnail Upload
            if (thumbnailFile || (useAutoThumbnail && defaultImage)) {
              toast.info("Uploading thumbnail...");
              const formData = new FormData();
              
              if (thumbnailFile) {
                formData.append("image", thumbnailFile);
              } else {
                try {
                    const url = convertToGitHubRawUrl(defaultImage, repoId);
                    const res = await fetch(url);
                    if (!res.ok) throw new Error("Failed to fetch image");
                    const blob = await res.blob();
                    formData.append("image", blob, "thumbnail.jpg");
                } catch (e) {
                    console.error("Failed to fetch auto thumbnail", e);
                    toast.error("Failed to download post image for thumbnail.");
                }
              }

              if (formData.has("image")) {
                  const thumbRes = await uploadYouTubeThumbnail(videoId, formData);
                  if (thumbRes.error) {
                    toast.error(thumbRes.error);
                  } else {
                    toast.success("Thumbnail uploaded successfully!");
                  }
              }
            }

            toast.success("Video uploaded successfully!");
            onSuccess(`https://youtu.be/${videoId}`);
            setIsOpen(false);
          } catch (e) {
            toast.error("Failed to parse YouTube response");
          }
        } else {
          toast.error("Upload failed: " + xhr.responseText);
        }
        setIsUploading(false);
      };

      xhr.onerror = () => {
        toast.error("Network error during upload");
        setIsUploading(false);
      };

      xhr.send(file);

    } catch (e: any) {
      toast.error(e.message || "Upload failed");
      setIsUploading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-3 py-2 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-md text-sm font-medium transition-colors flex items-center gap-2 border border-red-200 dark:border-red-500/20"
        title="Upload to YouTube"
      >
        <Youtube className="w-4 h-4" />
        <span className="hidden sm:inline">Upload to YouTube</span>
      </button>

      <Modal isOpen={isOpen} onClose={() => !isUploading && setIsOpen(false)} title="Upload to YouTube">
        <div className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto px-1 pb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Video File</label>
            <input
              type="file"
              accept="video/*"
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={isUploading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={isUploading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={isUploading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Visibility</label>
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value as any)}
              className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={isUploading}
            >
              <option value="public">Public</option>
              <option value="unlisted">Unlisted</option>
              <option value="private">Private</option>
            </select>
          </div>

          {privacy === "private" && (
            <div className="p-3 bg-muted/50 rounded-lg border border-border">
              <label className="block text-sm font-medium mb-2">Schedule Publication</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="flex-1 px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  disabled={isUploading}
                />
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="flex-1 px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  disabled={isUploading}
                />
              </div>
              
              <div className="mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPremiere}
                    onChange={(e) => setIsPremiere(e.target.checked)}
                    disabled={isUploading || (!scheduleDate || !scheduleTime)}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium">Set as Premiere</span>
                </label>
                {isPremiere && (
                   <p className="text-xs text-orange-600 dark:text-orange-400 mt-2 bg-orange-50 dark:bg-orange-500/10 p-2 rounded border border-orange-200 dark:border-orange-500/20">
                      <strong>Note:</strong> Due to YouTube API limitations, the video will be scheduled, but you may need to confirm the "Premiere" status in YouTube Studio.
                   </p>
                )}
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                The video will be uploaded as Private and YouTube will automatically publish it at the selected date/time.
              </p>
            </div>
          )}

          {/* Advanced Settings Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 mt-4"
          >
            <Settings className="w-4 h-4" />
            {showAdvanced ? "Hide Advanced Settings" : "Show Advanced Settings"}
          </button>

          {showAdvanced && (
            <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/10">
              <div>
                <label className="block text-sm font-medium mb-2">Thumbnail</label>
                
                {defaultImage && (
                  <label className="flex items-center gap-2 cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={useAutoThumbnail}
                      onChange={(e) => setUseAutoThumbnail(e.target.checked)}
                      disabled={isUploading || !!thumbnailFile}
                      className="rounded border-input text-primary focus:ring-primary"
                    />
                    <span className="text-sm">Automatically use the post's image as thumbnail</span>
                  </label>
                )}

                <div className="relative">
                  <input
                    type="file"
                    accept="image/jpeg, image/png"
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    onChange={(e) => {
                      setThumbnailFile(e.target.files?.[0] || null);
                      if (e.target.files?.[0]) setUseAutoThumbnail(false);
                    }}
                    disabled={isUploading}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Recommended: 1280x720, under 2MB. JPG/PNG.</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="podcast, veredillas, radio"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  disabled={isUploading}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    disabled={isUploading}
                  >
                    <option value="1">Film & Animation</option>
                    <option value="2">Autos & Vehicles</option>
                    <option value="10">Music</option>
                    <option value="15">Pets & Animals</option>
                    <option value="17">Sports</option>
                    <option value="19">Travel & Events</option>
                    <option value="20">Gaming</option>
                    <option value="22">People & Blogs</option>
                    <option value="23">Comedy</option>
                    <option value="24">Entertainment</option>
                    <option value="25">News & Politics</option>
                    <option value="26">Howto & Style</option>
                    <option value="27">Education</option>
                    <option value="28">Science & Technology</option>
                    <option value="29">Nonprofits & Activism</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">License</label>
                  <select
                    value={license}
                    onChange={(e) => setLicense(e.target.value as any)}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    disabled={isUploading}
                  >
                    <option value="youtube">Standard YouTube License</option>
                    <option value="creativeCommon">Creative Commons</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={madeForKids}
                    onChange={(e) => setMadeForKids(e.target.checked)}
                    disabled={isUploading}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="text-sm">Yes, it's made for kids</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={embeddable}
                    onChange={(e) => setEmbeddable(e.target.checked)}
                    disabled={isUploading}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="text-sm">Allow embedding</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifySubscribers}
                    onChange={(e) => setNotifySubscribers(e.target.checked)}
                    disabled={isUploading}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="text-sm">Publish to subscriptions feed and notify subscribers</span>
                </label>
              </div>
            </div>
          )}

          {isUploading && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Uploading...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {authError && !isUploading && (
            <div className="p-4 mt-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg flex flex-col items-center gap-3 text-center">
              <p className="text-sm text-red-600 dark:text-red-400">
                You need to connect or reconnect your YouTube account and grant the upload permissions.
              </p>
              <button
                onClick={() => signIn("google")}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Youtube className="w-4 h-4" />
                Connect YouTube Channel
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
          <button
            onClick={() => setIsOpen(false)}
            disabled={isUploading}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={isUploading || !file || !title}
            className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium flex items-center gap-2 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload to YouTube
              </>
            )}
          </button>
        </div>
      </Modal>
    </>
  );
}

