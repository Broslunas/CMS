import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAppInstallUrl } from "@/lib/github-app";
import { CheckCircle2, Github, ArrowRight, Layout, Sparkles, BookOpen, GitBranch, ShieldCheck } from "lucide-react";
import { Link } from "next-view-transitions";
import { Button } from "@/components/ui/button";
import { InstallationChecker } from "@/components/InstallationChecker";

export default async function SetupPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // If the app is already installed, redirect to the dashboard
  // But verify closely first, in case the user manually uninstalled it
  // and the session is still stale.
  if (session.appInstalled) {
    const { checkAppInstalled } = await import("@/lib/github-app");
    const isReallyInstalled = await checkAppInstalled(session.access_token || "");
    
    if (isReallyInstalled) {
      redirect("/dashboard");
    }
    // If not really installed, let them stay here to fix it
  }

  const installUrl = getAppInstallUrl();
  const isConfigured = process.env.GITHUB_APP_NAME !== undefined;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background relative overflow-hidden">
        
       {/* Background decorations */}
       <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
       
      <div className="max-w-4xl w-full relative z-10 space-y-12 py-12">
        
        {/* Header Section */}
        <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-xl shadow-primary/5 mb-4">
                <Github className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
                Connect your <br/>
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Content Collections
                </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Unlock the full power of Broslunas CMS by connecting your GitHub account. 
                Secure, fast, and fully integrated with your workflow.
            </p>

            <div className="pt-8 flex justify-center">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt" />
                    <Button asChild size="lg" className="relative h-14 px-8 text-lg font-bold rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 border-0 shadow-2xl shadow-primary/30 text-white">
                        <a href={installUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5">
                            <Github className="h-5 w-5" />
                            <span>Install GitHub App</span>
                        </a>
                    </Button>
                </div>
            </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6">
            <div className="group p-6 rounded-2xl bg-card/40 border border-border/50 hover:bg-card/60 transition-all hover:scale-[1.02] hover:shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                    <Layout className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold mb-2">Visual Editing</h3>
                <p className="text-sm text-muted-foreground">
                    Edit your Markdown and MDX files with a beautiful, notion-like interface designed for content creators.
                </p>
            </div>
            
            <div className="group p-6 rounded-2xl bg-card/40 border border-border/50 hover:bg-card/60 transition-all hover:scale-[1.02] hover:shadow-lg">
                 <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                    <GitBranch className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-lg font-bold mb-2">Git-Based Sync</h3>
                <p className="text-sm text-muted-foreground">
                    Every save is a commit. Full version control history without leaving the dashboard.
                </p>
            </div>
            
            <div className="group p-6 rounded-2xl bg-card/40 border border-border/50 hover:bg-card/60 transition-all hover:scale-[1.02] hover:shadow-lg">
                 <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                    <Sparkles className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold mb-2">AI Powers</h3>
                <p className="text-sm text-muted-foreground">
                    Generate metadata, translate content, and improve your SEO automatically with integrated AI tools.
                </p>
            </div>
        </div>

        {/* Main Action Card */}
        <div className="rounded-3xl border border-primary/20 bg-background/60 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                            <ShieldCheck className="w-3 h-3" />
                            Secure Installation
                        </div>
                        <h2 className="text-2xl font-bold">Ready to get started?</h2>
                        <p className="text-muted-foreground">
                            Install our GitHub App to grant access to your repositories. You can choose to grant access to all repositories or just the ones you want to manage.
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative group w-full sm:w-auto">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt" />
                            <Button asChild size="lg" className="relative w-full sm:w-auto h-14 px-8 text-lg font-bold rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 border-0 shadow-2xl shadow-primary/30 text-white">
                                <a href={installUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2.5">
                                    <Github className="h-5 w-5" />
                                    <span>Install GitHub App</span>
                                </a>
                            </Button>
                        </div>
                         <Button asChild variant="ghost" size="lg" className="h-14 text-muted-foreground hover:text-foreground">
                            <Link href="/dashboard">
                                I verify later
                            </Link>
                        </Button>
                    </div>

                    {!isConfigured && (
                        <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                             <span className="font-bold">Error:</span> GITHUB_APP_NAME not configured
                        </div>
                    )}
                </div>

                <div className="w-full md:w-1/3 bg-muted/50 rounded-2xl p-6 border border-border space-y-4">
                     <h4 className="font-semibold flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Quick Guide
                     </h4>
                     <ul className="space-y-3">
                        {[
                            "Click Install button",
                            "Select repositories",
                            "Approve permissions",
                            "Auto-redirect back"
                        ].map((step, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-background border flex items-center justify-center text-xs font-medium">
                                    {i + 1}
                                </span>
                                {step}
                            </li>
                        ))}
                     </ul>
                </div>
            </div>
        </div>

      </div>

      {/* Component that automatically checks the installation */}
      <InstallationChecker />
    </div>
  );
}
