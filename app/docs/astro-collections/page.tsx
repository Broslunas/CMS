import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight, ChevronLeft, LayoutTemplate } from "lucide-react"

export default function AstroCollectionsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl flex items-center gap-3">
          <LayoutTemplate className="h-10 w-10 text-primary" /> Astro Content Collections
        </h1>
        <p className="text-lg text-muted-foreground">
          Broslunas CMS está construido sobre los fundamentos de las Content Collections de Astro.
        </p>
      </div>
      
      <div className="space-y-4 my-8">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Estructura de Carpetas
        </h2>
        <p className="leading-7">
          Esperamos que tu repositorio siga la estructura estándar de Astro:
        </p>
        <div className="bg-card p-4 rounded-md border font-mono text-sm leading-relaxed">
            src/<br/>
            Running... ├── content/<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;├── config.ts  <span className="text-muted-foreground">// Definición de esquemas con Zod</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;├── blog/      <span className="text-muted-foreground">// Una colección</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;│   ├── post-1.md<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;│   └── post-2.mdx<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;└── authors/   <span className="text-muted-foreground">// Otra colección</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── pablo.json
        </div>
      </div>

      <div className="space-y-4 my-8">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Soporte de Formatos
        </h2>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li><strong>Markdown (.md)</strong>: Contenido estándar con Frontmatter YAML.</li>
            <li><strong>MDX (.mdx)</strong>: Soportado como texto plano en el editor (próximamente componentes visuales).</li>
            <li><strong>JSON (.json)</strong>: Colecciones de datos puros.</li>
        </ul>
      </div>

      <div className="flex justify-between mt-12">
         <Link href="/docs/linking-repos">
           <Button variant="ghost">
             <ChevronLeft className="mr-2 h-4 w-4" /> Vincular Repos
           </Button>
         </Link>
         <Link href="/docs/git-sync">
           <Button>
             Sincronización Git <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
         </Link>
      </div>
    </div>
  )
}
