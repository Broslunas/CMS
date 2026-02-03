"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export default function LoginButton() {
  return (
    <Button
      onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
      size="lg"
      className="gap-3 font-bold text-lg px-10 py-7 rounded-xl bg-slate-900 dark:bg-slate-50 dark:text-slate-900 hover:opacity-90 shadow-2xl transition-all duration-300 transform active:scale-95"
    >
      <Github className="w-6 h-6" />
      Continuar con GitHub
    </Button>
  );
}
