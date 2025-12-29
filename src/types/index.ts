// Database types for Supabase
export interface Habit {
    id: string
    user_id: string
    name: string
    icon: string
    goal: number
    position: number
    created_at: string
}

export interface HabitCompletion {
    id: string
    habit_id: string
    year: number
    month: number
    completions: boolean[]
}

export interface DayTask {
    id: string
    user_id: string
    name: string
    date: string
    priority: 'low' | 'medium' | 'high'
    completed: boolean
    created_at: string
}

// Frontend state types
export interface HabitWithCompletions extends Habit {
    completions: boolean[]
}

export interface AppState {
    habits: HabitWithCompletions[]
    tasks: DayTask[]
    currentYear: number
    currentMonth: number
}
