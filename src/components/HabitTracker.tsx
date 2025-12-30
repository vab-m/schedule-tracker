'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { HabitWithCompletions } from '@/types'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

interface HabitTrackerProps {
    initialHabits: HabitWithCompletions[]
    initialYear: number
    initialMonth: number
}

const ICONS = [
    { emoji: '💪', label: 'Fitness' },
    { emoji: '📚', label: 'Reading' },
    { emoji: '🧘', label: 'Meditation' },
    { emoji: '✍️', label: 'Writing' },
    { emoji: '💧', label: 'Hydration' },
    { emoji: '🥗', label: 'Nutrition' },
    { emoji: '😴', label: 'Sleep' },
    { emoji: '🚶', label: 'Walking' },
    { emoji: '💻', label: 'Coding' },
    { emoji: '🎨', label: 'Art' },
    { emoji: '📝', label: 'Journaling' },
    { emoji: '🎵', label: 'Music' },
    { emoji: '🧹', label: 'Cleaning' },
    { emoji: '💰', label: 'Saving' },
    { emoji: '📱', label: 'Screen Time' },
    { emoji: '⭐', label: 'Goal' },
]


export function HabitTracker({ initialHabits, initialYear, initialMonth }: HabitTrackerProps) {
    const [habits, setHabits] = useState(initialHabits)
    const [isPending, startTransition] = useTransition()
    const [showAddForm, setShowAddForm] = useState(false)
    const [newHabit, setNewHabit] = useState({ name: '', goal: '20', icon: '💪' })
    const [editingGoal, setEditingGoal] = useState<string | null>(null)
    const [draggedHabit, setDraggedHabit] = useState<string | null>(null)

    const router = useRouter()
    const supabase = createClient()

    const daysInMonth = new Date(initialYear, initialMonth + 1, 0).getDate()
    const today = new Date()
    const isCurrentMonth = today.getFullYear() === initialYear && today.getMonth() === initialMonth

    // Helper to check if a day is Saturday (6) or Sunday (0)
    const isWeekend = (day: number) => {
        const date = new Date(initialYear, initialMonth, day)
        const dayOfWeek = date.getDay()
        return dayOfWeek === 0 || dayOfWeek === 6
    }

    // Add new habit
    const handleAddHabit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newHabit.name.trim()) return

        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            console.error('No user logged in')
            alert('Please log in to add habits')
            return
        }

        const goalValue = parseInt(newHabit.goal) || 20

        const { data, error } = await supabase
            .from('habits')
            .insert({
                user_id: user.id,
                name: newHabit.name,
                goal: Math.min(31, Math.max(1, goalValue)),
                icon: newHabit.icon,
                position: habits.length,
            })
            .select()
            .single()

        if (error) {
            console.error('Error adding habit:', error)
            alert('Failed to add habit: ' + error.message)
            return
        }

        if (data) {
            setHabits([...habits, { ...data, completions: [] }])
            setNewHabit({ name: '', goal: '20', icon: '💪' })
            setShowAddForm(false)
        }
    }


    // Delete habit
    const handleDeleteHabit = async (habitId: string) => {
        await supabase.from('habits').delete().eq('id', habitId)
        setHabits(habits.filter(h => h.id !== habitId))
    }

    // Toggle completion
    const handleToggleCompletion = async (habitId: string, day: number) => {
        const habit = habits.find(h => h.id === habitId)
        if (!habit) return

        const newCompletions = [...(habit.completions || [])]
        // Fill array if needed
        while (newCompletions.length <= day) {
            newCompletions.push(false)
        }
        newCompletions[day] = !newCompletions[day]

        // Update local state immediately
        setHabits(habits.map(h =>
            h.id === habitId ? { ...h, completions: newCompletions } : h
        ))

        // Upsert to database
        await supabase.from('habit_completions').upsert({
            habit_id: habitId,
            year: initialYear,
            month: initialMonth,
            completions: newCompletions,
        }, {
            onConflict: 'habit_id,year,month',
        })
    }

    // Update goal
    const handleUpdateGoal = async (habitId: string, newGoal: number) => {
        if (newGoal < 1 || newGoal > 31) return

        await supabase.from('habits').update({ goal: newGoal }).eq('id', habitId)
        setHabits(habits.map(h =>
            h.id === habitId ? { ...h, goal: newGoal } : h
        ))
        setEditingGoal(null)
    }

    // Drag and drop handlers
    const handleDragStart = (habitId: string) => {
        setDraggedHabit(habitId)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDrop = async (targetHabitId: string) => {
        if (!draggedHabit || draggedHabit === targetHabitId) {
            setDraggedHabit(null)
            return
        }

        const draggedIndex = habits.findIndex(h => h.id === draggedHabit)
        const targetIndex = habits.findIndex(h => h.id === targetHabitId)

        if (draggedIndex === -1 || targetIndex === -1) return

        // Reorder habits array
        const newHabits = [...habits]
        const [removed] = newHabits.splice(draggedIndex, 1)
        newHabits.splice(targetIndex, 0, removed)

        // Update positions
        const updatedHabits = newHabits.map((h, i) => ({ ...h, position: i }))
        setHabits(updatedHabits)
        setDraggedHabit(null)

        // Save to database
        for (let i = 0; i < updatedHabits.length; i++) {
            await supabase.from('habits').update({ position: i }).eq('id', updatedHabits[i].id)
        }
    }

    return (
        <>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <span>📋</span> Daily Habits
                    </h2>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2"
                    >
                        <span>+</span> Add Habit
                    </button>
                </div>

                {/* Add Habit Form */}
                {showAddForm && (
                    <form onSubmit={handleAddHabit} className="mb-4 p-4 bg-white/5 rounded-lg flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-xs text-gray-400 uppercase mb-1">Habit Name</label>
                            <input
                                type="text"
                                value={newHabit.name}
                                onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                                placeholder="e.g., Morning Workout"
                                className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 uppercase mb-1">Goal</label>
                            <input
                                type="number"
                                min={1}
                                max={31}
                                value={newHabit.goal}
                                onChange={(e) => setNewHabit({ ...newHabit, goal: e.target.value })}
                                className="w-20 px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 uppercase mb-1">Icon</label>
                            <select
                                value={newHabit.icon}
                                onChange={(e) => setNewHabit({ ...newHabit, icon: e.target.value })}
                                className="px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            >
                                {ICONS.map(icon => (
                                    <option key={icon.emoji} value={icon.emoji}>{icon.emoji} {icon.label}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
                        >
                            Add
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
                        >
                            Cancel
                        </button>
                    </form>
                )}

                {/* Habits Table */}
                {habits.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <div className="text-5xl mb-4">🎯</div>
                        <h3 className="text-lg font-medium text-gray-300 mb-2">No habits yet</h3>
                        <p>Add your first habit above to start tracking!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto max-h-[450px] overflow-y-auto">
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-slate-800 z-10">
                                <tr>
                                    <th className="text-left p-2 text-gray-400 font-medium min-w-[180px]">Habit</th>
                                    <th className="p-2 text-gray-400 font-medium">Goal</th>
                                    {Array.from({ length: daysInMonth }, (_, i) => {
                                        const day = i + 1
                                        const weekend = isWeekend(day)
                                        const isToday = isCurrentMonth && today.getDate() === day
                                        return (
                                            <th
                                                key={i}
                                                className={`p-1 text-xs font-medium min-w-[32px] ${isToday
                                                    ? 'bg-purple-600 text-white rounded'
                                                    : weekend
                                                        ? 'text-rose-400 bg-rose-500/10'
                                                        : 'text-gray-400'
                                                    }`}
                                            >
                                                {day}
                                            </th>
                                        )
                                    })}
                                    <th className="p-2 text-gray-400 font-medium">Total</th>
                                    <th className="p-2 text-gray-400 font-medium">%</th>
                                    <th className="p-2 text-gray-400 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {habits.map((habit) => {
                                    const total = habit.completions.filter(Boolean).length
                                    const percentage = habit.goal > 0 ? Math.round((total / habit.goal) * 100) : 0
                                    const percentageClass = percentage >= 100 ? 'text-green-400' :
                                        percentage >= 75 ? 'text-lime-400' :
                                            percentage >= 50 ? 'text-yellow-400' : 'text-red-400'

                                    return (
                                        <tr
                                            key={habit.id}
                                            className={`border-b border-white/5 hover:bg-white/5 ${draggedHabit === habit.id ? 'opacity-50' : ''}`}
                                            draggable
                                            onDragStart={() => handleDragStart(habit.id)}
                                            onDragOver={handleDragOver}
                                            onDrop={() => handleDrop(habit.id)}
                                        >
                                            <td className="p-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="cursor-grab text-gray-500 hover:text-gray-300">⋮⋮</span>
                                                    <span className="text-xl">{habit.icon}</span>
                                                    <span className="text-white font-medium">{habit.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-2 text-center">
                                                {editingGoal === habit.id ? (
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        max={31}
                                                        defaultValue={habit.goal}
                                                        autoFocus
                                                        onBlur={(e) => handleUpdateGoal(habit.id, parseInt(e.target.value) || habit.goal)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleUpdateGoal(habit.id, parseInt((e.target as HTMLInputElement).value))
                                                            if (e.key === 'Escape') setEditingGoal(null)
                                                        }}
                                                        className="w-12 px-2 py-1 bg-slate-700 border border-purple-500 rounded text-white text-center focus:outline-none"
                                                    />
                                                ) : (
                                                    <span
                                                        onClick={() => setEditingGoal(habit.id)}
                                                        className="cursor-pointer px-2 py-1 rounded hover:bg-slate-700 text-gray-300"
                                                        title="Click to edit"
                                                    >
                                                        {habit.goal}
                                                    </span>
                                                )}
                                            </td>
                                            {Array.from({ length: daysInMonth }, (_, day) => (
                                                <td key={day} className="p-1 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={habit.completions[day] || false}
                                                        onChange={() => handleToggleCompletion(habit.id, day)}
                                                        className="w-6 h-6 rounded cursor-pointer accent-green-500 bg-slate-700 border-white/10"
                                                    />
                                                </td>
                                            ))}
                                            <td className="p-2 text-center text-purple-400 font-semibold">{total}</td>
                                            <td className={`p-2 text-center font-semibold ${percentageClass}`}>{percentage}%</td>
                                            <td className="p-2 text-center">
                                                <button
                                                    onClick={() => handleDeleteHabit(habit.id)}
                                                    className="p-1 hover:bg-red-500/20 rounded transition-all text-red-400"
                                                    title="Delete habit"
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Habits Dashboard - Real-time */}
            <HabitsDashboard habits={habits} daysInMonth={daysInMonth} />
        </>
    )
}


// Integrated Habits Dashboard Component
function HabitsDashboard({ habits, daysInMonth }: { habits: HabitWithCompletions[], daysInMonth: number }) {
    const totalCompletions = habits.reduce((sum, h) => sum + h.completions.filter(Boolean).length, 0)
    const totalGoals = habits.reduce((sum, h) => sum + h.goal, 0)
    const overallPercentage = totalGoals > 0 ? Math.round((totalCompletions / totalGoals) * 100) : 0

    // Calculate best streak
    let maxStreak = 0
    habits.forEach(habit => {
        let currentStreak = 0
        habit.completions.forEach((completed: boolean) => {
            if (completed) {
                currentStreak++
                maxStreak = Math.max(maxStreak, currentStreak)
            } else {
                currentStreak = 0
            }
        })
    })

    const dailyData = Array.from({ length: daysInMonth }, (_, day) => habits.filter(h => h.completions[day]).length)

    const weeklyData: number[] = []
    for (let week = 0; week < Math.ceil(daysInMonth / 7); week++) {
        let weekTotal = 0
        for (let day = week * 7; day < Math.min((week + 1) * 7, daysInMonth); day++) {
            weekTotal += habits.filter(h => h.completions[day]).length
        }
        weeklyData.push(weekTotal)
    }

    const sortedHabits = [...habits]
        .map(h => ({ ...h, completionRate: h.goal > 0 ? Math.round((h.completions.filter(Boolean).length / h.goal) * 100) : 0 }))
        .sort((a, b) => b.completionRate - a.completionRate)
        .slice(0, 5)

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.5)' } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.5)' } },
        },
    }

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>📈</span> Habits Dashboard
            </h2>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard icon="🎯" value={habits.length} label="Habits Tracked" />
                <StatCard icon="✅" value={totalCompletions} label="Completions" />
                <StatCard icon="📊" value={`${overallPercentage}%`} label="Success Rate" />
                <StatCard icon="🔥" value={maxStreak} label="Best Streak" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Daily Consistency</h3>
                    <div className="h-48">
                        <Bar
                            data={{
                                labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
                                datasets: [{ label: 'Completions', data: dailyData, backgroundColor: 'rgba(139, 92, 246, 0.8)', borderRadius: 4 }],
                            }}
                            options={chartOptions}
                        />
                    </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Monthly Completion</h3>
                    <div className="h-48 relative flex items-center justify-center">
                        <Doughnut
                            data={{
                                labels: ['Completed', 'Remaining'],
                                datasets: [{ data: [totalCompletions, Math.max(0, totalGoals - totalCompletions)], backgroundColor: ['#22c55e', 'rgba(255,255,255,0.1)'], borderWidth: 0 }],
                            }}
                            options={{ ...chartOptions, cutout: '70%' }}
                        />
                        <div className="absolute text-center">
                            <p className="text-2xl font-bold text-white">{overallPercentage}%</p>
                            <p className="text-xs text-gray-400">Complete</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Weekly Comparison</h3>
                    <div className="h-48">
                        <Line
                            data={{
                                labels: weeklyData.map((_, i) => `Week ${i + 1}`),
                                datasets: [{ label: 'Completions', data: weeklyData, borderColor: '#ec4899', backgroundColor: 'rgba(236, 72, 153, 0.2)', fill: true, tension: 0.4 }],
                            }}
                            options={chartOptions}
                        />
                    </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">🏆 Top Habits</h3>
                    <div className="space-y-2">
                        {sortedHabits.length === 0 ? (
                            <p className="text-gray-500 text-sm">Add habits to see rankings</p>
                        ) : (
                            sortedHabits.map((habit, index) => (
                                <div key={habit.id} className="flex items-center gap-2 text-sm">
                                    <span className="text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}</span>
                                    <span className="text-white flex-1 truncate">{habit.icon} {habit.name}</span>
                                    <span className={`font-medium ${habit.completionRate >= 100 ? 'text-green-400' : habit.completionRate >= 75 ? 'text-lime-400' : habit.completionRate >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                                        {habit.completionRate}%
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ icon, value, label }: { icon: string; value: number | string; label: string }) {
    return (
        <div className="bg-white/5 rounded-lg p-3 flex items-center gap-3">
            <div className="text-xl">{icon}</div>
            <div>
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="text-xs text-gray-400">{label}</p>
            </div>
        </div>
    )
}
