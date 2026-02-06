"use client"

import { Link } from "next-view-transitions"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

const docsConfig = [
  {
    title: "Empezando",
    items: [
      {
        title: "Introducción",
        href: "/docs",
      },
      {
        title: "Instalación y Setup",
        href: "/docs/getting-started/installation",
      },
      {
        title: "Vincular Repositorios",
        href: "/docs/getting-started/linking-repos",
      },
    ],
  },
  {
    title: "Conceptos Core",
    items: [
      {
        title: "Astro Collections",
        href: "/docs/core-concepts/collections",
      },
      {
        title: "Sincronización Git",
        href: "/docs/core-concepts/git-sync",
      },
      {
        title: "Schemas & Tipos",
        href: "/docs/core-concepts/schemas",
      },
    ],
  },
  {
    title: "Funcionalidades",
    items: [
      {
        title: "Editor Visual",
        href: "/docs/features/visual-editor",
      },
      {
        title: "Integración Vercel",
        href: "/docs/features/vercel",
      },
      {
        title: "Colaboración",
        href: "/docs/features/collaboration",
      },
      {
        title: "Control de Versiones",
        href: "/docs/features/version-control",
      },
      {
        title: "Gemini AI",
        href: "/docs/features/ai",
      },
      {
        title: "Modo JSON",
        href: "/docs/features/json-mode",
      },
    ],
  },
  {
    title: "Arquitectura",
    items: [
      {
        title: "Cómo funciona",
        href: "/docs/architecture",
      },
      {
        title: "Seguridad",
        href: "/docs/security",
      },
    ],
  },
]

export function DocsSidebar() {
  return (
    <div className="w-full">
      {docsConfig.map((item, index) => (
        <div key={index} className="pb-4">
          <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
            {item.title}
          </h4>
          {item.items?.length && (
            <DocsSidebarNavItems items={item.items} />
          )}
        </div>
      ))}
    </div>
  )
}

interface DocsSidebarNavItemsProps {
  items: {
    title: string
    href: string
  }[]
}

function DocsSidebarNavItems({ items }: DocsSidebarNavItemsProps) {
  const pathname = usePathname()

  return (
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {items.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={cn(
            "group flex w-full items-center rounded-md border border-transparent px-2 py-1.5 hover:underline text-muted-foreground",
            item.href === pathname
              ? "font-medium text-primary"
              : "text-muted-foreground"
          )}
        >
          {item.title}
        </Link>
      ))}
    </div>
  )
}
