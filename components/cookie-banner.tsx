"use client";

import { useState, useEffect } from "react";
import { Link } from "next-view-transitions";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted/rejected cookies
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom-full duration-500">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-popover/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl p-6 md:flex items-center justify-between gap-6 dark:bg-popover/90 ring-1 ring-border">
          <div className="space-y-2 mb-4 md:mb-0">
            <h3 className="font-semibold text-lg text-foreground">Gestionamos tu privacidad</h3>
            <p className="text-sm text-muted-foreground">
              Utilizamos cookies para mejorar tu experiencia y analizar el tráfico. Puedes leer más en nuestra{" "}
              <Link href="/legal/cookies" className="text-primary hover:underline font-medium">
                Política de Cookies
              </Link>.
            </p>
          </div>
          <div className="flex items-center gap-3 whitespace-nowrap">
            <Button variant="outline" onClick={declineCookies} className="border-border hover:bg-muted">
              Rechazar
            </Button>
            <Button onClick={acceptCookies} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
              Aceptar todo
            </Button>
            <button 
              onClick={declineCookies} 
              className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground md:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
