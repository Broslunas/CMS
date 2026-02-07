
import { Skeleton } from "@/components/ui/skeleton";

export default function EditorLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Editor Header Skeleton */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 gap-4">
           <Skeleton className="h-8 w-8 rounded-md" /> {/* Back button */}
           <div className="flex-1">
              <Skeleton className="h-6 w-48" />
           </div>
           <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-9 rounded-md" />
           </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
         {/* Info Card Skeleton */}
         <div className="bg-card rounded-lg p-4 border border-border space-y-2">
            <div className="flex justify-between items-center">
                 <div className="space-y-2 w-1/2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                 </div>
                 <Skeleton className="h-6 w-24 rounded-full" />
            </div>
         </div>

         {/* Metadata Editor Skeleton */}
         <div className="grid grid-cols-1 gap-6">
               <div className="bg-card rounded-lg border border-border p-6 space-y-6">
                  <div className="flex justify-between items-center border-b pb-4">
                     <Skeleton className="h-6 w-32" />
                     <div className="flex gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-8" />
                     </div>
                  </div>
                  <div className="space-y-4">
                     <Skeleton className="h-10 w-full" />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                     </div>
                     <div className="grid grid-cols-3 gap-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                     </div>
                  </div>
               </div>
         </div>

         {/* Content Editor Skeleton */}
         <div className="space-y-4 pt-4">
             <div className="flex items-center justify-between">
                <div className="flex gap-2">
                   <Skeleton className="h-9 w-24" />
                   <Skeleton className="h-9 w-24" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                </div>
             </div>
             <div className="h-[500px] w-full rounded-lg border border-border bg-card p-4 flex flex-col gap-4">
                <div className="flex gap-2 border-b pb-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <div className="w-px h-8 bg-border mx-2"></div>
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                </div>
                <div className="space-y-3 p-4">
                   <Skeleton className="h-4 w-3/4" />
                   <Skeleton className="h-4 w-1/2" />
                   <Skeleton className="h-4 w-5/6" />
                   <Skeleton className="h-4 w-full" />
                   <Skeleton className="h-4 w-2/3" />
                   <br />
                   <Skeleton className="h-4 w-full" />
                   <Skeleton className="h-4 w-4/5" />
                </div>
             </div>
         </div>
      </main>
    </div>
  );
}
