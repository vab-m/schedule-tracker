'use client'

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
import type { DayTask } from '@/types'

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

interface TaskDashboardProps {
    tasks: DayTask[]
    daysInMonth: number
    year: number
    month: number
}

export function TaskDashboard({ tasks, daysInMonth, year, month }: TaskDashboardProps) {
    // Calculate stats
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.completed).length
    const pendingTasks = totalTasks - completedTasks
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // Tasks by day data
    const tasksByDay = Array.from({ length: daysInMonth }, (_, day) => {
        const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day + 1).padStart(2, '0')}`
        return tasks.filter(t => t.date === dayStr).length
    })

    // Priority distribution
    const highPriority = tasks.filter(t => t.priority === 'high').length
    const mediumPriority = tasks.filter(t => t.priority === 'medium').length
    const lowPriority = tasks.filter(t => t.priority === 'low').length

    // Weekly trend
    const weeklyData = []
    const weeklyCompleted = []
    for (let week = 0; week < Math.ceil(daysInMonth / 7); week++) {
        let weekTotal = 0
        let weekCompleted = 0
        for (let day = week * 7; day < Math.min((week + 1) * 7, daysInMonth); day++) {
            const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day + 1).padStart(2, '0')}`
            const dayTasks = tasks.filter(t => t.date === dayStr)
            weekTotal += dayTasks.length
            weekCompleted += dayTasks.filter(t => t.completed).length
        }
        weeklyData.push(weekTotal)
        weeklyCompleted.push(weekCompleted)
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: 'rgba(255,255,255,0.5)' },
            },
            y: {
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: 'rgba(255,255,255,0.5)' },
            },
        },
    }

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>📊</span> Day Tasks Analytics
            </h2>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard icon="📋" value={totalTasks} label="Total Tasks" />
                <StatCard icon="✅" value={completedTasks} label="Completed" />
                <StatCard icon="⏳" value={pendingTasks} label="Pending" />
                <StatCard icon="📈" value={`${completionRate}%`} label="Completion Rate" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Tasks by Day Chart */}
                <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Tasks by Day</h3>
                    <div className="h-48">
                        <Bar
                            data={{
                                labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
                                datasets: [{
                                    label: 'Tasks',
                                    data: tasksByDay,
                                    backgroundColor: 'rgba(236, 72, 153, 0.8)',
                                    borderRadius: 4,
                                }],
                            }}
                            options={chartOptions}
                        />
                    </div>
                </div>

                {/* Task Status Doughnut */}
                <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Task Status</h3>
                    <div className="h-48 relative flex items-center justify-center">
                        <Doughnut
                            data={{
                                labels: ['Completed', 'Pending'],
                                datasets: [{
                                    data: [completedTasks, pendingTasks],
                                    backgroundColor: ['#22c55e', 'rgba(255,255,255,0.1)'],
                                    borderWidth: 0,
                                }],
                            }}
                            options={{
                                ...chartOptions,
                                cutout: '70%',
                            }}
                        />
                        <div className="absolute text-center">
                            <p className="text-2xl font-bold text-white">{completionRate}%</p>
                            <p className="text-xs text-gray-400">Done</p>
                        </div>
                    </div>
                </div>

                {/* Priority Distribution */}
                <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Priority Distribution</h3>
                    <div className="h-48 relative flex items-center justify-center">
                        <Doughnut
                            data={{
                                labels: ['High', 'Medium', 'Low'],
                                datasets: [{
                                    data: [highPriority, mediumPriority, lowPriority],
                                    backgroundColor: ['#ef4444', '#eab308', '#22c55e'],
                                    borderWidth: 0,
                                }],
                            }}
                            options={{
                                ...chartOptions,
                                cutout: '60%',
                            }}
                        />
                    </div>
                    <div className="flex justify-center gap-4 mt-2 text-xs">
                        <span className="text-red-400">🔴 High: {highPriority}</span>
                        <span className="text-yellow-400">🟡 Med: {mediumPriority}</span>
                        <span className="text-green-400">🟢 Low: {lowPriority}</span>
                    </div>
                </div>

                {/* Weekly Trend */}
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
