import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/DashboardNav'
import { Sidebar } from '@/components/Sidebar'

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
            <Sidebar />
            <div className="ml-64">
                <DashboardNav user={user} />
                <main className="max-w-6xl mx-auto px-6 py-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
