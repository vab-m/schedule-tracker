'use client'

import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

interface DashboardNavProps {
    user: User
}

export function DashboardNav({ user }: DashboardNavProps) {
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">⚡</span>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                            Schedule Tracker
                        </h1>
                        <p className="text-xs text-gray-400">Ultimate Habit and Tasks Tracker</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm text-white">{user.email}</p>
                        <p className="text-xs text-gray-400">Free Plan</p>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </header>
    )
}
