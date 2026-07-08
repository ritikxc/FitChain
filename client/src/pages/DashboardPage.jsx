import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Check, CircleDot, Dumbbell, Flame, Home, Loader2, Minus, Settings, Target, Utensils, X } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import AddMealForm from '../components/AddMealForm'
import MealList from '../components/MealList'
import MacroChart from '../components/MacroChart'
import WeeklyChart from '../components/WeeklyChart'
import {
  getStoredUser, updateProfile,
  getMealsForDate, addMeal, deleteMeal,
  getWeeklyData, sumMacros, getTodayString, getToken,
} from '../services/api'

function AnimNumber({ value }) {
  const n = typeof value === 'number' ? value : Number(value || 0)
  return <>{Number.isFinite(n) ? n.toLocaleString() : '0'}</>
}

// Mobile top bar
function MobileTopBar({ user, onSettings }) {
  const initials = user?.name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) || 'U'
  return (
    <div className="md:hidden sticky top-0 z-20 px-4 py-3 flex items-center justify-between bg-surface-default/80 backdrop-blur border-b border-surface-border/60">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-xl border border-surface-border/60 bg-surface-card flex items-center justify-center">
          <Activity className="w-4.5 h-4.5 text-brand-green" />
        </div>
        <span className="font-bold text-sm">
          <span className="text-white">Fit</span>
          <span className="text-brand-green">Chain</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onSettings}
          className="w-11 h-11 rounded-xl border border-surface-border/60 bg-surface-card flex items-center justify-center"
          style={{color:'var(--text-secondary)'}}
        >
          <Settings className="w-4 h-4" />
        </button>
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white border border-surface-border/60 bg-surface-default/40">{initials}</div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(getStoredUser)
  const [meals, setMeals] = useState([])
  const [weeklyData, setWeeklyData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showProfile, setShowProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({ goal:'hypertrophy', location:'gym', calorieGoal:2200 })

  useEffect(() => {
    if(!getToken() || !user) { navigate('/login'); return }
    if(!user.profile?.goal) setShowProfile(true)
    else setProfileForm({ goal:user.profile.goal, location:user.profile.location, calorieGoal:user.profile.calorieGoal||2200 })
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const [mealsData, weekly] = await Promise.all([
        getMealsForDate(getTodayString()),
        getWeeklyData(),
      ])
      setMeals(mealsData)
      setWeeklyData(weekly)
    } catch(err) {
      if(err.message.includes('expired') || err.message.includes('authorized')) navigate('/login')
      else setError('Failed to load data.')
    } finally { setLoading(false) }
  }

  async function handleAddMeal(mealData) {
    try {
      const newMeal = await addMeal({ ...mealData, date:getTodayString() })
      const updated = [...meals, newMeal]
      setMeals(updated)
      const weekly = await getWeeklyData()
      setWeeklyData(weekly)
    } catch(err) { setError(err.message) }
  }

  async function handleDeleteMeal(id) {
    try {
      await deleteMeal(id)
      const updated = meals.filter(m=>m._id!==id)
      setMeals(updated)
      const weekly = await getWeeklyData()
      setWeeklyData(weekly)
    } catch(err) { setError(err.message) }
  }

  async function handleProfileSave() {
    try {
      const updatedUser = await updateProfile(profileForm)
      setUser(updatedUser)
      setShowProfile(false)
    } catch(err) { setError(err.message) }
  }

  const macros = sumMacros(meals)
  const calorieGoal = user?.profile?.calorieGoal || 2200
  const remaining = Math.max(calorieGoal - macros.calories, 0)
  const pct = Math.min((macros.calories / calorieGoal)*100, 100)
  const today = new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})
  const macroTotal = (macros.protein + macros.carbs + macros.fats) || 1
  const macroRows = [
    { key:'protein', label:'Protein', value:macros.protein, color:'#A3FF12' },
    { key:'carbs', label:'Carbs', value:macros.carbs, color:'#FF7A00' },
    { key:'fats', label:'Fats', value:macros.fats, color:'#EF4444' },
  ]

  return (
    <div className="flex min-h-screen" style={{background:'var(--bg-void)'}}>
      <div className="bg-mesh"/>
      <Sidebar user={user}/>
      <MobileTopBar user={user} onSettings={()=>setShowProfile(true)}/>

      <main className="flex-1 md:ml-60 min-h-screen relative overflow-x-hidden">
        {/* Desktop top bar */}
        <div className="hidden md:flex sticky top-0 z-20 items-center justify-between px-6 py-4"
          style={{background:'rgba(2,4,8,0.9)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
          <div>
            <h1 className="font-black text-xl text-white" style={{letterSpacing:'-0.02em'}}>Dashboard</h1>
            <p className="text-xs mt-0.5" style={{color:'var(--text-muted)'}}>{today}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={()=>setShowProfile(true)} className="btn-glass !py-2 !px-3 !text-xs flex items-center gap-1.5">
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <span className="inline-flex items-center gap-2 rounded-full border border-surface-border/60 bg-surface-card/10 px-3 py-1 text-xs font-medium text-text-muted">
              <CircleDot className="w-3.5 h-3.5 text-brand-green" />
              Live
            </span>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
              style={{background:'rgba(255,80,80,0.08)',border:'1px solid rgba(255,80,80,0.2)',color:'#ff8080'}}>
              {error}
              <button onClick={()=>setError('')} className="ml-auto" style={{color:'#ff5050'}} aria-label="Dismiss error">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-12 h-12 rounded-xl border border-surface-border/60 bg-surface-card flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-brand-green" />
              </div>
              <p className="text-sm font-semibold" style={{color:'var(--text-secondary)'}}>Loading your data...</p>
            </div>
          ) : (
            <>
              {/* Top: Welcome + Daily progress + Remaining */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Welcome */}
                <section className="lg:col-span-4 rounded-xl border border-surface-border bg-surface-card p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl border border-surface-border/60 bg-surface-default/30 flex items-center justify-center flex-shrink-0">
                        <Activity className="w-5 h-5 text-brand-green" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Welcome</p>
                        <h2 className="font-display font-bold text-xl text-white leading-tight truncate">
                          {user?.name?.split(' ')[0] || 'User'}
                        </h2>
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-full border border-surface-border/60 bg-surface-default/20 px-3 py-1 text-xs font-medium text-text-secondary">
                      {new Date().toLocaleDateString('en-US', { month:'short', day:'numeric' })}
                    </span>
                  </div>

                  {user?.profile?.goal && (
                    <p className="text-sm text-text-secondary flex items-center gap-2">
                      <Target className="w-4 h-4 text-text-muted" />
                      Goal:
                      <span className="text-white font-semibold capitalize">{user.profile.goal}</span>
                      <span className="text-text-muted">·</span>
                      <span className="capitalize">{user.profile.location}</span>
                    </p>
                  )}
                </section>

                {/* Daily calorie progress */}
                <section className="lg:col-span-5 rounded-xl border border-surface-border bg-surface-card p-5">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-brand-green" />
                      <h3 className="font-display font-bold text-sm text-white">Daily calories</h3>
                    </div>
                    <span className="inline-flex items-center rounded-full border border-surface-border/60 bg-surface-default/20 px-3 py-1 text-xs font-mono text-text-secondary">
                      {Math.round(pct)}%
                    </span>
                  </div>

                  <div className="flex items-end justify-between gap-4 mb-4">
                    <div>
                      <p className="text-3xl font-mono font-bold text-white leading-none">
                        <AnimNumber value={macros.calories} />
                      </p>
                      <p className="text-xs text-text-muted mt-1">of {calorieGoal.toLocaleString()} kcal</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-text-muted">Consumed</p>
                      <p className="text-sm font-semibold text-white font-mono">{macros.calories.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="h-2 rounded-full border border-surface-border/60 bg-surface-default/30 overflow-hidden">
                    <div className="h-full bg-brand-green" style={{ width: `${pct}%` }} />
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-text-muted">Goal</span>
                    <span className="text-text-secondary font-mono">{calorieGoal.toLocaleString()} kcal</span>
                  </div>
                </section>

                {/* Remaining */}
                <section className="lg:col-span-3 rounded-xl border border-surface-border bg-surface-card p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Remaining</p>
                      <p className="mt-1 text-3xl font-mono font-bold text-white leading-none">
                        <AnimNumber value={remaining} />
                      </p>
                      <p className="text-xs text-text-muted mt-1">kcal left</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl border border-surface-border/60 bg-surface-default/30 flex items-center justify-center flex-shrink-0">
                      <Minus className="w-5 h-5 text-brand-green" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-text-muted">Meals logged</p>
                      <p className="text-sm font-semibold text-white">{meals.length}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-text-muted">Protein</p>
                      <p className="text-sm font-semibold text-white font-mono">{macros.protein}g</p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Main content grid */}
              <div className="grid lg:grid-cols-3 gap-5">
                <div className="lg:col-span-1 space-y-5">
                  <AddMealForm onAdd={handleAddMeal}/>
                  {/* Nutrition summary + Macro progress */}
                  <div className="rounded-xl border border-surface-border bg-surface-card p-4">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2 min-w-0">
                        <Utensils className="w-4.5 h-4.5 text-brand-green" />
                        <h3 className="font-display font-bold text-sm text-white truncate">Nutrition summary</h3>
                      </div>
                      <span className="badge-muted text-xs">{macros.calories.toLocaleString()} kcal</span>
                    </div>

                    <div className="space-y-3 mb-4">
                      {macroRows.map(m => (
                        <div key={m.key} className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-2 h-2 rounded-full" style={{ background: m.color, flexShrink: 0 }} />
                            <span className="text-xs font-semibold text-text-secondary truncate">{m.label}</span>
                          </div>
                          <span className="text-sm font-semibold font-mono text-white">
                            {m.value.toLocaleString()}
                            <span className="text-xs text-text-muted ml-1">g</span>
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-surface-border/60">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Macro progress</p>
                        <span className="text-xs text-text-muted">By grams</span>
                      </div>

                      <div className="space-y-3">
                        {macroRows.map(m => {
                          const pctOfMacros = Math.round((m.value / macroTotal) * 100)
                          return (
                            <div key={`${m.key}-bar`}>
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-text-muted">{m.label}</span>
                                <span className="text-text-secondary font-mono">{pctOfMacros}%</span>
                              </div>
                              <div className="h-1.5 rounded-full border border-surface-border/60 bg-surface-default/30 overflow-hidden">
                                <div className="h-full" style={{ width: `${pctOfMacros}%`, background: m.color }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-5">
                  <MacroChart macros={macros} calorieGoal={calorieGoal}/>
                  <WeeklyChart data={weeklyData}/>
                </div>
              </div>

              {/* Meal history */}
              <section className="rounded-xl border border-surface-border bg-surface-card p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-display font-bold text-sm text-white">Meal history</h3>
                    <p className="text-xs text-text-muted mt-1">Logged today</p>
                  </div>
                  {meals.length > 0 ? (
                    <span className="badge-muted text-xs">
                      {meals.length} {meals.length === 1 ? 'meal' : 'meals'}
                    </span>
                  ) : (
                    <span className="badge-muted text-xs">0 meals</span>
                  )}
                </div>
                <MealList meals={meals} onDelete={handleDeleteMeal} idField="_id" />
              </section>
            </>
          )}
        </div>
      </main>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{background:'rgba(0,0,0,0.75)',backdropFilter:'blur(8px)'}}>
          <div className="rounded-xl border border-surface-border bg-surface-card p-6 w-full max-w-md">
            <h2 className="font-display font-bold text-xl text-white mb-1 tracking-tight">Profile Settings</h2>
            <p className="text-sm mb-6 text-text-secondary">Customize your fitness preferences</p>

            <div className="space-y-5">
              <div>
                <label className="label-neon mb-3">Fitness Goal</label>
                <div className="grid grid-cols-3 gap-2">
                  {['hypertrophy','strength','endurance'].map(g=>(
                    <button key={g} onClick={()=>setProfileForm(p=>({...p,goal:g}))}
                      className="min-h-[44px] px-3 rounded-xl text-xs font-semibold capitalize border transition-colors"
                      style={profileForm.goal===g
                        ? { background:'rgba(163,255,18,0.10)', border:'1px solid rgba(163,255,18,0.40)', color:'#A3FF12' }
                        : { background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', color:'var(--text-secondary)' }
                      }>{g}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label-neon mb-3">Workout Location</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id:'home', label:'Home', Icon: Home },
                    { id:'gym', label:'Gym', Icon: Dumbbell },
                  ].map(l => {
                    const selected = profileForm.location === l.id
                    const Icon = l.Icon
                    return (
                      <button
                        key={l.id}
                        onClick={()=>setProfileForm(p=>({...p,location:l.id}))}
                        className="min-h-[44px] px-3 rounded-xl text-xs font-semibold capitalize border transition-colors inline-flex items-center justify-center gap-2"
                        style={selected
                          ? { background:'rgba(163,255,18,0.10)', border:'1px solid rgba(163,255,18,0.40)', color:'#A3FF12' }
                          : { background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', color:'var(--text-secondary)' }
                        }
                      >
                        <Icon className="w-4 h-4" />
                        {l.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="label-neon">Daily Calorie Goal</label>
                <input type="number" min="500" max="10000"
                  value={profileForm.calorieGoal}
                  onChange={e=>setProfileForm(p=>({...p,calorieGoal:Number(e.target.value)}))}
                  className="input-neon mt-1"/>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={()=>setShowProfile(false)} className="btn-glass flex-1 min-h-[44px] rounded-xl">Cancel</button>
              <button onClick={handleProfileSave} className="btn-gradient flex-1 min-h-[44px] rounded-xl">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
