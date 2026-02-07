import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"
import { ChevronRight, ChevronLeft, Sparkles, Wand2, Stars } from "lucide-react"

export default function AIPage() {
  return (
    <div className="space-y-10 max-w-3xl pb-10">
      <div className="space-y-4">
         <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Sparkles className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-primary">Features</p>
        </div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl gradient-text">
          Gemini AI
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
           Potenciado por el modelo Flash 2.5 de Google. Tu asistente de redacción inteligente integrado en el CMS.
        </p>
      </div>
      
      <div className="space-y-8">
        <div className="p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-primary/20 rounded-xl relative overflow-hidden">
             <Stars className="absolute top-2 right-2 text-primary/20 w-12 h-12 animate-pulse" />
             <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                 <Wand2 className="w-5 h-5 text-primary" /> Funcionalidades Mágicas
             </h3>
             <ul className="space-y-3">
                 <li className="flex items-start gap-3">
                     <span className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs mt-0.5">1</span>
                     <div>
                         <strong className="block text-foreground">Generación de Títulos SEO</strong>
                         <span className="text-sm text-muted-foreground">Deja que la IA analice tu contenido y sugiera títulos atractivos y optimizados para buscadores.</span>
                     </div>
                 </li>
                 <li className="flex items-start gap-3">
                     <span className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs mt-0.5">2</span>
                     <div>
                         <strong className="block text-foreground">Resumen Automático</strong>
                         <span className="text-sm text-muted-foreground">Genera descripciones y excerpts en segundos para tus meta tags.</span>
                     </div>
                 </li>
                 <li className="flex items-start gap-3">
                     <span className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs mt-0.5">3</span>
                     <div>
                         <strong className="block text-foreground">Corrección de Estilo</strong>
                         <span className="text-sm text-muted-foreground">Selecciona un texto y pide a Gemini que lo reescriba para ser más formal, divertido o conciso.</span>
                     </div>
                 </li>
                 <li className="flex items-start gap-3">
                     <span className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs mt-0.5">4</span>
                     <div>
                         <strong className="block text-foreground">Transcripción y Secciones</strong>
                         <span className="text-sm text-muted-foreground">Convierte tus audios en texto y deja que la IA detecte y genere automáticamente capítulos o secciones.</span>
                     </div>
                 </li>
             </ul>
        </div>

        <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b pb-2">Cómo usarlo</h2>
            <p className="text-muted-foreground">
                Busca el icono de <Sparkles className="inline w-4 h-4 text-primary" /> <strong>IA</strong> en la barra de herramientas del editor o al lado de los campos de input.
            </p>
            <div className="p-4 bg-muted rounded-lg text-sm italic border-l-4 border-primary">
                "Gemini, reescribe este párrafo para que suene más profesional."
            </div>
        </div>
      </div>

      <div className="flex justify-between pt-8 border-t">
         <Link href="/docs/features/version-control">
           <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
             <ChevronLeft className="mr-2 h-4 w-4" /> Control de Versiones
           </Button>
         </Link>
         <Link href="/docs/features/json-mode">
           <Button className="pr-4 hover:pr-6 transition-all">
             Modo JSON <ChevronRight className="ml-2 h-4 w-4" />
           </Button>
         </Link>
      </div>
    </div>
  )
}
