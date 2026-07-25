import type { Metadata } from 'next';
import React from 'react';
import { Providers } from './provider';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/next';
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: 'Cosmix',
    template: '%s · Cosmix',
  },
  description: "Share posts, connect, and explore what's trending across the cosmos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster position="top-right" duration={3000} />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
