"use client";

import { useState, useRef, useEffect } from "react";
import Modal from "@/components/Modal";
import { 
  Youtube, 
  Upload, 
  Loader2, 
  Settings, 
  Image as ImageIcon, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Check,
  PlusCircle,
  Video,
  Globe,
  Lock,
  EyeOff
} from "lucide-react";
import { 
  createYouTubeUploadSession, 
  uploadYouTubeThumbnail, 
  getYouTubePlaylists,
  addVideoToPlaylist
} from "@/app/actions/youtube";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

interface YouTubeUploaderProps {
  onSuccess: (url: string) => void;
  metadata: any;
  repoId?: string;
}

const convertToGitHubRawUrl = (src: string, repoId?: string): string => {
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  let baseUrl = 'https://raw.githubusercontent.com/Broslunas/portfolio-old/refs/heads/main';
  if (repoId) baseUrl = `https://raw.githubusercontent.com/${repoId}/refs/heads/main`;
  if (src.startsWith('/')) return `${baseUrl}${src}`;
  if (!src.startsWith('./') && !src.startsWith('../')) return `${baseUrl}/${src}`;
  return src;
};

type Step = 'video' | 'visibility' | 'extras' | 'thumbnail' | 'metadata' | 'uploading';

export function YouTubeUploader({ onSuccess, metadata, repoId }: YouTubeUploaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>('video');
  
  // Data State
  const [file, setFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");
  
  const [title, setTitle] = useState(metadata?.title || "");
  const [description, setDescription] = useState(metadata?.description || "");
  const [privacy, setPrivacy] = useState<"public" | "private" | "unlisted">("public");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isPremiere, setIsPremiere] = useState(false);
  
  const [madeForKids, setMadeForKids] = useState(false);
  const [playlists, setPlaylists] = useState<{id: string, title: string}[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [notifySubscribers, setNotifySubscribers] = useState(true);
  const [embeddable, setEmbeddable] = useState(true);
  
  const defaultImage = metadata?.image || metadata?.thumbnail || metadata?.cover || metadata?.ogImage;
  const [useAutoThumbnail, setUseAutoThumbnail] = useState(!!defaultImage);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  
  const initialTags = Array.isArray(metadata?.tags) ? metadata.tags.join(", ") : (metadata?.tags || "");
  const [tags, setTags] = useState(initialTags);
  const [categoryId, setCategoryId] = useState("22");
  const [license, setLicense] = useState<"youtube" | "creativeCommon">("youtube");

  // UI State
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [authError, setAuthError] = useState(false);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);

  // Clean up previews
  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [videoPreview, thumbnailPreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      setVideoPreview(URL.createObjectURL(selected));
    }
  };

  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setThumbnailFile(selected);
      setUseAutoThumbnail(false);
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      setThumbnailPreview(URL.createObjectURL(selected));
    }
  };

  const fetchPlaylists = async () => {
    setLoadingPlaylists(true);
    const res = await getYouTubePlaylists();
    if (res.playlists) setPlaylists(res.playlists);
    setLoadingPlaylists(false);
  };

  const nextStep = () => {
    if (step === 'video' && !file) return toast.error("Please select a video");
    if (step === 'video') setStep('visibility');
    else if (step === 'visibility') {
        setStep('extras');
        if (playlists.length === 0) fetchPlaylists();
    }
    else if (step === 'extras') setStep('thumbnail');
    else if (step === 'thumbnail') setStep('metadata');
  };

  const prevStep = () => {
    if (step === 'visibility') setStep('video');
    else if (step === 'extras') setStep('visibility');
    else if (step === 'thumbnail') setStep('extras');
    else if (step === 'metadata') setStep('thumbnail');
  };

  const startUpload = async () => {
    if (!title) return toast.error("Title is required");
    setStep('uploading');
    setIsUploading(true);
    setProgress(0);
    setAuthError(false);

    try {
      let publishAt;
      if (privacy === "private" && scheduleDate && scheduleTime) {
        publishAt = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
      }

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
        if (error?.toLowerCase().includes("connect") || error?.toLowerCase().includes("expired")) setAuthError(true);
        toast.error(error || "Upload initialization failed");
        setStep('metadata');
        setIsUploading(false);
        return;
      }

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl, true);
      xhr.setRequestHeader("Content-Type", file!.type || "video/mp4");

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setProgress((e.loaded / e.total) * 100);
      };

      xhr.onload = async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          const videoId = response.id;

          // Thumbnail Upload
          if (thumbnailFile || (useAutoThumbnail && defaultImage)) {
            toast.info("Uploading thumbnail...");
            const formData = new FormData();
            
            if (thumbnailFile) {
              formData.append("image", thumbnailFile);
            } else {
              try {
                const url = convertToGitHubRawUrl(defaultImage, repoId);
                const res = await fetch(url);
                if (!res.ok) throw new Error("Could not download image from GitHub");
                const blob = await res.blob();
                formData.append("image", blob, "thumb.jpg");
              } catch (e) {
                console.error("Failed to fetch auto thumbnail", e);
                toast.error("Could not fetch the post image for the thumbnail.");
              }
            }

            if (formData.has("image")) {
              const thumbRes = await uploadYouTubeThumbnail(videoId, formData);
              if (thumbRes.error) {
                toast.error("Thumbnail error: " + thumbRes.error);
              } else {
                toast.success("Thumbnail uploaded!");
              }
            }
          }

          // Playlist Assignment
          if (selectedPlaylistId) {
            const playlistRes = await addVideoToPlaylist(videoId, selectedPlaylistId);
            if (playlistRes.error) {
              toast.error("Playlist error: " + playlistRes.error);
            } else {
              toast.success("Added to playlist!");
            }
          }

          toast.success("Success! Video uploaded.");
          onSuccess(`https://youtu.be/${videoId}`);
          resetAndClose();
        } else {
          toast.error("Upload failed: " + xhr.responseText);
          setStep('metadata');
        }
        setIsUploading(false);
      };

      xhr.onerror = () => {
        toast.error("Network error");
        setStep('metadata');
        setIsUploading(false);
      };

      xhr.send(file);
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
      setStep('metadata');
      setIsUploading(false);
    }
  };

  const resetAndClose = () => {
    setIsOpen(false);
    setStep('video');
    setFile(null);
    setVideoPreview("");
    setThumbnailFile(null);
    setThumbnailPreview("");
    setProgress(0);
    setIsUploading(false);
  };

  const renderStep = () => {
    switch (step) {
      case 'video':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="group relative border-2 border-dashed border-border rounded-xl p-8 transition-colors hover:border-primary/50 flex flex-col items-center justify-center gap-4 bg-muted/20">
              {file ? (
                <div className="w-full space-y-4">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
                    <video src={videoPreview} controls className="w-full h-full object-contain" />
                  </div>
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground truncate max-w-[70%]">
                      <Video className="w-4 h-4 shrink-0" />
                      <span className="truncate">{file.name}</span>
                    </div>
                    <button onClick={() => {setFile(null); setVideoPreview("");}} className="text-xs text-red-500 hover:text-red-600 font-medium">Remove</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Select a video file to upload</p>
                    <p className="text-xs text-muted-foreground mt-1">MP4, MOV, or AVI (Max 5GB)</p>
                  </div>
                  <input type="file" accept="video/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </>
              )}
            </div>
          </div>
        );

      case 'visibility':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'public', label: 'Public', icon: Globe, desc: 'Anyone can watch' },
                  { id: 'unlisted', label: 'Unlisted', icon: EyeOff, desc: 'Only via link' },
                  { id: 'private', label: 'Private', icon: Lock, desc: 'Only you can see' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPrivacy(item.id as any)}
                    className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all text-center ${privacy === item.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-muted/20 hover:border-primary/50'}`}
                  >
                    <item.icon className={`w-6 h-6 ${privacy === item.id ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div>
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground hidden sm:block mt-1">{item.desc}</p>
                    </div>
                  </button>
                ))}
             </div>

             {privacy === 'private' && (
                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">Schedule for later</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="bg-background border rounded-lg px-3 py-2 text-sm" />
                    <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="bg-background border rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${isPremiere ? 'bg-primary' : 'bg-muted'}`}>
                       <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${isPremiere ? 'left-6' : 'left-1'}`} />
                    </div>
                    <input type="checkbox" className="hidden" checked={isPremiere} onChange={(e) => setIsPremiere(e.target.checked)} disabled={!scheduleDate || !scheduleTime} />
                    <span className="text-sm font-medium">Set as Premiere</span>
                  </label>
                </div>
             )}
          </div>
        );

      case 'extras':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2"><Youtube className="w-4 h-4" /> Add to Playlist</label>
              <select 
                value={selectedPlaylistId} 
                onChange={(e) => setSelectedPlaylistId(e.target.value)}
                className="w-full bg-background border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                disabled={loadingPlaylists}
              >
                <option value="">(None)</option>
                {playlists.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
              {loadingPlaylists && <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Fetching your playlists...</p>}
            </div>

            <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" checked={madeForKids} onChange={(e) => setMadeForKids(e.target.checked)} className="mt-1 accent-primary" />
                <div>
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">This video is made for kids</p>
                  <p className="text-xs text-muted-foreground">Required by COPPA. Affects comments and ads.</p>
                </div>
              </label>
            </div>

            <div className="space-y-3">
               {[
                 { id: 'notify', label: 'Notify subscribers', val: notifySubscribers, set: setNotifySubscribers },
                 { id: 'embed', label: 'Allow embedding', val: embeddable, set: setEmbeddable }
               ].map(opt => (
                  <label key={opt.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/10 cursor-pointer hover:bg-muted/20 transition-colors">
                    <span className="text-sm">{opt.label}</span>
                    <div className={`w-8 h-4 rounded-full relative transition-colors ${opt.val ? 'bg-primary' : 'bg-muted'}`}>
                       <div className={`absolute top-0.5 w-2 h-2 rounded-full bg-white transition-all ${opt.val ? 'left-5.5' : 'left-0.5'}`} />
                    </div>
                    <input type="checkbox" className="hidden" checked={opt.val} onChange={(e) => opt.set(e.target.checked)} />
                  </label>
               ))}
            </div>
          </div>
        );

      case 'thumbnail':
        const currentThumbUrl = thumbnailPreview || (useAutoThumbnail && defaultImage ? convertToGitHubRawUrl(defaultImage, repoId) : "");
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-border shadow-inner bg-black flex items-center justify-center">
               {currentThumbUrl ? (
                 <img src={currentThumbUrl} className="w-full h-full object-cover" alt="Preview" />
               ) : (
                 <div className="flex flex-col items-center gap-2 text-muted-foreground">
                   <ImageIcon className="w-10 h-10 opacity-20" />
                   <p className="text-xs">No thumbnail selected</p>
                 </div>
               )}
               <div className="absolute top-2 right-2 flex gap-2">
                  <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-bold tracking-widest uppercase">Preview</div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setUseAutoThumbnail(true)}
                disabled={!defaultImage}
                className={`p-4 rounded-xl border text-left transition-all ${useAutoThumbnail ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-muted/20 hover:border-primary/50 opacity-50 disabled:hidden'}`}
              >
                <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center mb-2"><Check className="w-3 h-3 text-primary" /></div>
                <p className="text-xs font-semibold">Auto from Image</p>
                <p className="text-[10px] text-muted-foreground mt-1 truncate">{defaultImage}</p>
              </button>
              
              <div className="relative p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/50 transition-all flex flex-col justify-center overflow-hidden">
                <div className="h-6 w-6 rounded bg-muted flex items-center justify-center mb-2"><PlusCircle className="w-3 h-3" /></div>
                <p className="text-xs font-semibold">Custom File</p>
                <p className="text-[10px] text-muted-foreground mt-1">Upload JPG/PNG</p>
                <input type="file" accept="image/*" onChange={handleThumbChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>
          </div>
        );

      case 'metadata':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 pb-2">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Video Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-background border-b rounded-none px-0 py-2 text-lg font-medium outline-none focus:border-primary transition-colors" placeholder="Enter a catchy title..." />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <label className="text-[10px] font-bold text-muted-foreground uppercase">Category</label>
                 <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full bg-muted/30 border rounded px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary/20">
                    <option value="1">Film & Animation</option>
                    <option value="10">Music</option>
                    <option value="22">People & Blogs</option>
                    <option value="24">Entertainment</option>
                    <option value="27">Education</option>
                 </select>
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-bold text-muted-foreground uppercase">License</label>
                 <select value={license} onChange={(e) => setLicense(e.target.value as any)} className="w-full bg-muted/30 border rounded px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary/20">
                    <option value="youtube">Standard YouTube</option>
                    <option value="creativeCommon">Creative Commons</option>
                 </select>
               </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Tags (comma separated)</label>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full bg-muted/30 border rounded px-3 py-2 text-xs" placeholder="podcast, fm, video..." />
            </div>

            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-muted/30 border rounded px-3 py-2 text-xs min-h-[80px]" placeholder="What's this video about?" />
            </div>

            {authError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex flex-col items-center gap-3 text-center animate-bounce">
                <p className="text-xs text-red-500">Authorization expired. Link your account again.</p>
                <button onClick={() => signIn("google")} className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold shadow-lg">Reconnect YouTube</button>
              </div>
            )}
          </div>
        );

      case 'uploading':
        return (
          <div className="flex flex-col items-center justify-center py-12 space-y-8 animate-in zoom-in duration-500">
            <div className="relative h-48 w-48">
              <div className="absolute inset-0 rounded-full border-4 border-muted/20" />
              <svg className="absolute inset-0 h-full w-full -rotate-90 transform">
                <circle
                  cx="96"
                  cy="96"
                  r="92"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={578}
                  strokeDashoffset={578 - (578 * progress) / 100}
                  className="text-primary transition-all duration-300 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
                <span className="text-4xl font-black text-primary">{Math.round(progress)}%</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Uploading</span>
              </div>
            </div>
            
            <div className="text-center space-y-2">
               <h4 className="font-bold text-xl">{title}</h4>
               <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                 <Loader2 className="w-4 h-4 animate-spin" />
                 Processing high-quality blocks...
               </p>
            </div>
            
            <p className="text-[10px] text-muted-foreground max-w-[200px] text-center leading-relaxed">
              Don't close this tab while we're securely transmitting your episode to YouTube's infrastructure.
            </p>
          </div>
        );
    }
  };

  const stepsList: {id: Step, label: string}[] = [
    { id: 'video', label: 'File' },
    { id: 'visibility', label: 'Privacy' },
    { id: 'extras', label: 'Options' },
    { id: 'thumbnail', label: 'Cover' },
    { id: 'metadata', label: 'Details' }
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-3 py-2 bg-red-600/10 text-red-600 dark:bg-red-500/10 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-white rounded-md text-sm font-semibold transition-all flex items-center gap-2 border border-red-200 dark:border-red-500/20 active:scale-95"
      >
        <Youtube className="w-4 h-4" />
        <span className="hidden sm:inline">Upload to YouTube</span>
      </button>

      <Modal 
        isOpen={isOpen} 
        onClose={() => !isUploading && resetAndClose()} 
        title={step === 'uploading' ? "Uploading to YouTube" : "YouTube Studio Wizard"}
      >
        <div className="flex flex-col h-full min-h-[450px]">
          {/* Steps Indicator */}
          {step !== 'uploading' && (
            <div className="flex items-center justify-between mb-8 px-2 overflow-x-auto no-scrollbar">
               {stepsList.map((s, idx) => {
                 const isCompleted = stepsList.findIndex(x => x.id === step) > idx;
                 const isActive = s.id === step;
                 return (
                    <div key={s.id} className="flex items-center">
                       <div className={`flex flex-col items-center gap-1 ${isActive ? 'scale-110' : ''} transition-transform`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors ${isActive ? 'bg-primary border-primary text-primary-foreground' : isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-muted text-muted-foreground'}`}>
                             {isCompleted ? <Check className="w-3 h-3" /> : idx + 1}
                          </div>
                          <span className={`text-[9px] font-bold uppercase tracking-tighter ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>{s.label}</span>
                       </div>
                       {idx < stepsList.length - 1 && (
                         <div className={`w-4 h-[2px] mx-2 mb-4 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-muted'}`} />
                       )}
                    </div>
                 );
               })}
            </div>
          )}

          <div className="flex-1">
             {renderStep()}
          </div>

          {step !== 'uploading' && (
            <div className="flex justify-between items-center mt-8 pt-4 border-t border-border">
              <button
                onClick={prevStep}
                disabled={step === 'video'}
                className={`flex items-center gap-2 text-sm font-semibold transition-opacity ${step === 'video' ? 'opacity-0 pointer-events-none' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              
              <div className="flex gap-3">
                 <button
                    onClick={resetAndClose}
                    className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  {step === 'metadata' ? (
                    <button
                      onClick={startUpload}
                      disabled={isUploading || !title}
                      className="px-6 py-2 bg-red-600 text-white hover:bg-red-700 rounded-xl text-xs font-black shadow-lg shadow-red-500/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      CONFIRM UPLOAD
                    </button>
                  ) : (
                    <button
                      onClick={nextStep}
                      disabled={step === 'video' && !file}
                      className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-xs font-black shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
