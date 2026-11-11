import type { Metadata } from "next";
import "../globals.css";
import { Suspense } from "react";
import { Toaster } from "@modules/components/feedbacks/toast/Toaster";

export const metadata: Metadata = {
  title: "SPA Viagem CIOT",
  description: "Sistema para gerenciamento de CIOTs",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="h-screen antialiased min-h-0">
      <body className="h-screen flex flex-col min-h-0">
        <div
          className="flex h-screen w-full overflow-hidden min-h-0"
          data-testid="layout"
        >
          <Toaster />
          <Suspense fallback={<>carregando...</>}>{children}</Suspense>
        </div>
      </body>
    </html>
  );
}
