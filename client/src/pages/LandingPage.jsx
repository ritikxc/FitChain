import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, CheckCircle2, Clock3, Dumbbell, Flame, HeartPulse, Sparkles, TrendingUp, Utensils, UserCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

const STATS = [
  { value: '50K+', label: 'Meals logged' },
  { value: '10K+', label: 'Active users' },
  { value: '95%', label: 'Goal completion' },
  { value: '4.9★', label: 'User rating' },
]

const FEATURES = [
  { icon: Utensils, title: 'Calorie Tracking', description: 'Keep meals simple with a calm daily overview that stays focused on what matters.' },
  { icon: Flame, title: 'Macro Tracking', description: 'Monitor protein, carbs, and fats with clean, easy-to-read summaries.' },
  { icon: BarChart3, title: 'Weekly Analytics', description: 'See progress clearly with thoughtful charts and steady weekly insights.' },
  { icon: TrendingUp, title: 'Progress Insights', description: 'Spot momentum over time without overwhelming visuals or unnecessary noise.' },
  { icon: HeartPulse, title: 'Meal Logging', description: 'Add meals quickly and keep your nutrition routine consistent.' },
  { icon: Dumbbell, title: 'Fitness Dashboard', description: 'Stay aligned with your goals through a polished, actionable planning view.' },
]

const STEPS = [
  { title: 'Create Account', description: 'Set up your profile and choose the goals that matter most to you.' },
  { title: 'Log Meals', description: 'Capture the foods you eat and keep your daily nutrition on track.' },
  { title: 'Track Progress', description: 'Review weekly trends and adjust with confidence as your journey evolves.' },
]

const TESTIMONIALS = [
  { quote: 'It feels calm, clear, and actually motivating. I finally have a system that works without the stress.', author: 'Maya L.' },
  { quote: 'The layout is so clean that I use it every day. Logging meals and checking trends takes seconds.', author: 'Jordan P.' },
  { quote: 'This is the first fitness app that feels premium and simple instead of overwhelming.', author: 'Alicia R.' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f7f7] text-[#111111]">
      <header className="sticky top-0 z-40 border-b border-[#e5e5e5] bg-[#fcfcfc]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#111111] text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">FitChain</p>
              <p className="text-sm text-[#666666]">Fitness OS</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-[#666666] md:flex">
            <a href="#features" className="transition hover:text-[#111111]">Features</a>
            <a href="#how-it-works" className="transition hover:text-[#111111]">How it Works</a>
            <a href="#about" className="transition hover:text-[#111111]">About</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/login" className="button-secondary px-3 py-2 text-sm sm:px-4">Login</Link>
            <Link to="/signup" className="button-primary px-3 py-2 text-sm sm:px-4">Get Started</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }} className="max-w-2xl">
            <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e5e5e5] bg-white px-3 py-2 text-sm text-[#666666] shadow-sm">
              <Sparkles className="h-4 w-4 text-[#2563eb]" />
              Built for a calmer, stronger routine
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Track Smarter. Eat Better. Reach Your Fitness Goals.
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg leading-8 text-[#666666]">
              FitChain brings your meals, workouts, and weekly progress into one refined space so you can stay focused and consistent without the clutter.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup" className="button-primary px-6 py-3">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="button-secondary px-6 py-3">Sign In</Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="rounded-[20px] border border-[#e5e5e5] bg-white p-4 shadow-sm">
                  <p className="text-xl font-semibold">{stat.value}</p>
                  <p className="mt-1 text-sm text-[#666666]">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="rounded-[32px] border border-[#e5e5e5] bg-white p-4 shadow-sm">
            <div className="rounded-[24px] border border-[#e5e5e5] bg-[#fcfcfc] p-4">
              <div className="flex items-center justify-between rounded-[18px] border border-[#e5e5e5] bg-white px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">Daily overview</p>
                  <p className="text-sm text-[#666666]">Balanced and steady</p>
                </div>
                <div className="pill">On track</div>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[20px] border border-[#e5e5e5] bg-[#f7f7f7] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="section-title">Calories</p>
                      <p className="mt-2 text-2xl font-semibold">1,840 / 2,200</p>
                    </div>
                    <div className="rounded-full border border-[#dce9ff] bg-[#f4f8ff] px-3 py-1 text-sm font-semibold text-[#2563eb]">84%</div>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-[#e5e5e5]">
                    <div className="h-2 w-[84%] rounded-full bg-[#111111]" />
                  </div>
                  <p className="mt-3 text-sm text-[#666666]">360 kcal remaining</p>
                </div>

                <div className="rounded-[20px] border border-[#e5e5e5] bg-white p-4">
                  <p className="section-title">Today</p>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between rounded-2xl bg-[#f7f7f7] px-3 py-3">
                      <span className="text-sm text-[#666666]">Meal entries</span>
                      <span className="font-semibold">4</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-[#f7f7f7] px-3 py-3">
                      <span className="text-sm text-[#666666]">Protein</span>
                      <span className="font-semibold">155g</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-[#f7f7f7] px-3 py-3">
                      <span className="text-sm text-[#666666]">Hydration</span>
                      <span className="font-semibold">3.2L</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-[20px] border border-[#e5e5e5] bg-white p-4">
                  <div className="flex items-center gap-2">
                    <Utensils className="h-4 w-4" />
                    <p className="font-semibold">Breakfast</p>
                  </div>
                  <p className="mt-3 text-sm text-[#666666]">Oats & protein yogurt</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#666666]">
                    <span className="pill">P 35g</span>
                    <span className="pill">C 45g</span>
                    <span className="pill">F 12g</span>
                  </div>
                </div>
                <div className="rounded-[20px] border border-[#e5e5e5] bg-white p-4">
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    <p className="font-semibold">Workout</p>
                  </div>
                  <p className="mt-3 text-sm text-[#666666]">Upper body strength plan</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#666666]">
                    <span className="pill">45 min</span>
                    <span className="pill">Gym</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-title">Features</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">Thoughtful tools for every step of your routine.</h2>
            </div>
            <p className="max-w-xl text-[#666666]">From logging meals to reviewing progress, everything is designed to stay clear, calm, and useful.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="rounded-[24px] border border-[#e5e5e5] bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f7f7f7]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#666666]">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-[#e5e5e5] bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-8">
              <p className="section-title">How it works</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">A simple rhythm that keeps you moving.</h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {STEPS.map((step, index) => (
                <div key={step.title} className="rounded-[24px] border border-[#e5e5e5] bg-[#fcfcfc] p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111111] text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#666666]">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-[#e5e5e5] bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <p className="section-title">Dashboard showcase</p>
                <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">A preview of the experience you’ll come back to every day.</h2>
                <p className="mt-4 max-w-xl text-lg leading-8 text-[#666666]">
                  The interface stays calm and easy to scan, with everything from nutrition to training planning visible at a glance.
                </p>
                <div className="mt-6 space-y-3 text-sm text-[#666666]">
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#16a34a]" /> Clear daily summaries</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#16a34a]" /> Minimal but useful charts</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#16a34a]" /> Focused actions for progress</div>
                </div>
              </div>

              <div className="rounded-[24px] border border-[#e5e5e5] bg-[#fcfcfc] p-4">
                <div className="rounded-[18px] border border-[#e5e5e5] bg-white p-4">
                  <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-4">
                    <div>
                      <p className="font-semibold">Weekly review</p>
                      <p className="text-sm text-[#666666]">Your momentum this week</p>
                    </div>
                    <div className="pill">+12%</div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-[#f7f7f7] p-3">
                      <p className="text-sm text-[#666666]">Calories</p>
                      <p className="mt-2 text-xl font-semibold">16.2k</p>
                    </div>
                    <div className="rounded-2xl bg-[#f7f7f7] p-3">
                      <p className="text-sm text-[#666666]">Protein</p>
                      <p className="mt-2 text-xl font-semibold">152g</p>
                    </div>
                    <div className="rounded-2xl bg-[#f7f7f7] p-3">
                      <p className="text-sm text-[#666666]">Workouts</p>
                      <p className="mt-2 text-xl font-semibold">4/7</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-[20px] border border-[#e5e5e5] bg-[#f7f7f7] p-4">
                    <div className="flex items-end justify-between">
                      <p className="text-sm font-semibold">Progress trend</p>
                      <p className="text-sm text-[#666666]">Steady rise</p>
                    </div>
                    <div className="mt-4 flex h-24 items-end gap-2">
                      {[40, 70, 56, 82, 76, 92, 88].map((height, index) => (
                        <div key={index} className="flex-1 rounded-t-full bg-[#111111]" style={{ height: `${height}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="section-title">Testimonials</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">What people are saying.</h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <div key={testimonial.author} className="rounded-[24px] border border-[#e5e5e5] bg-white p-6 shadow-sm">
                <p className="text-lg leading-8 text-[#111111]">“{testimonial.quote}”</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7f7f7] text-sm font-semibold">{testimonial.author.split(' ')[0][0]}</div>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-[#666666]">FitChain member</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-[#e5e5e5] bg-[#111111] p-8 text-white shadow-sm sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="section-title text-[#bdbdbd]">Start today</p>
                <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">Build a routine that feels clear, consistent, and rewarding.</h2>
              </div>
              <Link to="/signup" className="button-primary bg-white px-6 py-3 text-[#111111] hover:bg-[#f7f7f7]">
                Start Tracking Today <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e5e5e5] bg-[#fcfcfc]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#111111] text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">FitChain</p>
              <p className="text-sm text-[#666666]">Fitness OS</p>
            </div>
          </div>

          <div className="grid gap-6 text-sm text-[#666666] sm:grid-cols-3">
            <div>
              <p className="font-semibold text-[#111111]">Quick links</p>
              <ul className="mt-3 space-y-2">
                <li><a href="#features" className="transition hover:text-[#111111]">Features</a></li>
                <li><a href="#how-it-works" className="transition hover:text-[#111111]">How it Works</a></li>
                <li><a href="#about" className="transition hover:text-[#111111]">About</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-[#111111]">Contact</p>
              <ul className="mt-3 space-y-2">
                <li><a href="mailto:hello@fitchain.app" className="transition hover:text-[#111111]">hello@fitchain.app</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-[#111111]">GitHub</p>
              <ul className="mt-3 space-y-2">
                <li><a href="https://github.com" target="_blank" rel="noreferrer" className="transition hover:text-[#111111]">Open Source</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
