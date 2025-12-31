import { createClient } from '@/lib/supabase/server'
import { HabitTracker } from '@/components/HabitTracker'
import { DayTasks } from '@/components/DayTasks'
import { CalendarControls } from '@/components/CalendarControls'

// Force dynamic rendering to always get fresh date
export const dynamic = 'force-dynamic'

interface Props {
    searchParams: Promise<{ year?: string; month?: string; day?: string }>
}

export default async function DashboardPage({ searchParams }: Props) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Get year/month/day from URL params or default to current date in IST
    const params = await searchParams

    // Use IST timezone (UTC+5:30) for server-side date calculation
    const now = new Date()
    const istOffset = 5.5 * 60 * 60 * 1000 // 5:30 hours in milliseconds
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

    // Fetch day tasks for selected month
    const startDate = new Date(year, month, 1).toISOString().split('T')[0]
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]

    const { data: tasks } = await supabase
        .from('day_tasks')
        .select('*')
        .eq('user_id', user?.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date')

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
            {/* Calendar Controls */}
            <CalendarControls initialYear={year} initialMonth={month} initialDay={day} />

            {/* Habit Tracker with integrated Dashboard */}
            <HabitTracker
                initialHabits={habitsWithCompletions}
                initialYear={year}
                initialMonth={month}
            />

            {/* Day Tasks with integrated Analytics */}
            <DayTasks
                initialTasks={tasks || []}
                initialYear={year}
                initialMonth={month}
                selectedDay={day}
            />

            {/* Footer */}
            <footer className="border-t border-white/10 py-8 mt-8">
                <div className="text-center text-gray-500 text-sm">
                    <p>Made with ⚡ by Vaibhav • Data saved securely in the cloud</p>
                    <p className="mt-1">© 2025 Schedule Tracker. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
