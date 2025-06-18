import React from 'react'
import type { WordCountOption } from '@/lib/types'

interface ResponseLengthProps {
  selected: WordCountOption
  onChange: (wordCount: WordCountOption) => void
  disabled?: boolean
}

export function ResponseLength({ selected, onChange, disabled = false }: ResponseLengthProps) {
  const options: { value: WordCountOption; label: string }[] = [
    { value: '1', label: '1 word' },
    { value: '5', label: '5 words' },
    { value: '10', label: '10 words' },
  ]

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Response Length:
      </label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value as WordCountOption)}
        disabled={disabled}
        className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}