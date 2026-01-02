'use client'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js'
import { Line, Doughnut, Bar, Pie } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

interface DashboardChartsProps {
    habitsData: {
        names: string[]
        completions: number[]
        goals: number[]
        weeklyProgress: number[]
    }
    tasksData: {
        completed: number
        pending: number
        highPriority: number
        mediumPriority: number
        lowPriority: number
        weeklyTasks: number[]
    }
    daysInMonth: number
    currentDay: number
}

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: { color: '#9ca3af', font: { size: 11 } },
            position: 'bottom' as const,
        },
    },
    scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
    },
}

const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: { color: '#9ca3af', font: { size: 11 } },
            position: 'bottom' as const,
        },
    },
}

export function DashboardCharts({ habitsData, tasksData, daysInMonth, currentDay }: DashboardChartsProps) {
    const totalHabitCompletions = habitsData.completions.reduce((a, b) => a + b, 0)
    const totalHabitGoals = habitsData.goals.reduce((a, b) => a + b, 0)
    const habitSuccessRate = totalHabitGoals > 0 ? Math.min(100, Math.round((totalHabitCompletions / totalHabitGoals) * 100)) : 0

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Overall Progress Doughnut */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Overall Habit Progress</h3>
                <div className="h-48 flex items-center justify-center relative">
                    <Doughnut
                        data={{
                            labels: ['Completed', 'Remaining'],
                            datasets: [{
                                data: [totalHabitCompletions, Math.max(0, totalHabitGoals - totalHabitCompletions)],
                                backgroundColor: ['#22c55e', 'rgba(255,255,255,0.1)'],
                                borderWidth: 0,
                            }],
                        }}
                        options={{ ...doughnutOptions, cutout: '70%' }}
                    />
                    <div className="absolute text-center">
                        <p className="text-2xl font-bold text-white">{habitSuccessRate}%</p>
                        <p className="text-xs text-gray-400">Success</p>
                    </div>
                </div>
            </div>

            {/* 2. Task Status Pie */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Task Status</h3>
                <div className="h-48">
                    <Pie
                        data={{
                            labels: ['Completed', 'Pending'],
                            datasets: [{
                                data: [tasksData.completed, tasksData.pending],
                                backgroundColor: ['#22c55e', '#f59e0b'],
                                borderWidth: 0,
                            }],
                        }}
                        options={doughnutOptions}
                    />
                </div>
            </div>

            {/* 3. Task Priority Distribution */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Task Priorities</h3>
                <div className="h-48">
                    <Doughnut
                        data={{
                            labels: ['High', 'Medium', 'Low'],
                            datasets: [{
                                data: [tasksData.highPriority, tasksData.mediumPriority, tasksData.lowPriority],
                                backgroundColor: ['#ef4444', '#f59e0b', '#22c55e'],
                                borderWidth: 0,
                            }],
                        }}
                        options={doughnutOptions}
                    />
                </div>
            </div>

            {/* 4. Weekly Habit Progress Line */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Weekly Habit Trend</h3>
                <div className="h-48">
                    <Line
                        data={{
                            labels: habitsData.weeklyProgress.map((_, i) => `Week ${i + 1}`),
                            datasets: [{
                                label: 'Completions',
                                data: habitsData.weeklyProgress,
                                borderColor: '#a855f7',
                                backgroundColor: 'rgba(168, 85, 247, 0.2)',
                                fill: true,
                                tension: 0.4,
                            }],
                        }}
                        options={chartOptions}
                    />
                </div>
            </div>

            {/* 5. Weekly Tasks Completed Bar */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Weekly Task Completion</h3>
                <div className="h-48">
                    <Bar
                        data={{
                            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                            datasets: [{
                                label: 'Tasks',
                                data: tasksData.weeklyTasks,
                                backgroundColor: '#3b82f6',
                                borderRadius: 6,
                            }],
                        }}
                        options={chartOptions}
                    />
                </div>
            </div>

            {/* 6. Habit Completion by Habit Bar */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Habit Performance</h3>
                <div className="h-48">
                    <Bar
                        data={{
                            labels: habitsData.names.slice(0, 5),
                            datasets: [{
                                label: 'Completed',
                                data: habitsData.completions.slice(0, 5),
                                backgroundColor: '#22c55e',
                                borderRadius: 6,
                            }, {
                                label: 'Goal',
                                data: habitsData.goals.slice(0, 5),
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                borderRadius: 6,
                            }],
                        }}
                        options={chartOptions}
                    />
                </div>
            </div>

            {/* 7. Productivity Score Gauge */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Productivity Score</h3>
                <div className="h-48 flex items-center justify-center relative">
                    <Doughnut
                        data={{
                            labels: ['Score', 'Remaining'],
                            datasets: [{
                                data: [habitSuccessRate, 100 - habitSuccessRate],
                                backgroundColor: [
                                    habitSuccessRate >= 80 ? '#22c55e' : habitSuccessRate >= 50 ? '#f59e0b' : '#ef4444',
                                    'rgba(255,255,255,0.05)'
                                ],
                                borderWidth: 0,
                                circumference: 180,
                                rotation: 270,
                            }],
                        }}
                        options={{ ...doughnutOptions, cutout: '75%' }}
                    />
                    <div className="absolute text-center mt-8">
                        <p className="text-3xl font-bold text-white">{habitSuccessRate}</p>
                        <p className="text-xs text-gray-400">out of 100</p>
                    </div>
                </div>
            </div>

            {/* 8. Month Progress */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Month Progress</h3>
                <div className="h-48 flex items-center justify-center relative">
                    <Doughnut
                        data={{
                            labels: ['Days Passed', 'Days Left'],
                            datasets: [{
                                data: [currentDay, daysInMonth - currentDay],
                                backgroundColor: ['#8b5cf6', 'rgba(255,255,255,0.1)'],
                                borderWidth: 0,
                            }],
                        }}
                        options={{ ...doughnutOptions, cutout: '65%' }}
                    />
                    <div className="absolute text-center">
                        <p className="text-2xl font-bold text-white">{currentDay}/{daysInMonth}</p>
                        <p className="text-xs text-gray-400">Days</p>
                    </div>
                </div>
            </div>

            {/* 9. Daily Activity Heatmap Style */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Recent Activity</h3>
                <div className="h-48 grid grid-cols-7 gap-1 content-center">
                    {Array.from({ length: 28 }, (_, i) => {
                        const dayIndex = currentDay - 28 + i
                        const isActive = dayIndex > 0 && dayIndex <= currentDay
                        const intensity = isActive ? Math.random() : 0
                        return (
                            <div
                                key={i}
                                className={`aspect-square rounded-sm ${intensity > 0.7 ? 'bg-green-500' :
                                        intensity > 0.4 ? 'bg-green-600/60' :
                                            intensity > 0 ? 'bg-green-700/40' : 'bg-white/5'
                                    }`}
                                title={isActive ? `Day ${dayIndex}` : ''}
                            />
                        )
                    })}
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">Last 28 days activity</p>
            </div>
        </div>
    )
}
