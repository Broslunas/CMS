
import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"
import { ChevronRight, ChevronLeft, HardDrive, Database, Settings } from "lucide-react"

export default function StoragePage() {
  return (
    <div className="space-y-10 max-w-3xl pb-10">
      <div className="space-y-4">
         <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
                <HardDrive className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-blue-600">Integrations</p>
        </div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Almacenamiento S3
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
           Configura tu propio bucket S3 para almacenar imágenes y archivos multimedia de forma segura y escalable.
        </p>
      </div>
      
      <div className="space-y-8">
        <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b pb-2 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" /> Configuración
            </h2>
            <p className="text-muted-foreground">
                Ve a <strong>Settings &gt; Integrations</strong> para configurar tu proveedor de almacenamiento. Soportamos cualquier proveedor compatible con S3 (AWS, Cloudflare R2, MinIO, DigitalOcean Spaces, etc).
            </p>
            
            <div className="grid gap-4 mt-6">
                <div className="bg-card border rounded-lg p-4 space-y-2">
                    <h3 className="font-semibold text-lg">Campos Requeridos</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-2">
                        <li><strong>Endpoint:</strong> La URL base de tu proveedor (ej. <code>https://s3.amazonaws.com</code> o <code>https://fly.storage.tigris.dev</code>).</li>
                        <li><strong>Region:</strong> La región donde está tu bucket (ej. <code>us-east-1</code>).</li>
                        <li><strong>Bucket Name:</strong> El nombre de tu bucket.</li>
                        <li><strong>Access Key ID & Secret Key:</strong> Tus credenciales de acceso.</li>
                    </ul>
                </div>
            </div>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b pb-2 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" /> Uso
            </h2>
             <p className="text-muted-foreground">
                Una vez configurado, cualquier imagen que subas a través del editor visual o el gestor de archivos se almacenará automáticamente en tu bucket S3 en lugar de en el sistema de archivos local (o Vercel Blob).
            </p>
             <p className="text-sm bg-yellow-500/10 text-yellow-600 p-3 rounded-md border border-yellow-500/20">
                <strong>Nota:</strong> Si configuras una <em>Public URL Base</em>, esa URL se usará para construir los enlaces a tus imágenes (ej. CDN), mejorando el rendimiento de carga.
            </p>
        </section>
      </div>

      <div className="flex justify-between pt-8 border-t">
         <Link href="/docs/features/vercel">
           <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
             <ChevronLeft className="mr-2 h-4 w-4" /> Integración Vercel
           </Button>
         </Link>
         <Link href="/docs/features/collaboration">
           <Button className="pr-4 hover:pr-6 transition-all">
             Colaboración <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
         </Link>
      </div>
    </div>
  )
}
