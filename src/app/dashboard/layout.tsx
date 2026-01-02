import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/DashboardNav'
import { Sidebar } from '@/components/Sidebar'
import { MobileBottomNav } from '@/components/MobileBottomNav'
import { MobileHeader } from '@/components/MobileHeader'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
            {/* Desktop Sidebar - hidden on mobile */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            {/* Mobile Header - visible only on mobile/tablet */}
            <MobileHeader user={user} />

            {/* Main Content Area */}
            <div className="lg:ml-64">
                {/* Desktop Nav - hidden on mobile */}
                <div className="hidden lg:block">
                    <DashboardNav user={user} />
                </div>

                {/* Content with bottom padding on mobile for nav */}
                <main className="max-w-6xl mx-auto px-4 py-4 lg:px-6 lg:py-6 pb-24 lg:pb-6">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav />
        </div>
    )
}
