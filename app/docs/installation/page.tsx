import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"
import { ChevronRight, ChevronLeft } from "lucide-react"

export default function InstallationPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Instalación de la GitHub App
        </h1>
        <p className="text-lg text-muted-foreground">
          Para que Broslunas CMS pueda leer y escribir en tus repositorios, necesitas instalar nuestra aplicación oficial de GitHub.
        </p>
      </div>
      
      <div className="space-y-4 my-8">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          1. Iniciar sesión
        </h2>
        <p className="leading-7">
          Lo primero es iniciar sesión en Broslunas CMS utilizando tu cuenta de GitHub. Esto nos permite identificarte, pero <strong>no nos da acceso a tus repositorios todavía</strong>.
        </p>
      </div>

      <div className="space-y-4 my-8">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          2. Instalar la App
        </h2>
        <p className="leading-7">
          Ve a la sección de <strong>Dashboard</strong>. Si aún no has configurado la App, verás un aviso importante.
        </p>
        <div className="bg-muted p-4 rounded-md border text-sm font-mono">
           Click en "Instalar GitHub App" (o "Install GitHub App")
        </div>
        <p className="leading-7 mt-4">
          Serás redirigido a GitHub. Allí podrás elegir:
        </p>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li><strong>All repositories</strong>: Dar acceso a todos tus repositorios (actuales y futuros).</li>
            <li><strong>Only select repositories</strong>: Seleccionar manualmente qué repositorios quieres gestionar con Broslunas CMS.</li>
        </ul>
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-md text-yellow-700 dark:text-yellow-400">
           <strong>Recomendación:</strong> Selecciona "Only select repositories" y elige solo los proyectos de Astro que vayas a gestionar. Esto es una mejor práctica de seguridad.
        </div>
      </div>

      <div className="space-y-4 my-8">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          3. Confirmación
        </h2>
        <p className="leading-7">
          Una vez instalada, GitHub te redirigirá de vuelta al Dashboard de Broslunas CMS. Ahora verás tus repositorios listados y listos para ser importados.
        </p>
      </div>

      <div className="flex justify-between mt-12">
         <Link href="/docs">
           <Button variant="ghost">
             <ChevronLeft className="mr-2 h-4 w-4" /> Introducción
           </Button>
         </Link>
         <Link href="/docs/linking-repos">
           <Button>
             Vincular Repositorios <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
         </Link>
      </div>
    </div>
  )
}
