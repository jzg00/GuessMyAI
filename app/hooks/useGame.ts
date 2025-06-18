import { useState } from 'react'
import type { GameState, GameSubmission, GameResponse, ApiError, WordCountOption } from '@/lib/types'

export function useGame() {
  const [gameState, setGameState] = useState<GameState>({
    prompt: '',
    guess: '',
    aiResponse: '',
    score: null,
    loading: false,
    error: '',
    wordCount: '1' // Default option
  })

  const updateField = (field: keyof Pick<GameState, 'prompt' | 'guess'>, value: string) => {
    setGameState(prev => ({ ...prev, [field]: value }))
  }

  const updateWordCount = (wordCount: WordCountOption) => {
    setGameState(prev => ({ ...prev, wordCount }))
  }

  const submitGuess = async (submission: GameSubmission) => {
    setGameState(prev => ({
      ...prev,
      loading: true,
      error: '',
      aiResponse: '',
      score: null
    }))

    try {
      const res = await fetch('/api/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      })

      const data: GameResponse | ApiError = await res.json()

      if (!res.ok) {
        const errorData = data as ApiError
        setGameState(prev => ({
          ...prev,
          error: errorData.error || 'Something went wrong'
        }))
      } else {
        const responseData = data as GameResponse
        setGameState(prev => ({
          ...prev,
          aiResponse: responseData.aiResponse,
          score: responseData.score
        }))
      }
    } catch (err) {
      setGameState(prev => ({
        ...prev,
        error: 'Failed to fetch API'
      }))
    } finally {
      setGameState(prev => ({ ...prev, loading: false }))
    }
  }

  const resetGame = () => {
    setGameState({
      prompt: '',
      guess: '',
      aiResponse: '',
      score: null,
      loading: false,
      error: '',
      wordCount: '1'
    })
  }

  return {
    gameState,
    updateField,
    updateWordCount,
    submitGuess,
    resetGame
  }
}