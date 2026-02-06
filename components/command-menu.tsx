"use client"

import * as React from "react"
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  LayoutDashboard,
  FileText,
  Github,
  Moon,
  Sun,
  Laptop,
  Shield,
  Folder,
  Users
} from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

interface Project {
  repoId: string
  name: string
  isShared: boolean
}

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const [projects, setProjects] = React.useState<Project[]>([])
  const router = useRouter()
  const { setTheme } = useTheme()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  React.useEffect(() => {
    if (open) {
      fetch("/api/projects")
        .then((res) => {
          if (res.ok) return res.json()
          return []
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setProjects(data)
          }
        })
        .catch((err) => console.error("Failed to fetch projects for command menu", err))
    }
  }, [open])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={() => runCommand(() => router.push('/dashboard'))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/repos'))}>
            <Github className="mr-2 h-4 w-4" />
            <span>All Repositories</span>
            <CommandShortcut>⌘R</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/docs'))}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Documentation</span>
          </CommandItem>
        </CommandGroup>
        
        {projects.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Projects">
              {projects.map((project) => (
                <CommandItem
                  key={project.repoId}
                  onSelect={() => runCommand(() => router.push(`/dashboard/repos?repo=${encodeURIComponent(project.repoId)}`))}
                >
                  {project.isShared ? (
                    <Users className="mr-2 h-4 w-4 text-indigo-500" />
                  ) : (
                    <Folder className="mr-2 h-4 w-4 text-orange-500" />
                  )}
                  <span>{project.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground truncate max-w-[100px]">{project.repoId}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/settings'))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
          
          <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/settings/account'))}>
            <User className="mr-2 h-4 w-4" />
            <span>Account</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
           <CommandItem onSelect={() => runCommand(() => router.push('/legal/privacy'))}>
            <Shield className="mr-2 h-4 w-4" />
            <span>Privacy Policy</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
            <Laptop className="mr-2 h-4 w-4" />
            <span>System</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
