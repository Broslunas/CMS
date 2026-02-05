import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"
import { ChevronRight, ChevronLeft, Server, GitBranch, Database } from "lucide-react"

export default function ArchitecturePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Arquitectura del Sistema
        </h1>
        <p className="text-lg text-muted-foreground">
          Entiende cómo Broslunas CMS sincroniza tus datos entre MongoDB y GitHub para ofrecer velocidad y fiabilidad.
        </p>
      </div>
      
      <div className="space-y-4 my-8">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Diagrama de Flujo
        </h2>
        <div className="flex flex-col gap-4 items-center justify-center p-8 bg-muted/30 rounded-xl border border-dashed border-primary/20">
            <div className="flex items-center gap-4">
               <div className="flex flex-col items-center p-4 bg-card border rounded-lg shadow-sm">
                  <span className="mb-2 text-3xl">👤</span>
                  <span className="font-bold text-sm">Usuario</span>
               </div>
               <div className="h-0.5 w-12 bg-border"></div>
               <div className="flex flex-col items-center p-4 bg-primary/10 border border-primary/20 rounded-lg shadow-sm">
                  <Server className="mb-2 h-8 w-8 text-primary" />
                  <span className="font-bold text-sm">Next.js App</span>
               </div>
               <div className="h-0.5 w-12 bg-border"></div>
               <div className="flex flex-col items-center p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg shadow-sm">
                  <Database className="mb-2 h-8 w-8 text-purple-500" />
                  <span className="font-bold text-sm">MongoDB (Cache)</span>
               </div>
               <div className="h-0.5 w-12 bg-border"></div>
               <div className="flex flex-col items-center p-4 bg-zinc-900 border border-zinc-700 rounded-lg shadow-sm text-white">
                  <GitBranch className="mb-2 h-8 w-8 text-white" />
                  <span className="font-bold text-sm">GitHub API</span>
               </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4 italic">
                Flujo de sincronización bidireccional
            </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 my-8">
         <div className="space-y-2">
             <h3 className="font-bold text-xl flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-500" /> MongoDB
             </h3>
             <p className="text-sm text-muted-foreground">
                 Actúa como una <strong>capa de caché y estado</strong>. Almacena una copia de tus archivos Markdown parseados a JSON. Esto permite búsquedas instantáneas y edición rápida sin esperar a la API de GitHub.
             </p>
         </div>
         <div className="space-y-2">
             <h3 className="font-bold text-xl flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-foreground" /> GitHub API
             </h3>
             <p className="text-sm text-muted-foreground">
                 La <strong>fuente de la verdad</strong>. Cuando guardas un post, puedes elegir "Guardar" (solo DB) o "Guardar y Commitear" (Sync a GitHub). La importación inicial trae los datos desde aquí.
             </p>
         </div>
         <div className="space-y-2">
             <h3 className="font-bold text-xl flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" /> Astro Schemas
             </h3>
             <p className="text-sm text-muted-foreground">
                 El CMS respeta la estructura de carpetas de Astro (<code>src/content/</code>). Parseamos el Frontmatter (YAML) y el Body (Markdown) por separado.
             </p>
         </div>
      </div>

      <div className="space-y-4 my-8">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Gestión de Conflictos
        </h2>
        <p className="leading-7">
          Para evitar sobrescribir cambios, utilizamos el <strong>SHA</strong> de Git.
        </p>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>Al leer un archivo, guardamos su SHA actual.</li>
            <li>Al intentar escribir, enviamos ese SHA a GitHub.</li>
            <li>Si el SHA ha cambiado en el remoto (alguien más editó el archivo), GitHub rechaza el commit.</li>
            <li>El CMS te avisará para que actualices antes de guardar.</li>
        </ul>
      </div>

      <div className="flex justify-between mt-12">
         <Link href="/docs/json-mode">
           <Button variant="ghost">
             <ChevronLeft className="mr-2 h-4 w-4" /> Modo JSON
           </Button>
         </Link>
         <Link href="/docs">
           <Button variant="outline">
             Volver al Inicio
           </Button>
         </Link>
      </div>
    </div>
  )
}
