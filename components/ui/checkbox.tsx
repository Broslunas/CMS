
import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  HTMLButtonElement,
  {
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
    disabled?: boolean
    id?: string
    className?: string
  }
>(({ className, checked, onCheckedChange, disabled, id }, ref) => {
  return (
    <button
      type="button"
      id={id}
      disabled={disabled}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground flex items-center justify-center",
        className
      )}
      onClick={() => onCheckedChange?.(!checked)}
      data-state={checked ? "checked" : "unchecked"}
      ref={ref}
    >
      {checked && <Check className="h-3 w-3 text-white" />}
    </button>
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
