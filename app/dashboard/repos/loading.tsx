
import { Skeleton } from "@/components/ui/skeleton";

export default function ReposLoading() {
  return (
    <main className="container max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="space-y-6">
        {/* Navigation & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="flex items-center gap-4">
             <Skeleton className="h-9 w-24" />
             <div className="h-4 w-px bg-border hidden md:block" />
             <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
             </div>
           </div>

           <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-10" />
           </div>
        </div>

        {/* Invitation Alert Skeleton */}
        <div className="w-full h-16 rounded-lg border border-border/50 bg-card p-4 flex items-center gap-4 animate-pulse">
           <Skeleton className="h-8 w-8 rounded-full" />
           <Skeleton className="h-4 w-1/2 flex-1" />
           <Skeleton className="h-9 w-24" />
        </div>

        {/* Filters Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
           <Skeleton className="h-10 w-full sm:w-96" />
           <div className="flex items-center gap-2 w-full sm:w-auto">
              <Skeleton className="h-10 w-24 flex-1 sm:flex-none" />
              <Skeleton className="h-10 w-24 flex-1 sm:flex-none" />
           </div>
        </div>

        {/* Posts List Skeleton */}
        <div className="space-y-3 pt-2">
           <Skeleton className="h-5 w-32 mb-4" />
           {[1, 2, 3, 4, 5].map((i) => (
             <div key={i} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-lg border border-border/50 bg-card">
                <div className="flex-1 space-y-2 w-full">
                   <Skeleton className="h-5 w-3/4 md:w-1/3" />
                   <div className="flex gap-2">
                     <Skeleton className="h-4 w-20" />
                     <Skeleton className="h-4 w-20" />
                   </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0 justify-between md:justify-end">
                   <Skeleton className="h-6 w-20 rounded-full" />
                   <div className="flex gap-2">
                       <Skeleton className="h-8 w-8 rounded-md" />
                       <Skeleton className="h-8 w-8 rounded-md" />
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </main>
  );
}
