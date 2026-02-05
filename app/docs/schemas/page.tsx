import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"
import { ChevronRight, ChevronLeft, Braces } from "lucide-react"

export default function SchemasPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl flex items-center gap-3">
          <Braces className="h-10 w-10 text-primary" /> Schemas & Tipos
        </h1>
        <p className="text-lg text-muted-foreground">
          Broslunas CMS infiere los campos de edición basándose en tus datos.
        </p>
      </div>
      
      <div className="space-y-4 my-8">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Inferencia de Tipos
        </h2>
        <p className="leading-7">
          Actualmente, el CMS analiza el contenido actual de tus archivos Markdown (Frontmatter) para determinar qué campos mostrar en el editor.
        </p>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left my-4">
                <thead className="bg-muted text-muted-foreground font-medium">
                    <tr>
                        <th className="px-4 py-2">Valor en YAML</th>
                        <th className="px-4 py-2">Input Generado</th>
                    </tr>
                </thead>
                <tbody className="divide-y border-t border-b">
                    <tr>
                        <td className="px-4 py-2 font-mono">title: "Hola"</td>
                        <td className="px-4 py-2">Input de Texto</td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 font-mono">draft: true</td>
                        <td className="px-4 py-2">Checkbox (Switch)</td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 font-mono">tags: ["a", "b"]</td>
                        <td className="px-4 py-2">Editor de Arrays</td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 font-mono">date: 2024-01-01</td>
                        <td className="px-4 py-2">Selector de Fecha</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>

      <div className="space-y-4 my-8">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Próximamente: Integración con Zod
        </h2>
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-md">
            <p className="text-sm">
                Estamos trabajando en leer directamente tu archivo <code>src/content/config.ts</code>. Esto permitirá:
            </p>
            <ul className="ml-6 mt-2 list-disc text-sm [&>li]:mt-1">
                <li>Validación en tiempo real antes de guardar.</li>
                <li>Inputs obligatorios marcados con asterisco.</li>
                <li>Soporte para <code>z.enum()</code> como selectores desplegables.</li>
            </ul>
        </div>
      </div>

      <div className="flex justify-between mt-12">
         <Link href="/docs/git-sync">
           <Button variant="ghost">
             <ChevronLeft className="mr-2 h-4 w-4" /> Sincronización
           </Button>
         </Link>
         <Link href="/docs/editor">
           <Button>
             Editor Visual <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
         </Link>
      </div>
    </div>
  )
}
