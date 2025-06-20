import { stemmer } from 'stemmer'

// utility function for consistent word counting across the app
export function countWords(text: string): number {
  // replace common punctuation and symbols with spaces, then count words
  // this handles: periods, commas, semicolons, colons, exclamation marks, question marks, slashes, dashes, etc.
  const normalized = text.replace(/[.,;:!?\/\\\-_+=@#$%^&*()\[\]{}|<>]/g, ' ')
  const words = normalized.trim().split(/\s+/).filter(word => {
    // filter out empty strings and strings that are only punctuation/symbols
    return word.length > 0 && /[a-zA-Z0-9]/.test(word)
  })
  return words.length
}

interface NormalizedWord {
  normalized: string
  stemmed: string
}

function normalizeText(text: string): NormalizedWord[] {
  // use the same sophisticated word counting logic as the rest of the app
  // replace common punctuation and symbols with spaces, then normalize
  const normalized = text.replace(/[.,;:!?\/\\\-_+=@#$%^&*()\[\]{}|<>]/g, ' ')
  const clean = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()

  const cleaned = clean(normalized)
  const words = cleaned.split(/\s+/).filter(word => {
    // filter out empty strings and strings that are only punctuation/symbols
    return word.length > 0 && /[a-zA-Z0-9]/.test(word)
  })

  return words.map(word => ({
    normalized: word,
    stemmed: stemmer(word)
  }))
}

function getWordSimilarity(word1: NormalizedWord, word2: NormalizedWord): number {
  // exact match gets full points
  if (word1.normalized === word2.normalized) {
    return 1.0
  }

  // stemmed match gets partial points
  if (word1.stemmed === word2.stemmed) {
    return 0.7
  }

  // check if one word contains the other (for cases like programming/programmatic)
  if (word1.normalized.includes(word2.normalized) || word2.normalized.includes(word1.normalized)) {
    return 0.5
  }

  // check if stems are similar (for cases where stemming is too aggressive)
  const shorterStem = word1.stemmed.length < word2.stemmed.length ? word1.stemmed : word2.stemmed
  const longerStem = word1.stemmed.length >= word2.stemmed.length ? word1.stemmed : word2.stemmed

  if (longerStem.startsWith(shorterStem) && shorterStem.length >= 4) {
    return 0.4
  }

  return 0.0
}

function longestCommonSubsequence(aiWords: NormalizedWord[], guessWords: NormalizedWord[]): number {
  const dp = Array(aiWords.length + 1).fill(null).map(() => Array(guessWords.length + 1).fill(0))

  for (let i = 1; i <= aiWords.length; i++) {
    for (let j = 1; j <= guessWords.length; j++) {
      const similarity = getWordSimilarity(aiWords[i - 1], guessWords[j - 1])
      if (similarity > 0) {
        dp[i][j] = dp[i - 1][j - 1] + similarity
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  return dp[aiWords.length][guessWords.length]
}

export function calculateSimilarityScore(aiResponse: string, userGuess: string): number {
  // normalize both texts
  const aiWords = normalizeText(aiResponse)
  const guessWords = normalizeText(userGuess)

  // calculate exact position score (highest weight)
  let exactPositionScore = 0
  const minLength = Math.min(aiWords.length, guessWords.length)

  for (let i = 0; i < minLength; i++) {
    const similarity = getWordSimilarity(aiWords[i], guessWords[i])
    exactPositionScore += similarity
  }

  exactPositionScore = (exactPositionScore / aiWords.length) * 100

  // calculate presence score (medium weight)
  let presenceScore = 0
  const similarities: number[][] = aiWords.map(aiWord =>
    guessWords.map(guessWord => getWordSimilarity(aiWord, guessWord))
  )

  for (let i = 0; i < aiWords.length; i++) {
    const bestMatch = Math.max(...similarities[i])
    presenceScore += bestMatch
  }

  presenceScore = (presenceScore / aiWords.length) * 100

  // calculate LCS score for sequence matching (lower weight)
  const lcsScore = longestCommonSubsequence(aiWords, guessWords)
  const maxPossibleScore = Math.max(aiWords.length, guessWords.length)
  const sequenceScore = (lcsScore / maxPossibleScore) * 100

  // combine scores with better weighting
  // exact position is most important (50%), presence is second (30%), sequence is third (20%)
  const finalScore = (exactPositionScore * 0.5) + (presenceScore * 0.3) + (sequenceScore * 0.2)

  return Math.round(finalScore)
}