import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"
import { ChevronRight, ChevronLeft, History, GitCompare, RotateCcw } from "lucide-react"

export default function VersionControlPage() {
  return (
    <div className="space-y-10 max-w-3xl pb-10">
      <div className="space-y-4">
         <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <History className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-primary">Features</p>
        </div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Visual Version Control
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
           Don't fear breaking anything. Visualize your changes before saving and travel back in time if you make a mistake.
        </p>
      </div>
      
      <div className="space-y-8">
        <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b pb-2 flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-primary" /> Visual Diff
            </h2>
            <p className="text-muted-foreground">
                Before committing, you'll always want to know exactly what has changed. Our visual Diff system shows modifications line by line.
            </p>
            <div className="bg-card border rounded-lg p-4 font-mono text-sm">
                <div className="text-red-500 bg-red-500/10 px-2 py-0.5 rounded w-fit mb-1">- title: "The old title"</div>
                <div className="text-green-500 bg-green-500/10 px-2 py-0.5 rounded w-fit">+ title: "The new and improved title"</div>
            </div>
             <p className="text-xs text-muted-foreground mt-2">
                Accessible from the "View Changes" button in the save bar.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b pb-2 flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-primary" /> Commit History
            </h2>
             <p className="text-muted-foreground">
                Every time you save, we create a restoration point (commit) on GitHub. In the editor's "History" tab you can see:
            </p>
            <ul className="grid gap-2 mt-4">
                <li className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-600 flex items-center justify-center text-xs">JD</div>
                         <div>
                             <p className="text-sm font-medium">Update intro text</p>
                             <p className="text-xs text-muted-foreground">2 hours ago by John Doe</p>
                         </div>
                    </div>
                    <Button variant="outline" size="sm">Restore</Button>
                </li>
                 <li className="flex items-center justify-between p-3 border rounded-lg bg-muted/30 opacity-60">
                    <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center text-xs">ME</div>
                         <div>
                             <p className="text-sm font-medium">Initial commit</p>
                             <p className="text-xs text-muted-foreground">5 days ago by Me</p>
                         </div>
                    </div>
                    <Button variant="ghost" size="sm" disabled>Current</Button>
                </li>
            </ul>
             <p className="text-sm text-yellow-600 dark:text-yellow-500 mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <strong>Note:</strong> When restoring a version, a <em>new commit</em> is created that reverts the changes. We never delete history; we only add on top.
            </p>
        </section>
      </div>

      <div className="flex justify-between pt-8 border-t">
         <Link href="/docs/features/collaboration">
           <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
             <ChevronLeft className="mr-2 h-4 w-4" /> Collaboration
           </Button>
         </Link>
         <Link href="/docs/features/ai">
           <Button className="pr-4 hover:pr-6 transition-all">
             Gemini AI <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
         </Link>
      </div>
    </div>
  )
}
