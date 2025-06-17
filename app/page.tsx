'use client'

import { useState } from 'react'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [guess, setGuess] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [score, setScore] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setAiResponse('')
    setScore(null)

    try {
      const res = await fetch('/api/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, guess }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
      } else {
        setAiResponse(data.aiResponse)
        setScore(data.score)
      }
    } catch (err) {
      setError('Failed to fetch API')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Guess the AI's Response</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Prompt:
          <input
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 10 }}
          />
        </label>
        <label>
          Your Guess:
          <input
            type="text"
            value={guess}
            onChange={e => setGuess(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 10 }}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Guessing...' : 'Submit Guess'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {aiResponse && (
        <div style={{ marginTop: 20 }}>
          <h2>AI Response:</h2>
          <p>{aiResponse}</p>
          <h3>Your Score: {score}%</h3>
        </div>
      )}
    </main>
  )
}