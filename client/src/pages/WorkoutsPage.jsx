import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { getStoredUser, updateProfile, getToken } from '../services/api'
import { getWorkoutPlan } from '../data/workouts'

const GOALS = [
  { id:'hypertrophy', label:'Hypertrophy', icon:'💪', desc:'Build muscle & size', color:'#00ff87' },
  { id:'strength', label:'Strength', icon:'🏋️', desc:'Raw power & strength', color:'#00d4ff' },
  { id:'endurance', label:'Endurance', icon:'🏃', desc:'Stamina & cardio', color:'#bf5fff' },
]

const LOCATIONS = [
  { id:'home', label:'Home', icon:'🏠', desc:'Bodyweight & minimal gear', color:'#00ff87' },
  { id:'gym', label:'Gym', icon:'🏋️‍♂️', desc:'Full equipment access', color:'#00d4ff' },
]

export default function WorkoutsPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(getStoredUser)
  const [goal, setGoal] = useState('hypertrophy')
  const [location, setLocation] = useState('gym')
  const [activeDay, setActiveDay] = useState(0)
  const [saving, setSaving] = useState(false)

  useEffect(()=>{
    if(!getToken()||!user){ navigate('/login'); return }
    if(user.profile){ setGoal(user.profile.goal||'hypertrophy'); setLocation(user.profile.location||'gym') }
  },[])

  async function handleChange(newGoal, newLoc) {
    setSaving(true)
    try { const u = await updateProfile({goal:newGoal,location:newLoc}); setUser(u) }
    catch(err) { console.error(err) }
    finally { setSaving(false) }
  }

  const plan = getWorkoutPlan(location, goal)
  const currentDay = plan?.days?.[activeDay]

  return (
    <div className="flex min-h-screen" style={{background:'var(--bg-void)'}}>
      <div className="bg-mesh"/>
      <Sidebar user={user}/>
      <main className="flex-1 md:ml-60 min-h-screen relative">
        <div className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between"
          style={{background:'rgba(2,4,8,0.9)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
          <div>
            <h1 className="font-black text-xl text-white" style={{letterSpacing:'-0.02em'}}>Workout Plans</h1>
            <p className="text-xs mt-0.5" style={{color:'var(--text-muted)'}}>Personalized to your goals</p>
          </div>
          {saving && (
            <span className="flex items-center gap-1.5 text-xs" style={{color:'#00ff87'}}>
              <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Saving...
            </span>
          )}
        </div>

        <div className="p-4 md:p-6 space-y-5 page-enter">
          {/* Selectors */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Goal */}
            <div className="glass-static p-5" style={{border:'1px solid rgba(255,255,255,0.07)'}}>
              <p className="label-neon mb-3">Fitness Goal</p>
              <div className="space-y-2">
                {GOALS.map(g=>(
                  <button key={g.id} onClick={()=>{ setGoal(g.id); setActiveDay(0); handleChange(g.id,location) }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left"
                    style={goal===g.id
                      ? {background:`rgba(${g.color==='#00ff87'?'0,255,135':'0,212,255'},0.08)`,border:`1px solid rgba(${g.color==='#00ff87'?'0,255,135':'0,212,255'},0.3)`,color:g.color}
                      : {background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',color:'var(--text-secondary)'}
                    }>
                    <span className="text-xl">{g.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{color:goal===g.id?g.color:'var(--text-primary)'}}>{g.label}</p>
                      <p className="text-xs" style={{color:'var(--text-muted)'}}>{g.desc}</p>
                    </div>
                    {goal===g.id && (
                      <svg className="w-4 h-4 flex-shrink-0" style={{color:g.color}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="glass-static p-5" style={{border:'1px solid rgba(255,255,255,0.07)'}}>
              <p className="label-neon mb-3">Workout Location</p>
              <div className="space-y-2">
                {LOCATIONS.map(l=>(
                  <button key={l.id} onClick={()=>{ setLocation(l.id); setActiveDay(0); handleChange(goal,l.id) }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left"
                    style={location===l.id
                      ? {background:'rgba(0,255,135,0.08)',border:'1px solid rgba(0,255,135,0.3)',color:'#00ff87'}
                      : {background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',color:'var(--text-secondary)'}
                    }>
                    <span className="text-xl">{l.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{color:location===l.id?'#00ff87':'var(--text-primary)'}}>{l.label}</p>
                      <p className="text-xs" style={{color:'var(--text-muted)'}}>{l.desc}</p>
                    </div>
                    {location===l.id && (
                      <svg className="w-4 h-4 flex-shrink-0" style={{color:'#00ff87'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Plan header */}
          {plan && (
            <div className="glass-static p-5 relative overflow-hidden" style={{border:'1px solid rgba(0,255,135,0.15)'}}>
              <div className="absolute top-0 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,#00ff87,#00d4ff,transparent)'}}/>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-black text-xl text-white" style={{letterSpacing:'-0.01em'}}>{plan.label}</h2>
                  <p className="text-sm mt-1 max-w-2xl" style={{color:'var(--text-secondary)'}}>{plan.description}</p>
                </div>
                <span className="badge-green flex-shrink-0">{plan.days.length}-Day Split</span>
              </div>
            </div>
          )}

          {/* Day tabs + exercises */}
          {plan && (
            <div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {plan.days.map((_,i)=>(
                  <button key={i} onClick={()=>setActiveDay(i)}
                    className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                    style={activeDay===i
                      ? {background:'linear-gradient(135deg,#00ff87,#00d4ff)',color:'#020408',boxShadow:'0 4px 15px rgba(0,255,135,0.3)'}
                      : {background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',color:'var(--text-secondary)'}
                    }>Day {i+1}</button>
                ))}
              </div>

              {currentDay && (
                <div className="mt-4 glass-static p-5" style={{border:'1px solid rgba(255,255,255,0.07)'}}>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="font-bold text-white">{currentDay.day}</h3>
                      <p className="text-xs mt-0.5" style={{color:'var(--text-muted)'}}>{currentDay.exercises.length} exercises</p>
                    </div>
                    <span className="badge-muted text-xs">Day {activeDay+1}/{plan.days.length}</span>
                  </div>

                  <div className="space-y-3">
                    {currentDay.exercises.map((ex,idx)=>(
                      <div key={idx} className="rounded-xl p-4 transition-all duration-200"
                        style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}
                        onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(0,255,135,0.15)'}
                        onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'}>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold"
                            style={{background:'linear-gradient(135deg,rgba(0,255,135,0.15),rgba(0,212,255,0.1))',border:'1px solid rgba(0,255,135,0.2)',color:'#00ff87',fontFamily:"'JetBrains Mono',monospace"}}>
                            {idx+1}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-white text-sm">{ex.name}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="badge-green text-xs">{ex.sets} sets</span>
                              <span className="badge-blue text-xs">{ex.reps} reps</span>
                              <span className="badge-amber text-xs">{ex.rest} rest</span>
                            </div>
                            {ex.tip && (
                              <div className="flex items-start gap-2 mt-2 rounded-lg px-3 py-2"
                                style={{background:'rgba(0,255,135,0.04)',border:'1px solid rgba(0,255,135,0.08)'}}>
                                <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{color:'#00ff87'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <p className="text-xs italic" style={{color:'var(--text-secondary)'}}>{ex.tip}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
