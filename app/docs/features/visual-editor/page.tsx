import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"
import { ChevronRight, ChevronLeft, PenTool, LayoutPanelLeft, Edit3, Image as ImageIcon } from "lucide-react"

export default function VisualEditorPage() {
  return (
    <div className="space-y-10 max-w-3xl pb-10">
      <div className="space-y-4">
         <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <PenTool className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-primary">Features</p>
        </div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Editor Visual
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Una experiencia de escritura inmersiva que separa el contenido de la configuración. Escribe en Markdown/MDX sin distracciones.
        </p>
      </div>
      
      <div className="space-y-8">
        <section className="grid gap-6 md:grid-cols-2">
            <div className="border bg-card rounded-xl p-6">
                 <h3 className="flex items-center gap-2 font-semibold text-lg mb-3">
                    <LayoutPanelLeft className="w-5 h-5 text-primary" /> Panel de Metadatos
                 </h3>
                 <p className="text-sm text-muted-foreground mb-4">
                    Todo el <strong>Frontmatter</strong> de tu archivo vive en la barra lateral. Edita títulos, fechas, autores y tags sin tocar código.
                 </p>
                 <ul className="text-xs space-y-2 text-muted-foreground list-disc pl-4">
                    <li>Validación de tipos automática</li>
                    <li>Selectores de fecha inteligentes</li>
                    <li>Soporte para arrays y listas</li>
                 </ul>
            </div>
            <div className="border bg-card rounded-xl p-6">
                 <h3 className="flex items-center gap-2 font-semibold text-lg mb-3">
                    <Edit3 className="w-5 h-5 text-primary" /> Área de Contenido
                 </h3>
                 <p className="text-sm text-muted-foreground mb-4">
                    Un editor Markdown robusto con resaltado de sintaxis. Soporta MDX, por lo que puedes escribir componentes de React directamente.
                 </p>
                  <ul className="text-xs space-y-2 text-muted-foreground list-disc pl-4">
                    <li>Live Preview (Próximamente)</li>
                    <li>Sintaxis GFM (GitHub Flavored Markdown)</li>
                 </ul>
            </div>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b pb-2">Gestión de Campos</h2>
            <p className="text-muted-foreground">
                El editor es flexible. Si tu archivo necesita un nuevo campo en el Frontmatter que no existe en el esquema, puedes añadirlo al vuelo.
            </p>
            <div className="bg-muted border rounded-lg p-4 flex items-center gap-4">
                <div className="bg-background border px-3 py-1 rounded text-sm font-medium shadow-sm">
                    + Add Field
                </div>
                <span className="text-sm text-muted-foreground">
                    Pulsa este botón en la sidebar para inyectar nuevas propiedades al post.
                </span>
            </div>
        </section>

        <section className="space-y-4">
             <h2 className="text-2xl font-bold tracking-tight border-b pb-2">Media & Assets</h2>
             <p className="text-muted-foreground">
                Sube imágenes directamente desde el editor. Las imágenes se guardan en la carpeta <code>public/</code> de tu repositorio automáticamente.
             </p>
             <div className="flex items-center gap-2 text-sm text-primary font-medium bg-primary/10 w-fit px-3 py-1.5 rounded-full">
                <ImageIcon className="w-4 h-4" /> Drag & Drop soportado
             </div>
        </section>
      </div>

      <div className="flex justify-between pt-8 border-t">
         <Link href="/docs/core-concepts/schemas">
           <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
             <ChevronLeft className="mr-2 h-4 w-4" /> Schemas
           </Button>
         </Link>
         <Link href="/docs/features/vercel">
           <Button className="pr-4 hover:pr-6 transition-all">
             Integración Vercel <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
         </Link>
      </div>
    </div>
  )
}
