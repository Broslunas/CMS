import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"
import { ChevronRight, ChevronLeft, LayoutTemplate, FolderTree, FileCode, FileJson } from "lucide-react"

export default function AstroCollectionsPage() {
  return (
    <div className="space-y-10 max-w-3xl pb-10">
      <div className="space-y-4">
         <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <LayoutTemplate className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-primary">Core Concepts</p>
        </div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
           Astro Content Collections
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Broslunas CMS está diseñado para entender nativamente la estructura de tus <strong>Content Collections</strong> de Astro. No necesitas adaptar tu proyecto a nosotros.
        </p>
      </div>
      
      <div className="space-y-8">
        <section className="space-y-4">
             <h2 className="text-2xl font-bold tracking-tight border-b pb-2">Estructura Esperada</h2>
             <p className="text-muted-foreground">
                El sistema busca automáticamente la carpeta <code>src/content</code> en la raíz de tus repositorios vinculados.
             </p>

            <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                <div className="bg-muted px-4 py-2 border-b flex items-center gap-2">
                    <FolderTree className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-mono text-muted-foreground">Estructura de Directorios</span>
                </div>
                <div className="p-6 font-mono text-sm leading-relaxed">
                    <div className="text-primary font-bold">src/</div>
                     <div className="pl-4 border-l ml-[0.3rem]">
                        <div className="text-primary font-bold">content/</div>
                         <div className="pl-4 border-l ml-[0.3rem] space-y-1">
                            <div className="flex items-center gap-2">
                                <FileCode className="w-3 h-3 text-blue-500" />
                                <span>config.ts</span>
                                <span className="text-muted-foreground italic ml-2 text-xs">// Definición Zod de Colecciones</span>
                            </div>
                            <div className="pt-2">
                                <span className="font-semibold text-foreground">blog/</span>
                                <span className="text-muted-foreground text-xs ml-2">(Colección)</span>
                                <div className="pl-4 border-l ml-1 mt-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <FileCode className="w-3 h-3 text-yellow-500" />
                                        <span>post-1.md</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FileCode className="w-3 h-3 text-yellow-500" />
                                        <span>post-2.mdx</span>
                                    </div>
                                </div>
                            </div>
                             <div className="pt-2">
                                <span className="font-semibold text-foreground">authors/</span>
                                <span className="text-muted-foreground text-xs ml-2">(Colección tipo 'data')</span>
                                <div className="pl-4 border-l ml-1 mt-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <FileJson className="w-3 h-3 text-green-500" />
                                        <span>pablo.json</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b pb-2">Formatos Soportados</h2>
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-card">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-yellow-500" /> Markdown / MDX
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Soporte completo para Frontmatter YAML. El contenido MDX se trata como texto enriquecido.
                    </p>
                </div>
                <div className="p-4 border rounded-lg bg-card">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <FileJson className="w-4 h-4 text-green-500" /> JSON
                    </h3>
                   <p className="text-sm text-muted-foreground">
                        Para colecciones de tipo `type: 'data'`. Ideal para configuraciones globales, menús, o listas de autores.
                    </p>
                </div>
            </div>
        </section>
      </div>

      <div className="flex justify-between pt-8 border-t">
         <Link href="/docs/getting-started/linking-repos">
           <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
             <ChevronLeft className="mr-2 h-4 w-4" /> Vincular Repos
           </Button>
         </Link>
         <Link href="/docs/core-concepts/git-sync">
           <Button className="pr-4 hover:pr-6 transition-all">
             Sincronización Git <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
         </Link>
      </div>
    </div>
  )
}
