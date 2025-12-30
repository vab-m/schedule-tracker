'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { DayTask } from '@/types'
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

interface DayTasksProps {
    initialTasks: DayTask[]
    initialYear: number
    initialMonth: number
    selectedDay?: number
}

export function DayTasks({ initialTasks, initialYear, initialMonth, selectedDay }: DayTasksProps) {
    const [tasks, setTasks] = useState(initialTasks)
    const [showAddForm, setShowAddForm] = useState(false)
    const [newTask, setNewTask] = useState({
        name: '',
        date: new Date().toISOString().split('T')[0],
        priority: 'medium' as 'low' | 'medium' | 'high',
    })

    const supabase = createClient()
    const daysInMonth = new Date(initialYear, initialMonth + 1, 0).getDate()

    // Add new task
    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTask.name.trim()) return

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            alert('Please log in to add tasks')
            return
        }

        const { data, error } = await supabase
            .from('day_tasks')
            .insert({
                user_id: user.id,
                name: newTask.name,
                date: newTask.date,
                priority: newTask.priority,
                completed: false,
            })
            .select()
            .single()

        if (error) {
            alert('Failed to add task: ' + error.message)
            return
        }

        if (data) {
            setTasks([...tasks, data].sort((a, b) => a.date.localeCompare(b.date)))
            setNewTask({ name: '', date: new Date().toISOString().split('T')[0], priority: 'medium' })
            setShowAddForm(false)
        }
    }

    const handleToggleTask = async (taskId: string) => {
        const task = tasks.find(t => t.id === taskId)
        if (!task) return

        await supabase.from('day_tasks').update({ completed: !task.completed }).eq('id', taskId)
        setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t))
    }

    const handleDeleteTask = async (taskId: string) => {
        await supabase.from('day_tasks').delete().eq('id', taskId)
        setTasks(tasks.filter(t => t.id !== taskId))
    }

    // Group tasks by date
    const groupedTasks = tasks.reduce((acc, task) => {
        if (!acc[task.date]) acc[task.date] = []
        acc[task.date].push(task)
        return acc
    }, {} as Record<string, DayTask[]>)

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    }

    // Use local timezone for date comparisons
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    const isToday = (dateStr: string) => todayStr === dateStr
    const isPastDate = (dateStr: string) => dateStr < todayStr
    const isOverdue = (dateStr: string, completed: boolean) => {
        if (completed) return false
        return isPastDate(dateStr)
    }

    // Filter grouped tasks: past dates show only incomplete, today/future show all
    // Also filter by selectedDay if specified
    const filteredGroupedTasks = Object.entries(groupedTasks).reduce((acc, [date, dateTasks]) => {
        // If a specific day is selected, show ALL tasks for that day (done and undone)
        if (selectedDay !== undefined) {
            const selectedDateStr = `${initialYear}-${String(initialMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
            if (date === selectedDateStr) {
                acc[date] = dateTasks
            }
            return acc
        }

        // Default behavior (no day selected)
        if (isPastDate(date)) {
            // For past dates, only show incomplete tasks
            const incompleteTasks = dateTasks.filter(t => !t.completed)
            if (incompleteTasks.length > 0) {
                acc[date] = incompleteTasks
            }
        } else {
            // For today and future, show all tasks
            acc[date] = dateTasks
        }
        return acc
    }, {} as Record<string, DayTask[]>)

    // Flatten filtered tasks to get only visible tasks for analytics
    const visibleTasks = Object.values(filteredGroupedTasks).flat()

    const priorityColors = {
        high: 'border-l-red-500 bg-red-500/5',
        medium: 'border-l-yellow-500 bg-yellow-500/5',
        low: 'border-l-green-500 bg-green-500/5',
    }

    const priorityEmoji = { high: '🔴', medium: '🟡', low: '🟢' }

    // Analytics calculations (using visible tasks only)
    const totalTasks = visibleTasks.length
    const completedTasks = visibleTasks.filter(t => t.completed).length
    const pendingTasks = totalTasks - completedTasks
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    const tasksByDay = Array.from({ length: daysInMonth }, (_, day) => {
        const dayStr = `${initialYear}-${String(initialMonth + 1).padStart(2, '0')}-${String(day + 1).padStart(2, '0')}`
        return visibleTasks.filter(t => t.date === dayStr).length
    })

    const highPriority = visibleTasks.filter(t => t.priority === 'high').length
    const mediumPriority = visibleTasks.filter(t => t.priority === 'medium').length
    const lowPriority = visibleTasks.filter(t => t.priority === 'low').length

    // Weekly trend data
    const weeklyData: number[] = []
    const weeklyCompleted: number[] = []
    for (let week = 0; week < Math.ceil(daysInMonth / 7); week++) {
        let weekTotal = 0
        let weekDone = 0
        for (let day = week * 7; day < Math.min((week + 1) * 7, daysInMonth); day++) {
            const dayStr = `${initialYear}-${String(initialMonth + 1).padStart(2, '0')}-${String(day + 1).padStart(2, '0')}`
            const dayTasks = visibleTasks.filter(t => t.date === dayStr)
            weekTotal += dayTasks.length
            weekDone += dayTasks.filter(t => t.completed).length
        }
        weeklyData.push(weekTotal)
        weeklyCompleted.push(weekDone)
    }

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
        <div className="space-y-6">
            {/* Day Tasks Section */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <span>📌</span> Day Tasks
                        </h2>
                        <p className="text-sm text-gray-400">One-time tasks for specific days</p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2"
                    >
                        <span>+</span> Add Task
                    </button>
                </div>

                {showAddForm && (
                    <form onSubmit={handleAddTask} className="mb-4 p-4 bg-white/5 rounded-lg flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-xs text-gray-400 uppercase mb-1">Task Name</label>
                            <input
                                type="text"
                                value={newTask.name}
                                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                                placeholder="e.g., Doctor appointment"
                                className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 uppercase mb-1">Date</label>
                            <input
                                type="date"
                                value={newTask.date}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                                className="px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 uppercase mb-1">Priority</label>
                            <select
                                value={newTask.priority}
                                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                                className="px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            >
                                <option value="low">🟢 Low</option>
                                <option value="medium">🟡 Medium</option>
                                <option value="high">🔴 High</option>
                            </select>
                        </div>
                        <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">Add</button>
                        <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">Cancel</button>
                    </form>
                )}

                {tasks.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <div className="text-5xl mb-4">📌</div>
                        <h3 className="text-lg font-medium text-gray-300 mb-2">No day tasks yet</h3>
                        <p>Add tasks for specific days to track one-time activities!</p>
                    </div>
                ) : Object.keys(filteredGroupedTasks).length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <div className="text-5xl mb-4">✅</div>
                        <h3 className="text-lg font-medium text-gray-300 mb-2">All caught up!</h3>
                        <p>No pending tasks. Add new tasks above!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {Object.keys(filteredGroupedTasks).sort().map(date => (
                            <div key={date}>
                                <div className={`flex items-center gap-2 mb-2 text-sm font-medium ${isToday(date) ? 'text-purple-400' : isOverdue(date, false) ? 'text-red-400' : 'text-gray-400'}`}>
                                    <span>📅 {formatDate(date)}</span>
                                    {isToday(date) && <span className="px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full">Today</span>}
                                    {isPastDate(date) && !isToday(date) && (
                                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">Overdue</span>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    {filteredGroupedTasks[date].map(task => (
                                        <div key={task.id} className={`flex items-center gap-3 p-3 rounded-lg border-l-4 transition-all ${priorityColors[task.priority]} ${task.completed ? 'opacity-50' : ''}`}>
                                            <input type="checkbox" checked={task.completed} onChange={() => handleToggleTask(task.id)} className="w-5 h-5 rounded-full cursor-pointer accent-green-500" />
                                            <div className="flex-1">
                                                <p className={`text-white ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.name}</p>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${task.priority === 'high' ? 'bg-red-500/20 text-red-400' : task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                                                    {priorityEmoji[task.priority]} {task.priority}
                                                </span>
                                            </div>
                                            <button onClick={() => handleDeleteTask(task.id)} className="p-1 hover:bg-red-500/20 rounded transition-all text-red-400">🗑️</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Day Tasks Analytics - Real-time */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span>📊</span> Tasks Dashboard
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <StatCard icon="📋" value={totalTasks} label="Total Tasks" />
                    <StatCard icon="✅" value={completedTasks} label="Completed" />
                    <StatCard icon="⏳" value={pendingTasks} label="Pending" />
                    <StatCard icon="📈" value={`${completionRate}%`} label="Completion Rate" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-400 mb-3">Tasks by Day</h3>
                        <div className="h-48">
                            <Bar
                                data={{
                                    labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
                                    datasets: [{ label: 'Tasks', data: tasksByDay, backgroundColor: 'rgba(236, 72, 153, 0.8)', borderRadius: 4 }],
                                }}
                                options={chartOptions}
                            />
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-400 mb-3">Task Status</h3>
                        <div className="h-48 relative flex items-center justify-center">
                            <Doughnut
                                data={{
                                    labels: ['Completed', 'Pending'],
                                    datasets: [{ data: [completedTasks, pendingTasks], backgroundColor: ['#22c55e', 'rgba(255,255,255,0.1)'], borderWidth: 0 }],
                                }}
                                options={{ ...chartOptions, cutout: '70%' }}
                            />
                            <div className="absolute text-center">
                                <p className="text-2xl font-bold text-white">{completionRate}%</p>
                                <p className="text-xs text-gray-400">Done</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-400 mb-3">Priority Distribution</h3>
                        <div className="h-48 relative flex items-center justify-center">
                            <Doughnut
                                data={{
                                    labels: ['High', 'Medium', 'Low'],
                                    datasets: [{ data: [highPriority, mediumPriority, lowPriority], backgroundColor: ['#ef4444', '#eab308', '#22c55e'], borderWidth: 0 }],
                                }}
                                options={{ ...chartOptions, cutout: '60%' }}
                            />
                        </div>
                        <div className="flex justify-center gap-4 mt-2 text-xs">
                            <span className="text-red-400">🔴 {highPriority}</span>
                            <span className="text-yellow-400">🟡 {mediumPriority}</span>
                            <span className="text-green-400">🟢 {lowPriority}</span>
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-400 mb-3">Weekly Tasks Trend</h3>
                        <div className="h-48">
                            <Line
                                data={{
                                    labels: weeklyData.map((_, i) => `W${i + 1}`),
                                    datasets: [
                                        {
                                            label: 'Total',
                                            data: weeklyData,
                                            borderColor: '#8b5cf6',
                                            backgroundColor: 'rgba(139, 92, 246, 0.2)',
                                            fill: true,
                                            tension: 0.4,
                                        },
                                        {
                                            label: 'Completed',
                                            data: weeklyCompleted,
                                            borderColor: '#22c55e',
                                            backgroundColor: 'rgba(34, 197, 94, 0.2)',
                                            fill: true,
                                            tension: 0.4,
                                        },
                                    ],
                                }}
                                options={{
                                    ...chartOptions,
                                    plugins: {
                                        legend: {
                                            display: true,
                                            labels: { color: 'rgba(255,255,255,0.5)' },
                                        },
                                    },
                                }}
                            />
                        </div>
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
