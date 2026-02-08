import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"
import { ChevronRight, ChevronLeft, Zap, Rocket, Terminal } from "lucide-react"

export default function VercelPage() {
  return (
    <div className="space-y-10 max-w-3xl pb-10">
      <div className="space-y-4">
         <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Zap className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-primary">Features</p>
        </div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Vercel Integration
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Monitor your deployments directly from the CMS. View your build status without leaving the editor.
        </p>
      </div>
      
      <div className="space-y-8">
        <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b pb-2">Connecting Your Project</h2>
            <p className="text-muted-foreground">
                To activate the integration, go to your repository settings in Broslunas CMS.
            </p>
            <div className="space-y-4 mt-6">
                <div className="flex gap-4 items-start">
                    <div className="h-8 w-8 bg-black text-white rounded-full flex items-center justify-center shrink-0">1</div>
                    <div className="space-y-1">
                        <h3 className="font-semibold">Project ID</h3>
                        <p className="text-sm text-muted-foreground">
                            You need your Vercel Project ID. You can find it in <code>Settings &gt; General</code> on your Vercel dashboard.
                        </p>
                        <div className="text-xs bg-muted p-2 rounded mt-2 font-mono">prj_...</div>
                    </div>
                </div>
                 <div className="flex gap-4 items-start">
                    <div className="h-8 w-8 bg-black text-white rounded-full flex items-center justify-center shrink-0">2</div>
                    <div className="space-y-1">
                        <h3 className="font-semibold">Access Token</h3>
                        <p className="text-sm text-muted-foreground">
                            Generate a personal access token in Vercel with read permissions.
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mt-4">
                <p className="text-sm font-medium text-primary flex items-center gap-2">
                    <Terminal className="h-4 w-4" /> Feature: Auto-detection
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    If you provide a valid Token, we can attempt to auto-detect the Project ID associated with your GitHub repository.
                </p>
            </div>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b pb-2">Status Widget</h2>
            <p className="text-muted-foreground">
                Once connected, you will see a widget in your repository header showing the latest deployment.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
                 <div className="flex items-center gap-2 p-3 border rounded bg-green-500/10 text-green-700 border-green-200">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-bold text-sm">Ready</span>
                 </div>
                  <div className="flex items-center gap-2 p-3 border rounded bg-yellow-500/10 text-yellow-700 border-yellow-200">
                    <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                    <span className="font-bold text-sm">Building...</span>
                 </div>
                  <div className="flex items-center gap-2 p-3 border rounded bg-red-500/10 text-red-700 border-red-200">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="font-bold text-sm">Error</span>
                 </div>
            </div>
        </section>
      </div>

      <div className="flex justify-between pt-8 border-t">
         <Link href="/docs/features/github-app">
           <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
             <ChevronLeft className="mr-2 h-4 w-4" /> GitHub App
           </Button>
         </Link>
         <Link href="/docs/features/storage">
           <Button className="pr-4 hover:pr-6 transition-all">
             S3 Storage <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
         </Link>
      </div>
    </div>
  )
}
