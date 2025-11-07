/**
 * BilanCompetence.AI - Root Layout
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BilanCompetence.AI - Plateforme de bilans de compétences',
  description: 'Plateforme digitale pour la réalisation de bilans de compétences professionnels',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#FFFFFF',
              color: '#2C3E50',
              border: '1px solid #E5E7EB',
            },
            success: {
              iconTheme: {
                primary: '#1ABC9C',
                secondary: '#FFFFFF',
              },
            },
            error: {
              iconTheme: {
                primary: '#E74C3C',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
