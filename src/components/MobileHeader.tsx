'use client'

import Link from 'next/link'
import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface MobileHeaderProps {
    user: User
    title?: string
}

export function MobileHeader({ user, title = 'Schedule Tracker' }: MobileHeaderProps) {
    const [showMenu, setShowMenu] = useState(false)
    const router = useRouter()
    const supabase = createClient()
    const initials = user.email?.slice(0, 2).toUpperCase() || 'U'

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <header className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 z-40 lg:hidden safe-area-top">
            <div className="flex items-center justify-between px-4 py-3">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                        {title}
                    </span>
                </Link>
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold active:scale-95 transition-transform"
                    >
                        {initials}
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                        <>
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowMenu(false)}
                            />

                            {/* Menu */}
                            <div className="absolute right-0 top-12 w-56 bg-slate-800 border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                                <div className="px-4 py-3 border-b border-white/10">
                                    <p className="text-sm text-white font-medium truncate">{user.email}</p>
                                    <p className="text-xs text-gray-400">Free Plan</p>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-white/5 flex items-center gap-3 transition-colors"
                                >
                                    <span>🚪</span>
                                    Sign Out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
