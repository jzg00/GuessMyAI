'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || ''

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [date, setDate] = useState('')
  const [prompt, setPrompt] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      setMessage('')
    } else {
      setMessage('Incorrect password')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !prompt || !aiResponse) {
      setMessage('All fields are required')
      return
    }

    const { error } = await supabase
      .from('daily_prompts')
      .upsert([{ date, prompt, ai_response: aiResponse }], { onConflict: 'date' })
    if (error) {
      setMessage('Error saving prompt: ' + error.message)
    } else {
      setMessage('Prompt saved!')
    }
  }

  if (!authenticated) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <form onSubmit={handleLogin} className="max-w-sm w-full space-y-4 bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-white">Admin Login</h2>
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-700 bg-gray-900 text-white placeholder-gray-400 px-3 py-2 rounded"
          />
          <button type="submit" className="w-full bg-blue-700 hover:bg-blue-600 text-white py-2 rounded transition">Login</button>
          {message && <div className="text-red-400">{message}</div>}
        </form>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">Manage Daily Prompt</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full border border-gray-700 bg-gray-900 text-white px-3 py-2 rounded"
          />
          <textarea
            placeholder="Prompt"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            className="w-full border border-gray-700 bg-gray-900 text-white placeholder-gray-400 px-3 py-2 rounded"
          />
          <textarea
            placeholder="AI Response"
            value={aiResponse}
            onChange={e => setAiResponse(e.target.value)}
            className="w-full border border-gray-700 bg-gray-900 text-white placeholder-gray-400 px-3 py-2 rounded"
          />
          <button type="submit" className="w-full bg-green-700 hover:bg-green-600 text-white py-2 rounded transition">Save Prompt</button>
          {message && <div className="text-blue-400">{message}</div>}
        </form>
      </div>
    </div>
  )
}