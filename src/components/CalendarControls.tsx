'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CalendarControlsProps {
    initialYear: number
    initialMonth: number
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]

export function CalendarControls({ initialYear, initialMonth }: CalendarControlsProps) {
    const router = useRouter()
    const [year, setYear] = useState(initialYear)
    const [month, setMonth] = useState(initialMonth)

    const handleChange = (newYear: number, newMonth: number) => {
        setYear(newYear)
        setMonth(newMonth)
        router.push(`/dashboard?year=${newYear}&month=${newMonth}`)
        router.refresh()
    }

    const goToToday = () => {
        const today = new Date()
        handleChange(today.getFullYear(), today.getMonth())
    }

    // Generate year options
    const years = []
    for (let y = initialYear - 5; y <= initialYear + 5; y++) {
        years.push(y)
    }

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>📅</span> Calendar Settings
            </h2>
            <div className="flex flex-wrap items-end gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">Year</label>
                    <select
                        value={year}
                        onChange={(e) => handleChange(parseInt(e.target.value), month)}
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
                        onChange={(e) => handleChange(year, parseInt(e.target.value))}
                        className="bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    >
                        {MONTHS.map((m, i) => (
                            <option key={i} value={i}>{m}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={goToToday}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2 transition-all"
                >
                    <span>📍</span> Go to Today
                </button>
            </div>
        </div>
    )
}
