'use client'
import { useState } from 'react'
import Image from 'next/image'
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
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <main className="flex-1 max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6 w-full">
        <div className="text-center mb-4">
          <div className="mb-4">
            <Image src="/logo.png" alt="Logo" width={48} height={48} className="mx-auto" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            GuessMyAI
          </h1>
          <p className="text-gray-600 text-sm">
            Predict what the AI will say!
          </p>
        </div>

        <div className="flex mb-3">
          <button
            className={`flex-1 py-2 rounded-t-lg font-semibold transition text-sm sm:text-base ${
              mode === 'daily'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setMode('daily')}
          >
            Daily Prompt
          </button>
          <button
            className={`flex-1 py-2 rounded-t-lg font-semibold transition text-sm sm:text-base ${
              mode === 'custom'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setMode('custom')}
          >
            Custom Prompt
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-5 w-full">
          {mode === 'daily' ? (
            <DailyPromptGame />
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Custom Mode
                </h2>
                <p className="text-gray-600 text-sm">
                  Submit your own prompt and get an AI response in real-time.
                </p>
              </div>

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