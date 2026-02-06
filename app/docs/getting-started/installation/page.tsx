import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"
import { ChevronRight, ChevronLeft, Github, CheckCircle2 } from "lucide-react"

export default function InstallationPage() {
  return (
    <div className="space-y-10 max-w-3xl pb-10">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Github className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-primary">Getting Started</p>
        </div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Instalación de la GitHub App
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Para que Broslunas CMS pueda leer y escribir en tus repositorios, necesitas instalar nuestra aplicación oficial de GitHub. Este proceso es seguro y te da control total sobre qué repositorios compartes.
        </p>
      </div>
      
      <div className="space-y-8">
        <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b pb-2 flex items-center gap-2">
                <span className="bg-primary text-primary-foreground text-sm rounded-full w-6 h-6 flex items-center justify-center">1</span>
                Iniciar sesión
            </h2>
            <p className="text-muted-foreground">
                Comienza iniciando sesión en Broslunas CMS con tu cuenta de GitHub. Esto nos permite autenticarte, pero <strong>no otorga acceso al código todavía</strong>.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b pb-2 flex items-center gap-2">
                <span className="bg-primary text-primary-foreground text-sm rounded-full w-6 h-6 flex items-center justify-center">2</span>
                Instalar la App
            </h2>
            <p className="text-muted-foreground">
                Dirígete a tu Dashboard. Si aún no has configurado la integración, verás un aviso destacado.
            </p>
            <div className="bg-card p-6 rounded-xl border shadow-sm">
                <p className="font-mono text-sm mb-4 bg-muted p-2 rounded w-fit">Click en "Instalar GitHub App"</p>
                <p className="text-sm text-muted-foreground mb-4">Serás redirigido a GitHub para autorizar la instalación. Tendrás dos opciones:</p>
                <div className="grid gap-3">
                    <div className="p-3 border rounded-lg flex items-start gap-3 bg-background/50">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                            <strong className="block text-sm font-semibold">All repositories</strong>
                            <span className="text-xs text-muted-foreground">Otorga permiso a todos tus repositorios actuales y futuros.</span>
                        </div>
                    </div>
                    <div className="p-3 border rounded-lg flex items-start gap-3 bg-primary/5 border-primary/20">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                            <strong className="block text-sm font-semibold text-primary">Only select repositories (Recomendado)</strong>
                            <span className="text-xs text-muted-foreground">Selecciona manualmente qué repositorios quieres gestionar. Es la opción más segura.</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="space-y-4">
             <h2 className="text-2xl font-bold tracking-tight border-b pb-2 flex items-center gap-2">
                <span className="bg-primary text-primary-foreground text-sm rounded-full w-6 h-6 flex items-center justify-center">3</span>
                Confirmación
            </h2>
             <p className="text-muted-foreground">
              Una vez completada la instalación en GitHub, serás redirigido automáticamente a tu Dashboard. Tus repositorios seleccionados aparecerán listos para ser vinculados.
            </p>
        </section>
      </div>

      <div className="flex justify-between pt-8 border-t">
         <Link href="/docs">
           <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
             <ChevronLeft className="mr-2 h-4 w-4" /> Introducción
           </Button>
         </Link>
         <Link href="/docs/getting-started/linking-repos">
           <Button className="pr-4 hover:pr-6 transition-all">
             Vincular Repositorios <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
         </Link>
      </div>
    </div>
  )
}
