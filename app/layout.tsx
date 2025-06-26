// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChatFlow - Modern Chat Application",
  description:
    "A comprehensive chat app with smooth animations and clean design",
};

import ClientWrapper from "@/components/client-wrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientWrapper>
          <main>
            {children}
            <Toaster />
          </main>
        </ClientWrapper>
      </body>
    </html>
  );
}
