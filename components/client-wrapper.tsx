// components/client-wrapper.tsx
'use client';

import { ThemeProvider } from './theme-provider';
import { SessionProvider } from 'next-auth/react';

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
}
