import { Link } from "next-view-transitions";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Rocket, Zap, Bug, GitBranch } from "lucide-react";

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4 md:px-6">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-12">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Inicio
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Novedades</h1>
            <p className="text-xl text-muted-foreground">
                Descubre las últimas actualizaciones y mejoras de Broslunas CMS.
            </p>
        </div>

        <div className="relative border-l border-border ml-3 md:ml-6 space-y-12">
            
            {/* Entry 1 */}
            <div className="relative pl-8 md:pl-12">
                <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                    <h2 className="text-2xl font-bold">v1.0.0 - Lanzamiento Oficial</h2>
                    <Badge variant="secondary" className="w-fit">6 de Febrero, 2026</Badge>
                </div>
                <div className="prose prose-zinc dark:prose-invert max-w-none">
                    <p>
                        Hoy marcamos un hito importante. Broslunas CMS sale de beta y está disponible para todos. 
                        Hemos trabajado duro para traerte la mejor experiencia de gestión de contenido para Astro.
                    </p>
                    <ul className="list-none pl-0 space-y-2 mt-4">
                        <li className="flex items-start">
                            <Rocket className="mr-3 h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                            <span><strong>Git-based Workflow:</strong> Cada cambio es un commit. Sin bases de datos intermedias.</span>
                        </li>
                        <li className="flex items-start">
                            <Zap className="mr-3 h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                            <span><strong>Soporte para Astro Collections:</strong> Importación automática de esquemas desde tu `config.ts`.</span>
                        </li>
                        <li className="flex items-start">
                             <GitBranch className="mr-3 h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                            <span><strong>Editor Visual:</strong> Edita Markdown, MDX y JSON con una interfaz intuitiva y potente.</span>
                        </li>
                    </ul>
                </div>
            </div>

             {/* Entry 2 */}
             <div className="relative pl-8 md:pl-12">
                <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-muted-foreground/30 ring-4 ring-background" />
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                    <h2 className="text-xl font-semibold text-muted-foreground">Beta Pública</h2>
                    <Badge variant="outline" className="w-fit">1 de Enero, 2026</Badge>
                </div>
                <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground">
                    <p>
                        Abrimos las puertas a nuestros primeros usuarios beta. Gracias a vuestro feedback hemos pulido la experiencia de usuario y corregido errores críticos.
                    </p>
                     <ul className="list-none pl-0 space-y-2 mt-4">
                        <li className="flex items-start">
                            <Bug className="mr-3 h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                            <span>Corrección de errores en la autenticación con GitHub.</span>
                        </li>
                        <li className="flex items-start">
                            <Zap className="mr-3 h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                            <span>Mejoras de rendimiento en la carga de repositorios grandes.</span>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
