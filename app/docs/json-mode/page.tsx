import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight, ChevronLeft, FileJson } from "lucide-react"

export default function JSONModePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl flex items-center gap-3">
          <FileJson className="h-10 w-10 text-primary" /> Modo JSON
        </h1>
        <p className="text-lg text-muted-foreground">
          Edición avanzada para estructuras de datos complejas dentro de tus posts de Astro.
        </p>
      </div>
      
      <div className="space-y-4 my-8">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          ¿Qué es el Modo JSON?
        </h2>
        <p className="leading-7">
          A veces, el Frontmatter de tus posts contiene estructuras anidadas o arrays de objetos que son difíciles de editar con inputs estándar. 
          El <strong>Modo JSON</strong> te permite manipular estos datos directamente o utilizar nuestros editores visuales especializados para campos específicos.
        </p>
      </div>

      <div className="space-y-4 my-8">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Editores Especializados
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2 mt-6">
            <div className="border rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <FileJson size={100} />
                </div>
                <h3 className="font-bold text-xl mb-4">Transcription Editor</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Diseñado para podcasts o entrevistas. Permite añadir bloques de tiempo y texto fácilmente.
                </p>
                <div className="bg-muted p-4 rounded text-xs font-mono">
{`transcription: [
  { time: "00:00", text: "Hola..." },
  { time: "00:15", text: "..." }
]`}
                </div>
            </div>

            <div className="border rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <FileJson size={100} />
                </div>
                <h3 className="font-bold text-xl mb-4">Sections Editor</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Ideal para landing pages o posts estructurados con múltiples secciones.
                </p>
                <div className="bg-muted p-4 rounded text-xs font-mono">
{`sections: [
  { title: "Intro", content: "..." },
  { title: "Detail", content: "..." }
]`}
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-4 my-8">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Importación de JSON
        </h2>
        <p className="leading-7">
          Si ya tienes los datos en otro lugar, puedes usar el botón <strong>"Import JSON"</strong> dentro de los modales de edición para pegar una estructura JSON completa. 
          El sistema validará que el formato sea correcto antes de guardarlo.
        </p>
      </div>

      <div className="flex justify-between mt-12">
         <Link href="/docs/permissions">
           <Button variant="ghost">
             <ChevronLeft className="mr-2 h-4 w-4" /> Permisos
           </Button>
         </Link>
         <Link href="/docs/architecture">
           <Button>
             Arquitectura <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
         </Link>
      </div>
    </div>
  )
}
