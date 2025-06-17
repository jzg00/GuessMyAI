// pages/index.tsx
'use client'
import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [guess, setGuess] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAiResponse('');
    setScore(null);

    try {
      const res = await fetch('/api/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, guess }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setAiResponse(data.aiResponse);
      setScore(data.score);
    } catch (err: any) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🎮 Guess the AI</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Prompt</label>
          <textarea
            className="w-full border rounded p-2"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Your Guess</label>
          <textarea
            className="w-full border rounded p-2"
            rows={2}
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Guess'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-600">{error}</p>}

      {aiResponse && (
        <div className="mt-6 border-t pt-4">
          <p><strong>AI Response:</strong> {aiResponse}</p>
          <p><strong>Your Score:</strong> {score}%</p>
        </div>
      )}
    </main>
  );
}
