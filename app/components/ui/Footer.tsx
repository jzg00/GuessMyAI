import React from 'react'

interface FooterProps {
  text?: string
  className?: string
}

export function Footer({ text = "© 2025 GuessTheAI All rights reserved.", className = "" }: FooterProps) {
  return (
    <footer className={`text-center py-6 text-gray-500 text-sm ${className}`}>
      {text}
    </footer>
  )
}