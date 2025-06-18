export interface GameState {
  prompt: string
  guess: string
  aiResponse: string
  score: number | null
  loading: boolean
  error: string
  wordCount: WordCountOption
}

export interface GameSubmission {
  prompt: string
  guess: string
  wordCount: WordCountOption
}

export interface GameResponse {
  aiResponse: string
  score: number
}

export interface ApiError {
  error: string
}

export type WordCountOption = '1' | '5' | '10'