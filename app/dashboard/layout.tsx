import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import { InstallationWarning } from "@/components/dashboard/InstallationWarning";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // No longer blocking redirect, but show warning banner
  // Enforce app installation check for all dashboard routes
  // if (!session.appInstalled) {
  //   redirect("/setup");
  // }

  return (
    <>
      <div className="w-full relative z-50">
        <InstallationWarning initiallyInstalled={!!session.appInstalled} />
      </div>
      {children}
    </>
  );
}
