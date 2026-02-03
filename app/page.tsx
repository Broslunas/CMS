import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginButton from "@/components/LoginButton";
import { Countdown } from "@/components/launch-countdown";
import { Star, Code2, Globe, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth();

  // Si ya está autenticado, redirigir al dashboard
  // if (session?.user) {
  //   redirect("/dashboard");
  // }

  // Set launch date to Feb 12, 2026
  const launchDate = new Date('2026-02-12T00:00:00');

  return (
    <main className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden p-4">
      {/* Animated Glow Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-[-10%] top-[10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute right-[-5%] bottom-[5%] h-[400px] w-[400px] rounded-full bg-indigo-400/10 blur-[100px] animate-pulse delay-1000" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Floating Elements */}
      <div className="absolute top-24 left-[15%] animate-float hidden lg:block">
        <div className="glass rounded-2xl p-4 shadow-xl border-primary/20">
          <Star className="w-8 h-8 text-primary" />
        </div>
      </div>

      <div className="absolute bottom-32 right-[12%] animate-float delay-1000 hidden lg:block">
        <div className="glass rounded-2xl p-4 shadow-xl border-indigo-400/20">
          <Code2 className="w-8 h-8 text-indigo-400" />
        </div>
      </div>

      <div className="absolute top-1/3 right-[10%] animate-float delay-500 hidden lg:block">
        <div className="glass rounded-2xl p-4 shadow-xl border-purple-400/20">
          <Globe className="w-8 h-8 text-purple-400" />
        </div>
      </div>

      {/* Main Content */}
      <div className="z-10 flex flex-col items-center text-center max-w-5xl space-y-16 px-4">
        
        {/* Header Section */}
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 glass rounded-full px-5 py-2 text-sm font-semibold shadow-lg hover:shadow-primary/20 transition-all duration-500 border-primary/20">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary shadow-lg shadow-primary/50"></span>
            </span>
            <span className="bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
              Próximamente disponible

            </span>
          </div>
          
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9]">
              <span className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                Broslunas
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
                CMS
              </span>
            </h1>
          </div>
          
          {/* Description */}
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg md:text-xl leading-relaxed font-normal">
            La gestión de contenido estático reinventada. 
            <span className="block mt-2 font-medium text-foreground">
              Sin bases de datos. Sin fricciones. Directo a GitHub.
            </span>
          </p>
        </div>

        {/* Countdown Section */}
        <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <div className="premium-card rounded-[2rem] p-8 md:p-12 shadow-2xl border-primary/10">
            <Countdown targetDate={launchDate} />
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
           <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative">
                 {session?.user ? (
                   <Link href="/dashboard">
                     <Button 
                       size="lg" 
                       className="gap-3 font-bold text-lg px-10 py-7 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/20 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                     >
                        <LayoutDashboard className="w-6 h-6" />
                        Acceder al Dashboard
                     </Button>
                   </Link>
                 ) : (
                   <div className="transform hover:scale-[1.02] transition-transform duration-300">
                     <LoginButton />
                   </div>
                 )}
              </div>
           </div>
           <p className="text-sm text-muted-foreground flex items-center gap-2">
             <Code2 className="w-4 h-4" />
             Optimizado para Astro Content Collections
           </p>
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center animate-in fade-in duration-1000 delay-500">
        <div className="glass rounded-full px-6 py-3 border-white/10 flex items-center gap-3 shadow-xl">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
            Broslunas Engineering <span className="text-primary/40 mx-2">|</span> 2026
          </p>
        </div>
      </div>
    </main>
  );
}
