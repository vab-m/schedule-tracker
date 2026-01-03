// App-wide constants

export const APP_NAME = 'Schedule Tracker'
export const APP_SHORT_NAME = 'Tracker'
export const APP_TAGLINE = 'Ultimate Habit and Tasks Tracker'
export const APP_AUTHOR = 'Vaibhav'
export const APP_YEAR = 2026

// Colors
export const COLORS = {
    primary: '#7c3aed',
    primaryDark: '#6d28d9',
    secondary: '#ec4899',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    background: '#0f172a',
    surface: 'rgba(255, 255, 255, 0.05)',
} as const

// Chart colors
export const CHART_COLORS = {
    green: '#22c55e',
    yellow: '#f59e0b',
    red: '#ef4444',
    purple: '#a855f7',
    blue: '#3b82f6',
    cyan: '#06b6d4',
    pink: '#ec4899',
    indigo: '#8b5cf6',
    gray: 'rgba(255, 255, 255, 0.1)',
} as const

// Priority colors
export const PRIORITY_COLORS = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#22c55e',
} as const

// Months
export const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
] as const

export const MONTHS_SHORT = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
] as const

// Days
export const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const
export const DAYS_FULL = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
] as const

// Navigation
export const NAV_ITEMS = [
    { href: '/dashboard', label: 'Overview', icon: '📊', mobileLabel: 'Home', mobileIcon: '🏠' },
    { href: '/dashboard/habits', label: 'Habits', icon: '🎯', mobileLabel: 'Habits', mobileIcon: '🎯' },
    { href: '/dashboard/tasks', label: 'Tasks', icon: '✅', mobileLabel: 'Tasks', mobileIcon: '✅' },
] as const

// Timezone
export const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
} as const

// Animation durations (ms)
export const ANIMATION = {
    fast: 150,
    normal: 300,
    slow: 500,
} as const

// Limits
export const LIMITS = {
    maxHabits: 25,
    maxTasksPerDay: 50,
    maxHabitGoal: 100,
} as const
