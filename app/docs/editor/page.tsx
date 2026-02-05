import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"
import { ChevronRight, ChevronLeft, PenTool } from "lucide-react"

export default function EditorPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl flex items-center gap-3">
          <PenTool className="h-10 w-10 text-primary" /> Editor Visual
        </h1>
        <p className="text-lg text-muted-foreground">
          Una experiencia de escritura libre de distracciones y código ruidoso.
        </p>
      </div>
      
      <div className="space-y-4 my-8">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Interfaz de Edición
        </h2>
        <p className="leading-7">
          El editor se divide en dos áreas principales:
        </p>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li><strong>Panel Lateral (Metadatos)</strong>: Aquí gestionas todo lo relacionado con el Frontmatter: título, fecha, tags, imagen destacada, etc.</li>
            <li><strong>Área Principal (Contenido)</strong>: Un editor Markdown con resaltado de sintaxis, ideal para escribir el cuerpo del post.</li>
        </ul>
      </div>

      <div className="space-y-4 my-8">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Añadir Nuevos Campos
        </h2>
        <p className="leading-7">
          ¿Necesitas un nuevo campo en tu Frontmatter? No necesitas editar código. 
          Simplemente pulsa el botón <strong>"Añadir Campo Base"</strong> en la barra lateral, escribe el nombre (ej: <code>author</code>) y el valor inicial. El sistema actualizará el esquema automáticamente.
        </p>
      </div>

      <div className="flex justify-between mt-12">
         <Link href="/docs/schemas">
           <Button variant="ghost">
             <ChevronLeft className="mr-2 h-4 w-4" /> Schemas
           </Button>
         </Link>
         <Link href="/docs/permissions">
           <Button>
             Permisos <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
         </Link>
      </div>
    </div>
  )
}
