
import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"
import { ChevronRight, ChevronLeft, Github, Key, CheckCircle } from "lucide-react"

export default function GitHubAppPage() {
  return (
    <div className="space-y-10 max-w-3xl pb-10">
      <div className="space-y-4">
         <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-black rounded-lg text-white">
                <Github className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-black dark:text-gray-300">Integrations</p>
        </div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          GitHub App Integration
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
           The centerpiece of the CMS. Manage commits, permissions, and deployments with our official GitHub application.
        </p>
      </div>
      
      <div className="space-y-8">
        <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b pb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" /> Installation
            </h2>
             <div className="flex flex-col gap-4">
               <p className="text-muted-foreground">
                  To be able to read and write to your repositories, you need to install the <strong>Broslunas CMS GitHub App</strong> in your account or organization.
               </p>
               <ol className="list-decimal list-inside space-y-2 ml-2 marker:text-primary">
                    <li>Go to <strong>Settings &gt; Integrations</strong> on the dashboard.</li>
                    <li>Click the "Install GitHub App" button.</li>
                    <li>Select the repositories you want to grant access to (or "All Repositories").</li>
                    <li>Confirm the installation.</li>
               </ol>
             </div>
             
             <div className="mt-4 p-4 bg-muted border rounded-lg">
                <p className="text-sm">
                    <strong>Status:</strong> You can verify if the app is correctly installed by looking for the <span className="text-green-600 font-semibold text-xs bg-green-100 px-1.5 py-0.5 rounded ml-1">Installed</span> indicator on the integrations page.
                </p>
             </div>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b pb-2 flex items-center gap-2">
                <Key className="w-5 h-5 text-purple-600" /> Permissions & Security
            </h2>
            <p className="text-muted-foreground">
                Unlike personal access tokens (PAT) or traditional OAuth Apps, the GitHub App offers granular permissions and greater security:
            </p>
            <ul className="grid gap-3 sm:grid-cols-2 mt-2">
                <li className="p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                    <h4 className="font-semibold mb-1">Limited Access</h4>
                    <p className="text-sm text-muted-foreground">We only access the repositories you explicitly select.</p>
                </li>
                 <li className="p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                    <h4 className="font-semibold mb-1">Short-lived Tokens</h4>
                    <p className="text-sm text-muted-foreground">We use tokens that expire in 1 hour, reducing the risk of leaks.</p>
                </li>
                 <li className="p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                    <h4 className="font-semibold mb-1">Acting on Your Behalf</h4>
                    <p className="text-sm text-muted-foreground">Commits will appear as made by you, but "authored by Broslunas CMS Bot".</p>
                </li>
            </ul>
        </section>
      </div>

      <div className="flex justify-between pt-8 border-t">
         <Link href="/docs/features/visual-editor">
            <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
                <ChevronLeft className="mr-2 h-4 w-4" /> Visual Editor
            </Button>
         </Link>
         <Link href="/docs/features/vercel">
            <Button className="pr-4 hover:pr-6 transition-all">
                Vercel Integration <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
         </Link>
      </div>
    </div>
  )
}
