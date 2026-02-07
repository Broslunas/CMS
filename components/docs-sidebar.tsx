"use client"

import { Link } from "next-view-transitions"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

const docsConfig = [
  {
    title: "Getting Started",
    items: [
      {
        title: "Introduction",
        href: "/docs",
      },
      {
        title: "Installation & Setup",
        href: "/docs/getting-started/installation",
      },
      {
        title: "Linking Repositories",
        href: "/docs/getting-started/linking-repos",
      },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      {
        title: "Astro Collections",
        href: "/docs/core-concepts/collections",
      },
      {
        title: "Git Synchronization",
        href: "/docs/core-concepts/git-sync",
      },
      {
        title: "Schemas & Types",
        href: "/docs/core-concepts/schemas",
      },
    ],
  },
  {
    title: "Features",
    items: [
      {
        title: "Visual Editor",
        href: "/docs/features/visual-editor",
      },
      {
        title: "GitHub App",
        href: "/docs/features/github-app",
      },
      {
        title: "Vercel Integration",
        href: "/docs/features/vercel",
      },
      {
        title: "S3 Storage",
        href: "/docs/features/storage",
      },
      {
        title: "Collaboration",
        href: "/docs/features/collaboration",
      },
      {
        title: "Version Control",
        href: "/docs/features/version-control",
      },
      {
        title: "Gemini AI",
        href: "/docs/features/ai",
      },
      {
        title: "JSON Mode",
        href: "/docs/features/json-mode",
      },
    ],
  },
  {
    title: "Architecture",
    items: [
      {
        title: "How it works",
        href: "/docs/architecture",
      },
      {
        title: "Security",
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
