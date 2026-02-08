
import React from 'react';
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guest Preview",
  robots: {
    index: false,
    follow: false,
  },
};

interface MetadataFieldProps {
  label: string;
  value: any;
}

const MetadataField: React.FC<MetadataFieldProps> = ({ label, value }) => {
  if (value === null || value === undefined || value === "") return null;

  const renderValue = (val: any): React.ReactNode => {
    if (Array.isArray(val)) {
      return (
        <ul className="list-disc list-inside text-sm text-foreground ml-2 space-y-1">
          {val.map((item, i) => (
             <li key={i} className="truncate">{typeof item === 'object' ? JSON.stringify(item) : String(item)}</li>
          ))}
        </ul>
      );
    }
    if (typeof val === 'object' && val !== null) {
       return (
         <pre className="text-xs bg-muted/50 p-2 rounded overflow-x-auto mt-1 max-w-full font-mono text-muted-foreground">
            {JSON.stringify(val, null, 2)}
         </pre>
       );
    }
    if (typeof val === 'boolean') {
        return <span className={`text-xs px-2 py-0.5 rounded font-medium ${val ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>{val ? 'true' : 'false'}</span>;
    }
    
    // Image Check
    if (typeof val === 'string' && (val.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) || val.startsWith('http'))) {
        return (
            <div className="group relative break-all">
                <span className="text-sm text-primary hover:underline cursor-pointer transition-colors block truncate" title={val}>
                    {val}
                </span>
                {/* Simple Hover Preview for Images */}
                {(val.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i)) && (
                     <div className="hidden group-hover:block absolute z-50 top-full left-0 mt-2 p-1 bg-background border border-border shadow-lg rounded-lg">
                        <img src={val} alt="Preview" className="max-w-[200px] max-h-[150px] object-cover rounded" />
                     </div>
                )}
            </div>
        );
    }

    // Default string/number
    return <span className="text-sm text-foreground font-medium break-words">{String(val)}</span>;
  };

  return (
    <div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-border/40 last:border-0 items-start">
       <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-0.5 select-none">{label}</span>
       <div className="min-w-0">{renderValue(value)}</div>
    </div>
  );
};

export default async function PreviewPage(props: { params: Promise<{ token: string }> }) {
  const params = await props.params;

  if (!params?.token) {
    notFound();
  }

  const { token } = params;
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const preview = await db.collection("previews").findOne({ token });

  if (!preview) {
    notFound();
  }

  // Check expiration
  const now = new Date();
  const validUntil = new Date(preview.expiresAt);
  const isExpired = now > validUntil;

  if (isExpired) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background text-foreground">
        <div className="bg-destructive/10 text-destructive p-4 rounded-full mb-4 animate-in zoom-in spin-in-1">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Link Expired</h1>
        <p className="text-muted-foreground mb-6">This preview link is no longer valid.</p>
        <a href="/" className="text-primary hover:underline text-sm font-medium">Go to Home</a>
      </div>
    );
  }

  const timeLeft = Math.max(0, Math.ceil((validUntil.getTime() - now.getTime()) / (1000 * 60 * 60)));

  // Destructure for display
  const { title, ...otherMetadata } = preview.metadata || {};
  const collection = preview.collection || "blog";
  const repoId = preview.repoId;

  // Combine system metadata + custom metadata for display
  const systemMetadata = {
     "Collection": collection,
     "Repository": repoId,
     "Created At": new Date(preview.createdAt).toLocaleString(),
     "Expires At": validUntil.toLocaleString()
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        
        {/* Guest Banner */}
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 p-4 rounded-xl mb-8 flex flex-col sm:flex-row items-center justify-between shadow-sm backdrop-blur-sm gap-4">
             <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="p-2.5 bg-amber-500/20 rounded-full shadow-inner ring-1 ring-amber-500/10">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </div>
                <div>
                   <p className="font-bold text-sm tracking-tight text-foreground/90">Guest Preview Mode</p>
                   <p className="text-xs opacity-70 mt-0.5 font-medium flex items-center gap-1">
                       <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block"/>
                       Live Preview • Expires in {timeLeft}h
                   </p>
                </div>
             </div>
             <div className="text-[10px] font-mono opacity-50 bg-background/50 px-2 py-1 rounded border border-border/50 self-end sm:self-auto hidden sm:block" title="Preview Token">
                 ID: {token.substring(0, 8)}...
             </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
             
             {/* LEFT COLUMN: Content */}
             <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden min-h-[600px] flex flex-col transition-all hover:shadow-md">
                <div className="p-8 sm:p-10 lg:p-12">
                    {/* Header inside Content Area */}
                     <div className="mb-10 border-b border-border/40 pb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary uppercase tracking-wide">
                                Draft
                            </span>
                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground uppercase tracking-wide">
                                {collection}
                            </span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
                            {title || "Untitled Post"}
                        </h1>
                     </div>

                    <div className="prose dark:prose-invert max-w-none prose-lg prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-img:rounded-xl prose-img:shadow-lg prose-a:text-primary prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border/50">
                        <MarkdownRenderer content={preview.content} repoId={preview.repoId} />
                    </div>
                </div>
             </div>

             {/* RIGHT COLUMN: Metadata Sidebar */}
             <div className="space-y-6 lg:sticky lg:top-8">
                
                {/* System Info Card */}
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="px-4 py-3 bg-muted/40 border-b border-border/50 flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                           <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                           Preview Info
                        </h3>
                    </div>
                    <div className="p-4 bg-card/50">
                        <div className="divide-y divide-border/30">
                           {Object.entries(systemMetadata).map(([k, v]) => (
                               <div key={k} className="flex justify-between py-2 text-xs first:pt-0 last:pb-0">
                                   <span className="text-muted-foreground font-medium">{k}</span>
                                   <span className="text-foreground truncate max-w-[150px] font-mono text-[10px]">{v}</span>
                               </div>
                           ))}
                        </div>
                    </div>
                </div>

                {/* Post Metadata Card */}
                {Object.keys(otherMetadata).length > 0 && (
                    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                        <div className="px-4 py-3 bg-muted/40 border-b border-border/50 flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                               <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                               Frontmatter
                            </h3>
                            <span className="text-[10px] bg-background border border-border px-1.5 rounded text-muted-foreground">
                                {Object.keys(otherMetadata).length} fields
                            </span>
                        </div>
                        <div className="p-5">
                            <div className="space-y-0">
                                {Object.entries(otherMetadata).map(([key, value]) => (
                                    <MetadataField key={key} label={key} value={value} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

             </div>
        </div>

      </div>
    </div>
  );
}
