import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

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

    // Fetch habits count
    const { count: habitsCount } = await supabase
        .from('habits')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)

    // Fetch today's completions
    const { data: habits } = await supabase
        .from('habits')
        .select('id')
        .eq('user_id', user?.id)

    const { data: completions } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('year', year)
        .eq('month', month)

    let todayCompletions = 0
    habits?.forEach(habit => {
        const completion = completions?.find(c => c.habit_id === habit.id)
        if (completion?.completions?.[today - 1]) {
            todayCompletions++
        }
    })

    // Fetch today's tasks
    const todayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(today).padStart(2, '0')}`
    const { data: todayTasks } = await supabase
        .from('day_tasks')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', todayStr)

    const totalTodayTasks = todayTasks?.length || 0
    const completedTodayTasks = todayTasks?.filter(t => t.completed).length || 0

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Welcome back! 👋</h1>
                <p className="text-gray-400 mt-2">
                    Here&apos;s your productivity overview for today
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
                        {todayCompletions}/{habitsCount || 0}
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

                {/* Current Streak */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl">🔥</span>
                        <span className="text-xs text-gray-500 uppercase">Streak</span>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1">
                        {todayCompletions > 0 ? '1' : '0'}
                    </div>
                    <p className="text-gray-400 text-sm">Days this week</p>
                    <p className="mt-4 text-green-400 text-sm">
                        {todayCompletions > 0 ? 'Keep it going! 💪' : 'Start your streak today!'}
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
        </div>
    )
}
