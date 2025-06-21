'use client'

import { useState } from 'react'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [date, setDate] = useState('')
  const [prompt, setPrompt] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        setAuthenticated(true)
        setMessage('')
      } else {
        const data = await res.json()
        setMessage(data.error || 'Incorrect password')
      }
    } catch (err) {
      console.error('Login error', err)
      setMessage('Login failed')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !prompt || !aiResponse) {
      setMessage('All fields are required')
      return
    }

    try {
      const response = await fetch('/api/admin/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ date, prompt, aiResponse })
      })

      if (response.ok) {
        const data = await response.json()
        setMessage(data.message || 'Prompt saved!')
      } else {
        const errorData = await response.json()
        setMessage('Error saving prompt: ' + (errorData.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error saving prompt:', error)
      setMessage('Error saving prompt')
    }
  }

  const fetchPromptForDate = async (selectedDate: string) => {
    try {
      const response = await fetch(`/api/admin/prompt?date=${selectedDate}`, {
        credentials: 'include',
      })

      if (response.status === 404) {
        setPrompt('')
        setAiResponse('')
        setMessage('No prompt found for this date')
      } else if (response.ok) {
        const data = await response.json()
        setPrompt(data.prompt)
        setAiResponse(data.ai_response)
        setMessage('Prompt loaded')
      } else {
        const errorData = await response.json()
        setPrompt('')
        setAiResponse('')
        setMessage(errorData.error || 'Error loading prompt')
      }
    } catch (error) {
      console.error('Error fetching prompt:', error)
      setPrompt('')
      setAiResponse('')
      setMessage('Error loading prompt')
    }
  }

  if (!authenticated) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="max-w-lg w-full bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-white">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-700 bg-gray-900 text-white px-3 py-2 rounded"
            />
            <button type="submit" className="w-full bg-blue-700 hover:bg-blue-600 text-white py-2 rounded transition">Login</button>
            {message && <div className="text-red-400">{message}</div>}
          </form>
        </div>
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
            onChange={e => {
              setDate(e.target.value)
              fetchPromptForDate(e.target.value)
            }}
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