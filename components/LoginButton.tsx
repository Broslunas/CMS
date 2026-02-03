"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export default function LoginButton() {
  return (
    <Button
      onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
      size="lg"
      className="gap-2"
    >
      <Github className="w-5 h-5" />
      Continuar con GitHub
    </Button>
  );
}
