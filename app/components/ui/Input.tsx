import React from 'react'
import { countWords } from '@/lib/scoring'

interface InputProps {
  label?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  placeholder?: string
  disabled?: boolean
  maxLength?: number
  showCharacterCount?: boolean
  showWordCount?: boolean
  wordLimit?: number
  readOnly?: boolean
}

export function Input({
  label,
  value,
  onChange,
  required = false,
  placeholder = '',
  disabled = false,
  maxLength,
  showCharacterCount = false,
  showWordCount = false,
  wordLimit,
  readOnly = false
}: InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    // enforce character limit
    if (maxLength && newValue.length > maxLength) {
      return
    }

    // handle word limit
    if (showWordCount && wordLimit) {
      const currentWordCount = countWords(newValue);
      const previousWordCount = countWords(value);

      if (previousWordCount >= wordLimit) {
        // allow finishing current word with alphanumeric only
        const isAddingCharacter = newValue.length > value.length;
        if (isAddingCharacter) {
          const newChar = newValue[newValue.length - 1];
          if (/[^a-zA-Z0-9]/.test(newChar)) {
            return;
          }
        }
      }

      // prevent exceeding word limit
      if (currentWordCount > wordLimit) {
        return;
      }

      onChange(newValue);
      return;
    }

    onChange(newValue)
  }

  const currentWords = countWords(value)

  return (
    <label className="block mb-4">
      {label && (
        <span className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </span>
      )}
      <div className="relative w-full">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          readOnly={readOnly}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
            (showCharacterCount && maxLength) || (showWordCount && wordLimit) ? 'pr-16' : ''
          }`}
        />
        {showCharacterCount && maxLength && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 opacity-70">
            {value.length}/{maxLength}
          </div>
        )}
        {showWordCount && wordLimit && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 opacity-70">
            {currentWords}/{wordLimit} words
          </div>
        )}
      </div>
    </label>
  )
}