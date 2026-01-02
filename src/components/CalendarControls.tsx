'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface CalendarControlsProps {
    initialYear: number
    initialMonth: number
    initialDay?: number
    basePath?: string
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]

export function CalendarControls({ initialYear, initialMonth, initialDay, basePath = '/dashboard' }: CalendarControlsProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [year, setYear] = useState(initialYear)
    const [month, setMonth] = useState(initialMonth)
    const [day, setDay] = useState<number | undefined>(initialDay)

    // Sync with props when they change (e.g., new month starts)
    useEffect(() => {
        setYear(initialYear)
        setMonth(initialMonth)
        setDay(initialDay)
    }, [initialYear, initialMonth, initialDay])

    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const handleChange = (newYear: number, newMonth: number, newDay?: number) => {
        setYear(newYear)
        setMonth(newMonth)
        setDay(newDay)
        let url = `${basePath}?year=${newYear}&month=${newMonth}`
        if (newDay !== undefined) {
            url += `&day=${newDay}`
        }
        startTransition(() => {
            router.push(url)
            router.refresh()
        })
    }

    const goToToday = () => {
        const today = new Date()
        handleChange(today.getFullYear(), today.getMonth(), today.getDate())
    }

    const clearDayFilter = () => {
        handleChange(year, month, undefined)
    }

    // Generate year options
    const years = []
    for (let y = initialYear - 5; y <= initialYear + 5; y++) {
        years.push(y)
    }

    // Generate day options
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    return (
        <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 transition-opacity ${isPending ? 'opacity-70' : ''}`}>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>📅</span> Calendar Settings
                {isPending && (
                    <span className="ml-2 text-sm text-purple-400 flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></span>
                        Loading...
                    </span>
                )}
            </h2>
            <div className="flex flex-wrap items-end gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">Year</label>
                    <select
                        value={year}
                        onChange={(e) => handleChange(parseInt(e.target.value), month, day)}
                        className="bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    >
                        {years.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">Month</label>
                    <select
                        value={month}
                        onChange={(e) => handleChange(year, parseInt(e.target.value), day)}
                        className="bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    >
                        {MONTHS.map((m, i) => (
                            <option key={i} value={i}>{m}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">Day (Optional)</label>
                    <select
                        value={day ?? ''}
                        onChange={(e) => handleChange(year, month, e.target.value ? parseInt(e.target.value) : undefined)}
                        className="bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    >
                        <option value="">All Days</option>
                        {days.map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={goToToday}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2 transition-all"
                >
                    <span>📍</span> Go to Today
                </button>
                {day !== undefined && (
                    <button
                        onClick={clearDayFilter}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-all"
                    >
                        <span>✕</span> Show All Days
                    </button>
                )}
            </div>
        </div>
    )
}
