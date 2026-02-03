"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function AppearanceForm() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-4">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Theme
        </label>
        <p className="text-[0.8rem] text-muted-foreground">Select the theme for the dashboard.</p>
        <div className="flex flex-wrap items-center gap-4 pt-2">
            <div 
                className={`cursor-pointer border-2 rounded-lg p-2 w-[160px] text-center hover:border-primary transition-all ${theme === 'light' ? 'border-primary ring-2 ring-primary/20' : 'border-muted'}`} 
                onClick={() => setTheme("light")}
            >
                <div className="bg-[#ecedef] h-24 w-full rounded mb-2 border border-muted"/>
                <span className="font-medium text-sm">Light</span>
            </div>
            <div 
                className={`cursor-pointer border-2 rounded-lg p-2 w-[160px] text-center hover:border-primary transition-all ${theme === 'dark' ? 'border-primary ring-2 ring-primary/20' : 'border-muted'}`} 
                onClick={() => setTheme("dark")}
            >
                 <div className="bg-slate-950 h-24 w-full rounded mb-2 border border-muted"/>
                 <span className="font-medium text-sm">Dark</span>
            </div>
             <div 
                className={`cursor-pointer border-2 rounded-lg p-2 w-[160px] text-center hover:border-primary transition-all ${theme === 'system' ? 'border-primary ring-2 ring-primary/20' : 'border-muted'}`} 
                onClick={() => setTheme("system")}
            >
                 <div className="bg-gradient-to-tr from-slate-950 to-[#ecedef] h-24 w-full rounded mb-2 border border-muted"/>
                 <span className="font-medium text-sm">System</span>
            </div>
        </div>
    </div>
  )
}
