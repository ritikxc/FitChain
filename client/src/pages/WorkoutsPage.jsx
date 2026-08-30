import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, CheckCircle2, ChevronRight, Dumbbell, Flame, Layers, Loader2, Sparkles, TrendingUp, Trophy } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { getStoredUser, updateProfile, getToken, logWorkout, getTodayWorkout, getWorkoutHistory, getTodayString } from '../services/api'
import { getWorkoutPlan, GOAL_SPLIT_OPTIONS } from '../data/workouts'

const GOALS = [
  { id: 'hypertrophy', label: 'Hypertrophy', desc: 'Maximal muscle size and volume' },
  { id: 'strength', label: 'Strength', desc: 'Raw power and heavy compound loading' },
  { id: 'endurance', label: 'Endurance', desc: 'Stamina, work capacity, and cardio conditioning' },
]

const LOCATIONS = [
  { id: 'gym', label: 'Gym', desc: 'Full barbells, dumbbells & cable machines' },
  { id: 'home', label: 'Home', desc: 'Bodyweight and minimal equipment' },
]

export default function WorkoutsPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(getStoredUser)
  const [goal, setGoal] = useState(() => user?.profile?.goal || 'hypertrophy')
  const [location, setLocation] = useState(() => user?.profile?.location || 'gym')
  const [split, setSplit] = useState(() => user?.profile?.workoutSplit || 'ppl')
  const [activeDay, setActiveDay] = useState(0)
  const [saving, setSaving] = useState(false)
  const [logging, setLogging] = useState(false)
  const [logSuccess, setLogSuccess] = useState('')
  const [exercisesState, setExercisesState] = useState([])
  const [todayLog, setTodayLog] = useState(null)
  const [prevLog, setPrevLog] = useState(null)

  const unit = user?.profile?.unitSystem === 'imperial' ? 'lbs' : 'kg'

  useEffect(() => {
    if (!getToken() || !user) {
      navigate('/login')
      return
    }
    if (user.profile) {
      const g = user.profile.goal || 'hypertrophy'
      const l = user.profile.location || 'gym'
      const s = user.profile.workoutSplit || 'ppl'
      setGoal(g)
      setLocation(l)
      setSplit(s)
    }
    loadWorkoutData()
  }, [])

  async function loadWorkoutData() {
    try {
      const [today, history] = await Promise.all([
        getTodayWorkout(getTodayString()),
        getWorkoutHistory(),
      ])
      if (today) {
        setTodayLog(today)
      }
      if (history && history.length > 0) {
        // Find previous completed workout (different from today if today exists)
        const prev = history.find((h) => h.date !== getTodayString() && h.totalVolume > 0)
        if (prev) setPrevLog(prev)
      }
    } catch (err) {
      console.error('Error loading workout history:', err)
    }
  }

  // Load plan and initialize exercise editing state
  const plan = getWorkoutPlan(location, goal, split)
  const currentDay = plan?.days?.[activeDay]

  useEffect(() => {
    if (todayLog && todayLog.dayTitle === currentDay?.day) {
      setExercisesState(todayLog.exercises || [])
    } else if (currentDay?.exercises) {
      setExercisesState(
        currentDay.exercises.map((ex) => ({
          name: ex.name,
          sets: ex.sets || 3,
          reps: ex.reps || '10',
          weight: ex.weight || 0,
          completed: false,
          tip: ex.tip || '',
          rest: ex.rest || '60s',
        }))
      )
    }
  }, [currentDay, todayLog])

  async function handleProfileChange(newGoal, newLoc, newSplit) {
    setSaving(true)
    try {
      const updatedGoal = newGoal !== undefined ? newGoal : goal
      const updatedLoc = newLoc !== undefined ? newLoc : location
      const updatedSplit = newSplit !== undefined ? newSplit : split

      setGoal(updatedGoal)
      setLocation(updatedLoc)
      setSplit(updatedSplit)
      setActiveDay(0)

      const u = await updateProfile({
        goal: updatedGoal,
        location: updatedLoc,
        workoutSplit: updatedSplit,
      })
      setUser(u)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  function handleExerciseChange(idx, field, value) {
    setExercisesState((prev) => {
      const copy = [...prev]
      copy[idx] = { ...copy[idx], [field]: value }
      return copy
    })
  }

  function toggleExerciseCompleted(idx) {
    setExercisesState((prev) => {
      const copy = [...prev]
      copy[idx] = { ...copy[idx], completed: !copy[idx].completed }
      return copy
    })
  }

  // Calculate live session stats
  const totalVolume = exercisesState.reduce((sum, ex) => {
    const sets = Number(ex.sets) || 0
    const repMatch = String(ex.reps).match(/\d+/)
    const reps = repMatch ? Number(repMatch[0]) : 10
    const weight = Number(ex.weight) || 0
    return sum + sets * reps * weight
  }, 0)

  const completedCount = exercisesState.filter((ex) => ex.completed).length

  // Calculate percentage vs previous workout
  let volumeDiffPct = null
  if (prevLog && prevLog.totalVolume > 0 && totalVolume > 0) {
    volumeDiffPct = Math.round(((totalVolume - prevLog.totalVolume) / prevLog.totalVolume) * 100)
  }

  async function handleSaveAndLogWorkout() {
    if (!currentDay) return
    setLogging(true)
    setLogSuccess('')
    try {
      const workoutPayload = {
        date: getTodayString(),
        dayTitle: currentDay.day,
        goal,
        split,
        exercises: exercisesState,
        isCompleted: completedCount > 0 && completedCount === exercisesState.length,
      }
      const saved = await logWorkout(workoutPayload)
      setTodayLog(saved)
      setLogSuccess('Workout session saved and updated on Dashboard!')
      setTimeout(() => setLogSuccess(''), 4000)
    } catch (err) {
      console.error(err)
    } finally {
      setLogging(false)
    }
  }

  const availableSplits = GOAL_SPLIT_OPTIONS[goal] || GOAL_SPLIT_OPTIONS.hypertrophy

  return (
    <div className="flex min-h-screen bg-[#f7f7f7]">
      <Sidebar user={user} />
      <main className="flex-1 md:ml-64 min-h-screen">
        <div className="sticky top-0 z-20 border-b border-[#e5e5e5] bg-[#fcfcfc]/90 backdrop-blur">
          <div className="flex items-center justify-between px-4 md:px-6 py-4">
            <div>
              <p className="section-title">Training</p>
              <h1 className="text-xl font-semibold">Workout Structure & Tracking</h1>
            </div>
            {saving && <span className="pill">Saving preferences…</span>}
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-5">
          {logSuccess && (
            <div className="rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] p-4 text-sm text-[#16a34a] flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">{logSuccess}</span>
              </div>
            </div>
          )}

          {/* Goal, Environment & Split Configuration */}
          <section className="rounded-[28px] border border-[#e5e5e5] bg-white p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="h-5 w-5 text-[#111111]" />
              <h2 className="text-lg font-semibold">Workout Settings — Goal & Split</h2>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {/* Goal Selection */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#666666] mb-3">Primary Goal</p>
                <div className="space-y-2">
                  {GOALS.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => handleProfileChange(g.id, location, GOAL_SPLIT_OPTIONS[g.id]?.[0]?.id || 'ppl')}
                      className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                        goal === g.id ? 'border-[#111111] bg-[#f7f7f7]' : 'border-[#e5e5e5] bg-white hover:bg-[#fafafa]'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-sm">{g.label}</p>
                        <p className="text-xs text-[#666666] mt-0.5">{g.desc}</p>
                      </div>
                      {goal === g.id && <Check className="h-4 w-4 text-[#111111]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Split Selection based on goal */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#666666] mb-3">Split Option</p>
                <div className="space-y-2">
                  {availableSplits.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleProfileChange(goal, location, s.id)}
                      className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                        split === s.id ? 'border-[#111111] bg-[#f7f7f7]' : 'border-[#e5e5e5] bg-white hover:bg-[#fafafa]'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-sm">{s.label}</p>
                        <p className="text-xs text-[#666666] mt-0.5">{s.desc}</p>
                      </div>
                      {split === s.id && <Check className="h-4 w-4 text-[#111111]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Environment Selection */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#666666] mb-3">Training Environment</p>
                <div className="space-y-2">
                  {LOCATIONS.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => handleProfileChange(goal, l.id, split)}
                      className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                        location === l.id ? 'border-[#111111] bg-[#f7f7f7]' : 'border-[#e5e5e5] bg-white hover:bg-[#fafafa]'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-sm">{l.label}</p>
                        <p className="text-xs text-[#666666] mt-0.5">{l.desc}</p>
                      </div>
                      {location === l.id && <Check className="h-4 w-4 text-[#111111]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 7-Day Interactive Program */}
          {plan && (
            <section className="rounded-[28px] border border-[#e5e5e5] bg-white p-5 md:p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5 text-[#111111]" />
                    <h2 className="text-xl font-semibold">{plan.label}</h2>
                  </div>
                  <p className="text-sm text-[#666666] mt-1">{plan.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="pill">7-day schedule</span>
                  <span className="pill font-semibold text-[#111111]">{completedCount} / {exercisesState.length} completed</span>
                </div>
              </div>

              {/* 7 Day Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-6 border-b border-[#e5e5e5]">
                {plan.days.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveDay(i)}
                    className={`px-4 py-2.5 rounded-2xl text-sm font-medium transition whitespace-nowrap ${
                      activeDay === i
                        ? 'bg-[#111111] text-white shadow-sm'
                        : 'bg-[#f7f7f7] text-[#666666] hover:bg-[#ebebeb]'
                    }`}
                  >
                    Day {i + 1}
                  </button>
                ))}
              </div>

              {/* Current Day Schedule & Editable Exercises */}
              {currentDay && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fcfcfc] border border-[#e5e5e5] rounded-2xl p-4">
                    <div>
                      <h3 className="font-semibold text-lg">{currentDay.day}</h3>
                      <p className="text-xs text-[#666666] mt-0.5">
                        {exercisesState.length} exercises | Estimated total volume: <strong className="text-[#111111]">{totalVolume.toLocaleString()} {unit}</strong>
                      </p>
                    </div>

                    {/* Previous Workout Volume Comparison */}
                    {volumeDiffPct !== null && (
                      <div className="flex items-center gap-2 rounded-xl bg-white border border-[#e5e5e5] px-3 py-2 text-xs">
                        <TrendingUp className="h-4 w-4 text-[#16a34a]" />
                        <span>
                          {volumeDiffPct >= 0 ? `+${volumeDiffPct}%` : `${volumeDiffPct}%`} volume vs previous workout session
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Exercise Cards with Reps & Weight Modifications */}
                  <div className="space-y-3">
                    {exercisesState.map((ex, idx) => (
                      <div
                        key={idx}
                        className={`rounded-2xl border p-4 transition ${
                          ex.completed ? 'border-[#bbf7d0] bg-[#f7fdf9]' : 'border-[#e5e5e5] bg-white shadow-sm'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <button
                              type="button"
                              onClick={() => toggleExerciseCompleted(idx)}
                              className={`mt-0.5 h-6 w-6 rounded-lg border flex items-center justify-center transition ${
                                ex.completed
                                  ? 'border-[#16a34a] bg-[#16a34a] text-white'
                                  : 'border-[#cccccc] bg-white hover:border-[#111111]'
                              }`}
                            >
                              {ex.completed && <Check className="h-4 w-4" />}
                            </button>
                            <div>
                              <p className={`font-semibold text-base ${ex.completed ? 'line-through text-[#666666]' : 'text-[#111111]'}`}>
                                {ex.name}
                              </p>
                              {ex.tip && <p className="text-xs text-[#666666] mt-1">{ex.tip}</p>}
                              <p className="text-xs text-[#888888] mt-1">Rest: {ex.rest}</p>
                            </div>
                          </div>

                          {/* Editable Reps and Weight Fields */}
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-1.5 bg-[#f7f7f7] rounded-xl px-3 py-1.5 border border-[#e5e5e5]">
                              <span className="text-xs text-[#666666] font-medium">Sets:</span>
                              <input
                                type="number"
                                min="1"
                                max="20"
                                value={ex.sets}
                                onChange={(e) => handleExerciseChange(idx, 'sets', Number(e.target.value))}
                                className="w-12 bg-transparent text-sm font-semibold text-center focus:outline-none"
                              />
                            </div>

                            <div className="flex items-center gap-1.5 bg-[#f7f7f7] rounded-xl px-3 py-1.5 border border-[#e5e5e5]">
                              <span className="text-xs text-[#666666] font-medium">Reps:</span>
                              <input
                                type="text"
                                value={ex.reps}
                                onChange={(e) => handleExerciseChange(idx, 'reps', e.target.value)}
                                className="w-16 bg-transparent text-sm font-semibold text-center focus:outline-none"
                              />
                            </div>

                            <div className="flex items-center gap-1.5 bg-[#f7f7f7] rounded-xl px-3 py-1.5 border border-[#e5e5e5]">
                              <span className="text-xs text-[#666666] font-medium">Weight ({unit}):</span>
                              <input
                                type="number"
                                min="0"
                                max="500"
                                value={ex.weight}
                                onChange={(e) => handleExerciseChange(idx, 'weight', Number(e.target.value))}
                                className="w-16 bg-transparent text-sm font-semibold text-center focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Log Workout Button */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#e5e5e5]">
                    <div className="text-xs text-[#666666]">
                      <span>Volume calculated: <strong>{totalVolume.toLocaleString()} {unit}</strong> across {completedCount} completed exercises.</span>
                    </div>

                    <button
                      type="button"
                      disabled={logging}
                      onClick={handleSaveAndLogWorkout}
                      className="button-primary px-6 py-3 text-sm font-medium w-full sm:w-auto"
                    >
                      {logging ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" /> Saving Workout…
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" /> Save & Log Workout for Today
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
