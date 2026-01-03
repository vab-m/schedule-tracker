// Utility functions

import { IST_OFFSET_MS } from './constants'

/**
 * Get current date in IST timezone
 */
export function getISTDate(): Date {
    const now = new Date()
    return new Date(now.getTime() + IST_OFFSET_MS + now.getTimezoneOffset() * 60 * 1000)
}

/**
 * Get year, month, day from IST date
 */
export function getISTDateParts(): { year: number; month: number; day: number } {
    const istDate = getISTDate()
    return {
        year: istDate.getFullYear(),
        month: istDate.getMonth(),
        day: istDate.getDate(),
    }
}

/**
 * Format date string (YYYY-MM-DD)
 */
export function formatDateString(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/**
 * Get days in a month
 */
export function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate()
}

/**
 * Format date for display
 */
export function formatDateDisplay(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', options ?? { weekday: 'short', month: 'short', day: 'numeric' })
}

/**
 * Check if date is today
 */
export function isToday(dateStr: string): boolean {
    const { year, month, day } = getISTDateParts()
    const todayStr = formatDateString(year, month, day)
    return todayStr === dateStr
}

/**
 * Check if date is in the past
 */
export function isPastDate(dateStr: string): boolean {
    const { year, month, day } = getISTDateParts()
    const todayStr = formatDateString(year, month, day)
    return dateStr < todayStr
}

/**
 * Get start and end dates of a month
 */
export function getMonthDateRange(year: number, month: number): { start: string; end: string } {
    return {
        start: new Date(year, month, 1).toISOString().split('T')[0],
        end: new Date(year, month + 1, 0).toISOString().split('T')[0],
    }
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
}

/**
 * Calculate percentage (capped at 100)
 */
export function calculatePercentage(value: number, total: number): number {
    if (total === 0) return 0
    return clamp(Math.round((value / total) * 100), 0, 100)
}

/**
 * Group array by key
 */
export function groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
    return array.reduce((acc, item) => {
        const groupKey = String(item[key])
        if (!acc[groupKey]) acc[groupKey] = []
        acc[groupKey].push(item)
        return acc
    }, {} as Record<string, T[]>)
}

/**
 * Generate CSS class names conditionally
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ')
}
