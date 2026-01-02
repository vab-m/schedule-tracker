'use client'

import Link from 'next/link'
import { User } from '@supabase/supabase-js'

interface MobileHeaderProps {
    user: User
    title?: string
}

export function MobileHeader({ user, title = 'Schedule Tracker' }: MobileHeaderProps) {
    const initials = user.email?.slice(0, 2).toUpperCase() || 'U'

    return (
        <header className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 z-40 lg:hidden safe-area-top">
            <div className="flex items-center justify-between px-4 py-3">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                        {title}
                    </span>
                </Link>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">
                        {initials}
                    </div>
                </div>
            </div>
        </header>
    )
}
