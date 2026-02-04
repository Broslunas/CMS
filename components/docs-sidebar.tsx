"use client"

import Link from "next/link"
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
        title: "Instalar GitHub App",
        href: "/docs/installation",
      },
      {
        title: "Vincular Repositorio",
        href: "/docs/linking-repos",
      },
    ],
  },
  {
    title: "Conceptos Core",
    items: [
      {
        title: "Astro Collections",
        href: "/docs/astro-collections",
      },
      {
        title: "Sincronización Git",
        href: "/docs/git-sync",
      },
      {
        title: "Schemas & Tipos",
        href: "/docs/schemas",
      },
    ],
  },
  {
    title: "Funcionalidades",
    items: [
      {
        title: "Editor Visual",
        href: "/docs/editor",
      },
      {
        title: "Gestión de Permisos",
        href: "/docs/permissions",
      },
      {
        title: "Modo JSON",
        href: "/docs/json-mode",
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
