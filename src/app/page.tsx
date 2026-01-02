'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Dynamic animated background with gradient mesh
function AnimatedBackground() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-slate-900 to-slate-950" />

      {/* Large animated gradient blobs with parallax */}
      <div
        className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-blob"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      />
      <div
        className="absolute top-1/4 -right-40 w-80 h-80 bg-pink-600/25 rounded-full blur-3xl animate-blob animation-delay-2000"
        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
      />
      <div
        className="absolute top-1/2 left-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-blob animation-delay-4000"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-blob animation-delay-3000"
        style={{ transform: `translateY(${-scrollY * 0.12}px)` }}
      />
      <div
        className="absolute -bottom-40 left-1/3 w-80 h-80 bg-violet-600/25 rounded-full blur-3xl animate-blob animation-delay-1000"
        style={{ transform: `translateY(${-scrollY * 0.08}px)` }}
      />

      {/* Floating particles */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            background: `rgba(${Math.random() > 0.5 ? '168, 85, 247' : '236, 72, 153'}, ${0.1 + Math.random() * 0.3})`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${15 + Math.random() * 20}s`,
            transform: `translateY(${scrollY * (0.05 + Math.random() * 0.1)}px)`,
          }}
        />
      ))}

      {/* Grid overlay for depth */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
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

// Memory Match mini-game
function MemoryGame() {
  const icons = ['💪', '📚', '🧘', '💧', '🥗', '😴', '🚶', '🎨']
  const [cards, setCards] = useState<{ icon: string; flipped: boolean; matched: boolean }[]>([])
  const [flippedIndices, setFlippedIndices] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)

  // Initialize game
  useEffect(() => {
    const shuffled = [...icons, ...icons]
      .sort(() => Math.random() - 0.5)
      .map(icon => ({ icon, flipped: false, matched: false }))
    setCards(shuffled)
  }, [])

  const handleCardClick = (index: number) => {
    if (cards[index].flipped || cards[index].matched || flippedIndices.length >= 2) return

    const newCards = [...cards]
    newCards[index].flipped = true
    setCards(newCards)

    const newFlipped = [...flippedIndices, index]
    setFlippedIndices(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      const [first, second] = newFlipped
      if (cards[first].icon === cards[second].icon) {
        // Match found!
        setTimeout(() => {
          const matched = [...cards]
          matched[first].matched = true
          matched[second].matched = true
          setCards(matched)
          setFlippedIndices([])
          if (matched.every(c => c.matched)) {
            setGameComplete(true)
          }
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          const reset = [...cards]
          reset[first].flipped = false
          reset[second].flipped = false
          setCards(reset)
          setFlippedIndices([])
        }, 1000)
      }
    }
  }

  const resetGame = () => {
    const shuffled = [...icons, ...icons]
      .sort(() => Math.random() - 0.5)
      .map(icon => ({ icon, flipped: false, matched: false }))
    setCards(shuffled)
    setFlippedIndices([])
    setMoves(0)
    setGameComplete(false)
  }

  return (
    <div className="text-center">
      <p className="text-gray-400 text-sm mb-4">Find all matching habit pairs!</p>
      <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto mb-4">
        {cards.map((card, i) => (
          <button
            key={i}
            onClick={() => handleCardClick(i)}
            disabled={card.matched}
            className={`w-14 h-14 rounded-lg text-2xl flex items-center justify-center transition-all duration-300 ${card.matched
              ? 'bg-green-500/30 border-2 border-green-500'
              : card.flipped
                ? 'bg-purple-600 border-2 border-purple-400 scale-105'
                : 'bg-white/10 border-2 border-white/20 hover:bg-white/20'
              }`}
          >
            {card.flipped || card.matched ? card.icon : '❓'}
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-4 items-center">
        <span className="text-gray-400">Moves: <strong className="text-white">{moves}</strong></span>
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-all"
        >
          🔄 Reset
        </button>
      </div>
      {gameComplete && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg animate-pulse">
          <p className="text-green-400 font-semibold">🎉 Congratulations! You won in {moves} moves!</p>
        </div>
      )}
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
    <div className="min-h-screen bg-slate-950 overflow-hidden relative">
      <AnimatedBackground />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20 relative">
        <div className="text-center">
          {/* Animated logo */}
          <div className="relative inline-block mb-6 cursor-default select-none">
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
          <AnimatedCounter target={100} label="Active Users" />
          <AnimatedCounter target={500} label="Habits Tracked" />
          <AnimatedCounter target={99} label="Uptime %" />
        </div>
      </div>

      {/* Interactive Games Section - Side by Side */}
      <div id="demo" className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-white mb-4">
          Try it yourself! 🎯
        </h2>
        <p className="text-gray-400 text-center mb-8">
          Interactive demos to explore
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Habit Demo - Left */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-center text-white mb-4">📅 Weekly Habit Tracker</h3>
            <HabitDemo />
          </div>
          {/* Memory Game - Right */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-center text-white mb-4">🎮 Habit Memory Match</h3>
            <MemoryGame />
          </div>
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
          <p className="text-sm mt-2">© 2026 Schedule Tracker. All rights reserved.</p>
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
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(20px, -30px) scale(1.05); }
                    50% { transform: translate(-20px, 20px) scale(0.95); }
                    75% { transform: translate(30px, 10px) scale(1.02); }
                }
                .animate-blob {
                    animation: blob 20s ease-in-out infinite;
                }
                .animation-delay-1000 {
                    animation-delay: 1s;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-3000 {
                    animation-delay: 3s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
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
