import { Link } from "next-view-transitions";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-float opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px] animate-float opacity-50" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 text-center px-4 animate-in fade-in zoom-in-95 duration-500">
        {/* Giant 404 */}
        <h1 className="text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary via-indigo-400 to-purple-600 drop-shadow-2xl select-none">
          404
        </h1>
        
        {/* Message */}
        <div className="space-y-4 max-w-lg mx-auto mt-4 md:mt-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Página no encontrada
          </h2>
          <p className="text-muted-foreground text-lg">
            Parece que has llegado a un territorio inexplorado. La página que buscas no existe o ha sido movida.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <Link
            href="/"
            className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 hover:-translate-y-1 flex items-center gap-2 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Inicio
          </Link>
          
          <Link
            href="/dashboard"
            className="px-8 py-3 bg-card border border-border text-foreground font-medium rounded-xl hover:bg-muted/50 transition-all hover:-translate-y-1 flex items-center gap-2"
          >
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Ir al Dashboard
          </Link>
        </div>
      </div>
      
      {/* Decorative footer line */}
      <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
    </div>
  );
}
