'use client';

import React from 'react';
import { Providers } from './provider';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/next';
import "./globals.css"
import { Instrument_Serif, Inter } from 'next/font/google';

const _inter = Inter({ subsets: ["latin"] });
const _instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
