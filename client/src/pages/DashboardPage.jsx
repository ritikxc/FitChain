import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, ArrowRight, Flame, Loader2, Settings, Sparkles, Target, Utensils, Waves, X } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import AddMealForm from '../components/AddMealForm'
import MacroChart from '../components/MacroChart'
import WeeklyChart from '../components/WeeklyChart'
import { getStoredUser, getMealsForDate, addMeal, getWeeklyData, sumMacros, getTodayString, getToken } from '../services/api'

function AnimNumber({ value }) {
  const n = typeof value === 'number' ? value : Number(value || 0)
  return <>{Number.isFinite(n) ? n.toLocaleString() : '0'}</>
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(getStoredUser)
  const [meals, setMeals] = useState([])
  const [weeklyData, setWeeklyData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!getToken() || !user) {
      navigate('/login')
      return
    }
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const [mealsData, weekly] = await Promise.all([getMealsForDate(getTodayString()), getWeeklyData()])
      setMeals(mealsData)
      setWeeklyData(weekly)
    } catch (err) {
      if (err.message.includes('expired') || err.message.includes('authorized')) navigate('/login')
      else setError('Failed to load data.')
    } finally {
      setLoading(false)
    }
  }

  async function handleAddMeal(mealData) {
    try {
      await addMeal({ ...mealData, date: getTodayString() })
      const [updatedMeals, weekly] = await Promise.all([getMealsForDate(getTodayString()), getWeeklyData()])
      setMeals(updatedMeals)
      setWeeklyData(weekly)
    } catch (err) {
      setError(err.message)
    }
  }

  const macros = sumMacros(meals)
  const calorieGoal = user?.profile?.calorieGoal || 2200
  const remaining = Math.max(calorieGoal - macros.calories, 0)
  const pct = Math.min((macros.calories / calorieGoal) * 100, 100)
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const metricCards = [
    { label: 'Calories', value: macros.calories, target: calorieGoal, unit: 'kcal', status: macros.calories < calorieGoal ? 'On track' : 'Above goal', tone: macros.calories < calorieGoal ? '#2563eb' : '#dc2626' },
    { label: 'Protein', value: macros.protein, target: 160, unit: 'g', status: macros.protein >= 160 ? 'Goal met' : 'Needs more', tone: macros.protein >= 160 ? '#16a34a' : '#2563eb' },
    { label: 'Carbs', value: macros.carbs, target: 220, unit: 'g', status: macros.carbs <= 220 ? 'Balanced' : 'High', tone: macros.carbs <= 220 ? '#16a34a' : '#dc2626' },
    { label: 'Fats', value: macros.fats, target: 70, unit: 'g', status: macros.fats <= 70 ? 'Balanced' : 'High', tone: macros.fats <= 70 ? '#16a34a' : '#dc2626' },
  ]

  return (
    <div className="flex min-h-screen bg-[#f7f7f7]">
      <Sidebar user={user} />
      <main className="flex-1 md:ml-64 min-h-screen overflow-x-hidden">
        <div className="sticky top-0 z-20 border-b border-[#e5e5e5] bg-[#fcfcfc]/90 backdrop-blur">
          <div className="flex items-center justify-between px-4 md:px-6 py-4">
            <div>
              <p className="section-title">Overview</p>
              <h1 className="text-xl font-semibold">{today}</h1>
            </div>
            <button className="button-secondary px-3 py-2 text-sm">
              <Settings className="h-4 w-4" />
              Settings
            </button>
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
              <section className="rounded-[28px] border border-[#e5e5e5] bg-white p-5 md:p-7 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
                  <div>
                    <p className="section-title mb-2">Today</p>
                    <h2 className="text-3xl font-semibold">Hello, {user?.name?.split(' ')[0] || 'there'}.</h2>
                    <p className="text-sm text-[#666666] mt-2 max-w-xl">You’re keeping a steady rhythm. Here’s a calm view of your nutrition and momentum.</p>
                  </div>
                  <div className="rounded-3xl border border-[#e5e5e5] bg-[#f7f7f7] px-4 py-3 min-w-[220px]">
                    <div className="flex items-center gap-2 text-sm text-[#666666]">
                      <Sparkles className="h-4 w-4" />
                      Focus for today
                    </div>
                    <p className="mt-2 font-semibold">Stay within your calorie lane</p>
                  </div>
                </div>
              </section>

              <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[28px] border border-[#e5e5e5] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="section-title">Calories</p>
                      <h3 className="text-2xl font-semibold">{macros.calories} / {calorieGoal}</h3>
                    </div>
                    <div className="rounded-2xl bg-[#f7f7f7] px-3 py-2 text-sm font-semibold text-[#111111]">{Math.round(pct)}%</div>
                  </div>
                  <div className="progress-bar mb-4">
                    <div className="bg-[#111111]" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-sm text-[#666666]">
                    <span>{remaining} kcal remaining</span>
                    <span>Target {calorieGoal} kcal</span>
                  </div>
                </div>

                <div className="rounded-[28px] border border-[#e5e5e5] bg-[#f7f7f7] p-5 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="h-4 w-4" />
                    <p className="text-sm font-semibold">Today’s plan</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-3">
                      <span className="text-sm text-[#666666]">Meal entries</span>
                      <span className="font-semibold">{meals.length}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-3">
                      <span className="text-sm text-[#666666]">Hydration</span>
                      <span className="font-semibold">3.2L</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {metricCards.map((card) => (
                  <div key={card.label} className="rounded-[24px] border border-[#e5e5e5] bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-semibold">{card.label}</p>
                      <span className="pill" style={{ color: card.tone, borderColor: `${card.tone}22`, background: `${card.tone}0f` }}>{card.status}</span>
                    </div>
                    <p className="text-2xl font-semibold">{card.value}<span className="text-sm text-[#666666] ml-1">{card.unit}</span></p>
                    <p className="text-sm text-[#666666] mt-2">Target {card.target} {card.unit}</p>
                  </div>
                ))}
              </section>

              <section className="grid lg:grid-cols-[0.9fr_1.1fr] gap-5">
                <AddMealForm onAdd={handleAddMeal} />
                <div className="space-y-5">
                  <MacroChart macros={macros} />
                  <WeeklyChart data={weeklyData} />
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
