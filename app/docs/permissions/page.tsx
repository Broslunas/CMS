import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight, ChevronLeft } from "lucide-react"

export default function PermissionsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Gestión de Permisos
        </h1>
        <p className="text-lg text-muted-foreground">
          Comparte tus repositorios con otros usuarios y controla quién puede editar, crear o gestionar el contenido.
        </p>
      </div>
      
      <div className="space-y-4 my-8">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Roles de Usuario
        </h2>
        <p className="leading-7">
          Actualmente, Broslunas CMS soporta un sistema de permisos granular. Al compartir un repositorio, puedes asignar los siguientes permisos:
        </p>
        
        <div className="grid gap-6 md:grid-cols-3 mt-6">
            <div className="border rounded-lg p-6 bg-card">
                <h3 className="font-bold text-xl mb-2">👁️ View (Ver)</h3>
                <p className="text-sm text-muted-foreground">
                    El usuario puede ver el contenido del repositorio pero no puede realizar cambios. Ideal para revisores o "stakeholders".
                </p>
                <div className="mt-4 text-xs font-mono bg-muted p-2 rounded">
                    permission: "view"
                </div>
            </div>
            
            <div className="border rounded-lg p-6 bg-card">
                <h3 className="font-bold text-xl mb-2">✏️ Manage (Gestionar)</h3>
                <p className="text-sm text-muted-foreground">
                    Acceso completo para editar post existentes y eliminar contenido. Es el permiso estándar de editor.
                </p>
                <div className="mt-4 text-xs font-mono bg-muted p-2 rounded">
                    permission: "manage"
                </div>
            </div>

            <div className="border rounded-lg p-6 bg-card">
                <h3 className="font-bold text-xl mb-2">➕ Create (Crear)</h3>
                <p className="text-sm text-muted-foreground">
                    Permite crear nuevos posts desde cero. A menudo se combina con "Manage".
                </p>
                <div className="mt-4 text-xs font-mono bg-muted p-2 rounded">
                    permission: "create"
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-4 my-8">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Cómo compartir un repositorio
        </h2>
        <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
            <li>Navega al <strong>Dashboard</strong>.</li>
            <li>Localiza la tarjeta del repositorio que deseas compartir.</li>
            <li>Haz clic en el icono de <strong>"Compartir"</strong> <span className="text-muted-foreground text-xs">(icono de usuarios)</span>.</li>
            <li>Introduce el <strong>email</strong> del usuario con el que quieres compartir (debe estar registrado en Broslunas CMS).</li>
            <li>Selecciona los permisos (View, Manage, Create).</li>
            <li>Haz clic en <strong>Compartir</strong>.</li>
        </ol>
      </div>

      <div className="p-4 bg-muted border rounded-md my-8">
        <h4 className="font-semibold mb-2">Nota sobre GitHub</h4>
        <p className="text-sm text-muted-foreground">
           Los permisos en Broslunas CMS son <em>virtuales</em> y funcionan sobre la capa de aplicación. 
           Para que un colaborador pueda hacer commits reales, la GitHub App utiliza el token del 
           <strong>Administrador del repositorio</strong> (quien instaló la App) para realizar los cambios en nombre de los editores. 
           Esto significa que no necesitas dar acceso de escritura en GitHub a cada redactor, simplificando la gestión.
        </p>
      </div>

      <div className="flex justify-between mt-12">
         <Link href="/docs/editor">
           <Button variant="ghost">
             <ChevronLeft className="mr-2 h-4 w-4" /> Editor Visual
           </Button>
         </Link>
         <Link href="/docs/json-mode">
           <Button>
             Modo JSON <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
         </Link>
      </div>
    </div>
  )
}
