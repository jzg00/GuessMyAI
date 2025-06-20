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
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            disabled={disabled}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md border transition-colors ${
              selected === option.value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
            } disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-200`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}