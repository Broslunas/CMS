import Link from "next/link"
import { auth, signOut } from "@/lib/auth"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Github, LogOut, User } from "lucide-react"

export async function SiteHeader() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4 md:px-6">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold inline-block">Broslunas CMS</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            href="https://github.com/broslunas"
            target="_blank"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            GitHub
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          {session?.user ? (
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  {session.user.image ? (
                    <img src={session.user.image} alt="User" className="w-6 h-6 rounded-full" />
                  ) : <User className="w-5 h-5" />}
                  <span className="hidden md:inline-block">{session.user.name}</span>
                </div>
                <form
                  action={async () => {
                    "use server"
                    await signOut()
                  }}
                >
                  <Button variant="ghost" size="icon" title="Cerrar sesión">
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only">Cerrar sesión</span>
                  </Button>
                </form>
             </div>
          ) : null}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
