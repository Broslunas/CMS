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
          Vincular Repositorios
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Aprende cómo importar tus proyectos de Astro existentes a la plataforma. El proceso es rápido y preserva la integridad de tu código.
        </p>
      </div>
      
      <div className="space-y-8">
        <div className="bg-card border rounded-xl p-6 shadow-sm">
             <h3 className="font-semibold text-lg mb-4">Cómo funciona el proceso</h3>
             <div className="grid gap-6">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-muted rounded-md">
                        <ScanSearch className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <h4 className="font-medium">1. Detección Automática</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                             El sistema escanea tus repositorios conectados en busca de una carpeta <code>src/content</code> definida. Si detectamos un proyecto Astro válido, lo marcaremos como "Compatible".
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-muted rounded-md">
                        <DownloadCloud className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <h4 className="font-medium">2. Importación Inicial</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                             Al hacer clic en "Importar", clonamos una referencia superficial de tu repositorio y cacheamos tus archivos <code>.md</code> y <code>.mdx</code>. Esto suele tomar de 2 a 10 segundos.
                        </p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <div className="p-2 bg-muted rounded-md">
                        <FileX className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <h4 className="font-medium">3. Filtrado (Opcional)</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                             Por defecto importamos todo el contenido. Puedes usar un archivo <code>.cmsignore</code> (feature en beta) para excluir carpetas específicas.
                        </p>
                    </div>
                </div>
             </div>
        </div>

        <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Resolución de Problemas</h2>
            <div className="grid gap-4 md:grid-cols-2">
                <div className="border p-4 rounded-lg bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-semibold text-sm mb-2">No veo mi repositorio</h4>
                    <p className="text-xs text-muted-foreground">
                        Asegúrate de haberle dado permisos a la GitHub App. Ve a Settings en GitHub y revisa la sección "Applications".
                    </p>
                </div>
                 <div className="border p-4 rounded-lg bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-semibold text-sm mb-2">Error de parsing</h4>
                    <p className="text-xs text-muted-foreground">
                        Si tu <code>config.ts</code> usa funciones muy complejas o dinámicas, el parser estático podría fallar. Intenta simplificar las definiciones de colecciones.
                    </p>
                </div>
            </div>
        </div>
      </div>

      <div className="flex justify-between pt-8 border-t">
         <Link href="/docs/getting-started/installation">
           <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
             <ChevronLeft className="mr-2 h-4 w-4" /> Instalación
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
