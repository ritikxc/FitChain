import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Dumbbell, Loader2, Sparkles } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { getStoredUser, updateProfile, getToken } from '../services/api'
import { getWorkoutPlan } from '../data/workouts'

const GOALS = [
  { id: 'hypertrophy', label: 'Hypertrophy', icon: '💪', desc: 'Build muscle and size', tone: '#111111' },
  { id: 'strength', label: 'Strength', icon: '🏋️', desc: 'Train for raw power', tone: '#2563eb' },
  { id: 'endurance', label: 'Endurance', icon: '🏃', desc: 'Build stamina and cardio', tone: '#16a34a' },
]

const LOCATIONS = [
  { id: 'home', label: 'Home', icon: '🏠', desc: 'Bodyweight and minimal gear', tone: '#111111' },
  { id: 'gym', label: 'Gym', icon: '🏋️‍♂️', desc: 'Full equipment access', tone: '#2563eb' },
]

export default function WorkoutsPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(getStoredUser)
  const [goal, setGoal] = useState('hypertrophy')
  const [location, setLocation] = useState('gym')
  const [activeDay, setActiveDay] = useState(0)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!getToken() || !user) {
      navigate('/login')
      return
    }
    if (user.profile) {
      setGoal(user.profile.goal || 'hypertrophy')
      setLocation(user.profile.location || 'gym')
    }
  }, [])

  async function handleChange(newGoal, newLoc) {
    setSaving(true)
    try {
      const u = await updateProfile({ goal: newGoal, location: newLoc })
      setUser(u)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const plan = getWorkoutPlan(location, goal)
  const currentDay = plan?.days?.[activeDay]

  return (
    <div className="flex min-h-screen bg-[#f7f7f7]">
      <Sidebar user={user} />
      <main className="flex-1 md:ml-64 min-h-screen">
        <div className="sticky top-0 z-20 border-b border-[#e5e5e5] bg-[#fcfcfc]/90 backdrop-blur">
          <div className="flex items-center justify-between px-4 md:px-6 py-4">
            <div>
              <p className="section-title">Training</p>
              <h1 className="text-xl font-semibold">Workout plan</h1>
            </div>
            {saving && <span className="pill">Saving…</span>}
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-5">
          <section className="grid md:grid-cols-2 gap-4">
            <div className="rounded-[24px] border border-[#e5e5e5] bg-white p-5 shadow-sm">
              <p className="section-title mb-3">Goal</p>
              <div className="space-y-2">
                {GOALS.map((g) => (
                  <button key={g.id} onClick={() => { setGoal(g.id); setActiveDay(0); handleChange(g.id, location) }} className={`w-full flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${goal === g.id ? 'border-[#111111] bg-[#f7f7f7]' : 'border-[#e5e5e5] bg-white'}`}>
                    <span className="text-xl">{g.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold">{g.label}</p>
                      <p className="text-sm text-[#666666]">{g.desc}</p>
                    </div>
                    {goal === g.id && <CheckCircle2 className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-[#e5e5e5] bg-white p-5 shadow-sm">
              <p className="section-title mb-3">Environment</p>
              <div className="space-y-2">
                {LOCATIONS.map((l) => (
                  <button key={l.id} onClick={() => { setLocation(l.id); setActiveDay(0); handleChange(goal, l.id) }} className={`w-full flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${location === l.id ? 'border-[#111111] bg-[#f7f7f7]' : 'border-[#e5e5e5] bg-white'}`}>
                    <span className="text-xl">{l.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold">{l.label}</p>
                      <p className="text-sm text-[#666666]">{l.desc}</p>
                    </div>
                    {location === l.id && <CheckCircle2 className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {plan && (
            <section className="rounded-[24px] border border-[#e5e5e5] bg-white p-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
                <div>
                  <p className="section-title mb-1">Plan</p>
                  <h2 className="text-xl font-semibold">{plan.label}</h2>
                  <p className="text-sm text-[#666666] mt-1">{plan.description}</p>
                </div>
                <div className="pill"><Sparkles className="h-3.5 w-3.5" /> {plan.days.length}-day split</div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                {plan.days.map((_, i) => (
                  <button key={i} onClick={() => setActiveDay(i)} className={`px-4 py-2 rounded-full text-sm font-medium ${activeDay === i ? 'bg-[#111111] text-white' : 'bg-[#f7f7f7] text-[#666666]'}`}>
                    Day {i + 1}
                  </button>
                ))}
              </div>

              {currentDay && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{currentDay.day}</h3>
                      <p className="text-sm text-[#666666]">{currentDay.exercises.length} exercises</p>
                    </div>
                    <div className="pill"><Dumbbell className="h-3.5 w-3.5" /> Ready</div>
                  </div>
                  {currentDay.exercises.map((ex, idx) => (
                    <div key={idx} className="rounded-2xl border border-[#e5e5e5] bg-[#fcfcfc] p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#111111] text-white flex items-center justify-center text-sm font-semibold">{idx + 1}</div>
                        <div className="flex-1">
                          <p className="font-semibold">{ex.name}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="pill">{ex.sets} sets</span>
                            <span className="pill">{ex.reps} reps</span>
                            <span className="pill">{ex.rest} rest</span>
                          </div>
                          {ex.tip && <p className="text-sm text-[#666666] mt-3">{ex.tip}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
