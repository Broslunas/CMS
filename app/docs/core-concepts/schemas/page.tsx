import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"
import { ChevronRight, ChevronLeft, Braces, Wand2, Calendar, List, ToggleRight, Type } from "lucide-react"

export default function SchemasPage() {
  return (
    <div className="space-y-10 max-w-3xl pb-10">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Braces className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-primary">Core Concepts</p>
        </div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
           Schemas & Tipos
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
           Cómo Broslunas CMS sabe qué campos mostrar en el editor.
        </p>
      </div>
      
      <div className="space-y-8">
        <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b pb-2 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-primary" /> Inferencia Automática
            </h2>
            <p className="text-muted-foreground">
                Actualmente, el sistema utiliza un motor de inferencia inteligente. Cuando abres un archivo, analizamos su contenido (Frontmatter o JSON) para determinar dinámicamente qué inputs mostrar.
            </p>

            <div className="grid gap-3 mt-4">
                <div className="flex items-center justify-between p-4 bg-card border rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded"><Type className="w-4 h-4" /></div>
                        <code className="text-sm font-mono">title: "Hola Mundo"</code>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Input de Texto</span>
                </div>
                 <div className="flex items-center justify-between p-4 bg-card border rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded"><ToggleRight className="w-4 h-4" /></div>
                        <code className="text-sm font-mono">draft: true</code>
                    </div>
                     <span className="text-sm font-medium text-muted-foreground">Switch / Checkbox</span>
                </div>
                 <div className="flex items-center justify-between p-4 bg-card border rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded"><List className="w-4 h-4" /></div>
                        <code className="text-sm font-mono">tags: ["react", "astro"]</code>
                    </div>
                     <span className="text-sm font-medium text-muted-foreground">Editor de Arrays</span>
                </div>
                 <div className="flex items-center justify-between p-4 bg-card border rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded"><Calendar className="w-4 h-4" /></div>
                         <code className="text-sm font-mono">date: 2024-05-10</code>
                    </div>
                     <span className="text-sm font-medium text-muted-foreground">Selector de Fecha</span>
                </div>
            </div>
        </section>

        <section className="space-y-4 pt-6">
            <div className="relative rounded-xl border bg-gradient-to-br from-primary/10 via-background to-background p-8 overflow-hidden">
                <div className="relative z-10">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground mb-4 inline-block">Proximamente</span>
                    <h2 className="text-2xl font-bold tracking-tight mb-2">Integración Nativa con Zod</h2>
                    <p className="text-muted-foreground max-w-lg">
                        Estamos trabajando en un parser para leer tu archivo <code>src/content/config.ts</code> directamente. Esto permitirá:
                    </p>
                    <ul className="grid gap-2 mt-4 text-sm font-medium">
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Validaciones estrictas antes de guardar.</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Campos obligatorios vs opcionales.</li>
                         <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Enums convertidos a Selectores desplegables.</li>
                    </ul>
                </div>
                <Braces className="absolute -right-10 -bottom-10 h-64 w-64 text-primary/5 rotate-12" />
            </div>
        </section>
      </div>

      <div className="flex justify-between pt-8 border-t">
         <Link href="/docs/core-concepts/git-sync">
           <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
             <ChevronLeft className="mr-2 h-4 w-4" /> Sincronización
           </Button>
         </Link>
         <Link href="/docs/features/visual-editor">
           <Button className="pr-4 hover:pr-6 transition-all">
             Editor Visual <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
         </Link>
      </div>
    </div>
  )
}
