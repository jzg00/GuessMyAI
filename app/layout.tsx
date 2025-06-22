// app/layout.tsx
import '@/globals.css'
import { ReactNode } from 'react'
import { Analytics } from "@vercel/analytics/next"

export const metadata = {
  title: 'GuessMyAI',
  description: 'Try to guess what the AI will say!',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
