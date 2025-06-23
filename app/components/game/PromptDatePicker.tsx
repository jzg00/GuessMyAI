'use client'
import { useState, useEffect, useRef } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

interface PromptDatePickerProps {
  onDateSelect: (date: Date | null) => void
  selectedDate: Date
}

export function PromptDatePicker({ onDateSelect, selectedDate }: PromptDatePickerProps) {
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const datePickerRef = useRef<HTMLDivElement>(null)

  // fetch available dates when component mounts
  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const response = await fetch('/api/available-dates')
        if (response.ok) {
          const data = await response.json()
          setAvailableDates(data.dates || [])
        } else {
          console.error('Failed to fetch available dates')
        }
      } catch (error) {
        console.error('Error fetching available dates:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAvailableDates()
  }, [])

  // clicking outside to close date picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const formatDateToString = (date: Date): string => {
    return date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0')
  }

  const highlightWithAvailableDates = (date: Date) => {
    const dateString = formatDateToString(date)
    return availableDates.includes(dateString)
  }

  return (
    <div className="relative inline-block" ref={datePickerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        aria-label="Select date"
        disabled={loading}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
          />
        </svg>
        {selectedDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 right-0">
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => {
              onDateSelect(date)
              setIsOpen(false)
            }}
            inline
            maxDate={new Date()}
            filterDate={highlightWithAvailableDates}
            dayClassName={date =>
              highlightWithAvailableDates(date)
                ? 'available-date'
                : 'unavailable-date'
            }
          />
        </div>
      )}
    </div>
  )
}