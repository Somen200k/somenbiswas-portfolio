"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { PageTransition } from "@/components/ui/PageTransition";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

export function SiteChrome({
  children,
  footer,
}: {
  children: ReactNode;
  footer: ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <LoadingScreen />
      <Navbar />
      <main className="flex-1 pt-24">
        <PageTransition>{children}</PageTransition>
      </main>
      {footer}
    </>
  );
}
