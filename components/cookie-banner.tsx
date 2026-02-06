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

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom-full duration-500">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-popover/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl p-6 md:flex items-center justify-between gap-6 dark:bg-popover/90 ring-1 ring-border">
          <div className="space-y-2 mb-4 md:mb-0">
            <h3 className="font-semibold text-lg text-foreground">We value your privacy</h3>
            <p className="text-sm text-muted-foreground">
              We use cookies to enhance your experience and analyze traffic. You can read more in our{" "}
              <Link href="/legal/cookies" className="text-primary hover:underline font-medium">
                Cookie Policy
              </Link>.
            </p>
          </div>
          <div className="flex items-center gap-3 whitespace-nowrap">
            <Button onClick={acceptCookies} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
