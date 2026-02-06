import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"
import { ChevronRight, ChevronLeft, Server, GitBranch, Database, ShieldCheck, Cpu } from "lucide-react"

export default function ArchitecturePage() {
  return (
    <div className="space-y-10 max-w-3xl pb-10">
      <div className="space-y-4">
         <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Cpu className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-primary">Technical Reference</p>
        </div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Arquitectura del Sistema
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Diseñado para ser rápido sin sacrificar la verdad. Entiende cómo sincronizamos MongoDB y GitHub en tiempo real.
        </p>
      </div>
      
      <div className="space-y-8">
        <section className="space-y-4">
             <h2 className="text-2xl font-bold tracking-tight border-b pb-2">Topología de Datos</h2>
             <div className="flex flex-col gap-4 items-center justify-center p-8 bg-card rounded-xl border border-dashed border-primary/20">
                <div className="flex flex-wrap justify-center items-center gap-4">
                   <div className="flex flex-col items-center p-4 bg-background border rounded-lg shadow-sm w-24">
                      <span className="mb-2 text-2xl">👤</span>
                      <span className="font-bold text-xs text-center">Usuario</span>
                   </div>
                   <div className="h-0.5 w-8 bg-border hidden sm:block"></div>
                   <div className="flex flex-col items-center p-4 bg-primary/10 border border-primary/20 rounded-lg shadow-sm w-28">
                      <Server className="mb-2 h-6 w-6 text-primary" />
                      <span className="font-bold text-xs text-center">Next.js App</span>
                   </div>
                   <div className="h-0.5 w-8 bg-border hidden sm:block"></div>
                   <div className="flex flex-col items-center p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg shadow-sm w-28">
                      <Database className="mb-2 h-6 w-6 text-purple-500" />
                      <span className="font-bold text-xs text-center">MongoDB (Hot Cache)</span>
                   </div>
                   <div className="h-0.5 w-8 bg-border hidden sm:block"></div>
                   <div className="flex flex-col items-center p-4 bg-zinc-900 border border-zinc-700 rounded-lg shadow-sm text-white w-28">
                      <GitBranch className="mb-2 h-6 w-6 text-white" />
                      <span className="font-bold text-xs text-center">GitHub API (Source)</span>
                   </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4 italic bg-muted py-1 px-3 rounded-full">
                    Sincronización bidireccional optimista
                </p>
            </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
                 <h3 className="font-bold text-lg flex items-center gap-2">
                    <Database className="h-4 w-4 text-purple-500" /> MongoDB Cache
                 </h3>
                 <p className="text-sm text-muted-foreground">
                     Almacena una copia indexada de tus archivos parseados. Permite búsquedas instantáneas, filtrado avanzado y borradores que aún no son commits. <strong>Es efímero</strong>: se puede reconstruir desde cero si se borra.
                 </p>
            </div>
            <div className="space-y-2">
                 <h3 className="font-bold text-lg flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-foreground" /> GitHub Source
                 </h3>
                 <p className="text-sm text-muted-foreground">
                     La <strong>única fuente de la verdad</strong>. Un post no existe realmente hasta que está commiteado en tu rama `main`. El CMS respeta siempre el historial de Git.
                 </p>
            </div>
        </div>

        <section className="space-y-4 pt-4">
             <h2 className="text-2xl font-bold tracking-tight border-b pb-2">Gestión de Concurrencia</h2>
             <p className="text-muted-foreground">
                ¿Qué pasa si dos personas editan el mismo archivo? Utilizamos lock optimista basado en SHAs.
             </p>
             <ul className="grid gap-2 text-sm text-muted-foreground border-l-2 border-primary/20 pl-4 py-2">
                <li>1. Al leer un archivo, el CMS guarda su <code>blob_sha</code>.</li>
                <li>2. Al guardar, enviamos el nuevo contenido junto con el <code>last_sha</code> conocido.</li>
                <li>3. La API de GitHub rechaza el commit si el SHA remoto no coincide.</li>
                <li>4. El CMS captura el error y te pide sincronizar antes de guardar.</li>
             </ul>
        </section>
      </div>

      <div className="flex justify-between pt-8 border-t">
         <Link href="/docs/features/json-mode">
           <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
             <ChevronLeft className="mr-2 h-4 w-4" /> Modo JSON
           </Button>
         </Link>
         <Link href="/docs/security">
           <Button className="pr-4 hover:pr-6 transition-all">
             Seguridad <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
         </Link>
      </div>
    </div>
  )
}
