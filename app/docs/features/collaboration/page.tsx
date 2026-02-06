import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"
import { ChevronRight, ChevronLeft, Users, Shield, UserPlus, Eye, Edit } from "lucide-react"

export default function CollaborationPage() {
  return (
    <div className="space-y-10 max-w-3xl pb-10">
      <div className="space-y-4">
         <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Users className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-primary">Features</p>
        </div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Colaboración y Permisos
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Invita a tu equipo a gestionar el contenido sin darles acceso total a tu cuenta de GitHub.
        </p>
      </div>
      
      <div className="space-y-8">
        <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b pb-2">Roles de Usuario</h2>
            <div className="grid gap-4 sm:grid-cols-3">
                 <div className="border bg-card rounded-lg p-6 hover:border-primary/50 transition-colors">
                    <div className="mb-3 p-2 bg-muted w-fit rounded-md"><Eye className="w-5 h-5" /></div>
                    <h3 className="font-bold text-lg">Viewer</h3>
                    <p className="text-sm text-muted-foreground mt-2">Solo lectura. Puede ver contenido y estado de deploys, pero no editar.</p>
                 </div>
                 <div className="border bg-card rounded-lg p-6 hover:border-primary/50 transition-colors">
                     <div className="mb-3 p-2 bg-muted w-fit rounded-md"><Edit className="w-5 h-5" /></div>
                    <h3 className="font-bold text-lg">Editor</h3>
                    <p className="text-sm text-muted-foreground mt-2">Puede crear, editar y eliminar posts. No puede cambiar configuraciones del repo.</p>
                 </div>
                 <div className="border bg-card rounded-lg p-6 hover:border-primary/50 transition-colors">
                     <div className="mb-3 p-2 bg-muted w-fit rounded-md"><Shield className="w-5 h-5" /></div>
                    <h3 className="font-bold text-lg">Admin</h3>
                    <p className="text-sm text-muted-foreground mt-2">Control total. Puede invitar a otros usuarios y cambiar settings.</p>
                 </div>
            </div>
        </section>

        <section className="space-y-4">
             <h2 className="text-2xl font-bold tracking-tight border-b pb-2">Cómo invitar colaboradores</h2>
             <ol className="list-decimal list-inside space-y-4 text-muted-foreground">
                <li className="p-4 border rounded-lg bg-card">
                    <strong className="text-foreground">Ve a Configuración</strong>: Entra en el dashboard del repositorio y busca la pestaña "Settings".
                </li>
                <li className="p-4 border rounded-lg bg-card">
                    <strong className="text-foreground">Introduce el Email</strong>: El usuario debe tener una cuenta creada en Broslunas CMS.
                </li>
                <li className="p-4 border rounded-lg bg-card">
                    <strong className="text-foreground">Selecciona el Rol</strong>: Elige el nivel de acceso apropiado y envía la invitación.
                </li>
             </ol>
        </section>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                <UserPlus className="w-5 h-5 text-primary" /> Abstracción de GitHub
            </h3>
            <p className="text-sm text-muted-foreground">
                Tus editores <strong>no necesitan tener cuenta en GitHub</strong> ni permisos en el repositorio. 
                Broslunas CMS actúa como un proxy seguro, realizando los cambios en nombre de la App instalada por el administrador.
            </p>
        </div>
      </div>

      <div className="flex justify-between pt-8 border-t">
         <Link href="/docs/features/vercel">
           <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
             <ChevronLeft className="mr-2 h-4 w-4" /> Vercel Integration
           </Button>
         </Link>
         <Link href="/docs/features/version-control">
           <Button className="pr-4 hover:pr-6 transition-all">
             Version Control <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
         </Link>
      </div>
    </div>
  )
}
