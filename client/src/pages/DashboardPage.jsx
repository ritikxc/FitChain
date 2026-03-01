import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
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

// Animated number that counts up
function AnimNumber({ value, duration=800 }) {
  const [display, setDisplay] = useState(0)
  const prev = useRef(0)

  useEffect(() => {
    const start = prev.current
    const end = value
    const diff = end - start
    if(diff === 0) return
    const startTime = Date.now()
    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1-progress, 3)
      setDisplay(Math.round(start + diff * eased))
      if(progress < 1) requestAnimationFrame(tick)
      else prev.current = end
    }
    requestAnimationFrame(tick)
  }, [value, duration])

  return <>{display.toLocaleString()}</>
}

// Mobile top bar
function MobileTopBar({ user, onSettings }) {
  const initials = user?.name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) || 'U'
  return (
    <div className="md:hidden sticky top-0 z-20 px-4 py-3 flex items-center justify-between"
      style={{background:'rgba(2,4,8,0.9)',backdropFilter:'blur(16px)',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{background:'linear-gradient(135deg,#00ff87,#00d4ff)'}}>
          <svg className="w-3.5 h-3.5 text-black" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-6a6 6 0 100 12A6 6 0 0010 4z" clipRule="evenodd"/>
          </svg>
        </div>
        <span className="font-bold text-sm"><span className="text-white">Fit</span><span className="text-gradient-green">Chain</span></span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onSettings} className="p-2 rounded-lg" style={{color:'var(--text-secondary)'}}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </button>
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-black"
          style={{background:'linear-gradient(135deg,#00ff87,#00d4ff)'}}>{initials}</div>
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

  return (
    <div className="flex min-h-screen" style={{background:'var(--bg-void)'}}>
      <div className="bg-mesh"/>
      <Sidebar user={user}/>
      <MobileTopBar user={user} onSettings={()=>setShowProfile(true)}/>

      <main className="flex-1 md:ml-60 min-h-screen relative">
        {/* Desktop top bar */}
        <div className="hidden md:flex sticky top-0 z-20 items-center justify-between px-6 py-4"
          style={{background:'rgba(2,4,8,0.9)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
          <div>
            <h1 className="font-black text-xl text-white" style={{letterSpacing:'-0.02em'}}>Dashboard</h1>
            <p className="text-xs mt-0.5" style={{color:'var(--text-muted)'}}>{today}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={()=>setShowProfile(true)} className="btn-glass !py-2 !px-3 !text-xs flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Settings
            </button>
            <span className="badge-green text-xs">
              <span className="w-1.5 h-1.5 rounded-full" style={{background:'#00ff87',animation:'neonPulse 2s ease-in-out infinite'}}/>
              Live
            </span>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-5 page-enter">
          {error && (
            <div className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
              style={{background:'rgba(255,80,80,0.08)',border:'1px solid rgba(255,80,80,0.2)',color:'#ff8080'}}>
              {error}
              <button onClick={()=>setError('')} className="ml-auto" style={{color:'#ff5050'}}>✕</button>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center animate-neon-pulse"
                style={{border:'2px solid #00ff87',boxShadow:'0 0 20px rgba(0,255,135,0.3)'}}>
                <svg className="animate-spin w-6 h-6" style={{color:'#00ff87'}} fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              </div>
              <p className="text-sm font-semibold" style={{color:'var(--text-secondary)'}}>Loading your data...</p>
            </div>
          ) : (
            <>
              {/* Welcome + Stats row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Welcome card */}
                <div className="col-span-2 stat-tile relative overflow-hidden" style={{border:'1px solid rgba(0,255,135,0.1)'}}>
                  <div className="absolute top-0 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,#00ff87,#00d4ff)'}}/>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest" style={{color:'var(--text-muted)'}}>Good to see you</p>
                      <h2 className="font-black text-2xl text-white mt-1" style={{letterSpacing:'-0.02em'}}>
                        {user?.name?.split(' ')[0]} 👋
                      </h2>
                      {user?.profile?.goal && (
                        <p className="text-xs mt-1" style={{color:'var(--text-secondary)'}}>
                          Goal: <span className="font-semibold capitalize" style={{color:'#00ff87'}}>{user.profile.goal}</span>
                          {' · '}<span className="capitalize">{user.profile.location}</span>
                        </p>
                      )}
                    </div>
                    <span className="badge-green text-xs">{new Date().toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold" style={{color:'var(--text-secondary)'}}>Daily Calorie Progress</span>
                      <span className="text-xs font-bold font-mono" style={{color: pct>100?'#ff5050':pct>85?'#ffb700':'#00ff87'}}>{Math.round(pct)}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{
                        width:`${pct}%`,
                        background: pct>100 ? '#ff5050' : pct>85 ? 'linear-gradient(90deg,#ffb700,#ff8c00)' : 'linear-gradient(90deg,#00ff87,#00d4ff)',
                        boxShadow: pct>100 ? '0 0 10px rgba(255,80,80,0.5)' : '0 0 10px rgba(0,255,135,0.5)',
                      }}/>
                    </div>
                    <div className="flex justify-between text-xs mt-1.5" style={{color:'var(--text-muted)'}}>
                      <span><AnimNumber value={macros.calories}/> consumed</span>
                      <span>{remaining.toLocaleString()} remaining</span>
                    </div>
                  </div>
                </div>

                {/* Calories stat */}
                <div className="stat-tile">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{color:'var(--text-muted)'}}>Consumed</p>
                  <p className="font-black text-3xl" style={{color:'#00ff87',fontFamily:"'JetBrains Mono',monospace"}}>
                    <AnimNumber value={macros.calories}/>
                  </p>
                  <p className="text-xs mt-0.5" style={{color:'var(--text-muted)'}}>kcal today</p>
                  <div className="mt-3">
                    <span className="badge-green text-xs">Goal: {calorieGoal}</span>
                  </div>
                </div>

                {/* Remaining stat */}
                <div className="stat-tile">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{color:'var(--text-muted)'}}>Remaining</p>
                  <p className="font-black text-3xl" style={{color: remaining===0?'#ffb700':'var(--text-primary)',fontFamily:"'JetBrains Mono',monospace"}}>
                    <AnimNumber value={remaining}/>
                  </p>
                  <p className="text-xs mt-0.5" style={{color:'var(--text-muted)'}}>kcal left</p>
                  <div className="mt-3">
                    <span className="badge-muted text-xs">{meals.length} {meals.length===1?'meal':'meals'}</span>
                  </div>
                </div>
              </div>

              {/* Main content grid */}
              <div className="grid lg:grid-cols-3 gap-5">
                <div className="lg:col-span-1 space-y-5">
                  <AddMealForm onAdd={handleAddMeal}/>
                  {/* Quick macro tiles */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {label:'Protein',value:macros.protein,unit:'g',color:'#00d4ff'},
                      {label:'Carbs',value:macros.carbs,unit:'g',color:'#ffb700'},
                      {label:'Fats',value:macros.fats,unit:'g',color:'#ff5050'},
                    ].map(m=>(
                      <div key={m.label} className="stat-tile py-3 px-3 text-center">
                        <p className="font-bold text-lg" style={{color:m.color,fontFamily:"'JetBrains Mono',monospace"}}>
                          <AnimNumber value={m.value}/>{m.unit}
                        </p>
                        <p className="text-xs mt-0.5" style={{color:'var(--text-muted)'}}>{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-5">
                  <MacroChart macros={macros} calorieGoal={calorieGoal}/>
                  <WeeklyChart data={weeklyData}/>
                </div>
              </div>

              {/* Meal list */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm">Today's Meals</h3>
                    {meals.length>0 && <span className="badge-muted text-xs">{meals.length}</span>}
                  </div>
                  {meals.length>0 && (
                    <span className="text-sm font-bold font-mono" style={{color:'#00ff87'}}>{macros.calories.toLocaleString()} kcal</span>
                  )}
                </div>
                <MealList meals={meals} onDelete={handleDeleteMeal} idField="_id"/>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{background:'rgba(0,0,0,0.75)',backdropFilter:'blur(8px)'}}>
          <div className="glass-static rounded-2xl p-6 w-full max-w-md relative animate-scale-in"
            style={{border:'1px solid rgba(0,255,135,0.2)',boxShadow:'0 20px 60px rgba(0,0,0,0.8)'}}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,#00ff87,#00d4ff,transparent)'}}/>

            <h2 className="font-black text-xl text-white mb-1" style={{letterSpacing:'-0.02em'}}>Profile Settings</h2>
            <p className="text-sm mb-6" style={{color:'var(--text-secondary)'}}>Customize your fitness preferences</p>

            <div className="space-y-5">
              <div>
                <label className="label-neon mb-3">Fitness Goal</label>
                <div className="grid grid-cols-3 gap-2">
                  {['hypertrophy','strength','endurance'].map(g=>(
                    <button key={g} onClick={()=>setProfileForm(p=>({...p,goal:g}))}
                      className="py-2.5 px-3 rounded-xl text-xs font-semibold capitalize transition-all duration-200"
                      style={profileForm.goal===g
                        ? {background:'rgba(0,255,135,0.15)',border:'1px solid rgba(0,255,135,0.4)',color:'#00ff87'}
                        : {background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',color:'var(--text-secondary)'}
                      }>{g}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label-neon mb-3">Workout Location</label>
                <div className="grid grid-cols-2 gap-2">
                  {[{id:'home',label:'🏠 Home'},{id:'gym',label:'🏋️ Gym'}].map(l=>(
                    <button key={l.id} onClick={()=>setProfileForm(p=>({...p,location:l.id}))}
                      className="py-2.5 text-xs font-semibold capitalize rounded-xl transition-all duration-200"
                      style={profileForm.location===l.id
                        ? {background:'rgba(0,255,135,0.15)',border:'1px solid rgba(0,255,135,0.4)',color:'#00ff87'}
                        : {background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',color:'var(--text-secondary)'}
                      }>{l.label}</button>
                  ))}
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
              <button onClick={()=>setShowProfile(false)} className="btn-glass flex-1">Cancel</button>
              <button onClick={handleProfileSave} className="btn-gradient flex-1">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
