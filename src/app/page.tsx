'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Floating particle component
function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-purple-500/20 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  )
}

// Typing animation hook
function useTypingEffect(text: string, speed: number = 100) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1))
        i++
      } else {
        setIsComplete(true)
        clearInterval(timer)
      }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])

  return { displayedText, isComplete }
}

// Interactive habit demo
function HabitDemo() {
  const [checked, setChecked] = useState([false, false, false, false, false, false, false])
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const checkedCount = checked.filter(Boolean).length

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">💪</span>
        <div>
          <h3 className="text-white font-semibold">Morning Workout</h3>
          <p className="text-sm text-gray-400">{checkedCount}/7 days completed</p>
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        {days.map((day, i) => (
          <button
            key={i}
            onClick={() => {
              const newChecked = [...checked]
              newChecked[i] = !newChecked[i]
              setChecked(newChecked)
            }}
            className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-all ${checked[i]
                ? 'bg-green-500 border-green-400 text-white scale-110'
                : 'bg-white/10 border-white/20 text-gray-400 hover:bg-white/20'
              }`}
          >
            {checked[i] ? '✓' : day}
          </button>
        ))}
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
          style={{ width: `${(checkedCount / 7) * 100}%` }}
        />
      </div>
      <p className="text-center text-xs text-gray-500 mt-2">Try clicking the days! 👆</p>
    </div>
  )
}

// Streak counter mini-game
function StreakGame() {
  const [streak, setStreak] = useState(0)
  const [lastClick, setLastClick] = useState(0)
  const [isActive, setIsActive] = useState(false)

  const handleClick = () => {
    const now = Date.now()
    if (now - lastClick < 1000) {
      setStreak(s => s + 1)
    } else {
      setStreak(1)
    }
    setLastClick(now)
    setIsActive(true)
    setTimeout(() => setIsActive(false), 100)
  }

  return (
    <div className="text-center">
      <p className="text-gray-400 text-sm mb-2">Quick! Tap as fast as you can:</p>
      <button
        onClick={handleClick}
        className={`w-20 h-20 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-3xl shadow-lg transition-all ${isActive ? 'scale-90' : 'scale-100 hover:scale-105'
          }`}
      >
        🔥
      </button>
      <div className="mt-2">
        <span className="text-2xl font-bold text-white">{streak}</span>
        <span className="text-gray-400 text-sm ml-1">streak!</span>
      </div>
      {streak >= 10 && <p className="text-yellow-400 text-sm animate-pulse">🌟 Amazing! You&apos;re on fire!</p>}
    </div>
  )
}

// Animated counter
function AnimatedCounter({ target, label }: { target: number; label: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0
          const duration = 2000
          const step = target / (duration / 16)
          const timer = setInterval(() => {
            start += step
            if (start >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(start))
            }
          }, 16)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        {count}+
      </div>
      <p className="text-gray-400 text-sm">{label}</p>
    </div>
  )
}

// Motivational quotes
const quotes = [
  "The secret of getting ahead is getting started.",
  "Small daily improvements are the key to staggering long-term results.",
  "You don't have to be great to start, but you have to start to be great.",
  "Every day is a new opportunity to change your life.",
  "Consistency is what transforms average into excellence.",
]

function MotivationalQuote() {
  const [quoteIndex, setQuoteIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex(i => (i + 1) % quotes.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 text-center">
      <p className="text-lg text-gray-300 italic transition-all duration-500">
        &quot;{quotes[quoteIndex]}&quot;
      </p>
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()
  const { displayedText, isComplete } = useTypingEffect('Schedule Tracker', 80)

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) router.push('/dashboard')
    }
    checkUser()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <FloatingParticles />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20 relative">
        <div className="text-center">
          {/* Animated logo */}
          <div className="relative inline-block mb-6">
            <div className="text-7xl animate-bounce">⚡</div>
            <div className="absolute inset-0 text-7xl blur-xl opacity-50 animate-pulse">⚡</div>
          </div>

          {/* Typing animation title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-4 h-20">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              {displayedText}
            </span>
            {!isComplete && <span className="animate-blink text-purple-400">|</span>}
          </h1>

          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto animate-fade-in">
            Ultimate Habit and Tasks Tracker. Transform your daily actions into clear, real-time insights.
          </p>

          {/* CTA Buttons with hover effects */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/50 hover:scale-105"
            >
              Get Started Free
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <a
              href="#demo"
              className="px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/10 hover:border-purple-500/50 hover:scale-105"
            >
              Try Demo 🎮
            </a>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-3 gap-8">
          <AnimatedCounter target={1000} label="Active Users" />
          <AnimatedCounter target={50000} label="Habits Tracked" />
          <AnimatedCounter target={99} label="Uptime %" />
        </div>
      </div>

      {/* Interactive Demo Section */}
      <div id="demo" className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-white mb-4">
          Try it yourself! 🎯
        </h2>
        <p className="text-gray-400 text-center mb-8">
          Click on the days to mark your habits complete
        </p>
        <HabitDemo />
      </div>

      {/* Mini Game Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-center text-white mb-6">
            🎮 Streak Challenge
          </h2>
          <StreakGame />
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <MotivationalQuote />
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Everything you need to build better habits ✨
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon="🎯"
            title="Track 25+ Habits"
            description="Monitor your daily habits with a visual calendar grid. See your progress at a glance."
            delay={0}
          />
          <FeatureCard
            icon="📊"
            title="Visual Analytics"
            description="Beautiful charts showing your consistency, streaks, and completion rates."
            delay={100}
          />
          <FeatureCard
            icon="📌"
            title="Day Tasks"
            description="Track one-time tasks alongside your recurring habits. Stay organized."
            delay={200}
          />
          <FeatureCard
            icon="🔄"
            title="Sync Across Devices"
            description="Your data is securely stored in the cloud. Access from anywhere."
            delay={300}
          />
          <FeatureCard
            icon="🎨"
            title="Beautiful Dark Mode"
            description="Premium design with glassmorphism effects. Easy on the eyes."
            delay={400}
          />
          <FeatureCard
            icon="⚡"
            title="Lightning Fast"
            description="Built with modern tech for instant updates and smooth interactions."
            delay={500}
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to transform your habits? 🚀
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Free forever. No credit card required. Start in 10 seconds.
          </p>
          <Link
            href="/login"
            className="inline-block px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/50 hover:scale-105"
          >
            Get Started Free →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500">
          <p>Made with ⚡ by Vaibhav • Data saved securely in the cloud</p>
          <p className="text-sm mt-2">© 2025 Schedule Tracker. All rights reserved.</p>
        </div>
      </footer>

      {/* Custom styles for animations */}
      <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
                    50% { transform: translateY(-100px) rotate(180deg); opacity: 1; }
                }
                .animate-float {
                    animation: float 15s ease-in-out infinite;
                }
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
                .animate-blink {
                    animation: blink 0.8s infinite;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out 0.5s both;
                }
            `}</style>
    </div>
  )
}

function FeatureCard({ icon, title, description, delay }: { icon: string; title: string; description: string; delay: number }) {
  return (
    <div
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-purple-500/50 transition-all hover:scale-105 hover:-translate-y-1 group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
