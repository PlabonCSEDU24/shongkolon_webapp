import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReactNode } from 'react';
import { Header } from '@/ui/components/Header';
import { AuthContextProvider } from '@/context/AuthContext';
import { Footer } from '@/ui/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shongkolon',
  description: 'Book Selling Platform',
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en" className="min-h-dvh">
      <body className={`${inter.className} min-h-dvh`}>
        <AuthContextProvider>
          <main>
            <Header />
            {props.children}
            <Footer />
          </main>
        </AuthContextProvider>
      </body>
    </html>
  );
}
