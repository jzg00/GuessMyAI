// app/layout.tsx
import '@/globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'GuessMyAI',
  description: 'Try to guess what the AI will say!',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
