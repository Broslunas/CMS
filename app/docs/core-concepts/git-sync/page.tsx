import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"
import { ChevronRight, ChevronLeft, GitBranch, RefreshCw, Save, GitCommit, Database } from "lucide-react"

export default function GitSyncPage() {
  return (
    <div className="space-y-10 max-w-3xl pb-10">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <GitBranch className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-primary">Core Concepts</p>
        </div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
           Sincronización Git
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
           Entiende cómo Broslunas CMS interactúa con tus repositorios. Cada acción importante es un commit, garantizando trazabilidad total.
        </p>
      </div>
      
      <div className="space-y-8">
        <h2 className="text-2xl font-bold tracking-tight border-b pb-2">Ciclo de Vida de un Cambio</h2>
        
        <div className="relative border-l-2 border-muted ml-4 pl-8 py-2 space-y-12">
            
            <div className="relative">
                <div className="absolute -left-[42px] top-1 h-8 w-8 rounded-full bg-background border-2 border-muted flex items-center justify-center">
                    <Save className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">1. Borrador (Draft)</h3>
                    <div className="mt-2 p-4 bg-muted/50 rounded-lg border text-sm text-muted-foreground">
                        <p>
                             Cuando editas contenido y pulsas <strong>Guardar</strong> (sin publicar), los cambios se almacenan en nuestra <strong className="text-foreground">Base de Datos Caché</strong> (MongoDB).
                        </p>
                        <p className="mt-2 text-xs flex items-center gap-1">
                            <Database className="w-3 h-3" /> No se realizan cambios en GitHub. Tu repositorio permanece limpio mientras trabajas.
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative">
                <div className="absolute -left-[42px] top-1 h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <GitCommit className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2 text-primary">2. Commit & Sync</h3>
                    <div className="mt-2 p-4 bg-primary/5 rounded-lg border border-primary/20 text-sm">
                        <p className="text-foreground">
                             Al pulsar <strong>Publicar</strong> o <strong>Guardar y Sync</strong>, compilamos el archivo final (con su Frontmatter y cuerpo) y enviamos un commit directo a la API de GitHub.
                        </p>
                        <p className="mt-2 text-xs text-primary/80 font-mono bg-primary/10 w-fit px-2 py-0.5 rounded">
                            commit message: "Update post-slug from CMS"
                        </p>
                    </div>
                </div>
            </div>

             <div className="relative">
                <div className="absolute -left-[42px] top-1 h-8 w-8 rounded-full bg-background border-2 border-muted flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">3. Revalidación</h3>
                    <div className="mt-2 p-4 bg-muted/50 rounded-lg border text-sm text-muted-foreground">
                        <p>
                             GitHub nos confirma el nuevo <code>SHA</code> del archivo. Actualizamos nuestra referencia interna para asegurar que estamos sincronizados con la fuente de verdad.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
            <h3 className="font-semibold text-lg text-yellow-700 dark:text-yellow-500 flex items-center gap-2 mb-2">
                <RefreshCw className="w-5 h-5" /> Conflictos y Cambios Externos
            </h3>
            <p className="text-sm text-muted-foreground">
                Si tú o tu equipo editáis un archivo directamente en GitHub o VS Code, el CMS detectará que su versión en caché es antigua.
                Verás un aviso para <strong>"Sincronizar desde GitHub"</strong>, lo cual descartará tus borradores locales y traerá la última versión del repositorio.
            </p>
        </div>
      </div>

      <div className="flex justify-between pt-8 border-t">
         <Link href="/docs/core-concepts/collections">
           <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
             <ChevronLeft className="mr-2 h-4 w-4" /> Collections
           </Button>
         </Link>
         <Link href="/docs/core-concepts/schemas">
           <Button className="pr-4 hover:pr-6 transition-all">
             Schemas & Tipos <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
         </Link>
      </div>
    </div>
  )
}
