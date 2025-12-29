import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center">
          <div className="text-7xl mb-6 animate-pulse">⚡</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Schedule Tracker
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Ultimate Habit and Tasks Tracker. Transform your daily actions into clear, real-time insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/25"
            >
              Get Started Free
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/10"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Everything you need to build better habits
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon="🎯"
            title="Track 25+ Habits"
            description="Monitor your daily habits with a visual calendar grid. See your progress at a glance."
          />
          <FeatureCard
            icon="📊"
            title="Visual Analytics"
            description="Beautiful charts showing your consistency, streaks, and completion rates."
          />
          <FeatureCard
            icon="📌"
            title="Day Tasks"
            description="Track one-time tasks alongside your recurring habits. Stay organized."
          />
          <FeatureCard
            icon="🔄"
            title="Sync Across Devices"
            description="Your data is securely stored in the cloud. Access from anywhere."
          />
          <FeatureCard
            icon="🎨"
            title="Beautiful Dark Mode"
            description="Premium design with glassmorphism effects. Easy on the eyes."
          />
          <FeatureCard
            icon="⚡"
            title="Lightning Fast"
            description="Built with modern tech for instant updates and smooth interactions."
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Start tracking your habits today
        </h2>
        <p className="text-gray-400 mb-8">
          Free forever. No credit card required.
        </p>
        <Link
          href="/login"
          className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/25"
        >
          Get Started Free →
        </Link>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500">
          <p>Made with ⚡ by Vaibhav • Data saved securely in the cloud</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
