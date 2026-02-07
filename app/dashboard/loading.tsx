
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <main className="container max-w-7xl mx-auto px-4 py-12 md:py-20">
      <div className="space-y-12">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
          <div className="space-y-3">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-6 w-64" />
          </div>

          <div className="flex items-center gap-3">
             <Skeleton className="h-10 w-28" />
             <Skeleton className="h-10 w-36" />
          </div>
        </div>

        {/* Projects Grid Skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[220px] rounded-2xl border border-border/50 bg-card p-6 flex flex-col justify-between">
               <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <Skeleton className="h-10 w-10 rounded-xl" />
                      <Skeleton className="h-5 w-16 rounded-md" />
                   </div>
                   <div className="space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                   </div>
               </div>
               <div className="pt-4 border-t border-border/50 flex justify-between">
                 <Skeleton className="h-4 w-20" />
                 <Skeleton className="h-4 w-24" />
               </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
