import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"
import { ChevronRight, ChevronLeft, Link as LinkIcon } from "lucide-react"

export default function LinkingReposPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl flex items-center gap-3">
          <LinkIcon className="h-10 w-10 text-primary" /> Vincular Repositorios
        </h1>
        <p className="text-lg text-muted-foreground">
          Cómo conectar tus proyectos de GitHub existentes a Broslunas CMS.
        </p>
      </div>
      
      <div className="space-y-4 my-8">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          El proceso de importación
        </h2>
        <p className="leading-7">
          Una vez instalada la GitHub App, el sistema <strong>no importa automáticamente</strong> todo tu contenido. Tú decides qué repositorios de tu lista permitida quieres gestionar activamente.
        </p>
        <div className="my-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h4 className="font-bold flex items-center gap-2 mb-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">1</span>
                Detección Automática
            </h4>
            <p className="text-sm">
                Escaneamos tus repositorios en busca de carpetas <code>src/content</code> que indiquen un proyecto Astro compatible.
            </p>
        </div>
        <div className="my-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h4 className="font-bold flex items-center gap-2 mb-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">2</span>
                Importación Inicial
            </h4>
            <p className="text-sm">
                Al pulsar "Importar", descargamos tus archivos <code>.md</code> y <code>.mdx</code> y creamos una copia en nuestra base de datos caché. Esto puede tardar unos segundos dependiendo del tamaño del repo.
            </p>
        </div>
      </div>

      <div className="space-y-4 my-8">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Filtrado de Archivos
        </h2>
        <p className="leading-7">
          Por defecto, importamos cualquier archivo Markdown dentro de las colecciones. Si deseas excluir ciertos archivos o carpetas, puedes mencionarlo en la configuración (Feature en desarrollo: .cmsignore).
        </p>
      </div>

      <div className="flex justify-between mt-12">
         <Link href="/docs/installation">
           <Button variant="ghost">
             <ChevronLeft className="mr-2 h-4 w-4" /> Instalación
           </Button>
         </Link>
         <Link href="/docs/astro-collections">
           <Button>
             Astro Collections <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
         </Link>
      </div>
    </div>
  )
}
