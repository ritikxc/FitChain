import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, ArrowDownRight, ArrowUpRight, BarChart3, Calendar, CheckCircle2, Dumbbell, Flame, Layers, LineChart as LineIcon, Loader2, Scale, Sparkles, Target, TrendingDown, TrendingUp, Trophy, Utensils } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from 'recharts'
import Sidebar from '../components/Sidebar'
import {
  getStoredUser,
  getWeeklyData,
  getToken,
  getMonthlyWorkouts,
  getMonthlyWater,
  updateProfile,
} from '../services/api'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-2xl border border-[#e5e5e5] bg-white px-3.5 py-2.5 text-xs shadow-sm">
        <p className="font-semibold text-[#111111] mb-1.5">{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey || p.name} style={{ color: p.color || '#111111' }} className="font-medium">
            {p.name || p.dataKey}: {Number(p.value).toLocaleString()} {p.unit || ''}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function ProgressPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(getStoredUser)
  const [weeklyNutrition, setWeeklyNutrition] = useState([])
  const [monthlyWorkouts, setMonthlyWorkouts] = useState([])
  const [monthlyWater, setMonthlyWater] = useState([])
  const [loading, setLoading] = useState(true)
  const [newWeight, setNewWeight] = useState('')
  const [savingWeight, setSavingWeight] = useState(false)
  const [weightSuccess, setWeightSuccess] = useState('')
  const [activeNutriMetric, setActiveNutriMetric] = useState('calories')

  const unit = user?.profile?.unitSystem === 'imperial' ? 'lbs' : 'kg'

  useEffect(() => {
    if (!getToken() || !user) {
      navigate('/login')
      return
    }
    loadProgressData()
  }, [])

  async function loadProgressData() {
    try {
      setLoading(true)
      const [nutritionData, workoutData, waterData] = await Promise.all([
        getWeeklyData(),
        getMonthlyWorkouts(),
        getMonthlyWater(),
      ])
      setWeeklyNutrition(nutritionData || [])
      setMonthlyWorkouts(workoutData?.workouts || [])
      setMonthlyWater(waterData || [])
    } catch (err) {
      console.error('Error loading progress data:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogWeight(e) {
    e.preventDefault()
    const val = Number(newWeight)
    if (isNaN(val) || val <= 0) return

    setSavingWeight(true)
    try {
      const updatedUser = await updateProfile({ weight: val })
      setUser(updatedUser)
      setNewWeight('')
      setWeightSuccess(`Logged ${val} ${unit}!`)
      setTimeout(() => setWeightSuccess(''), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setSavingWeight(false)
    }
  }

  // Weight History Calculations
  const weightHistory = user?.profile?.weightHistory || []
  const initialWeight = weightHistory.length > 0 ? weightHistory[0].weight : (user?.profile?.weight || 75)
  const currentWeight = user?.profile?.weight || initialWeight
  const weightChange = Number((currentWeight - initialWeight).toFixed(1))
  const isWeightLoss = weightChange < 0
  const isWeightGain = weightChange > 0

  const weightChartData = weightHistory.length > 0
    ? weightHistory.map((w) => ({
        date: w.date.slice(5),
        weight: w.weight,
      }))
    : [
        { date: 'Start', weight: initialWeight },
        { date: 'Current', weight: currentWeight },
      ]

  // Nutrition Monthly/Weekly Calculations
  const avgCalories = weeklyNutrition.length
    ? Math.round(weeklyNutrition.reduce((s, d) => s + d.calories, 0) / weeklyNutrition.length)
    : 0
  const avgProtein = weeklyNutrition.length
    ? Math.round(weeklyNutrition.reduce((s, d) => s + d.protein, 0) / weeklyNutrition.length)
    : 0
  const daysTracked = weeklyNutrition.filter((d) => d.calories > 0).length

  // Workout Monthly Calculations
  const totalWorkouts = monthlyWorkouts.length
  const totalVolumeLifted = monthlyWorkouts.reduce((s, w) => s + (w.totalVolume || 0), 0)
  const avgVolumePerSession = totalWorkouts > 0 ? Math.round(totalVolumeLifted / totalWorkouts) : 0
  const completedWorkouts = monthlyWorkouts.filter((w) => w.isCompleted).length

  // Workout volume progression trend
  const workoutTrendData = monthlyWorkouts.map((w) => ({
    date: w.date.slice(5),
    volume: w.totalVolume,
    exercises: w.completedExercises,
    name: w.dayTitle,
  }))

  const metrics = [
    { id: 'calories', label: 'Calories', color: '#111111', unit: 'kcal' },
    { id: 'protein', label: 'Protein', color: '#2563eb', unit: 'g' },
    { id: 'carbs', label: 'Carbs', color: '#16a34a', unit: 'g' },
    { id: 'fats', label: 'Fats', color: '#dc2626', unit: 'g' },
  ]

  return (
    <div className="flex min-h-screen bg-[#f7f7f7]">
      <Sidebar user={user} />
      <main className="flex-1 md:ml-64 min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-20 border-b border-[#e5e5e5] bg-[#fcfcfc]/90 backdrop-blur">
          <div className="flex items-center justify-between px-4 md:px-6 py-4">
            <div>
              <p className="section-title">Analytics & Trends</p>
              <h1 className="text-xl font-semibold">Monthly Progress</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="pill text-xs font-semibold text-[#111111] bg-[#f0f0f0]">30-Day Window</span>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-5">
          {loading ? (
            <div className="rounded-[24px] border border-[#e5e5e5] bg-white p-12 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-[#111111]" />
            </div>
          ) : (
            <>
              {/* Top Monthly Metrics Overview */}
              <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="rounded-[24px] border border-[#e5e5e5] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold uppercase text-[#666666]">Current Weight</p>
                    <Scale className="h-4 w-4 text-[#111111]" />
                  </div>
                  <p className="text-3xl font-bold text-[#111111]">{currentWeight} <span className="text-sm font-normal text-[#666666]">{unit}</span></p>
                  <div className="flex items-center gap-1.5 mt-2 text-xs">
                    {isWeightLoss ? (
                      <span className="text-[#16a34a] font-semibold flex items-center">
                        <TrendingDown className="h-3.5 w-3.5 mr-0.5" /> {Math.abs(weightChange)} {unit}
                      </span>
                    ) : isWeightGain ? (
                      <span className="text-[#2563eb] font-semibold flex items-center">
                        <TrendingUp className="h-3.5 w-3.5 mr-0.5" /> +{weightChange} {unit}
                      </span>
                    ) : (
                      <span className="text-[#666666] font-medium">Maintained baseline</span>
                    )}
                    <span className="text-[#888888]">since start</span>
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#e5e5e5] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold uppercase text-[#666666]">Workouts Completed</p>
                    <Dumbbell className="h-4 w-4 text-[#111111]" />
                  </div>
                  <p className="text-3xl font-bold text-[#111111]">{totalWorkouts} <span className="text-sm font-normal text-[#666666]">sessions</span></p>
                  <p className="text-xs text-[#666666] mt-2">{completedWorkouts} fully completed</p>
                </div>

                <div className="rounded-[24px] border border-[#e5e5e5] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold uppercase text-[#666666]">Total Volume Lifted</p>
                    <Trophy className="h-4 w-4 text-[#111111]" />
                  </div>
                  <p className="text-3xl font-bold text-[#111111]">{totalVolumeLifted.toLocaleString()} <span className="text-sm font-normal text-[#666666]">{unit}</span></p>
                  <p className="text-xs text-[#666666] mt-2">Avg {avgVolumePerSession.toLocaleString()} {unit} / workout</p>
                </div>

                <div className="rounded-[24px] border border-[#e5e5e5] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold uppercase text-[#666666]">Avg Daily Intake</p>
                    <Utensils className="h-4 w-4 text-[#111111]" />
                  </div>
                  <p className="text-3xl font-bold text-[#111111]">{avgCalories.toLocaleString()} <span className="text-sm font-normal text-[#666666]">kcal</span></p>
                  <p className="text-xs text-[#666666] mt-2">{daysTracked} days logged this week</p>
                </div>
              </section>

              {/* 1. Weight Progression & Logging Section */}
              <section className="rounded-[28px] border border-[#e5e5e5] bg-white p-5 md:p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Scale className="h-5 w-5 text-[#111111]" />
                      <h2 className="text-lg font-semibold">Weight Progression</h2>
                    </div>
                    <p className="text-xs text-[#666666] mt-0.5">
                      Starting: {initialWeight} {unit} | Current: {currentWeight} {unit} ({isWeightLoss ? `${weightChange} ${unit}` : `+${weightChange} ${unit}`})
                    </p>
                  </div>

                  {/* Log Weight Form */}
                  <form onSubmit={handleLogWeight} className="flex items-center gap-2">
                    {weightSuccess && <span className="text-xs text-[#16a34a] font-medium">{weightSuccess}</span>}
                    <input
                      type="number"
                      step="0.1"
                      min="30"
                      max="300"
                      placeholder={`New weight (${unit})`}
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                      className="w-32 rounded-xl border border-[#e5e5e5] bg-[#f7f7f7] px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                    />
                    <button
                      type="submit"
                      disabled={savingWeight || !newWeight}
                      className="button-primary px-3.5 py-2 text-xs font-semibold whitespace-nowrap"
                    >
                      {savingWeight ? 'Saving…' : 'Log Weight'}
                    </button>
                  </form>
                </div>

                <div className="h-56 pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightChartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="date" tick={{ fill: '#666666', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fill: '#666666', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        name="Body Weight"
                        stroke="#111111"
                        strokeWidth={2.5}
                        dot={{ fill: '#111111', r: 4, strokeWidth: 0 }}
                        unit={` ${unit}`}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* 2. Workout Performance & Volume Trend */}
              <section className="rounded-[28px] border border-[#e5e5e5] bg-white p-5 md:p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-[#111111]" />
                      <h2 className="text-lg font-semibold">Workout Performance & Volume Trajectory</h2>
                    </div>
                    <p className="text-xs text-[#666666] mt-0.5">
                      Cumulative volume (reps × sets × weight) across recorded sessions
                    </p>
                  </div>
                  <div className="pill text-xs font-semibold">
                    {totalWorkouts} sessions logged
                  </div>
                </div>

                {workoutTrendData.length > 0 ? (
                  <div className="h-64 pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={workoutTrendData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis dataKey="date" tick={{ fill: '#666666', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#666666', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="volume"
                          name="Total Volume"
                          stroke="#111111"
                          fill="#111111"
                          fillOpacity={0.08}
                          strokeWidth={2.5}
                          unit={` ${unit}`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#e5e5e5] bg-[#fcfcfc] p-8 text-center text-sm text-[#666666]">
                    Complete workouts in the Workout tab to generate your volume progression curve.
                  </div>
                )}
              </section>

              {/* 3. Nutrition Breakdown & Trends */}
              <section className="rounded-[28px] border border-[#e5e5e5] bg-white p-5 md:p-6 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Utensils className="h-5 w-5 text-[#111111]" />
                      <h2 className="text-lg font-semibold">Nutrition Overview & Macro Breakdown</h2>
                    </div>
                    <p className="text-xs text-[#666666] mt-0.5">
                      Weekly average: {avgCalories} kcal | {avgProtein}g protein
                    </p>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {metrics.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setActiveNutriMetric(m.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                          activeNutriMetric === m.id
                            ? 'bg-[#111111] text-white shadow-sm'
                            : 'bg-[#f7f7f7] text-[#666666] hover:bg-[#ebebeb]'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-56 pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyNutrition} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="day" tick={{ fill: '#666666', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#666666', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey={activeNutriMetric}
                        fill={metrics.find((m) => m.id === activeNutriMetric)?.color || '#111111'}
                        radius={[6, 6, 0, 0]}
                        name={metrics.find((m) => m.id === activeNutriMetric)?.label}
                        unit={` ${metrics.find((m) => m.id === activeNutriMetric)?.unit}`}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
