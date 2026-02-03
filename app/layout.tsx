import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: {
    default: "Broslunas CMS | Gestiona tus Content Collections",
    template: "%s | Broslunas CMS",
  },
  description:
    "El CMS definitivo para Astro. Gestiona tus Content Collections directamente desde GitHub. Rápido, seguro y con una interfaz intuitiva.",
  keywords: [
    "astro",
    "cms",
    "github",
    "git",
    "content collections",
    "markdown",
    "editor",
    "static site generator",
    "web development",
  ],
  authors: [{ name: "Broslunas Team" }],
  creator: "Broslunas",
  publisher: "Broslunas",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    title: "Broslunas CMS | Gestiona tus Content Collections",
    description:
      "Gestiona tus Content Collections de Astro con el poder de Git. Sin bases de datos, sincronización directa con GitHub.",
    siteName: "Broslunas CMS",
  },

  twitter: {
    card: "summary_large_image",
    title: "Broslunas CMS | Gestiona tus Content Collections",
    description:
      "Gestiona tus Content Collections de Astro con el poder de Git. Sin bases de datos, sincronización directa con GitHub.",
    creator: "@broslunas",
  },
  icons: {
    icon: "https://cdn.broslunas.com/favicon.ico",
    shortcut: "https://cdn.broslunas.com/favicon.ico",
    apple: "https://cdn.broslunas.com/favicon.ico",
  },
};




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans text-foreground`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <div className="flex-1">{children}</div>
            </div>
            <Toaster theme="system" position="bottom-right" />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  name: "Broslunas CMS",
                  url: process.env.NEXTAUTH_URL || "http://localhost:3000",
                  logo: "https://cdn.broslunas.com/logo.png", // Placeholder
                  sameAs: [
                    "https://twitter.com/broslunas",
                    "https://github.com/broslunas",
                  ],
                }),
              }}
            />
        </ThemeProvider>
      </body>
    </html>
  );
}
