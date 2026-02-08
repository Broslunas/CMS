import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"
import { ChevronRight, ChevronLeft, PenTool, LayoutPanelLeft, Edit3, Image as ImageIcon } from "lucide-react"

export default function VisualEditorPage() {
  return (
    <div className="space-y-10 max-w-3xl pb-10">
      <div className="space-y-4">
         <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <PenTool className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-primary">Features</p>
        </div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Visual Editor
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          An immersive writing experience that separates content from configuration. Write in Markdown/MDX without distractions.
        </p>
      </div>
      
      <div className="space-y-8">
        <section className="grid gap-6 md:grid-cols-2">
            <div className="border bg-card rounded-xl p-6">
                 <h3 className="flex items-center gap-2 font-semibold text-lg mb-3">
                    <LayoutPanelLeft className="w-5 h-5 text-primary" /> Metadata Panel
                 </h3>
                 <p className="text-sm text-muted-foreground mb-4">
                    Your file's entire <strong>Frontmatter</strong> lives in the sidebar. Edit titles, dates, authors, and tags without touching code.
                 </p>
                 <ul className="text-xs space-y-2 text-muted-foreground list-disc pl-4">
                    <li>Automatic type validation</li>
                    <li>Smart date pickers</li>
                    <li>Support for arrays and lists</li>
                 </ul>
            </div>
            <div className="border bg-card rounded-xl p-6">
                 <h3 className="flex items-center gap-2 font-semibold text-lg mb-3">
                    <Edit3 className="w-5 h-5 text-primary" /> Content Area
                 </h3>
                 <p className="text-sm text-muted-foreground mb-4">
                    A robust Markdown editor with syntax highlighting. Supports MDX, so you can write React components directly.
                 </p>
                  <ul className="text-xs space-y-2 text-muted-foreground list-disc pl-4">
                    <li>Live Preview (Coming Soon)</li>
                    <li>GFM Syntax (GitHub Flavored Markdown)</li>
                  </ul>
            </div>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b pb-2">Field Management</h2>
            <p className="text-muted-foreground">
                The editor is flexible. If your file needs a new Frontmatter field that doesn't exist in the schema, you can add it on the fly.
            </p>
            <div className="bg-muted border rounded-lg p-4 flex items-center gap-4">
                <div className="bg-background border px-3 py-1 rounded text-sm font-medium shadow-sm">
                    + Add Field
                </div>
                <span className="text-sm text-muted-foreground">
                    Press this button in the sidebar to inject new properties into the post.
                </span>
            </div>
        </section>

        <section className="space-y-4">
             <h2 className="text-2xl font-bold tracking-tight border-b pb-2">Media & Assets</h2>
             <p className="text-muted-foreground">
                Upload images directly from the editor. Images are automatically saved to the <code>public/</code> folder of your repository.
             </p>
             <div className="flex items-center gap-2 text-sm text-primary font-medium bg-primary/10 w-fit px-3 py-1.5 rounded-full">
                <ImageIcon className="w-4 h-4" /> Drag & Drop supported
             </div>
        </section>
      </div>

      <div className="flex justify-between pt-8 border-t">
         <Link href="/docs/core-concepts/schemas">
           <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
             <ChevronLeft className="mr-2 h-4 w-4" /> Schemas
           </Button>
         </Link>
         <Link href="/docs/features/github-app">
           <Button className="pr-4 hover:pr-6 transition-all">
             GitHub App <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
         </Link>
      </div>
    </div>
  )
}
