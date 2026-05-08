"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/auth-context";
import { CompareProvider } from "@/context/compare-context";
import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <CompareProvider>
          <Providers>
            {children}
            <Toaster position="top-right" richColors />
          </Providers>
        </CompareProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
