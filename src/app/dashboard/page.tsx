import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { DashboardCharts } from '@/components/DashboardCharts'

// Force dynamic rendering for fresh data
export const dynamic = 'force-dynamic'

export default async function DashboardOverview() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Use IST timezone for server-side date calculation
    const now = new Date()
    const istOffset = 5.5 * 60 * 60 * 1000
    const istDate = new Date(now.getTime() + istOffset + now.getTimezoneOffset() * 60 * 1000)
    const year = istDate.getFullYear()
    const month = istDate.getMonth()
    const today = istDate.getDate()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // Fetch all habits with their data
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

    // Calculate today's completions
    let todayCompletions = 0
    habits?.forEach(habit => {
        const completion = completions?.find(c => c.habit_id === habit.id)
        if (completion?.completions?.[today - 1]) {
            todayCompletions++
        }
    })

    // Fetch all tasks for current month
    const startDate = new Date(year, month, 1).toISOString().split('T')[0]
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]

    const { data: allTasks } = await supabase
        .from('day_tasks')
        .select('*')
        .eq('user_id', user?.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date')

    // Fetch today's tasks
    const todayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(today).padStart(2, '0')}`
    const todayTasks = allTasks?.filter(t => t.date === todayStr) || []
    const totalTodayTasks = todayTasks.length
    const completedTodayTasks = todayTasks.filter(t => t.completed).length

    // Prepare habits chart data
    const habitsData = {
        names: habits?.map(h => h.name.slice(0, 10)) || [],
        completions: habits?.map(h => {
            const completion = completions?.find(c => c.habit_id === h.id)
            return completion?.completions?.filter(Boolean).length || 0
        }) || [],
        goals: habits?.map(h => h.goal) || [],
        weeklyProgress: [0, 0, 0, 0],
    }

    // Calculate weekly habit progress
    habits?.forEach(habit => {
        const completion = completions?.find(c => c.habit_id === habit.id)
        if (completion?.completions) {
            completion.completions.forEach((completed: boolean, dayIndex: number) => {
                if (completed) {
                    const weekIndex = Math.min(3, Math.floor(dayIndex / 7))
                    habitsData.weeklyProgress[weekIndex]++
                }
            })
        }
    })

    // Prepare tasks chart data
    const completedTaskCount = allTasks?.filter(t => t.completed).length || 0
    const pendingTaskCount = allTasks?.filter(t => !t.completed).length || 0
    const highPriorityCount = allTasks?.filter(t => t.priority === 'high').length || 0
    const mediumPriorityCount = allTasks?.filter(t => t.priority === 'medium').length || 0
    const lowPriorityCount = allTasks?.filter(t => t.priority === 'low').length || 0

    // Calculate weekly task completions
    const weeklyTasks = [0, 0, 0, 0]
    allTasks?.forEach(task => {
        if (task.completed) {
            const taskDay = new Date(task.date).getDate()
            const weekIndex = Math.min(3, Math.floor((taskDay - 1) / 7))
            weeklyTasks[weekIndex]++
        }
    })

    const tasksData = {
        completed: completedTaskCount,
        pending: pendingTaskCount,
        highPriority: highPriorityCount,
        mediumPriority: mediumPriorityCount,
        lowPriority: lowPriorityCount,
        weeklyTasks,
    }

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Welcome back! 👋</h1>
                <p className="text-gray-400 mt-2">
                    Here&apos;s your productivity overview for {istDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Today's Habits */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl">🎯</span>
                        <span className="text-xs text-gray-500 uppercase">Today</span>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1">
                        {todayCompletions}/{habits?.length || 0}
                    </div>
                    <p className="text-gray-400 text-sm">Habits completed</p>
                    <Link
                        href="/dashboard/habits"
                        className="mt-4 inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm"
                    >
                        View habits →
                    </Link>
                </div>

                {/* Today's Tasks */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl">✅</span>
                        <span className="text-xs text-gray-500 uppercase">Today</span>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1">
                        {completedTodayTasks}/{totalTodayTasks}
                    </div>
                    <p className="text-gray-400 text-sm">Tasks completed</p>
                    <Link
                        href={`/dashboard/tasks?year=${year}&month=${month}&day=${today}`}
                        className="mt-4 inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm"
                    >
                        View tasks →
                    </Link>
                </div>

                {/* Month Stats */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl">📅</span>
                        <span className="text-xs text-gray-500 uppercase">This Month</span>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1">
                        {completedTaskCount + habitsData.completions.reduce((a, b) => a + b, 0)}
                    </div>
                    <p className="text-gray-400 text-sm">Total completions</p>
                    <p className="mt-4 text-green-400 text-sm">
                        Day {today} of {daysInMonth} 💪
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        href="/dashboard/habits"
                        className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6 hover:from-purple-600/30 hover:to-pink-600/30 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-4xl group-hover:scale-110 transition-transform">🎯</span>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Track Habits</h3>
                                <p className="text-gray-400 text-sm">Mark your daily habits as complete</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/tasks"
                        className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl p-6 hover:from-blue-600/30 hover:to-cyan-600/30 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-4xl group-hover:scale-110 transition-transform">✅</span>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Manage Tasks</h3>
                                <p className="text-gray-400 text-sm">Add and complete your daily tasks</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Date Info */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center">
                <p className="text-gray-400">
                    Today is <span className="text-white font-medium">
                        {istDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </p>
            </div>

            {/* Analytics Charts - 3x3 Grid */}
            <div>
                <h2 className="text-xl font-semibold text-white mb-4">📊 Analytics Dashboard</h2>
                <DashboardCharts
                    habitsData={habitsData}
                    tasksData={tasksData}
                    daysInMonth={daysInMonth}
                    currentDay={today}
                />
            </div>
        </div>
    )
}
