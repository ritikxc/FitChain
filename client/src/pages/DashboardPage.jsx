import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Droplets, Dumbbell, Flame, Layers, Loader2, Plus, Sparkles, Target, TrendingUp, Trophy, Utensils, Waves, X } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import MacroChart from '../components/MacroChart'
import WeeklyChart from '../components/WeeklyChart'
import {
  getStoredUser,
  getMealsForDate,
  getWeeklyData,
  sumMacros,
  getTodayString,
  getToken,
  getTodayWorkout,
  getWorkoutHistory,
  getTodayWater,
  logWater,
} from '../services/api'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(() => getStoredUser())
  const [meals, setMeals] = useState([])
  const [weeklyData, setWeeklyData] = useState([])
  const [todayWorkout, setTodayWorkout] = useState(null)
  const [prevWorkout, setPrevWorkout] = useState(null)
  const [waterLogged, setWaterLogged] = useState(0)
  const [customWater, setCustomWater] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingWater, setSavingWater] = useState(false)

  const unit = user?.profile?.unitSystem === 'imperial' ? 'lbs' : 'kg'
  const todayStr = getTodayString()

  useEffect(() => {
    if (!getToken() || !user) {
      navigate('/login')
      return
    }
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
      setLoading(true)
      const [mealsData, weekly, workout, history, water] = await Promise.all([
        getMealsForDate(todayStr),
        getWeeklyData(),
        getTodayWorkout(todayStr),
        getWorkoutHistory(),
        getTodayWater(todayStr),
      ])

      setMeals(mealsData || [])
      setWeeklyData(weekly || [])
      setTodayWorkout(workout)
      setWaterLogged(water || 0)

      if (history && history.length > 0) {
        const prev = history.find((h) => h.date !== todayStr && h.totalVolume > 0)
        if (prev) setPrevWorkout(prev)
      }
    } catch (err) {
      if (err.message.includes('expired') || err.message.includes('authorized')) {
        navigate('/login')
      } else {
        setError('Failed to load dashboard data.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleAddWater(amountToAdd) {
    setSavingWater(true)
    try {
      const newTotal = Math.max(0, Number((waterLogged + amountToAdd).toFixed(2)))
      const savedAmount = await logWater(newTotal, todayStr)
      setWaterLogged(savedAmount)
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingWater(false)
    }
  }

  async function handleSetCustomWater(e) {
    e.preventDefault()
    const val = Number(customWater)
    if (isNaN(val) || val < 0) return
    setSavingWater(true)
    try {
      const savedAmount = await logWater(val, todayStr)
      setWaterLogged(savedAmount)
      setCustomWater('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingWater(false)
    }
  }

  const macros = sumMacros(meals)
  const calorieGoal = user?.profile?.calorieGoal || 2200
  const proteinGoal = user?.profile?.proteinGoal || 160
  const carbsGoal = user?.profile?.carbsGoal || 220
  const fatGoal = user?.profile?.fatGoal || 70
  const waterGoal = user?.profile?.waterGoal || 3.0

  const remainingCalories = Math.max(calorieGoal - macros.calories, 0)
  const caloriePct = Math.min((macros.calories / calorieGoal) * 100, 100)
  const waterPct = Math.min((waterLogged / waterGoal) * 100, 100)

  const todayFormatted = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  // Calculate volume comparison with previous workout
  let volumeComparison = null
  if (todayWorkout && todayWorkout.totalVolume > 0 && prevWorkout && prevWorkout.totalVolume > 0) {
    const diff = todayWorkout.totalVolume - prevWorkout.totalVolume
    const pct = Math.round((diff / prevWorkout.totalVolume) * 100)
    volumeComparison = {
      pct,
      isHigher: pct >= 0,
      prevVolume: prevWorkout.totalVolume,
      currentVolume: todayWorkout.totalVolume,
    }
  }

  const hasMeals = meals.length > 0

  return (
    <div className="flex min-h-screen bg-[#f7f7f7]">
      <Sidebar user={user} />
      <main className="flex-1 md:ml-64 min-h-screen overflow-x-hidden">
        {/* Sticky Header with Overview date (Settings button removed) */}
        <div className="sticky top-0 z-20 border-b border-[#e5e5e5] bg-[#fcfcfc]/90 backdrop-blur">
          <div className="flex items-center justify-between px-4 md:px-6 py-4">
            <div>
              <p className="section-title">Overview</p>
              <h1 className="text-xl font-semibold">{todayFormatted}</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="pill text-xs font-semibold text-[#111111] bg-[#f0f0f0]">FitChain OS</span>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-5">
          {error && (
            <div className="rounded-2xl border border-[#f1c4c4] bg-[#fff7f7] p-3 text-sm text-[#b91c1c] flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError('')}><X className="h-4 w-4" /></button>
            </div>
          )}

          {loading ? (
            <div className="rounded-[24px] border border-[#e5e5e5] bg-white p-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-[#111111]" />
              <p className="text-sm text-[#666666]">Loading your dashboard…</p>
            </div>
          ) : (
            <>
              {/* Welcome Hero Banner */}
              <section className="rounded-[28px] border border-[#e5e5e5] bg-white p-5 md:p-7 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
                  <div>
                    <p className="section-title mb-2">Today</p>
                    <h2 className="text-3xl font-semibold">Hello, {user?.name?.split(' ')[0] || 'there'}.</h2>
                    <p className="text-sm text-[#666666] mt-2 max-w-xl">
                      Here is your consolidated daily overview covering your nutrition metrics, hydration, and training performance.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-[#e5e5e5] bg-[#f7f7f7] px-4 py-3 min-w-[240px]">
                    <div className="flex items-center gap-2 text-sm text-[#666666]">
                      <Sparkles className="h-4 w-4 text-[#111111]" />
                      Focus for today
                    </div>
                    <p className="mt-2 font-semibold text-sm">
                      {todayWorkout?.isCompleted
                        ? 'Workout completed. Hit your protein target!'
                        : 'Fuel your workout and stay hydrated'}
                    </p>
                  </div>
                </div>
              </section>

              {/* TODAY OVERVIEW SECTION: Nutrition Overview & Workout Overview */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#111111]" />
                  <h2 className="text-xl font-semibold">Today Overview</h2>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  {/* 1. Nutrition Overview Card */}
                  <div className="rounded-[28px] border border-[#e5e5e5] bg-white p-5 md:p-6 shadow-sm flex flex-col justify-between space-y-5">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Utensils className="h-4 w-4 text-[#111111]" />
                          <p className="section-title">Nutrition Overview</p>
                        </div>
                        <Link to="/nutrition" className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1">
                          Log Meals <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>

                      {/* Calorie Status */}
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-3xl font-semibold">{macros.calories.toLocaleString()} <span className="text-sm font-normal text-[#666666]">/ {calorieGoal.toLocaleString()} kcal</span></h3>
                          <p className="text-xs text-[#666666] mt-0.5">{remainingCalories.toLocaleString()} kcal remaining</p>
                        </div>
                        <div className="rounded-2xl bg-[#f7f7f7] px-3.5 py-2 text-sm font-semibold text-[#111111]">
                          {Math.round(caloriePct)}%
                        </div>
                      </div>

                      {/* Calorie Progress Bar */}
                      <div className="progress-bar my-3">
                        <div className="bg-[#111111]" style={{ width: `${caloriePct}%` }} />
                      </div>

                      {/* Macro Breakdown Chips */}
                      <div className="grid grid-cols-3 gap-2.5 mt-4 text-xs">
                        <div className="rounded-2xl bg-[#f7f7f7] p-3 text-center">
                          <p className="text-[#666666] font-medium">Protein</p>
                          <p className="font-semibold text-sm mt-1 text-[#2563eb]">{macros.protein}g <span className="text-[10px] text-[#888888]">/ {proteinGoal}g</span></p>
                        </div>
                        <div className="rounded-2xl bg-[#f7f7f7] p-3 text-center">
                          <p className="text-[#666666] font-medium">Carbs</p>
                          <p className="font-semibold text-sm mt-1 text-[#16a34a]">{macros.carbs}g <span className="text-[10px] text-[#888888]">/ {carbsGoal}g</span></p>
                        </div>
                        <div className="rounded-2xl bg-[#f7f7f7] p-3 text-center">
                          <p className="text-[#666666] font-medium">Fats</p>
                          <p className="font-semibold text-sm mt-1 text-[#dc2626]">{macros.fats}g <span className="text-[10px] text-[#888888]">/ {fatGoal}g</span></p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-[#e5e5e5] pt-3 flex items-center justify-between text-xs text-[#666666]">
                      <span>{meals.length} meals logged today</span>
                      <span className="font-medium text-[#111111]">{macros.protein >= proteinGoal ? 'Protein goal met' : `${Math.max(0, proteinGoal - macros.protein)}g protein to target`}</span>
                    </div>
                  </div>

                  {/* 2. Workout Overview Card */}
                  <div className="rounded-[28px] border border-[#e5e5e5] bg-white p-5 md:p-6 shadow-sm flex flex-col justify-between space-y-5">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Dumbbell className="h-4 w-4 text-[#111111]" />
                          <p className="section-title">Workout Overview</p>
                        </div>
                        <Link to="/workouts" className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1">
                          Workout Plan <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>

                      {todayWorkout ? (
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-[#111111]">{todayWorkout.dayTitle}</h3>
                              <p className="text-xs text-[#666666] mt-0.5">
                                Goal: <strong className="capitalize text-[#111111]">{todayWorkout.goal}</strong> | Split: <strong className="uppercase text-[#111111]">{todayWorkout.split?.replace('_', ' ')}</strong>
                              </p>
                            </div>
                            <span className={`pill ${todayWorkout.isCompleted ? 'bg-[#bbf7d0] text-[#16a34a] border-[#86efac]' : 'bg-[#f7f7f7] text-[#111111]'}`}>
                              {todayWorkout.isCompleted ? 'Completed' : 'In Progress'}
                            </span>
                          </div>

                          {/* Lifted Metrics */}
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="rounded-2xl bg-[#f7f7f7] p-3.5">
                              <p className="text-xs text-[#666666]">Total Volume Lifted</p>
                              <p className="text-xl font-bold text-[#111111] mt-1">{todayWorkout.totalVolume.toLocaleString()} <span className="text-xs font-normal text-[#666666]">{unit}</span></p>
                            </div>
                            <div className="rounded-2xl bg-[#f7f7f7] p-3.5">
                              <p className="text-xs text-[#666666]">Exercises Logged</p>
                              <p className="text-xl font-bold text-[#111111] mt-1">{todayWorkout.completedExercises} <span className="text-xs font-normal text-[#666666]">/ {todayWorkout.totalExercises}</span></p>
                            </div>
                          </div>

                          {/* Comparison Banner */}
                          {volumeComparison ? (
                            <div className={`rounded-2xl p-3.5 text-xs flex items-center gap-3 border ${
                              volumeComparison.isHigher
                                ? 'bg-[#f0fdf4] border-[#bbf7d0] text-[#15803d]'
                                : 'bg-[#fff7ed] border-[#fed7aa] text-[#c2410c]'
                            }`}>
                              <TrendingUp className="h-5 w-5 shrink-0" />
                              <div>
                                <p className="font-semibold">
                                  {volumeComparison.isHigher
                                    ? `You lifted ${volumeComparison.pct}% more weight than your previous workout!`
                                    : `Session volume is ${Math.abs(volumeComparison.pct)}% lower than previous workout.`}
                                </p>
                                <p className="text-[11px] opacity-80 mt-0.5">
                                  Current: {volumeComparison.currentVolume.toLocaleString()} {unit} vs Previous: {volumeComparison.prevVolume.toLocaleString()} {unit}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="rounded-2xl bg-[#f7f7f7] p-3 text-xs text-[#666666]">
                              Session logged. Complete subsequent workouts to track percentage volume gains over time.
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-[#e5e5e5] bg-[#fcfcfc] p-6 text-center space-y-3">
                          <p className="text-sm font-semibold text-[#111111]">No workout logged for today yet</p>
                          <p className="text-xs text-[#666666]">
                            Follow your 7-day program, log your reps & weights, and track your strength trajectory.
                          </p>
                          <Link to="/workouts" className="button-primary inline-flex items-center gap-2 px-4 py-2 text-xs">
                            <Dumbbell className="h-3.5 w-3.5" /> Start Today’s Workout
                          </Link>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-[#e5e5e5] pt-3 flex items-center justify-between text-xs text-[#666666]">
                      <span>Program: 7-Day Split</span>
                      <Link to="/workouts" className="font-medium text-[#111111] hover:underline">
                        View Exercises
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* WATER INTAKE LOGGING SECTION */}
              <section className="rounded-[28px] border border-[#e5e5e5] bg-white p-5 md:p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-[#2563eb]/10 text-[#2563eb] flex items-center justify-center">
                      <Droplets className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="section-title">Daily Hydration</p>
                      <h3 className="text-xl font-semibold">Water Intake Tracker</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#111111]">{waterLogged}L</span>
                    <span className="text-xs text-[#666666]">/ target {waterGoal}L ({Math.round(waterPct)}%)</span>
                  </div>
                </div>

                {/* Water Progress Bar */}
                <div className="progress-bar mb-5">
                  <div className="bg-[#2563eb]" style={{ width: `${waterPct}%` }} />
                </div>

                {/* Quick Add Buttons & Custom Amount Input */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-[#666666] mr-1">Quick Add:</span>
                    <button
                      type="button"
                      disabled={savingWater}
                      onClick={() => handleAddWater(0.25)}
                      className="rounded-xl border border-[#e5e5e5] bg-[#f7f7f7] hover:bg-[#ebebeb] px-3.5 py-2 text-xs font-semibold text-[#111111] transition"
                    >
                      +250 ml
                    </button>
                    <button
                      type="button"
                      disabled={savingWater}
                      onClick={() => handleAddWater(0.5)}
                      className="rounded-xl border border-[#e5e5e5] bg-[#f7f7f7] hover:bg-[#ebebeb] px-3.5 py-2 text-xs font-semibold text-[#111111] transition"
                    >
                      +500 ml
                    </button>
                    <button
                      type="button"
                      disabled={savingWater}
                      onClick={() => handleAddWater(1.0)}
                      className="rounded-xl border border-[#e5e5e5] bg-[#f7f7f7] hover:bg-[#ebebeb] px-3.5 py-2 text-xs font-semibold text-[#111111] transition"
                    >
                      +1.0 L
                    </button>
                    <button
                      type="button"
                      disabled={savingWater || waterLogged === 0}
                      onClick={() => logWater(0, todayStr).then(setWaterLogged)}
                      className="rounded-xl border border-[#e5e5e5] bg-white hover:bg-[#f5f5f5] px-3 py-2 text-xs font-medium text-[#b91c1c] transition"
                    >
                      Reset
                    </button>
                  </div>

                  {/* Custom Water Input */}
                  <form onSubmit={handleSetCustomWater} className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="20"
                      placeholder="e.g. 2.5"
                      value={customWater}
                      onChange={(e) => setCustomWater(e.target.value)}
                      className="w-24 rounded-xl border border-[#e5e5e5] bg-[#f7f7f7] px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                    />
                    <button
                      type="submit"
                      disabled={savingWater || !customWater}
                      className="button-secondary px-3 py-2 text-xs font-semibold"
                    >
                      Set (L)
                    </button>
                  </form>
                </div>
              </section>

              {/* Weekly Trends Section */}
              <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-5">
                <div className="space-y-4">
                  {hasMeals ? (
                    <MacroChart macros={macros} />
                  ) : (
                    <div className="rounded-[24px] border border-[#e5e5e5] bg-white p-6 text-sm text-[#666666]">
                      <p className="font-semibold text-[#111111] mb-1">No meals logged yet today</p>
                      Log meals in the Nutrition tab to populate your live macro breakdown.
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {weeklyData.length > 0 ? (
                    <WeeklyChart data={weeklyData} />
                  ) : (
                    <div className="rounded-[24px] border border-[#e5e5e5] bg-white p-6 text-sm text-[#666666]">
                      Your 7-day intake trend will automatically generate as meals are tracked.
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
