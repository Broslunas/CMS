import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"
import { ChevronRight, ChevronLeft, FileJson, Layers, Mic } from "lucide-react"

export default function JSONModePage() {
  return (
    <div className="space-y-10 max-w-3xl pb-10">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <FileJson className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-primary">Features</p>
        </div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          JSON Mode
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
           For when standard inputs aren't enough. Edit complex data structures or use our specialized editors.
        </p>
      </div>
      
      <div className="space-y-8">
        <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b pb-2">Specialized Editors</h2>
            <p className="text-muted-foreground">
                We've created visual interfaces to handle common arrays of objects in advanced content structures.
            </p>
            
            <div className="grid gap-6 md:grid-cols-2 mt-4">
                <div className="border rounded-xl p-6 bg-card hover:shadow-lg transition-all group">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                            <Mic className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-lg">Transcription Editor</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                        Perfect for podcasts or interviews. Optimized interface for adding time blocks and text quickly.
                    </p>
                     <code className="block bg-muted p-2 rounded text-xs font-mono text-muted-foreground">
                        transcription: [ &#123; time: "00:00", text: "..." &#125; ]
                    </code>
                </div>

                <div className="border rounded-xl p-6 bg-card hover:shadow-lg transition-all group">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                            <Layers className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-lg">Sections Editor</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                        Build modular landing pages. Add, reorder, and edit content sections with title and body.
                    </p>
                    <code className="block bg-muted p-2 rounded text-xs font-mono text-muted-foreground">
                        sections: [ &#123; title: "Intro", body: "..." &#125; ]
                    </code>
                </div>
            </div>
        </section>

        <section className="space-y-4">
             <h2 className="text-2xl font-bold tracking-tight border-b pb-2">Raw JSON Input</h2>
             <p className="text-muted-foreground">
                Have the data in another file? All complex editing modals have an <strong>"Import JSON"</strong> button. 
                Paste your raw JSON and we'll automatically convert it into the visual interface.
             </p>
        </section>
      </div>

      <div className="flex justify-between pt-8 border-t">
         <Link href="/docs/features/ai">
           <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
             <ChevronLeft className="mr-2 h-4 w-4" /> Gemini AI
           </Button>
         </Link>
         <Link href="/docs/architecture">
           <Button className="pr-4 hover:pr-6 transition-all">
             Architecture <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
         </Link>
      </div>
    </div>
  )
}
