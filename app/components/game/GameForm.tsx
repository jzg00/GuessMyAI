import React from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ResponseLength } from '@/components/game/ResponseLength'
import { countWords } from '@/lib/scoring'
import type { GameSubmission, WordCountOption } from '@/lib/types'

interface GameFormProps {
  prompt: string
  guess: string
  wordCount: WordCountOption
  onPromptChange: (value: string) => void
  onGuessChange: (value: string) => void
  onWordCountChange: (wordCount: WordCountOption) => void
  onSubmit: (submission: GameSubmission) => void
  loading: boolean
  promptReadOnly?: boolean
  hidePromptInput?: boolean
  disableWordCount?: boolean
  maxAttempts?: number
  attempts?: number
}

export function GameForm({
  prompt,
  guess,
  wordCount,
  onPromptChange,
  onGuessChange,
  onWordCountChange,
  onSubmit,
  loading,
  promptReadOnly = false,
  hidePromptInput = false,
  disableWordCount = false,
  maxAttempts,
  attempts
}: GameFormProps) {
  const PROMPT_MAX_LENGTH = 100
  const GUESS_MAX_LENGTH = 100 // Add character limit for guess input

  // convert wordCount to number for validation
  const wordLimit = parseInt(wordCount)

  const isPromptValid = prompt.length <= PROMPT_MAX_LENGTH
  const isGuessValid = countWords(guess) <= wordLimit && guess.length <= GUESS_MAX_LENGTH
  const canSubmit = isPromptValid && isGuessValid && prompt.trim() && guess.trim()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (canSubmit) {
      onSubmit({ prompt, guess, wordCount })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!hidePromptInput ? (
        <Input
          // label="Prompt:"
          value={prompt}
          onChange={onPromptChange}
          required
          placeholder="Enter a prompt for the AI..."
          disabled={loading || promptReadOnly}
          maxLength={PROMPT_MAX_LENGTH}
          showCharacterCount={true}
          readOnly={promptReadOnly}
        />
      ) : (
        <div className="mb-4">
          <div className="text-gray-700 font-medium mb-1">Prompt:</div>
          <div className="bg-gray-100 rounded px-3 py-2">{prompt}</div>
        </div>
      )}

      {!disableWordCount && (
        <ResponseLength
          selected={wordCount}
          onChange={onWordCountChange}
          disabled={loading}
        />
      )}

      <Input
        // label="Your Guess:"
        value={guess}
        onChange={onGuessChange}
        required
        placeholder="What will the AI say?"
        disabled={loading}
        showWordCount={true}
        wordLimit={wordLimit}
        maxLength={GUESS_MAX_LENGTH}
      />

      {typeof maxAttempts === 'number' && typeof attempts === 'number' && (
        <div className="text-sm text-gray-500 text-center">
          Attempts: {attempts} / {maxAttempts}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading || !canSubmit}
        className="w-full"
      >
        {loading ? 'Guessing...' : 'Submit Guess'}
      </Button>
    </form>
  )
}