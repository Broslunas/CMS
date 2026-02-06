import { Link } from "next-view-transitions";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-muted/30 border-t border-border mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-bold text-xl leading-none">B</span>
              </div>
              <span className="font-bold text-lg tracking-tight">Broslunas CMS</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              El CMS definitivo para Astro. Gestiona tus Content Collections con el poder de Git y una interfaz visual premium.
            </p>
            <div className="flex items-center space-x-4">
              <Link href="https://github.com/broslunas" target="_blank">
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-colors">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </Link>
              <Link href="https://twitter.com/broslunas" target="_blank">
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-colors">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Product Column */}
          <div className="space-y-4">
            <h3 className="font-bold text-foreground">Producto</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/pricing" className="hover:text-primary transition-colors">Precios</Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-primary transition-colors">Documentación</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
              </li>
              <li>
                <Link href="/changelog" className="hover:text-primary transition-colors">Novedades</Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-4">
            <h3 className="font-bold text-foreground">Recursos</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="https://github.com/broslunas/cms" target="_blank" className="hover:text-primary transition-colors">GitHub Repo</Link>
              </li>
              <li>
                <Link href="/docs/getting-started/installation" className="hover:text-primary transition-colors">Guía de Inicio</Link>
              </li>
              <li>
                <Link href="https://astro.build" target="_blank" className="hover:text-primary transition-colors">Astro</Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-4">
            <h3 className="font-bold text-foreground">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/legal/privacy" className="hover:text-primary transition-colors">Privacidad</Link>
              </li>
              <li>
                <Link href="/legal/terms" className="hover:text-primary transition-colors">Términos</Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="hover:text-primary transition-colors">Cookies</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Broslunas. Todos los derechos reservados.</p>
          <div className="flex items-center space-x-6">
            <Link href="/legal/privacy" className="hover:text-foreground transition-colors">Privacidad</Link>
            <Link href="/legal/terms" className="hover:text-foreground transition-colors">Términos</Link>
            <Link href="/legal/cookies" className="hover:text-foreground transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
