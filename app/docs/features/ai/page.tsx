import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"
import { ChevronRight, ChevronLeft, Sparkles, Wand2, Stars } from "lucide-react"

export default function AIPage() {
  return (
    <div className="space-y-10 max-w-3xl pb-10">
      <div className="space-y-4">
         <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Sparkles className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-primary">Features</p>
        </div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl gradient-text">
          Gemini AI
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
           Powered by Google's Flash 2.5 model. Your integrated intelligent writing assistant within the CMS.
        </p>
      </div>
      
      <div className="space-y-8">
        <div className="p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-primary/20 rounded-xl relative overflow-hidden">
             <Stars className="absolute top-2 right-2 text-primary/20 w-12 h-12 animate-pulse" />
             <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                 <Wand2 className="w-5 h-5 text-primary" /> Magical Features
             </h3>
             <ul className="space-y-3">
                 <li className="flex items-start gap-3">
                     <span className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs mt-0.5">1</span>
                     <div>
                         <strong className="block text-foreground">SEO Title Generation</strong>
                         <span className="text-sm text-muted-foreground">Let AI analyze your content and suggest attractive, search-engine optimized titles.</span>
                     </div>
                 </li>
                 <li className="flex items-start gap-3">
                     <span className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs mt-0.5">2</span>
                     <div>
                         <strong className="block text-foreground">Automatic Summary</strong>
                         <span className="text-sm text-muted-foreground">Generate descriptions and excerpts in seconds for your meta tags.</span>
                     </div>
                 </li>
                 <li className="flex items-start gap-3">
                     <span className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs mt-0.5">3</span>
                     <div>
                         <strong className="block text-foreground">Style Correction</strong>
                         <span className="text-sm text-muted-foreground">Select text and ask Gemini to rewrite it to be more formal, fun, or concise.</span>
                     </div>
                 </li>
                 <li className="flex items-start gap-3">
                     <span className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs mt-0.5">4</span>
                     <div>
                         <strong className="block text-foreground">Transcription & Sections</strong>
                         <span className="text-sm text-muted-foreground">Convert your audio to text and let the AI automatically detect and generate chapters or sections.</span>
                     </div>
                 </li>
             </ul>
        </div>

        <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b pb-2">How to Use It</h2>
            <p className="text-muted-foreground">
                Look for the <Sparkles className="inline w-4 h-4 text-primary" /> <strong>AI</strong> icon in the editor toolbar or next to input fields.
            </p>
            <div className="p-4 bg-muted rounded-lg text-sm italic border-l-4 border-primary">
                "Gemini, rewrite this paragraph to sound more professional."
            </div>
        </div>
      </div>

      <div className="flex justify-between pt-8 border-t">
         <Link href="/docs/features/version-control">
           <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
             <ChevronLeft className="mr-2 h-4 w-4" /> Version Control
           </Button>
         </Link>
         <Link href="/docs/features/json-mode">
           <Button className="pr-4 hover:pr-6 transition-all">
             JSON Mode <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
         </Link>
      </div>
    </div>
  )
}
