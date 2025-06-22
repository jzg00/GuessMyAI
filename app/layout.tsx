// app/layout.tsx
import '@/globals.css'
import { ReactNode } from 'react'
import { Analytics } from "@vercel/analytics/next"

export const metadata = {
  title: 'GuessMyAI',
  description: 'Try to guess what the AI will say!',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
