/**
 * Simulated Google Meet Link Generator
 * Generates realistic-looking Google Meet links.
 * In production, replace generateMeetLink() with a real
 * Google Calendar API call to create an event with conferenceData.
 */

const CONSONANTS = 'bcdfghjklmnpqrstvwxyz';
const VOWELS = 'aeiou';

function randomChar(chars: string): string {
  return chars[Math.floor(Math.random() * chars.length)];
}

/**
 * Generates a 3-letter syllable (consonant + vowel + consonant)
 */
function syllable(): string {
  return randomChar(CONSONANTS) + randomChar(VOWELS) + randomChar(CONSONANTS);
}

/**
 * Generates a Google Meet style link: meet.google.com/xxx-xxxx-xxx
 */
export function generateMeetLink(): string {
  const part1 = syllable() + randomChar(CONSONANTS);         // 4 chars
  const part2 = syllable() + randomChar(VOWELS);             // 4 chars
  const part3 = syllable() + randomChar(CONSONANTS);         // 4 chars
  return `https://meet.google.com/${part1}-${part2}-${part3}`;
}

/**
 * Formats a date + time for display
 */
export function formatMeetingTime(scheduledAt: string): string {
  const date = new Date(scheduledAt);
  return date.toLocaleString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}
