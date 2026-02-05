import { auth } from "@/lib/auth";
import { Link } from "next-view-transitions";
import { Button } from "@/components/ui/button";
import { 
  Github, 
  Database, 
  Zap, 
  Lock, 
  LayoutTemplate, 
  GitBranch, 
  FileJson,
  Rocket,
  Code
} from "lucide-react";
import LoginButton from "@/components/LoginButton";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center rounded-full border border-border bg-background/50 backdrop-blur-sm px-3 py-1 text-sm text-muted-foreground shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              v1.0 Ahora Disponible
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-8 duration-700">
              El CMS para Astro <br/>
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                basado en Git
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              Gestiona tus Content Collections sin salir de tu flujo de trabajo. 
              Sin bases de datos. Sin complicaciones. Solo tú, tu repositorio y tu contenido.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
               {session?.user ? (
                 <Link href="/dashboard">
                   <Button size="lg" className="h-12 px-8 text-base shadow-lg hover:shadow-primary/20 transition-all font-semibold">
                     Ir al Dashboard
                   </Button>
                 </Link>
               ) : (
                 <div className="h-12">
                   <LoginButton /> 
                 </div>
               )}
               <Link href="https://github.com/broslunas" target="_blank">
                 <Button variant="outline" size="lg" className="h-12 px-8 text-base hover:bg-muted bg-transparent backdrop-blur-sm border-zinc-200 dark:border-zinc-800">
                   <Github className="mr-2 h-5 w-5" />
                   Ver en GitHub
                 </Button>
               </Link>
            </div>
          </div>
        </div>
        
        {/* Abstract Background Grid - Adaptive */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/30 border-y border-border">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<GitBranch className="h-8 w-8 text-primary" />}
              title="Git Nativo"
              description="Cada cambio es un commit. Mantén el historial completo de tu contenido y revierte cambios cuando lo necesites."
            />
            <FeatureCard 
              icon={<Database className="h-8 w-8 text-primary" />}
              title="Sin Base de Datos"
              description="Tu contenido vive en archivos JSON y Markdown. Olvídate de gestionar bases de datos complejas."
            />
            <FeatureCard 
              icon={<LayoutTemplate className="h-8 w-8 text-primary" />}
              title="Esquemas de Astro"
              description="Importamos automáticamente tus esquemas de Content Collections. Type-safe desde el primer día."
            />
            <FeatureCard 
              icon={<FileJson className="h-8 w-8 text-primary" />}
              title="Edición Visual de JSON"
              description="Edita estructuras de datos complejas con una interfaz intuitiva, diseñada específicamente para datos estáticos."
            />
            <FeatureCard 
              icon={<Lock className="h-8 w-8 text-primary" />}
              title="Control Total"
              description="Tú posees tus datos. Sin vendor lock-in. Si decides dejarnos, tu contenido sigue en tu repositorio."
            />
            <FeatureCard 
              icon={<Zap className="h-8 w-8 text-primary" />}
              title="Ultra Rápido"
              description="Interfaz optimizada para la velocidad. Carga instantánea y ediciones en tiempo real."
            />
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-32 bg-background overflow-hidden relative">
         <div className="container px-4 md:px-6 mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
               <div className="space-y-8">
                  <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    <Code className="mr-2 h-4 w-4" />
                    Developer First
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                    Diseñado para el desarrollador moderno
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Broslunas CMS entiende tu estructura de proyecto. Simplemente conecta tu repositorio y nosotros nos encargamos del resto.
                  </p>
                  <ul className="space-y-4 pt-4">
                    <IntegrationStep number="1" text="Instala el GitHub App" />
                    <IntegrationStep number="2" text="Selecciona tus repositorios" />
                    <IntegrationStep number="3" text="Empieza a editar contenido" />
                  </ul>
               </div>
               
               {/* Visual Code Block */}
               <div className="relative group perspective-1000">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                  <div className="relative rounded-xl bg-[#0F0F11] border border-white/10 p-6 md:p-8 shadow-2xl transform transition-transform duration-500 hover:rotate-y-2 hover:scale-[1.01]">
                    <div className="flex items-center space-x-2 mb-6 border-b border-white/5 pb-4">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <div className="ml-4 text-xs text-zinc-500 font-mono">src/content/config.ts</div>
                    </div>
                    <div className="space-y-3 font-mono text-sm leading-relaxed">
                      <p><span className="text-[#C586C0]">import</span> {`{ defineCollection, z }`} <span className="text-[#C586C0]">from</span> <span className="text-[#CE9178]">'astro:content'</span>;</p>
                      <br/>
                      <p><span className="text-[#569CD6]">const</span> blog = <span className="text-[#DCDCAA]">defineCollection</span>({`{`}</p>
                      <p className="pl-4"><span className="text-[#9CDCFE]">type</span>: <span className="text-[#CE9178]">'content'</span>,</p>
                      <p className="pl-4"><span className="text-[#9CDCFE]">schema</span>: z.<span className="text-[#DCDCAA]">object</span>({`{`}</p>
                      <p className="pl-8"><span className="text-[#9CDCFE]">title</span>: z.<span className="text-[#DCDCAA]">string</span>(),</p>
                      <p className="pl-8"><span className="text-[#9CDCFE]">tags</span>: z.<span className="text-[#DCDCAA]">array</span>(z.<span className="text-[#DCDCAA]">string</span>()),</p>
                      <p className="pl-8"><span className="text-[#9CDCFE]">pubDate</span>: z.<span className="text-[#DCDCAA]">date</span>(),</p>
                      <p className="pl-4">{`}`}),</p>
                      <p>{`}`});</p>
                      <br/>
                      <p><span className="text-[#C586C0]">export const</span> collections = {`{ blog }`};</p>
                    </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative text-center overflow-hidden">
         {/* Adaptive CTA Background */}
         <div className="absolute inset-0 bg-primary/5 -skew-y-3 origin-bottom-left transform-gpu"></div>
         
         <div className="container px-4 relative z-10 mx-auto max-w-3xl">
           <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
             ¿Listo para empezar?
           </h2>
           <p className="text-xl text-muted-foreground mb-12">
             Únete a los desarrolladores que ya están gestionando sus sitios de Astro de forma más inteligente.
           </p>
           {session?.user ? (
             <Link href="/dashboard">
               <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-xl hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300">
                 Ir al Dashboard <Rocket className="ml-2 h-5 w-5" />
               </Button>
             </Link>
           ) : (
             <div className="scale-110">
                <LoginButton />
             </div>
           )}
         </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t border-border bg-muted/20 text-center relative z-10">
        <div className="flex justify-center items-center gap-2 mb-4">
           <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md">
             <span className="text-primary-foreground font-bold leading-none">B</span>
           </div>
           <span className="font-bold text-lg text-foreground">Broslunas CMS</span>
        </div>
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Broslunas Engineering. All rights reserved.
        </p>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="mb-6 inline-flex p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 border border-transparent group-hover:border-primary/20">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

function IntegrationStep({ number, text }: { number: string, text: string }) {
  return (
    <li className="flex items-center text-foreground font-medium group cursor-default">
      <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-muted border border-border group-hover:border-primary group-hover:text-primary transition-colors">
        <span className="font-bold text-sm">{number}</span>
      </div>
      <span className="group-hover:translate-x-1 transition-transform text-muted-foreground group-hover:text-foreground">{text}</span>
    </li>
  )
}
