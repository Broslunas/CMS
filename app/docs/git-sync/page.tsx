import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"
import { ChevronRight, ChevronLeft, GitBranch, RefreshCw } from "lucide-react"

export default function GitSyncPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl flex items-center gap-3">
          <GitBranch className="h-10 w-10 text-primary" /> Sincronización Git
        </h1>
        <p className="text-lg text-muted-foreground">
          Cada acción en el CMS es una acción en tu repositorio.
        </p>
      </div>
      
      <div className="space-y-4 my-8">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Ciclo de Vida del Contenido
        </h2>
        
        <div className="grid gap-4 mt-6">
            <div className="flex gap-4 items-start p-4 border rounded-lg">
                <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded text-xl">📝</div>
                <div>
                    <h4 className="font-bold">1. Borrador (Draft)</h4>
                    <p className="text-sm text-muted-foreground">
                        Cuando editas en el CMS y pulsas "Guardar", los cambios se guardan en nuestra caché de MongoDB. No se toca GitHub. Esto es ideal para ediciones rápidas sin llenar tu historial de commits basura.
                    </p>
                </div>
            </div>
            <div className="flex gap-4 items-start p-4 border rounded-lg bg-primary/5 border-primary/20">
                <div className="bg-primary/20 p-2 rounded text-xl">🚀</div>
                <div>
                    <h4 className="font-bold text-primary">2. Commit (Sync)</h4>
                    <p className="text-sm text-muted-foreground">
                        Al pulsar "Guardar y Commitear", generamos el archivo físico (Markdown/JSON) y lo enviamos a la API de GitHub. Se crea un commit real en tu rama main (o la configurada).
                    </p>
                </div>
            </div>
            <div className="flex gap-4 items-start p-4 border rounded-lg">
                <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded text-xl">🔄</div>
                <div>
                    <h4 className="font-bold">3. Revalidación</h4>
                    <p className="text-sm text-muted-foreground">
                        GitHub nos devuelve el nuevo SHA del archivo. Actualizamos nuestra caché y marcamos el post como "Synced".
                    </p>
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-4 my-8">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight flex items-center gap-2">
           <RefreshCw className="h-6 w-6" /> Pull Changes
        </h2>
        <p className="leading-7">
          ¿Qué pasa si editas directamente en VS Code o GitHub? El CMS detectará que el SHA remoto es diferente al local.
          Verás un botón para <strong>"Sincronizar desde GitHub"</strong> que se traerá los últimos cambios, sobrescribiendo el borrador local.
        </p>
      </div>

      <div className="flex justify-between mt-12">
         <Link href="/docs/astro-collections">
           <Button variant="ghost">
             <ChevronLeft className="mr-2 h-4 w-4" /> Astro Collections
           </Button>
         </Link>
         <Link href="/docs/schemas">
           <Button>
             Schemas & Tipos <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
         </Link>
      </div>
    </div>
  )
}
