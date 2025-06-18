import React from 'react'

interface InputProps {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  placeholder?: string
  disabled?: boolean
  maxLength?: number
  showCharacterCount?: boolean
}

export function Input({
  label,
  value,
  onChange,
  required = false,
  placeholder = '',
  disabled = false,
  maxLength,
  showCharacterCount = false
}: InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (maxLength && newValue.length > maxLength) {
      return
    }
    onChange(newValue)
  }

  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      {showCharacterCount && maxLength && (
        <div className="text-xs mt-1 text-gray-500">
          {value.length}/{maxLength} characters
        </div>
      )}
    </label>
  )
}