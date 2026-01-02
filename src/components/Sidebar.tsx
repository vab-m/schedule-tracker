'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
    { href: '/dashboard', label: 'Overview', icon: '📊' },
    { href: '/dashboard/habits', label: 'Habits', icon: '🎯' },
    { href: '/dashboard/tasks', label: 'Tasks', icon: '✅' },
]

export function Sidebar() {
    const pathname = usePathname()

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return pathname === '/dashboard'
        }
        return pathname.startsWith(href)
    }

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 flex flex-col z-50">
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <span className="text-3xl">⚡</span>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                            Schedule Tracker
                        </h1>
                        <p className="text-xs text-gray-500">Build Better Habits</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.href)
                                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
                <div className="text-center text-xs text-gray-500">
                    <p>Made with ⚡ by Vaibhav</p>
                    <p className="mt-1">© 2026 Schedule Tracker</p>
                </div>
            </div>
        </aside>
    )
}
