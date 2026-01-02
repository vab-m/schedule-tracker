import { createClient } from '@/lib/supabase/server'
import { HabitTracker } from '@/components/HabitTracker'
import { CalendarControls } from '@/components/CalendarControls'

// Force dynamic rendering for fresh date
export const dynamic = 'force-dynamic'

interface Props {
    searchParams: Promise<{ year?: string; month?: string; day?: string }>
}

export default async function HabitsPage({ searchParams }: Props) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Get year/month from URL params or default to current date in IST
    const params = await searchParams

    // Use IST timezone (UTC+5:30) for server-side date calculation
    const now = new Date()
    const istOffset = 5.5 * 60 * 60 * 1000
    const istDate = new Date(now.getTime() + istOffset + now.getTimezoneOffset() * 60 * 1000)

    const year = params.year ? parseInt(params.year) : istDate.getFullYear()
    const month = params.month !== undefined ? parseInt(params.month) : istDate.getMonth()
    const day = params.day ? parseInt(params.day) : undefined

    // Fetch habits
    const { data: habits } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user?.id)
        .order('position')

    // Fetch completions for selected month
    const { data: completions } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('year', year)
        .eq('month', month)

    // Merge habits with completions
    const habitsWithCompletions = (habits || []).map(habit => {
        const habitCompletion = completions?.find(c => c.habit_id === habit.id)
        return {
            ...habit,
            completions: habitCompletion?.completions || [],
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Habit Tracker</h1>
                    <p className="text-gray-400 mt-1">Track your daily habits and build consistency</p>
                </div>
            </div>

            {/* Calendar Controls */}
            <CalendarControls
                initialYear={year}
                initialMonth={month}
                initialDay={day}
                basePath="/dashboard/habits"
            />

            {/* Habit Tracker with integrated Dashboard */}
            <HabitTracker
                initialHabits={habitsWithCompletions}
                initialYear={year}
                initialMonth={month}
            />
        </div>
    )
}
