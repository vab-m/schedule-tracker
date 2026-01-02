import { createClient } from '@/lib/supabase/server'
import { DayTasks } from '@/components/DayTasks'
import { CalendarControls } from '@/components/CalendarControls'

// Force dynamic rendering for fresh date
export const dynamic = 'force-dynamic'

interface Props {
    searchParams: Promise<{ year?: string; month?: string; day?: string }>
}

export default async function TasksPage({ searchParams }: Props) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Get year/month/day from URL params or default to current date in IST
    const params = await searchParams

    // Use IST timezone (UTC+5:30) for server-side date calculation
    const now = new Date()
    const istOffset = 5.5 * 60 * 60 * 1000
    const istDate = new Date(now.getTime() + istOffset + now.getTimezoneOffset() * 60 * 1000)

    const year = params.year ? parseInt(params.year) : istDate.getFullYear()
    const month = params.month !== undefined ? parseInt(params.month) : istDate.getMonth()
    const day = params.day ? parseInt(params.day) : undefined

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Task Manager</h1>
                    <p className="text-gray-400 mt-1">Manage your daily tasks and stay productive</p>
                </div>
            </div>

            {/* Calendar Controls */}
            <CalendarControls
                initialYear={year}
                initialMonth={month}
                initialDay={day}
                basePath="/dashboard/tasks"
            />

            {/* Day Tasks with integrated Analytics */}
            <DayTasks
                initialTasks={tasks || []}
                initialYear={year}
                initialMonth={month}
                selectedDay={day}
            />
        </div>
    )
}
