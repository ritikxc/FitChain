import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { motion, useInView } from 'framer-motion'
const FEATURES = [
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>, title: 'Intelligent Macro Tracking', desc: 'Log meals with instant macro calculations. Know exactly what fuel your body is absorbing.', colSpan: 'md:col-span-2' },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>, title: 'Precision Targets', desc: 'Dynamic goals that adapt to your body composition changes and performance.', colSpan: 'md:col-span-1' },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>, title: 'Performance Analytics', desc: 'Visualize your progression with professional-grade data charting and weekly reviews.', colSpan: 'md:col-span-1' },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m14.5 14.5-9-9" /><path d="M4.5 10.5 10.5 4.5" /><path d="M13.5 19.5 19.5 13.5" /><path d="M19 13l-6-6" /><path d="M11 19l-6-6" /><path d="M4 14l-2-2 2-2 2 2" /><path d="M22 10l-2-2-2 2 2 2" /><path d="M8 22l-2-2 2-2 2 2" /><path d="M20 4l-2-2-2 2 2 2" /></svg>, title: 'Adaptive Programming', desc: 'Workout routines calibrated to your environment, whether at home or in an elite facility.', colSpan: 'md:col-span-2' },
]
const STATS = [
  { value: '50k+', label: 'Active Athletes' },
  { value: '2M+', label: 'Meals Logged' },
  { value: '98%', label: 'Goal Attainment' },
  { value: '4.9', label: 'App Store Rating' },
]
const PLANS = [
  {
    name: 'Foundation', price: '$0', period: 'forever',
    features: ['Standard meal logging', 'Basic macros', 'Home programming', 'Weekly summary'],
    cta: 'Start Free', highlight: false,
  },
  {
    name: 'Elite', price: '$9', period: 'per month',
    features: ['Unlimited logging', 'All environments', 'Advanced analytics', 'Custom goals', 'Priority access'],
    cta: 'Begin Trial', highlight: true,
  },
  {
    name: 'Coaching', price: '$29', period: 'per month',
    features: ['Everything in Elite', '5 connected users', 'Team dashboards', 'Shared programming', 'Concierge support'],
    cta: 'Contact Sales', highlight: false,
  },
]
const MEALS_DEMO = [
  { name: 'Oats & Protein', cal: 420, p: 35, c: 50, f: 8 },
  { name: 'Steak & Rice', cal: 750, p: 65, c: 70, f: 22 },
  { name: 'Greek Yogurt', cal: 200, p: 20, c: 15, f: 4 },
]
const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
}
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}
export default function LandingPage() {
  return (
    <div className="min-h-screen relative bg-surface-default selection:bg-brand-green selection:text-black">
      <div className="bg-mesh" />
      <Navbar />
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-brand-green/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl"
          >
            <motion.div variants={fadeUpVariant} className="mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-green rounded-sm" />
              <span className="font-mono text-xs uppercase tracking-widest text-brand-green font-bold">The Standard in Fitness Data</span>
            </motion.div>
            <motion.h1 variants={fadeUpVariant} className="font-display font-bold text-5xl sm:text-7xl lg:text-[5.5rem] leading-[1.05] tracking-tight mb-8">
              Engineer Your <br/>
              <span className="text-brand-green">Peak Performance.</span>
            </motion.h1>
            <motion.p variants={fadeUpVariant} className="text-lg sm:text-xl text-text-secondary max-w-2xl mb-12 leading-relaxed">
              FitChain combines surgical precision in nutrition tracking with adaptive programming. Built for those who treat their body like a high-performance machine.
            </motion.p>
            <motion.div variants={fadeUpVariant} className="flex flex-wrap items-center gap-4 mb-20">
              <Link to="/signup" className="btn-gradient px-8 py-4 text-base">
                Commence Training
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </Link>
              <Link to="/login" className="btn-glass px-8 py-4 text-base">
                System Login
              </Link>
            </motion.div>
            <motion.div variants={fadeUpVariant} className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-8 border-t border-surface-border">
              {STATS.map(s => (
                <div key={s.label}>
                  <div className="font-mono font-bold text-3xl mb-1 text-white">{s.value}</div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* FEATURES BENTO GRID */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.h2 variants={fadeUpVariant} className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight mb-4">
              Precision Tools. <br/>
              <span className="text-text-muted">Zero Distractions.</span>
            </motion.h2>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
          >
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} variants={fadeUpVariant} 
                className={`bg-surface-card border border-surface-border p-8 rounded-xl ${f.colSpan} hover:border-surface-border/80 transition-colors`}
              >
                <div className="text-3xl mb-6 bg-surface-default w-12 h-12 flex items-center justify-center rounded-lg border border-surface-border">{f.icon}</div>
                <h3 className="font-display font-bold text-xl text-white mb-3 tracking-tight">{f.title}</h3>
                <p className="text-text-secondary leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* PREVIEW SECTION */}
      <section id="about" className="py-32 bg-surface-card border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeUpVariant} className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight mb-6">
                Data visualised <br/>
                <span className="text-brand-orange">in real time.</span>
              </motion.h2>
              <motion.p variants={fadeUpVariant} className="text-lg text-text-secondary leading-relaxed mb-8">
                Your body's telemetry delivered instantly. Monitor intake against expenditure with zero latency. The interface gets out of your way so you can focus on the work.
              </motion.p>
              <motion.ul variants={fadeUpVariant} className="space-y-4">
                {['Live telemetry with responsive rings', 'Granular macronutrient breakdown', 'Frictionless log entries', 'Historical performance charting'].map(item => (
                  <li key={item} className="flex items-center gap-3 font-medium text-text-primary">
                    <div className="w-1.5 h-1.5 bg-brand-orange rounded-sm" />
                    {item}
                  </li>
                ))}
              </motion.ul>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-surface-default rounded-xl p-6 sm:p-8 border border-surface-border relative"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h4 className="font-display font-bold text-lg text-white">Daily Telemetry</h4>
                  <p className="text-sm text-text-muted mt-1 font-mono uppercase tracking-wider">Active Day</p>
                </div>
                
                {/* Progress Ring */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="#2A2A2A" strokeWidth="4" />
                    <circle cx="32" cy="32" r="28" fill="none" stroke="#FF7A00" strokeWidth="4" strokeDasharray="130 176" strokeLinecap="square" />
                  </svg>
                  <div className="absolute font-mono font-bold text-xs">74%</div>
                </div>
              </div>
              <div className="space-y-3 mb-8">
                {MEALS_DEMO.map((meal, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-surface-card border border-surface-border">
                    <div>
                      <p className="font-bold text-sm text-white">{meal.name}</p>
                      <div className="flex gap-3 mt-1.5 font-mono text-[10px] uppercase tracking-wider font-bold">
                        <span className="text-text-secondary">P: <span className="text-white">{meal.p}g</span></span>
                        <span className="text-text-secondary">C: <span className="text-white">{meal.c}g</span></span>
                        <span className="text-text-secondary">F: <span className="text-white">{meal.f}g</span></span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-brand-green">{meal.cal}</span>
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t border-surface-border">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-semibold text-text-secondary">Expenditure Capacity</span>
                  <span className="font-mono font-bold text-brand-orange text-xl">1,370 / 1,850</span>
                </div>
                <div className="w-full h-2 bg-surface-card border border-surface-border rounded-sm overflow-hidden mt-3">
                  <div className="h-full bg-brand-orange w-[74%] rounded-sm" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* PRICING */}
      <section id="plans" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.h2 variants={fadeUpVariant} className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight mb-4">
              Select your tier.
            </motion.h2>
            <motion.p variants={fadeUpVariant} className="text-lg text-text-secondary">
              Professional tools priced for accessibility.
            </motion.p>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {PLANS.map((plan, i) => (
              <motion.div key={plan.name} variants={fadeUpVariant} 
                className={`flex flex-col bg-surface-card rounded-xl p-8 border ${plan.highlight ? 'border-brand-green' : 'border-surface-border'} relative`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-8 bg-brand-green text-surface-default font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-sm">
                    Recommended
                  </div>
                )}
                <h3 className="font-display font-bold text-2xl text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="font-mono font-bold text-4xl text-white">{plan.price}</span>
                  <span className="text-sm font-medium text-text-muted">/{plan.period}</span>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-3 text-sm font-medium text-text-secondary">
                      <svg className={`w-5 h-5 shrink-0 ${plan.highlight ? 'text-brand-green' : 'text-surface-border'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className={`w-full text-center font-display font-bold text-sm py-3.5 rounded transition-colors ${
                  plan.highlight 
                    ? 'bg-brand-green text-surface-default hover:bg-white' 
                    : 'bg-surface-default text-white border border-surface-border hover:border-text-secondary'
                }`}>
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* FOOTER */}
      <footer className="py-12 border-t border-surface-border bg-surface-default">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-surface-default" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-6a6 6 0 100 12A6 6 0 0010 4z" clipRule="evenodd"/>
              </svg>
            </div>
            <span className="font-display font-bold text-white tracking-tight">FitChain</span>
          </div>
          <p className="text-sm font-medium text-text-muted">© 2026 FitChain Systems.</p>
        </div>
      </footer>
    </div>
  )
}
