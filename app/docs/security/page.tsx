import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"
import { ChevronLeft, ShieldCheck, Lock, Fingerprint, EyeOff } from "lucide-react"

export default function SecurityPage() {
  return (
    <div className="space-y-10 max-w-3xl pb-10">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <ShieldCheck className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-primary">Technical Reference</p>
        </div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Seguridad y Privacidad
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
           Diseñado bajo el principio de menor privilegio. Tu código nunca es nuestro, solo lo tomamos prestado cuando tú dices.
        </p>
      </div>
      
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
            <div className="border bg-card p-6 rounded-xl">
                <div className="text-primary mb-4 bg-primary/10 w-fit p-2 rounded-lg">
                    <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg mb-2">Tokens Efímeros</h3>
                <p className="text-sm text-muted-foreground">
                    Nunca guardamos tu Access Token personal permanentemente. Usamos tokens de instalación de GitHub Apps que rotan cada hora y solo son válidos para los repositorios que has autorizado.
                </p>
            </div>
             <div className="border bg-card p-6 rounded-xl">
                 <div className="text-primary mb-4 bg-primary/10 w-fit p-2 rounded-lg">
                    <Fingerprint className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg mb-2">Acceso Granular</h3>
                <p className="text-sm text-muted-foreground">
                    A diferencia de OAuth, la GitHub App te permite seleccionar repo por repo. No tienes que darnos las llaves de toda tu organización si solo quieres editar un blog.
                </p>
            </div>
        </div>

        <section className="space-y-4">
             <h2 className="text-2xl font-bold tracking-tight border-b pb-2">Privacidad de Datos</h2>
             <div className="space-y-4">
                 <div className="flex gap-4 items-start">
                    <EyeOff className="w-5 h-5 mt-1 text-muted-foreground" />
                    <div>
                        <h4 className="font-semibold text-foreground">Tu contenido es tuyo</h4>
                        <p className="text-sm text-muted-foreground">
                            No utilizamos tu código para entrenar modelos de IA ni lo compartimos con terceros. La caché de MongoDB está aislada y protegida.
                        </p>
                    </div>
                 </div>
                 <div className="flex gap-4 items-start">
                    <ShieldCheck className="w-5 h-5 mt-1 text-muted-foreground" />
                    <div>
                        <h4 className="font-semibold text-foreground">Revocación Inmediata</h4>
                        <p className="text-sm text-muted-foreground">
                            Al desinstalar la App en GitHub, perdemos acceso instantáneamente. Nuestro sistema detecta la revocación y borra los datos cacheados asociados.
                        </p>
                    </div>
                 </div>
             </div>
        </section>
      </div>

      <div className="flex justify-start mt-12 pt-8 border-t">
         <Link href="/docs/architecture">
           <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
             <ChevronLeft className="mr-2 h-4 w-4" /> Arquitectura
           </Button>
         </Link>
      </div>
    </div>
  )
}
