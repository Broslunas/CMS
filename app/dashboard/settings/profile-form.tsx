"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface ProfileFormProps {
  user: any
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast.success("Profile updated successfully")
    }, 1000)
    
    // In a real app, call a Server Action or API route here
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Display Name</Label>
        <Input 
            id="name" 
            name="name" 
            defaultValue={user?.name || ""} 
            placeholder="Your name" 
        />
        <p className="text-[0.8rem] text-muted-foreground">
          This is your public display name.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
            id="email" 
            name="email" 
            defaultValue={user?.email || ""} 
            readOnly 
            disabled
        />
         <p className="text-[0.8rem] text-muted-foreground">
          You cannot change your email address.
        </p>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update profile"}
      </Button>
    </form>
  )
}
