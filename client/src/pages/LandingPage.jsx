import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useReveal, useCounter } from '../hooks/useAnimations'

// Animated counter component
function AnimCounter({ target, suffix='', prefix='' }) {
  const [ref, visible] = useReveal(0.3)
  const count = useCounter(target, 1800, visible)
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

// Scroll reveal wrapper
function Reveal({ children, delay=0, className='' }) {
  const [ref, visible] = useReveal()
  return (
    <div ref={ref} className={`reveal ${visible?'visible':''} ${className}`}
      style={{ transitionDelay:`${delay}ms` }}>
      {children}
    </div>
  )
}

const FEATURES = [
  { icon:'⚡', title:'Smart Calorie Tracking', desc:'Log meals in seconds with automatic macro calculations. Never lose track of your nutrition goals.', color:'#00ff87' },
  { icon:'🏋️', title:'AI Workout Plans', desc:'Personalized plans for home or gym. Hypertrophy, strength, or endurance — tuned to your goals.', color:'#00d4ff' },
  { icon:'📊', title:'Visual Analytics', desc:'Beautiful real-time charts showing your weekly nutrition trends and performance data.', color:'#bf5fff' },
  { icon:'🎯', title:'Goal Engine', desc:'Set targets, track progress, hit milestones. The system adapts to keep you on the right path.', color:'#ffb700' },
]

const STATS = [
  { value:50000, suffix:'+ ', label:'Active Athletes' },
  { value:2, suffix:'M+ ', label:'Meals Tracked' },
  { value:98, suffix:'%', label:'Satisfaction Rate' },
  { value:14, suffix:' lbs', label:'Avg. Weight Lost' },
]

const PLANS = [
  {
    name:'Starter', price:'$0', period:'forever',
    color:'rgba(255,255,255,0.05)', border:'rgba(255,255,255,0.08)',
    features:['Meal tracking (5/day)','Basic macro tracking','Home workout plans','Weekly progress view'],
    cta:'Start Free', highlight:false,
  },
  {
    name:'Pro', price:'$9', period:'per month',
    color:'rgba(0,255,135,0.06)', border:'rgba(0,255,135,0.25)',
    features:['Unlimited meal logging','All workout plans','Advanced analytics','Custom calorie goals','Priority support'],
    cta:'Start Free Trial', highlight:true,
  },
  {
    name:'Team', price:'$29', period:'per month',
    color:'rgba(0,212,255,0.05)', border:'rgba(0,212,255,0.15)',
    features:['Everything in Pro','Up to 5 users','Team analytics','Shared workout plans','Dedicated support'],
    cta:'Contact Sales', highlight:false,
  },
]

const MEALS_DEMO = [
  { name:'Oats + Blueberries', cal:380, p:12, c:68, f:6 },
  { name:'Grilled Chicken Bowl', cal:620, p:52, c:74, f:8 },
  { name:'Greek Yogurt + Honey', cal:150, p:17, c:9, f:3 },
  { name:'Protein Shake', cal:280, p:40, c:18, f:4 },
]

export default function LandingPage() {
  // Hero scan line effect
  const heroRef = useRef(null)

  return (
    <div className="min-h-screen relative" style={{background:'var(--bg-void)'}}>
      <div className="bg-mesh"/>
      <div className="bg-grid-pattern absolute inset-0 pointer-events-none"/>
      <Navbar/>

      {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Orbs */}
        <div className="orb orb-green w-96 h-96 -top-20 -left-20" style={{width:'500px',height:'500px'}}/>
        <div className="orb orb-blue w-80 h-80 bottom-10 right-10" style={{width:'400px',height:'400px'}}/>
        <div className="orb orb-purple" style={{width:'300px',height:'300px',top:'40%',left:'50%',transform:'translateX(-50%)'}}/>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full py-20">
          <div className="max-w-4xl mx-auto text-center">

            {/* Tag */}
            <div className="animate-fade-up flex justify-center mb-8">
              <span className="section-tag">
                <span className="w-1.5 h-1.5 rounded-full" style={{background:'#00ff87',boxShadow:'0 0 6px #00ff87',animation:'neonPulse 2s ease-in-out infinite'}}/>
                The Future of Fitness Tracking
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up delay-100 font-black leading-none mb-6"
              style={{fontSize:'clamp(3rem,8vw,6rem)', letterSpacing:'-0.03em'}}>
              <span className="text-white block">Forge Your</span>
              <span className="text-gradient-green block glow-green">Unbreakable</span>
              <span className="text-white block">Chain</span>
            </h1>

            {/* Subtext */}
            <p className="animate-fade-up delay-200 text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{color:'var(--text-secondary)'}}>
              FitChain is the only fitness platform that combines smart nutrition tracking,
              AI-powered workout plans, and real-time analytics — all in one sleek dashboard.
            </p>

            {/* CTAs */}
            <div className="animate-fade-up delay-300 flex flex-wrap items-center justify-center gap-4 mb-16">
              <Link to="/signup" className="btn-gradient text-base px-8 py-4">
                Start For Free
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </Link>
              <Link to="/login" className="btn-glass text-base px-8 py-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Watch Demo
              </Link>
            </div>

            {/* Stats row */}
            <div className="animate-fade-up delay-400 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {STATS.map(s => (
                <div key={s.label} className="text-center">
                  <div className="font-black text-3xl mb-1 text-gradient-green">
                    <AnimCounter target={s.value} suffix={s.suffix}/>
                  </div>
                  <div className="text-xs" style={{color:'var(--text-muted)'}}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{background:'linear-gradient(to top,var(--bg-void),transparent)'}}/>
      </section>

      {/* Divider */}
      <div className="divider-neon mx-8"/>

      {/* ═══════════════════════════════ FEATURES ═══════════════════════════════ */}
      <section id="features" className="py-28 relative">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <Reveal>
              <span className="section-tag mb-5 inline-flex">Platform Features</span>
              <h2 className="font-black text-4xl sm:text-5xl text-white mt-4 mb-4" style={{letterSpacing:'-0.02em'}}>
                Everything you need<br/>
                <span className="text-gradient-green">to dominate</span>
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{color:'var(--text-secondary)'}}>
                From meal logging to progress visualization — FitChain gives you every tool to reach your goals faster.
              </p>
            </Reveal>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i*100}>
                <div className="glass p-6 h-full relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{background:`linear-gradient(90deg,transparent,${f.color},transparent)`}}/>
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="font-bold text-white mb-2 text-sm">{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{color:'var(--text-secondary)'}}>{f.desc}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold" style={{color:f.color}}>
                    Learn more <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ PREVIEW ═══════════════════════════════ */}
      <section id="about" className="py-28 relative overflow-hidden">
        <div className="orb orb-green" style={{width:'400px',height:'400px',right:'-100px',top:'50%',transform:'translateY(-50%)'}}/>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <span className="section-tag mb-5 inline-flex">Smart Nutrition</span>
              <h2 className="font-black text-4xl text-white mt-4 mb-6" style={{letterSpacing:'-0.02em'}}>
                Track every macro<br/>
                <span className="text-gradient-green">in seconds</span>
              </h2>
              <p className="leading-relaxed mb-8" style={{color:'var(--text-secondary)'}}>
                Our streamlined logging interface lets you add meals with full macro breakdowns instantly.
                Watch your daily calorie ring fill up in real time and stay perfectly on target.
              </p>
              <ul className="space-y-3">
                {['Real-time calorie counter with animated ring','Full macro breakdown: protein, carbs & fats','Delete and edit meals with one click','7-day history with beautiful charts'].map(item=>(
                  <li key={item} className="flex items-center gap-3 text-sm" style={{color:'var(--text-primary)'}}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{background:'rgba(0,255,135,0.15)',border:'1px solid rgba(0,255,135,0.3)'}}>
                      <svg className="w-3 h-3" style={{color:'#00ff87'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Live preview card */}
            <Reveal delay={200}>
              <div className="glass-static rounded-2xl p-5 relative" style={{border:'1px solid rgba(0,255,135,0.15)',boxShadow:'0 0 40px rgba(0,255,135,0.05)'}}>
                <div className="absolute top-0 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,#00ff87,#00d4ff,transparent)'}}/>

                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="font-bold text-white text-sm">Today's Calories</p>
                    <p className="text-xs" style={{color:'var(--text-muted)'}}>Tuesday, Feb 28</p>
                  </div>
                  <span className="badge-green">1,840 / 2,200</span>
                </div>

                <div className="space-y-2 mb-5">
                  {MEALS_DEMO.map(meal => (
                    <div key={meal.name} className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                      style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.05)'}}>
                      <span className="text-base">🍽️</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{meal.name}</p>
                        <div className="flex gap-2 mt-0.5">
                          <span className="text-xs font-mono" style={{color:'#00d4ff'}}>P{meal.p}g</span>
                          <span className="text-xs font-mono" style={{color:'#ffb700'}}>C{meal.c}g</span>
                          <span className="text-xs font-mono" style={{color:'#ff5050'}}>F{meal.f}g</span>
                        </div>
                      </div>
                      <span className="font-bold font-mono text-sm" style={{color:'#00ff87'}}>{meal.cal}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4" style={{borderColor:'rgba(255,255,255,0.06)'}}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold" style={{color:'var(--text-secondary)'}}>Progress</span>
                    <span className="text-xs font-mono font-bold" style={{color:'#00ff87'}}>84%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{width:'84%'}}/>
                  </div>
                  <div className="flex justify-between mt-3">
                    <span className="text-xs" style={{color:'var(--text-muted)'}}>Total</span>
                    <span className="text-base font-black font-mono" style={{color:'#00ff87'}}>1,430 kcal</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ PLANS ═══════════════════════════════ */}
      <section id="plans" className="py-28 relative">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <Reveal>
              <span className="section-tag mb-5 inline-flex">Pricing</span>
              <h2 className="font-black text-4xl sm:text-5xl text-white mt-4 mb-4" style={{letterSpacing:'-0.02em'}}>
                Simple,<br/>
                <span className="text-gradient-green">transparent pricing</span>
              </h2>
              <p className="text-lg" style={{color:'var(--text-secondary)'}}>No hidden fees. Cancel anytime.</p>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {PLANS.map((plan, i) => (
              <Reveal key={plan.name} delay={i*100}>
                <div className="relative rounded-2xl p-6 transition-all duration-300 h-full flex flex-col"
                  style={{background:plan.color, border:`1px solid ${plan.border}`, boxShadow: plan.highlight ? '0 0 40px rgba(0,255,135,0.08)' : 'none'}}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=plan.highlight?'0 20px 60px rgba(0,255,135,0.15)':'0 20px 40px rgba(0,0,0,0.4)'}}
                  onMouseLeave={e=>{e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=plan.highlight?'0 0 40px rgba(0,255,135,0.08)':'none'}}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge-green px-4 text-xs">Most Popular</div>
                  )}
                  <h3 className="font-black text-xl text-white mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="font-black text-4xl text-white">{plan.price}</span>
                    <span className="text-sm" style={{color:'var(--text-muted)'}}>/{plan.period}</span>
                  </div>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm" style={{color:'var(--text-secondary)'}}>
                        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" style={{color:plan.highlight?'#00ff87':'#00d4ff'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/signup" className={plan.highlight?'btn-gradient text-center':'btn-outline-neon text-center'} style={{borderRadius:'12px'}}>
                    {plan.cta}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ CONTACT ═══════════════════════════════ */}
      <section id="contact" className="py-28 relative overflow-hidden">
        <div className="orb orb-blue" style={{width:'600px',height:'600px',left:'50%',top:'50%',transform:'translate(-50%,-50%)'}}/>
        <div className="relative max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <Reveal>
            <span className="section-tag mb-5 inline-flex">Get In Touch</span>
            <h2 className="font-black text-4xl text-white mt-4 mb-4" style={{letterSpacing:'-0.02em'}}>
              Have questions?<br/>
              <span className="text-gradient-blue">We'd love to help.</span>
            </h2>
            <p className="mb-8" style={{color:'var(--text-secondary)'}}>
              Reach out and we'll get back to you within 24 hours.
            </p>
            <a href="mailto:hello@fitchain.app" className="btn-gradient inline-flex text-base px-8 py-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              hello@fitchain.app
            </a>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t" style={{borderColor:'rgba(255,255,255,0.05)'}}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{background:'linear-gradient(135deg,#00ff87,#00d4ff)'}}>
              <svg className="w-3.5 h-3.5 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-6a6 6 0 100 12A6 6 0 0010 4z" clipRule="evenodd"/>
              </svg>
            </div>
            <span className="font-bold text-white">FitChain</span>
          </div>
          <p className="text-xs" style={{color:'var(--text-muted)'}}>© 2025 FitChain. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy','Terms','Contact'].map(item => (
              <a key={item} href="#" className="text-xs transition-colors" style={{color:'var(--text-muted)'}}
                onMouseEnter={e=>e.target.style.color='#00ff87'} onMouseLeave={e=>e.target.style.color='var(--text-muted)'}>{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
