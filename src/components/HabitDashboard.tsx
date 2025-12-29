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
import type { HabitWithCompletions } from '@/types'

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

interface HabitDashboardProps {
    habits: HabitWithCompletions[]
    daysInMonth: number
}

export function HabitDashboard({ habits, daysInMonth }: HabitDashboardProps) {
    // Calculate stats
    const totalCompletions = habits.reduce(
        (sum, h) => sum + h.completions.filter(Boolean).length,
        0
    )
    const totalGoals = habits.reduce((sum, h) => sum + h.goal, 0)
    const overallPercentage = totalGoals > 0
        ? Math.round((totalCompletions / totalGoals) * 100)
        : 0

    // Daily consistency data
    const dailyData = Array.from({ length: daysInMonth }, (_, day) => {
        return habits.filter((h) => h.completions[day]).length
    })

    // Weekly data (aggregate by week)
    const weeklyData = []
    for (let week = 0; week < Math.ceil(daysInMonth / 7); week++) {
        let weekTotal = 0
        for (let day = week * 7; day < Math.min((week + 1) * 7, daysInMonth); day++) {
            weekTotal += habits.filter((h) => h.completions[day]).length
        }
        weeklyData.push(weekTotal)
    }

    // Top habits
    const sortedHabits = [...habits]
        .map((h) => ({
            ...h,
            completionRate: h.goal > 0
                ? Math.round((h.completions.filter(Boolean).length / h.goal) * 100)
                : 0,
        }))
        .sort((a, b) => b.completionRate - a.completionRate)
        .slice(0, 5)

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
                <span>📈</span> Habits Dashboard
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Daily Consistency Chart */}
                <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Daily Consistency</h3>
                    <div className="h-48">
                        <Bar
                            data={{
                                labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
                                datasets: [{
                                    label: 'Completions',
                                    data: dailyData,
                                    backgroundColor: 'rgba(139, 92, 246, 0.8)',
                                    borderRadius: 4,
                                }],
                            }}
                            options={chartOptions}
                        />
                    </div>
                </div>

                {/* Monthly Completion Doughnut */}
                <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Monthly Completion</h3>
                    <div className="h-48 relative flex items-center justify-center">
                        <Doughnut
                            data={{
                                labels: ['Completed', 'Remaining'],
                                datasets: [{
                                    data: [totalCompletions, Math.max(0, totalGoals - totalCompletions)],
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
                            <p className="text-2xl font-bold text-white">{overallPercentage}%</p>
                            <p className="text-xs text-gray-400">Complete</p>
                        </div>
                    </div>
                </div>

                {/* Weekly Comparison */}
                <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Weekly Comparison</h3>
                    <div className="h-48">
                        <Line
                            data={{
                                labels: weeklyData.map((_, i) => `Week ${i + 1}`),
                                datasets: [{
                                    label: 'Completions',
                                    data: weeklyData,
                                    borderColor: '#ec4899',
                                    backgroundColor: 'rgba(236, 72, 153, 0.2)',
                                    fill: true,
                                    tension: 0.4,
                                }],
                            }}
                            options={chartOptions}
                        />
                    </div>
                </div>

                {/* Top Habits */}
                <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">🏆 Top Habits</h3>
                    <div className="space-y-2">
                        {sortedHabits.length === 0 ? (
                            <p className="text-gray-500 text-sm">Add habits to see rankings</p>
                        ) : (
                            sortedHabits.map((habit, index) => (
                                <div
                                    key={habit.id}
                                    className="flex items-center gap-2 text-sm"
                                >
                                    <span className="text-lg">
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                                    </span>
                                    <span className="text-white flex-1 truncate">
                                        {habit.icon} {habit.name}
                                    </span>
                                    <span className={`font-medium ${habit.completionRate >= 100 ? 'text-green-400' :
                                            habit.completionRate >= 75 ? 'text-lime-400' :
                                                habit.completionRate >= 50 ? 'text-yellow-400' : 'text-red-400'
                                        }`}>
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
