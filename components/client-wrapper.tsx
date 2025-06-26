// components/client-wrapper.tsx
'use client';

import { ThemeProvider } from './theme-provider';

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
    >{children}
    </ThemeProvider>
  );
}
