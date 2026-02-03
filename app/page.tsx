import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginButton from "@/components/LoginButton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Zap, Layout, RefreshCw } from "lucide-react";

export default async function Home() {
  const session = await auth();

  // Si ya está autenticado, redirigir al dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center p-4 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        {/* Abstract background elements if desired, or keep clean */}
      </div>

      <article className="max-w-5xl w-full space-y-20">
        {/* Hero */}
        <header className="text-center space-y-6">
          <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
            Beta Pública disponible
          </div>
          <h1 className="text-4xl md:text-7xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent pb-3">
            Broslunas CMS
          </h1>
          <p className="text-xl text-muted-foreground md:text-2xl max-w-[42rem] mx-auto leading-normal">
            Gestiona tus Content Collections de Astro con el poder de Git.
            <br className="hidden md:inline" /> Sin bases de datos, solo tu repositorio.
          </p>
          <div className="pt-4">
             <LoginButton />
          </div>
        </header>

        {/* Features */}
        <section aria-label="Características Principales" className="grid md:grid-cols-3 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <Zap className="h-10 w-10 mb-2 opacity-80" />
              <CardTitle>Rápido y Ligero</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Sin bases de datos de contenido. Todo se sincroniza directamente con GitHub mediante Git nativo.
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <Layout className="h-10 w-10 mb-2 opacity-80" />
              <CardTitle>Interfaz Intuitiva</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Edita tu contenido Markdown y JSON con una UI moderna, limpia y fluida. WYSIWYG real.
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
             <CardHeader>
              <RefreshCw className="h-10 w-10 mb-2 opacity-80" />
              <CardTitle>Sincronización Total</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Cada cambio es un commit. Tu contenido vive en tu repositorio, siempre versionado y seguro.
            </CardContent>
          </Card>
        </section>

        {/* Footer Text */}
        <footer className="text-center text-sm text-muted-foreground pb-8">
          <p>Potenciado por Vercel, Next.js y GitHub API.</p>
        </footer>
      </article>
    </main>
  );
}
