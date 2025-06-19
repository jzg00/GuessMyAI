'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { ScoreDisplay } from '@/components/game/ScoreDisplay'
import { calculateSimilarityScore } from '@/lib/scoring'

interface DailyPrompt {
  date: string
  prompt: string
  ai_response: string
}

const MAX_ATTEMPTS = 3

function getTodayLocalDateString() {
  const today = new Date();
  return today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0');
}

function countWords(text: string) {
  // Remove punctuation and special characters, then split by whitespace
  const cleanText = text.replace(/[^\w\s]/g, ' ').trim();
  return cleanText.split(/\s+/).filter(word => word.length > 0).length;
}

export function DailyPromptGame() {
  const [loading, setLoading] = useState(true)
  const [promptData, setPromptData] = useState<DailyPrompt | null>(null)
  const [guess, setGuess] = useState('')
  const [attempts, setAttempts] = useState<string[]>([])
  const [attemptScores, setAttemptScores] = useState<number[]>([])
  const [revealed, setRevealed] = useState(false)
  const [message, setMessage] = useState('')
  const [bestScore, setBestScore] = useState<number>(0)

  const maxWords = promptData ? countWords(promptData.ai_response) : 0;

  // fetch daily prompt from database
  useEffect(() => {
    const fetchPrompt = async () => {
      setLoading(true)
      const today = getTodayLocalDateString()
      const { data, error } = await supabase
        .from('daily_prompts')
        .select('*')
        .eq('date', today)
        .single()
      if (error || !data) {
        setPromptData(null)
        setMessage('No daily prompt found for today.')
      } else {
        setPromptData(data)
        setMessage('')
      }
      setLoading(false)
    }
    fetchPrompt()
  }, [])

  // REMOVE localStorage logic for development
  // useEffect(() => {
  //   const today = getTodayLocalDateString()
  //   const stored = localStorage.getItem(`daily_attempts_${today}`)
  //   if (stored) {
  //     const arr = JSON.parse(stored)
  //     setAttempts(arr)
  //     if (arr.length >= MAX_ATTEMPTS) setRevealed(true)
  //   }
  // }, [])

  // useEffect(() => {
  //   const today = getTodayLocalDateString()
  //   localStorage.setItem(`daily_attempts_${today}`, JSON.stringify(attempts))
  //   if (attempts.length >= MAX_ATTEMPTS) setRevealed(true)
  // }, [attempts])

  const handleGuessInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const words = value.trim().split(/\s+/).filter(Boolean);
    if (words.length <= maxWords) {
      setGuess(value);
    } else {
      setGuess(words.slice(0, maxWords).join(' '));
    }
  };

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault()
    if (!guess.trim() || revealed) return

    const currentGuess = guess.trim()
    setAttempts(prev => [...prev, currentGuess])

    if (promptData) {
      const newScore = calculateSimilarityScore(promptData.ai_response, currentGuess)
      setAttemptScores(prev => [...prev, newScore])
      setBestScore(prev => Math.max(prev, newScore))
    }
    setGuess('')

    if (attempts.length + 1 >= MAX_ATTEMPTS) {
      setRevealed(true)
    }
  }

  if (loading) {
    return <div className="text-center text-gray-400">Loading daily prompt...</div>
  }

  if (!promptData) {
    return <div className="text-center text-red-400">{message}</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">Today's Prompt</h2>
      <div className="mb-6 text-center text-lg text-gray-800 font-medium h-20 flex items-center justify-center relative">
        <span className="text-4xl text-gray-500 absolute left-0 top-1/2 -translate-y-1/2 font-serif">"</span>
        <span className="px-8 font-serif italic">{promptData.prompt}</span>
        <span className="text-4xl text-gray-500 absolute right-0 top-1/2 -translate-y-1/2 font-serif">"</span>
      </div>
      <div className="mb-2 text-center text-sm text-gray-500">
        AI's response is{' '}
        <span className="font-bold text-gray-700">
          {countWords(promptData.ai_response)} word{countWords(promptData.ai_response) === 1 ? '' : 's'}
        </span>.
      </div>

      {!revealed ? (
        <>
          <form onSubmit={handleGuess} className="flex flex-col items-center gap-4">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={guess}
                onChange={handleGuessInput}
                placeholder="What do you think the AI will say?"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 pr-20"
                disabled={revealed || attempts.length >= MAX_ATTEMPTS}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 opacity-70">
                {countWords(guess)}/{maxWords} words
              </div>
            </div>
            <Button
              type="submit"
              disabled={revealed || attempts.length >= MAX_ATTEMPTS || !guess.trim()}
              className="w-full"
            >
              Submit Guess
            </Button>
          </form>
          <div className="mt-4 text-center text-gray-500">
            Attempts: {attempts.length} / {MAX_ATTEMPTS}
          </div>
          <ul className="mt-2 text-center text-sm text-gray-400">
            {attempts.map((a, i) => (
              <li key={i}>Guess {i + 1}: {a}</li>
            ))}
          </ul>
        </>
      ) : (
        <div className="mt-6">
          <ScoreDisplay aiResponse={promptData.ai_response} score={bestScore} />
          <div className="mt-4 text-center">
            <h3 className="text-lg font-semibold mb-2">Your Guesses:</h3>
            <ul className="text-sm text-gray-600">
              {attempts.map((attempt, i) => (
                <li key={i} className="mb-1">
                  Guess {i + 1}: "{attempt}" - {attemptScores[i]}%
                </li>
              ))}
            </ul>
            <div className="mt-2 text-sm text-gray-500">
              Best Score: {bestScore}%
            </div>
          </div>
          <div className="text-gray-400 text-center mt-4">Try again tomorrow!</div>
        </div>
      )}
    </div>
  )
}