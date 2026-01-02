'use client'

import { useEffect, useState } from 'react'

export function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null)
    const [showInstall, setShowInstall] = useState(false)
    const [isIOS, setIsIOS] = useState(false)
    const [isStandalone, setIsStandalone] = useState(false)

    useEffect(() => {
        // Check if already installed
        const standalone = window.matchMedia('(display-mode: standalone)').matches
        setIsStandalone(standalone)

        // Check if iOS
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
        setIsIOS(iOS)

        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('SW registered:', registration.scope)
                })
                .catch((error) => {
                    console.log('SW registration failed:', error)
                })
        }

        // Listen for install prompt (Android/Chrome)
        const handleBeforeInstall = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e)
            setShowInstall(true)
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstall)

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
        }
    }, [])

    const handleInstall = async () => {
        if (!deferredPrompt) return

        // Show the install prompt
        (deferredPrompt as BeforeInstallPromptEvent).prompt()

        // Wait for user response
        const { outcome } = await (deferredPrompt as BeforeInstallPromptEvent).userChoice

        if (outcome === 'accepted') {
            console.log('User accepted install')
        }

        setDeferredPrompt(null)
        setShowInstall(false)
    }

    const handleDismiss = () => {
        setShowInstall(false)
        // Don't show again for this session
        sessionStorage.setItem('pwa-dismissed', 'true')
    }

    // Don't show if already installed or dismissed
    if (isStandalone) return null
    if (typeof window !== 'undefined' && sessionStorage.getItem('pwa-dismissed')) return null

    // iOS instructions
    if (isIOS && !isStandalone) {
        return (
            <div
                className="fixed bottom-20 left-4 right-4 bg-slate-800 border border-purple-500/30 rounded-xl p-4 shadow-2xl z-50 lg:hidden animate-slide-up"
                style={{ animation: 'slideUp 0.3s ease-out' }}
            >
                <div className="flex items-start gap-3">
                    <span className="text-2xl">📲</span>
                    <div className="flex-1">
                        <p className="text-white font-medium text-sm">Install Schedule Tracker</p>
                        <p className="text-gray-400 text-xs mt-1">
                            Tap <span className="inline-flex items-center mx-1 px-1 bg-white/10 rounded">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                            </span> then &quot;Add to Home Screen&quot;
                        </p>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="text-gray-500 hover:text-white p-1"
                    >
                        ✕
                    </button>
                </div>
            </div>
        )
    }

    // Android/Chrome install prompt
    if (showInstall) {
        return (
            <div
                className="fixed bottom-20 left-4 right-4 bg-gradient-to-r from-purple-900 to-pink-900 border border-purple-500/30 rounded-xl p-4 shadow-2xl z-50 lg:hidden"
                style={{ animation: 'slideUp 0.3s ease-out' }}
            >
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">⚡</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-white font-medium text-sm">Install Schedule Tracker</p>
                        <p className="text-gray-300 text-xs mt-0.5">Add to home screen for quick access</p>
                    </div>
                </div>
                <div className="flex gap-2 mt-3">
                    <button
                        onClick={handleDismiss}
                        className="flex-1 px-4 py-2 text-gray-300 text-sm hover:bg-white/10 rounded-lg transition-all"
                    >
                        Not now
                    </button>
                    <button
                        onClick={handleInstall}
                        className="flex-1 px-4 py-2 bg-white text-purple-900 font-medium text-sm rounded-lg hover:bg-gray-100 transition-all"
                    >
                        Install
                    </button>
                </div>
            </div>
        )
    }

    return null
}

// Type for BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}
