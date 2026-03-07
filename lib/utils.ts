/**
 * Format phone number to Ghana standard format
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Handle Ghana phone numbers
  if (cleaned.startsWith('233') && cleaned.length === 12) {
    // Format: +233 XX XXX XXXX
    return `+233 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    // Format: +233 XX XXX XXXX (remove leading 0 and add Ghana code)
    return `+233 ${cleaned.slice(1, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  
  // Return original if it doesn't match expected patterns
  return phone;
}

/**
 * Validate Ghana phone number
 */
export function isValidGhanaPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  
  // Accept formats:
  // +233XXXXXXXXXX (12 digits with country code)
  // 0XXXXXXXXXX (10 digits with leading 0)
  // XXXXXXXXX (9 digits without leading 0)
  
  return (
    (cleaned.startsWith('233') && cleaned.length === 12) ||
    (cleaned.startsWith('0') && cleaned.length === 10) ||
    (cleaned.length === 9)
  );
}

/**
 * Generate reference number with proper format
 */
export function generateReferenceNumber(prefix: string, year?: number): string {
  const currentYear = year || new Date().getFullYear();
  const random = Math.floor(Math.random() * 90000) + 10000; // 5-digit random number
  return `${prefix}-${currentYear}-${random.toString().padStart(5, '0')}`;
}

/**
 * Format currency for Ghana
 */
export function formatGhanaCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Check if date is within Ghana visa validity range
 */
export function isValidVisaDuration(days: number): boolean {
  return days >= 1 && days <= 365; // Ghana allows up to 1 year
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date, locale: string = 'en-GH'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}
