import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { getStoredUser, getToken, updateProfile } from '../services/api'

const GOALS = [
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'maintain', label: 'Maintain Weight' },
  { value: 'weight_gain', label: 'Weight Gain' },
  { value: 'muscle_gain', label: 'Muscle Gain' },
]

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary' },
  { value: 'lightly_active', label: 'Lightly Active' },
  { value: 'moderately_active', label: 'Moderately Active' },
  { value: 'very_active', label: 'Very Active' },
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(() => getStoredUser())
  const [form, setForm] = useState({
    height: user?.profile?.height ?? '',
    weight: user?.profile?.weight ?? '',
    age: user?.profile?.age ?? '',
    gender: user?.profile?.gender ?? '',
    fitnessGoal: user?.profile?.fitnessGoal ?? 'weight_loss',
    calorieGoal: user?.profile?.calorieGoal ?? '',
    proteinGoal: user?.profile?.proteinGoal ?? '',
    carbsGoal: user?.profile?.carbsGoal ?? '',
    fatGoal: user?.profile?.fatGoal ?? '',
    waterGoal: user?.profile?.waterGoal ?? '',
    activityLevel: user?.profile?.activityLevel ?? 'sedentary',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!getToken() || !user) {
      navigate('/login')
      return
    }
    const completed = user?.profile?.profileCompleted ?? user?.profile?.setupComplete ?? false
    if (completed) {
      navigate('/dashboard')
    }
  }, [navigate, user])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = {
        height: form.height === '' ? undefined : Number(form.height),
        weight: form.weight === '' ? undefined : Number(form.weight),
        age: form.age === '' ? undefined : Number(form.age),
        gender: form.gender?.trim() || '',
        goal: 'hypertrophy',
        fitnessGoal: form.fitnessGoal,
        calorieGoal: form.calorieGoal === '' ? undefined : Number(form.calorieGoal),
        proteinGoal: form.proteinGoal === '' ? undefined : Number(form.proteinGoal),
        carbsGoal: form.carbsGoal === '' ? undefined : Number(form.carbsGoal),
        fatGoal: form.fatGoal === '' ? undefined : Number(form.fatGoal),
        waterGoal: form.waterGoal === '' ? undefined : Number(form.waterGoal),
        activityLevel: form.activityLevel,
        profileCompleted: true,
        setupComplete: true,
      }
      const updatedUser = await updateProfile(payload)
      setUser(updatedUser)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-[#e5e5e5] bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#111111] text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="section-title">Profile setup</p>
            <h1 className="text-2xl font-semibold">Set your baseline before you start tracking.</h1>
          </div>
        </div>

        {error && <div className="mb-4 rounded-2xl border border-[#f1c4c4] bg-[#fff7f7] p-3 text-sm text-[#b91c1c]">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-[24px] border border-[#e5e5e5] bg-[#fcfcfc] p-5">
            <h2 className="text-lg font-semibold">Personal information</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-semibold">Height (cm)</label>
                <input name="height" type="number" value={form.height} onChange={handleChange} className="input-field" placeholder="175" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Weight (kg)</label>
                <input name="weight" type="number" value={form.weight} onChange={handleChange} className="input-field" placeholder="72" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Age</label>
                <input name="age" type="number" value={form.age} onChange={handleChange} className="input-field" placeholder="29" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Gender</label>
                <input name="gender" value={form.gender} onChange={handleChange} className="input-field" placeholder="Optional" />
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e5e5e5] bg-[#fcfcfc] p-5">
            <h2 className="text-lg font-semibold">Fitness goal</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {GOALS.map((goal) => (
                <button key={goal.value} type="button" onClick={() => setForm((prev) => ({ ...prev, fitnessGoal: goal.value }))} className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium ${form.fitnessGoal === goal.value ? 'border-[#111111] bg-[#f7f7f7]' : 'border-[#e5e5e5] bg-white'}`}>
                  {goal.label}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e5e5e5] bg-[#fcfcfc] p-5">
            <h2 className="text-lg font-semibold">Daily targets</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">Calories Goal</label>
                <input name="calorieGoal" type="number" value={form.calorieGoal} onChange={handleChange} className="input-field" placeholder="2200" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Protein Goal</label>
                <input name="proteinGoal" type="number" value={form.proteinGoal} onChange={handleChange} className="input-field" placeholder="160" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Carbs Goal</label>
                <input name="carbsGoal" type="number" value={form.carbsGoal} onChange={handleChange} className="input-field" placeholder="220" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Fat Goal</label>
                <input name="fatGoal" type="number" value={form.fatGoal} onChange={handleChange} className="input-field" placeholder="70" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Water Goal</label>
                <input name="waterGoal" type="number" value={form.waterGoal} onChange={handleChange} className="input-field" placeholder="3" />
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e5e5e5] bg-[#fcfcfc] p-5">
            <h2 className="text-lg font-semibold">Activity level</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {ACTIVITY_LEVELS.map((level) => (
                <button key={level.value} type="button" onClick={() => setForm((prev) => ({ ...prev, activityLevel: level.value }))} className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium ${form.activityLevel === level.value ? 'border-[#111111] bg-[#f7f7f7]' : 'border-[#e5e5e5] bg-white'}`}>
                  {level.label}
                </button>
              ))}
            </div>
          </section>

          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="button-primary px-6 py-3">
              {loading ? 'Saving…' : 'Continue to dashboard'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
