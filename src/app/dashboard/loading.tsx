export default function DashboardLoading() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
                {/* Animated Logo */}
                <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-spin opacity-75"
                            style={{ animationDuration: '1.5s' }}></div>
                        <div className="absolute inset-2 rounded-full bg-slate-900 flex items-center justify-center">
                            <span className="text-3xl animate-pulse">⚡</span>
                        </div>
                    </div>
                </div>

                {/* Loading Text */}
                <h2 className="text-xl font-semibold text-white mb-2">Loading your schedule...</h2>
                <p className="text-gray-400 text-sm">Fetching habits and tasks</p>

                {/* Animated Dots */}
                <div className="flex justify-center gap-1 mt-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    )
}
