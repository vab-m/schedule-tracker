'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from '@/lib/constants'

export function MobileBottomNav() {
    const pathname = usePathname()

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return pathname === '/dashboard'
        }
        return pathname.startsWith(href)
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 z-50 lg:hidden safe-area-bottom">
            <div className="flex items-center justify-around py-2">
                {NAV_ITEMS.map((item) => {
                    const active = isActive(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center py-2 px-6 rounded-xl transition-all ${active
                                ? 'text-purple-400'
                                : 'text-gray-500'
                                }`}
                        >
                            <span className={`text-2xl transition-transform ${active ? 'scale-110' : ''}`}>
                                {item.mobileIcon}
                            </span>
                            <span className={`text-xs mt-1 font-medium ${active ? 'text-purple-400' : ''}`}>
                                {item.mobileLabel}
                            </span>
                            {active && (
                                <span className="absolute bottom-1 w-1 h-1 bg-purple-500 rounded-full" />
                            )}
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
