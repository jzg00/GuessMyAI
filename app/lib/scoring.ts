import { stemmer } from 'stemmer'

interface NormalizedWord {
  normalized: string
  stemmed: string
}

function normalizeText(text: string): NormalizedWord[] {
  const clean = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()

  const cleaned = clean(text)
  const words = cleaned.split(/\s+/)

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

  // calculate position scored using LCS
  const lcsScore = longestCommonSubsequence(aiWords, guessWords)
  const maxPossibleScore = Math.max(aiWords.length, guessWords.length)
  const positionScore = (lcsScore / maxPossibleScore) * 100

  // calculate presence score
  let presenceScore = 0
  const totalWords = Math.max(aiWords.length, guessWords.length)


  const similarities: number[][] = aiWords.map(aiWord =>
    guessWords.map(guessWord => getWordSimilarity(aiWord, guessWord))
  )


  for (let i = 0; i < aiWords.length; i++) {
    const bestMatch = Math.max(...similarities[i])
    presenceScore += bestMatch
  }

  presenceScore = (presenceScore / totalWords) * 100

  // combine scores
  const finalScore = (positionScore * 0.6) + (presenceScore * 0.4)

  return Math.round(finalScore)
}