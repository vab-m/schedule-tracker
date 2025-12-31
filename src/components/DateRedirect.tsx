'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function DateRedirect() {
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        // If no year/month params, redirect to current local date
        if (!searchParams.get('year') && !searchParams.get('month')) {
            const now = new Date()
            const year = now.getFullYear()
            const month = now.getMonth()
            router.replace(`/dashboard?year=${year}&month=${month}`)
        }
    }, [router, searchParams])

    return null
}
