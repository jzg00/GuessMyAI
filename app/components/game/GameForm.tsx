import React from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ResponseLength } from '@/components/game/ResponseLength'
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
}

export function GameForm({
  prompt,
  guess,
  wordCount,
  onPromptChange,
  onGuessChange,
  onWordCountChange,
  onSubmit,
  loading
}: GameFormProps) {
  const PROMPT_MAX_LENGTH = 100
  const GUESS_MAX_LENGTH = 100

  const isPromptValid = prompt.length <= PROMPT_MAX_LENGTH
  const isGuessValid = guess.length <= GUESS_MAX_LENGTH
  const canSubmit = isPromptValid && isGuessValid && prompt.trim() && guess.trim()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (canSubmit) {
      onSubmit({ prompt, guess, wordCount })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        value={prompt}
        onChange={onPromptChange}
        required
        placeholder="Enter a prompt for the AI..."
        disabled={loading}
        maxLength={PROMPT_MAX_LENGTH}
        showCharacterCount={true}
      />

      <ResponseLength
        selected={wordCount}
        onChange={onWordCountChange}
        disabled={loading}
      />

      <Input
        value={guess}
        onChange={onGuessChange}
        required
        placeholder="What do you think the AI will say?"
        disabled={loading}
        maxLength={GUESS_MAX_LENGTH}
        showCharacterCount={true}
      />

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