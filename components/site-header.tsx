import { Link } from "next-view-transitions"
import { auth, signOut } from "@/lib/auth"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Github, LogOut, User } from "lucide-react"

export async function SiteHeader() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="mr-8 flex items-center space-x-2 transition-opacity hover:opacity-90">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
             <span className="text-white font-bold text-xl leading-none">B</span>
          </div>
          <span className="font-bold text-lg tracking-tight inline-block">Broslunas CMS</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link
            href="/dashboard"
            className="transition-colors hover:text-primary text-foreground/60"
          >
            Dashboard
          </Link>
          <Link
            href="https://github.com/broslunas"
            target="_blank"
            className="transition-colors hover:text-primary text-foreground/60"
          >
            GitHub
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-5">
          {session?.user ? (
             <div className="flex items-center gap-5">
                <div className="flex items-center gap-3 py-1 px-3 rounded-full bg-muted/50 border border-border">
                  {session.user.image ? (
                    <img src={session.user.image} alt="User" className="w-6 h-6 rounded-full ring-2 ring-primary/20" />
                  ) : <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center"><User className="w-3.5 h-3.5 text-primary" /></div>}
                  <span className="hidden lg:inline-block text-xs font-semibold">{session.user.name}</span>
                </div>
                <form
                  action={async () => {
                    "use server"
                    await signOut()
                  }}
                >
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Cerrar sesión">
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only">Cerrar sesión</span>
                  </Button>
                </form>
             </div>
          ) : null}
          <div className="h-6 w-[1px] bg-border mx-1 hidden md:block" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
