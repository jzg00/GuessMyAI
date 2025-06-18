import React from 'react'
import type { GameResponse } from '@/lib/types'

interface ScoreDisplayProps {
  aiResponse: string
  score: number
}

export function ScoreDisplay({ aiResponse, score }: ScoreDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreMessage = (score: number) => {
    if (score == 100) return '⭐ Perfect! You guessed the AI\'s response exactly!'
    if (score >= 90) return '🎯 Excellent! Almost perfect!'
    if (score >= 80) return '🎉 Great job! Very close!'
    if (score >= 60) return '👍 Good guess!'
    if (score >= 40) return '🤔 Not bad, but room for improvement'
    return '💭 Keep trying!'
  }

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-semibold mb-2">AI Response:</h2>
      <p className="text-gray-800 mb-4 italic">"{aiResponse}"</p>

      <div className="border-t pt-4">
        <h3 className={`text-lg font-bold ${getScoreColor(score)}`}>
          Your Score: {score}%
        </h3>
        <p className="text-gray-600 mt-1">{getScoreMessage(score)}</p>
      </div>
    </div>
  )
}