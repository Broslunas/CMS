import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"
import { ChevronRight, ChevronLeft, History, GitCompare, RotateCcw } from "lucide-react"

export default function VersionControlPage() {
  return (
    <div className="space-y-10 max-w-3xl pb-10">
      <div className="space-y-4">
         <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <History className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-primary">Features</p>
        </div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Control de Versiones Gráfico
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
           No temas romper nada. Visualiza tus cambios antes de guardar y viaja en el tiempo si te equivocas.
        </p>
      </div>
      
      <div className="space-y-8">
        <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b pb-2 flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-primary" /> Visual Diff
            </h2>
            <p className="text-muted-foreground">
                Antes de commitear, siempre querrás saber qué ha cambiado exactamente. Nuestro sistema de Diff visual te muestra las modificaciones línea por línea.
            </p>
            <div className="bg-card border rounded-lg p-4 font-mono text-sm">
                <div className="text-red-500 bg-red-500/10 px-2 py-0.5 rounded w-fit mb-1">- title: "El antiguo título"</div>
                <div className="text-green-500 bg-green-500/10 px-2 py-0.5 rounded w-fit">+ title: "El nuevo y mejorado título"</div>
            </div>
             <p className="text-xs text-muted-foreground mt-2">
                Accesible desde el botón "Ver Cambios" en la barra de guardado.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b pb-2 flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-primary" /> Historial de Commits
            </h2>
             <p className="text-muted-foreground">
                Cada vez que guardas, creamos un punto de restauración (commit) en GitHub. En la pestaña "Historial" del editor puedes ver:
            </p>
            <ul className="grid gap-2 mt-4">
                <li className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-600 flex items-center justify-center text-xs">JD</div>
                         <div>
                             <p className="text-sm font-medium">Update intro text</p>
                             <p className="text-xs text-muted-foreground">Hace 2 horas por John Doe</p>
                         </div>
                    </div>
                    <Button variant="outline" size="sm">Restaurar</Button>
                </li>
                 <li className="flex items-center justify-between p-3 border rounded-lg bg-muted/30 opacity-60">
                    <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center text-xs">ME</div>
                         <div>
                             <p className="text-sm font-medium">Initial commit</p>
                             <p className="text-xs text-muted-foreground">Hace 5 días por Mi</p>
                         </div>
                    </div>
                    <Button variant="ghost" size="sm" disabled>Actual</Button>
                </li>
            </ul>
             <p className="text-sm text-yellow-600 dark:text-yellow-500 mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <strong>Nota:</strong> Al restaurar una versión, se crea un <em>nuevo commit</em> que revierte los cambios. Nunca borramos la historia, solo añadimos encima.
            </p>
        </section>
      </div>

      <div className="flex justify-between pt-8 border-t">
         <Link href="/docs/features/collaboration">
           <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
             <ChevronLeft className="mr-2 h-4 w-4" /> Colaboración
           </Button>
         </Link>
         <Link href="/docs/features/ai">
           <Button className="pr-4 hover:pr-6 transition-all">
             Gemini AI <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
         </Link>
      </div>
    </div>
  )
}
