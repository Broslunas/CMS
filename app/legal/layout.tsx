
import { SiteFooter } from "@/components/site-footer";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-background">{children}</main>
      <SiteFooter />
    </div>
  );
}
