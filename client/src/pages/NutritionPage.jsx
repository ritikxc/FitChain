import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Loader2, Search, Sparkles, Utensils } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import AddMealForm from '../components/AddMealForm'
import { getMealsForDate, getTodayString, getToken, getStoredUser, sumMacros, addMeal } from '../services/api'

const QUICK_MEALS = [
  { title: 'Breakfast', calories: 420, protein: 32, carbs: 50, fats: 10 },
  { title: 'Lunch', calories: 610, protein: 44, carbs: 70, fats: 18 },
  { title: 'Dinner', calories: 720, protein: 56, carbs: 58, fats: 24 },
  { title: 'Snack', calories: 190, protein: 16, carbs: 20, fats: 6 },
]

export default function NutritionPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(getStoredUser)
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!getToken() || !user) {
      navigate('/login')
      return
    }
    loadMeals()
  }, [])

  async function loadMeals() {
    try {
      setLoading(true)
      const data = await getMealsForDate(getTodayString())
      setMeals(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddMeal(mealData) {
    try {
      await addMeal({ ...mealData, date: getTodayString() })
      const updated = await getMealsForDate(getTodayString())
      setMeals(updated)
    } catch (err) {
      setError(err.message)
    }
  }

  const macros = sumMacros(meals)

  return (
    <div className="flex min-h-screen bg-[#f7f7f7]">
      <Sidebar user={user} />
      <main className="flex-1 md:ml-64 min-h-screen">
        <div className="sticky top-0 z-20 border-b border-[#e5e5e5] bg-[#fcfcfc]/90 backdrop-blur">
          <div className="px-4 md:px-6 py-4">
            <p className="section-title">Nutrition</p>
            <h1 className="text-xl font-semibold">Daily fueling</h1>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-5">
          {error && <div className="rounded-2xl border border-[#f1c4c4] bg-[#fff7f7] p-3 text-sm text-[#b91c1c]">{error}</div>}

          <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-5">
            <div className="rounded-[28px] border border-[#e5e5e5] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="section-title mb-2">Today</p>
                  <h2 className="text-2xl font-semibold">Your nutrition overview</h2>
                </div>
                <div className="pill"><Sparkles className="h-3.5 w-3.5" /> Balanced</div>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="rounded-2xl bg-[#f7f7f7] p-4">
                  <p className="text-sm text-[#666666]">Calories</p>
                  <p className="text-xl font-semibold mt-1">{macros.calories}</p>
                </div>
                <div className="rounded-2xl bg-[#f7f7f7] p-4">
                  <p className="text-sm text-[#666666]">Protein</p>
                  <p className="text-xl font-semibold mt-1">{macros.protein}g</p>
                </div>
                <div className="rounded-2xl bg-[#f7f7f7] p-4">
                  <p className="text-sm text-[#666666]">Carbs</p>
                  <p className="text-xl font-semibold mt-1">{macros.carbs}g</p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#e5e5e5] bg-[#f7f7f7] p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-4 w-4" />
                <p className="font-semibold">Search food</p>
              </div>
              <div className="relative">
                <input className="input-field" placeholder="Eggs, oats, salmon..." />
              </div>
              <button className="button-primary w-full mt-4">
                Quick add <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>

          <section className="grid lg:grid-cols-[0.95fr_1.05fr] gap-5">
            <AddMealForm onAdd={handleAddMeal} />

            <div className="rounded-[28px] border border-[#e5e5e5] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Utensils className="h-4 w-4" />
                <p className="font-semibold">Today’s meals</p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : meals.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#e5e5e5] p-6 text-center text-sm text-[#666666]">
                  No meals logged yet. Add your first entry to start building momentum.
                </div>
              ) : (
                <div className="space-y-3">
                  {meals.map((meal) => (
                    <div key={meal._id || meal.name} className="rounded-2xl border border-[#e5e5e5] bg-[#fcfcfc] p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{meal.name}</p>
                          <p className="text-sm text-[#666666]">{meal.calories} kcal</p>
                        </div>
                        <div className="pill">{meal.protein || 0}g protein</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {QUICK_MEALS.map((meal) => (
              <div key={meal.title} className="rounded-[24px] border border-[#e5e5e5] bg-white p-4 shadow-sm">
                <p className="font-semibold">{meal.title}</p>
                <p className="text-sm text-[#666666] mt-1">{meal.calories} kcal</p>
                <div className="flex gap-2 mt-3 text-xs text-[#666666]">
                  <span className="pill">P {meal.protein}g</span>
                  <span className="pill">C {meal.carbs}g</span>
                  <span className="pill">F {meal.fats}g</span>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  )
}
