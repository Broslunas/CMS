import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"
import { ChevronLeft, ShieldCheck } from "lucide-react"

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl flex items-center gap-3">
          <ShieldCheck className="h-10 w-10 text-primary" /> Seguridad y Privacidad
        </h1>
        <p className="text-lg text-muted-foreground">
          Cómo protegemos tu código y tus datos.
        </p>
      </div>
      
      <div className="space-y-4 my-8">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Acceso a Repositorios
        </h2>
        <p className="leading-7">
          Broslunas CMS utiliza una <strong>GitHub App</strong> en lugar de un OAuth App tradicional. Esto nos permite ofrecer un control mucho más fino sobre la seguridad:
        </p>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li><strong>Acceso granular</strong>: Tú decides explícitamente a qué repositorios tenemos acceso. No pedimos acceso de lectura/escritura a toda tu cuenta.</li>
            <li><strong>Revocación fácil</strong>: Puedes desinstalar la App de un repositorio específico desde los ajustes de GitHub en cualquier momento.</li>
        </ul>
      </div>

      <div className="space-y-4 my-8">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Manejo de Tokens
        </h2>
        <p className="leading-7">
          Nosotros <strong>nunca almacenamos tu token personal de GitHub</strong> de forma permanente para operaciones de escritura. 
          Las operaciones se realizan utilizando tokens de instalación de corta duración (1 hora) que se generan dinámicamente y expiran automáticamente.
        </p>
      </div>

      <div className="space-y-4 my-8">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Datos en Tránsito y Reposo
        </h2>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>Toda la comunicación con GitHub se realiza bajo HTTPS/TLS.</li>
            <li>Nuestra base de datos caché (MongoDB) está protegida y aislada.</li>
            <li>No vendemos ni analizamos tu contenido. Tu código es tuyo.</li>
        </ul>
      </div>

      <div className="flex justify-start mt-12">
         <Link href="/docs/architecture">
           <Button variant="ghost">
             <ChevronLeft className="mr-2 h-4 w-4" /> Arquitectura
           </Button>
         </Link>
      </div>
    </div>
  )
}
