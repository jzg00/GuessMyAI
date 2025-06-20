/**
 * server-side date validation utilities
 */

export function getServerDate(): Date {
  // use server time instead of client time
  return new Date()
}

export function formatDateForDB(date: Date): string {
  return date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0')
}

export function isDateInFuture(dateString: string): boolean {
  const requestedDate = new Date(dateString)
  const serverDate = getServerDate()

  // reset time to start of day for comparison
  const requestedDay = new Date(requestedDate.getFullYear(), requestedDate.getMonth(), requestedDate.getDate())
  const serverDay = new Date(serverDate.getFullYear(), serverDate.getMonth(), serverDate.getDate())

  return requestedDay > serverDay
}

export function validateDateAccess(dateString: string): { valid: boolean; error?: string } {
  if (isDateInFuture(dateString)) {
    return {
      valid: false,
      error: 'Cannot access prompts for future dates'
    }
  }

  return { valid: true }
}