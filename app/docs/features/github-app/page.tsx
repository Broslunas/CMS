
import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"
import { ChevronRight, ChevronLeft, Github, Key, CheckCircle } from "lucide-react"

export default function GitHubAppPage() {
  return (
    <div className="space-y-10 max-w-3xl pb-10">
      <div className="space-y-4">
         <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-black rounded-lg text-white">
                <Github className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-black dark:text-gray-300">Integrations</p>
        </div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Integración GitHub App
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
           La pieza central del CMS. Gestiona commits, permisos y despliegues con nuestra aplicación oficial de GitHub.
        </p>
      </div>
      
      <div className="space-y-8">
        <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b pb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" /> Instalación
            </h2>
             <div className="flex flex-col gap-4">
               <p className="text-muted-foreground">
                  Para poder leer y escribir en tus repositorios, necesitas instalar la <strong>Broslunas CMS GitHub App</strong> en tu cuenta u organización.
               </p>
               <ol className="list-decimal list-inside space-y-2 ml-2 marker:text-primary">
                    <li>Ve a <strong>Settings &gt; Integrations</strong> en el dashboard.</li>
                    <li>Haz clic en el botón "Install GitHub App".</li>
                    <li>Selecciona los repositorios a los que quieres dar acceso (o "All Repositories").</li>
                    <li>Confirma la instalación.</li>
               </ol>
             </div>
             
             <div className="mt-4 p-4 bg-muted border rounded-lg">
                <p className="text-sm">
                    <strong>Status:</strong> Puedes verificar si la app está instalada correctamente buscando el indicador <span className="text-green-600 font-semibold text-xs bg-green-100 px-1.5 py-0.5 rounded ml-1">Installed</span> en la página de integraciones.
                </p>
             </div>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b pb-2 flex items-center gap-2">
                <Key className="w-5 h-5 text-purple-600" /> Permisos & Seguridad
            </h2>
            <p className="text-muted-foreground">
                A diferencia de los tokens personales (PAT) o OAuth Apps tradicionales, la GitHub App ofrece permisos granulares y mayor seguridad:
            </p>
            <ul className="grid gap-3 sm:grid-cols-2 mt-2">
                <li className="p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                    <h4 className="font-semibold mb-1">Acceso Limitado</h4>
                    <p className="text-sm text-muted-foreground">Solo accedemos a los repositorios que tú seleccionas explícitamente.</p>
                </li>
                 <li className="p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                    <h4 className="font-semibold mb-1">Tokens de Corta Vida</h4>
                    <p className="text-sm text-muted-foreground">Usamos tokens que expiran en 1 hora, reduciendo el riesgo de filtraciones.</p>
                </li>
                 <li className="p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                    <h4 className="font-semibold mb-1">Actuamos en tu nombre</h4>
                    <p className="text-sm text-muted-foreground">Los commits aparecerán como hechos por ti, pero "authored by Broslunas CMS Bot".</p>
                </li>
            </ul>
        </section>
      </div>

      <div className="flex justify-between pt-8 border-t">
         <Link href="/docs/features/visual-editor">
            <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
                <ChevronLeft className="mr-2 h-4 w-4" /> Editorial Visual
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
