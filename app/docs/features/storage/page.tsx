
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
          S3 Storage
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
           Configure your own S3 bucket to store images and multimedia files securely and scalably.
        </p>
      </div>
      
      <div className="space-y-8">
        <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b pb-2 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" /> Configuration
            </h2>
            <p className="text-muted-foreground">
                Go to <strong>Settings &gt; Integrations</strong> to configure your storage provider. We support any S3-compatible provider (AWS, Cloudflare R2, MinIO, DigitalOcean Spaces, etc).
            </p>
            
            <div className="grid gap-4 mt-6">
                <div className="bg-card border rounded-lg p-4 space-y-2">
                    <h3 className="font-semibold text-lg">Required Fields</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-2">
                        <li><strong>Endpoint:</strong> Your provider's base URL (e.g. <code>https://s3.amazonaws.com</code> or <code>https://fly.storage.tigris.dev</code>).</li>
                        <li><strong>Region:</strong> The region where your bucket is located (e.g. <code>us-east-1</code>).</li>
                        <li><strong>Bucket Name:</strong> Your bucket name.</li>
                        <li><strong>Access Key ID & Secret Key:</strong> Your access credentials.</li>
                    </ul>
                </div>
            </div>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b pb-2 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" /> Usage
            </h2>
             <p className="text-muted-foreground">
                Once configured, any image you upload through the visual editor or file manager will be automatically stored in your S3 bucket instead of the local file system (or Vercel Blob).
            </p>
             <p className="text-sm bg-yellow-500/10 text-yellow-600 p-3 rounded-md border border-yellow-500/20">
                <strong>Note:</strong> If you configure a <em>Public URL Base</em>, that URL will be used to build links to your images (e.g., CDN), improving loading performance.
            </p>
        </section>
      </div>

      <div className="flex justify-between pt-8 border-t">
         <Link href="/docs/features/vercel">
           <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
             <ChevronLeft className="mr-2 h-4 w-4" /> Vercel Integration
           </Button>
         </Link>
         <Link href="/docs/features/collaboration">
           <Button className="pr-4 hover:pr-6 transition-all">
             Collaboration <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
         </Link>
      </div>
    </div>
  )
}
