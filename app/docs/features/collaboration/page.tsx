import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"
import { ChevronRight, ChevronLeft, Users, Shield, UserPlus, Eye, Edit } from "lucide-react"

export default function CollaborationPage() {
  return (
    <div className="space-y-10 max-w-3xl pb-10">
      <div className="space-y-4">
         <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Users className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-primary">Features</p>
        </div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Collaboration & Permissions
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Invite your team to manage content without giving them full access to your GitHub account.
        </p>
      </div>
      
      <div className="space-y-8">
        <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b pb-2">User Roles</h2>
            <div className="grid gap-4 sm:grid-cols-3">
                 <div className="border bg-card rounded-lg p-6 hover:border-primary/50 transition-colors">
                    <div className="mb-3 p-2 bg-muted w-fit rounded-md"><Eye className="w-5 h-5" /></div>
                    <h3 className="font-bold text-lg">Viewer</h3>
                    <p className="text-sm text-muted-foreground mt-2">Read-only access. Can view content and deployment status, but cannot edit.</p>
                 </div>
                 <div className="border bg-card rounded-lg p-6 hover:border-primary/50 transition-colors">
                      <div className="mb-3 p-2 bg-muted w-fit rounded-md"><Edit className="w-5 h-5" /></div>
                    <h3 className="font-bold text-lg">Editor</h3>
                    <p className="text-sm text-muted-foreground mt-2">Can create, edit, and delete posts. Cannot change repository configurations.</p>
                 </div>
                 <div className="border bg-card rounded-lg p-6 hover:border-primary/50 transition-colors">
                      <div className="mb-3 p-2 bg-muted w-fit rounded-md"><Shield className="w-5 h-5" /></div>
                    <h3 className="font-bold text-lg">Admin</h3>
                    <p className="text-sm text-muted-foreground mt-2">Full control. Can invite other users and change repository settings.</p>
                 </div>
            </div>
        </section>

        <section className="space-y-4">
             <h2 className="text-2xl font-bold tracking-tight border-b pb-2">How to Invite Collaborators</h2>
             <ol className="list-decimal list-inside space-y-4 text-muted-foreground">
                <li className="p-4 border rounded-lg bg-card">
                    <strong className="text-foreground">Go to Settings</strong>: Navigate to the repository dashboard and look for the "Settings" tab.
                </li>
                <li className="p-4 border rounded-lg bg-card">
                    <strong className="text-foreground">Enter Email</strong>: The user must have an account created in Broslunas CMS.
                </li>
                <li className="p-4 border rounded-lg bg-card">
                    <strong className="text-foreground">Select Role</strong>: Choose the appropriate access level and send the invitation.
                </li>
             </ol>
        </section>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                <UserPlus className="w-5 h-5 text-primary" /> GitHub Abstraction
            </h3>
            <p className="text-sm text-muted-foreground">
                Your editors <strong>do not need a GitHub account</strong> or permissions on the repository. 
                Broslunas CMS acts as a secure proxy, making changes on behalf of the App installed by the administrator.
            </p>
        </div>
      </div>

      <div className="flex justify-between pt-8 border-t">
         <Link href="/docs/features/storage">
           <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
             <ChevronLeft className="mr-2 h-4 w-4" /> S3 Storage
           </Button>
         </Link>
         <Link href="/docs/features/version-control">
           <Button className="pr-4 hover:pr-6 transition-all">
             Version Control <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
         </Link>
      </div>
    </div>
  )
}
