'use client'
import { useState } from 'react'
import { GameForm } from '@/components/game/GameForm'
import { ScoreDisplay } from '@/components/game/ScoreDisplay'
import { Button } from '@/components/ui/Button'
import { Footer } from '@/components/ui/Footer'
import { useGame } from '@/hooks/useGame'
import { DailyPromptGame } from '@/components/game/DailyPromptGame'
import type { WordCountOption } from '@/lib/types'

export default function Home() {
  const [mode, setMode] = useState<'daily' | 'custom'>('daily')
  // Custom prompt game state/hooks
  const { gameState, updateField, updateWordCount, submitGuess, resetGame } = useGame()

  const handleSubmit = (submission: { prompt: string; guess: string; wordCount: WordCountOption }) => {
    submitGuess(submission)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main style={{ maxWidth: 600, margin: 'auto', padding: '12px 20px' }} className="flex-1">
        <div className="text-center mb-4">
          <div className="mb-4">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 mx-auto" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Guess the AI
          </h1>
          <p className="text-gray-600 text-sm">
            {mode === 'daily'
              ? "Try to guess today's AI response!"
              : 'Submit a prompt and try to predict how the AI will respond!'}
          </p>
        </div>

        <div className="flex mb-3">
          <button
            className={`flex-1 py-2 rounded-t-lg font-semibold transition ${
              mode === 'daily'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setMode('daily')}
          >
            Daily Prompt
          </button>
          <button
            className={`flex-1 py-2 rounded-t-lg font-semibold transition ${
              mode === 'custom'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setMode('custom')}
          >
            Custom Prompt
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5 w-[560px]">
          {mode === 'daily' ? (
            <DailyPromptGame />
          ) : (
            <>
              <GameForm
                prompt={gameState.prompt}
                guess={gameState.guess}
                wordCount={gameState.wordCount}
                onPromptChange={(value) => updateField('prompt', value)}
                onGuessChange={(value) => updateField('guess', value)}
                onWordCountChange={updateWordCount}
                onSubmit={handleSubmit}
                loading={gameState.loading}
              />

              {gameState.error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700">{gameState.error}</p>
                </div>
              )}

              {gameState.aiResponse && gameState.score !== null && (
                <>
                  <ScoreDisplay
                    aiResponse={gameState.aiResponse}
                    score={gameState.score}
                  />
                  <div className="mt-4 text-center">
                    <Button
                      onClick={resetGame}
                      variant="secondary"
                    >
                      Play Again
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}