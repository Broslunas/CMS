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
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background p-4">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[100px] animate-pulse" />
      <div className="absolute right-0 bottom-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[100px] animate-pulse delay-700" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-[20%] animate-bounce duration-5000 opacity-20 hidden md:block">
        <Star className="w-12 h-12 text-primary" />
      </div>

      <div className="absolute bottom-20 right-[20%] animate-bounce duration-[6000ms] opacity-20 hidden md:block">
        <Code2 className="w-12 h-12 text-blue-500" />
      </div>

      <div className="z-10 flex flex-col items-center text-center max-w-5xl space-y-12 animate-in fade-in zoom-in duration-1000 slide-in-from-bottom-10">
        
        {/* Header Section */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-inner backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Próximamente
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter">
            <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/50 bg-clip-text text-transparent">
              Broslunas CMS
            </span>
          </h1>
          
          <p className="max-w-[42rem] mx-auto text-muted-foreground text-lg md:text-2xl leading-relaxed">
            Estamos preparando algo <span className="text-foreground font-semibold">gigante</span>. 
            La nueva generación de gestión de contenido estático está a punto de aterrizar.
          </p>
        </div>

        {/* Countdown Section */}
        <div className="w-full">
           <Countdown targetDate={launchDate} />
        </div>

        {/* CTA Section */}
        <div className="flex flex-col items-center gap-4 pt-8">
           <p className="text-sm text-muted-foreground">
             ¿Eres administrador?
           </p>
           <div className="relative group">
             <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
             <div className="relative">
                {session?.user ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="gap-2 font-bold">
                       <LayoutDashboard className="w-5 h-5" />
                       Ir al Dashboard
                    </Button>
                  </Link>
                ) : (
                  <LoginButton />
                )}
             </div>
           </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 left-0 right-0 text-center p-4">
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Globe className="w-3 h-3" /> Powered by Broslunas Engineering
        </p>
      </footer>
    </main>
  );
}
