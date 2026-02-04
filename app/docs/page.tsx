import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Documentación de Broslunas CMS
        </h1>
        <p className="text-lg text-muted-foreground">
          Bienvenido a la referencia completa para gestionar tus proyectos Astro con Broslunas CMS.
        </p>
      </div>
      
      <div className="rounded-xl border bg-card text-card-foreground shadow pt-6 pb-6 px-8 my-8">
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>Broslunas CMS</strong> es una plataforma de gestión de contenidos (CMS) basada en Git, diseñada específicamente para el ecosistema <strong>Astro</strong>. 
          Permite gestionar tus <em>Content Collections</em> mediante una interfaz visual intuitiva, sincronizando los datos directamente con GitHub.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
        <Link href="/docs/installation" className="block group">
           <div className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
             <h3 className="font-semibold text-lg mb-2 flex items-center group-hover:text-primary transition-colors">
                Primeros Pasos <ChevronRight className="ml-2 h-4 w-4" />
             </h3>
             <p className="text-sm text-muted-foreground">
               Aprende a instalar la GitHub App y conectar tu primer repositorio.
             </p>
           </div>
        </Link>
        <Link href="/docs/astro-collections" className="block group">
           <div className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
             <h3 className="font-semibold text-lg mb-2 flex items-center group-hover:text-primary transition-colors">
                Entendiendo Collections <ChevronRight className="ml-2 h-4 w-4" />
             </h3>
             <p className="text-sm text-muted-foreground">
               Cómo Broslunas CMS lee y respeta tus esquemas de Astro Content.
             </p>
           </div>
        </Link>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          ¿Por qué Broslunas CMS?
        </h2>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            <strong>Sin Base de Datos ("Database-less")</strong>: Tu contenido vive en tu repositorio. MongoDB solo se usa como caché de alto rendimiento.
          </li>
          <li>
            <strong>Flujo Git-based</strong>: Cada vez que guardas, estás haciendo un commit (o preparando uno). Tienes el historial completo.
          </li>
          <li>
            <strong>Soporte Nativo de Astro</strong>: Entendemos la estructura <code>src/content/</code> y los archivos <code>config.ts</code>.
          </li>
          <li>
             <strong>Edición Estructurada</strong>: No más errores de YAML. Editores visuales para JSON complejos y bloques de contenido.
          </li>
        </ul>
      </div>
      
      <div className="flex justify-end mt-12">
         <Link href="/docs/installation">
           <Button>
             Comenzar la Instalación <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
         </Link>
      </div>
    </div>
  )
}
