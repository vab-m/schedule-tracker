import { createClient } from '@/lib/supabase/server'
import { HabitTracker } from '@/components/HabitTracker'
import { DayTasks } from '@/components/DayTasks'
import { CalendarControls } from '@/components/CalendarControls'

// Force dynamic rendering to always get fresh date
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch initial data
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // Fetch habits
    const { data: habits } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user?.id)
        .order('position')

    // Fetch completions for current month
    const { data: completions } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('year', year)
        .eq('month', month)

    // Fetch day tasks for current month
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
            <CalendarControls initialYear={year} initialMonth={month} />

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
            />
        </div>
    )
}

