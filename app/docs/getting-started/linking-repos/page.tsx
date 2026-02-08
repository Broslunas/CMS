import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"
import { ChevronRight, ChevronLeft, Link as LinkIcon, ScanSearch, DownloadCloud, FileX } from "lucide-react"

export default function LinkingReposPage() {
  return (
    <div className="space-y-10 max-w-3xl pb-10">
       <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <LinkIcon className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-primary">Getting Started</p>
        </div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Linking Repositories
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Learn how to import your existing Astro projects into the platform. The process is fast and preserves the integrity of your code.
        </p>
      </div>
      
      <div className="space-y-8">
        <div className="bg-card border rounded-xl p-6 shadow-sm">
             <h3 className="font-semibold text-lg mb-4">How the process works</h3>
             <div className="grid gap-6">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-muted rounded-md">
                        <ScanSearch className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <h4 className="font-medium">1. Automatic Detection</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                             The system scans your connected repositories for a defined <code>src/content</code> folder. If we detect a valid Astro project, we will mark it as "Compatible".
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-muted rounded-md">
                        <DownloadCloud className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <h4 className="font-medium">2. Initial Import</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                             When you click "Import", we clone a shallow reference of your repository and cache your <code>.md</code> and <code>.mdx</code> files. This usually takes 2 to 10 seconds.
                        </p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <div className="p-2 bg-muted rounded-md">
                        <FileX className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <h4 className="font-medium">3. Filtering (Optional)</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                             By default, we import all content. You can use a <code>.cmsignore</code> file (beta feature) to exclude specific folders.
                        </p>
                    </div>
                </div>
             </div>
        </div>

        <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Troubleshooting</h2>
            <div className="grid gap-4 md:grid-cols-2">
                <div className="border p-4 rounded-lg bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-semibold text-sm mb-2">I can't see my repository</h4>
                    <p className="text-xs text-muted-foreground">
                        Make sure you have granted permissions to the GitHub App. Go to Settings on GitHub and check the "Applications" section.
                    </p>
                </div>
                 <div className="border p-4 rounded-lg bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-semibold text-sm mb-2">Parsing error</h4>
                    <p className="text-xs text-muted-foreground">
                        If your <code>config.ts</code> uses very complex or dynamic functions, the static parser might fail. Try simplifying the collection definitions.
                    </p>
                </div>
            </div>
        </div>
      </div>

      <div className="flex justify-between pt-8 border-t">
         <Link href="/docs/getting-started/installation">
           <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
             <ChevronLeft className="mr-2 h-4 w-4" /> Installation
           </Button>
         </Link>
         <Link href="/docs/core-concepts/collections">
           <Button className="pr-4 hover:pr-6 transition-all">
             Core Concepts: Collections <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
         </Link>
      </div>
    </div>
  )
}
