import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, HeartPulse, UserCircle2, Loader2 } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { getStoredUser, getToken, updateProfile } from '../services/api'

export default function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(() => getStoredUser())
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    height: '',
    weight: '',
    age: '',
    gender: '',
    calorieGoal: '',
    proteinGoal: '',
    carbsGoal: '',
    fatGoal: '',
    waterGoal: '',
    fitnessGoal: '',
    activityLevel: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!getToken() || !user) {
      navigate('/login')
      return
    }
    if (user?.profile) {
      setForm({
        height: user.profile.height ?? '',
        weight: user.profile.weight ?? '',
        age: user.profile.age ?? '',
        gender: user.profile.gender ?? '',
        calorieGoal: user.profile.calorieGoal ?? '',
        proteinGoal: user.profile.proteinGoal ?? '',
        carbsGoal: user.profile.carbsGoal ?? '',
        fatGoal: user.profile.fatGoal ?? '',
        waterGoal: user.profile.waterGoal ?? '',
        fitnessGoal: user.profile.fitnessGoal ?? '',
        activityLevel: user.profile.activityLevel ?? '',
      })
    }
  }, [navigate, user])

  if (!getToken() || !user) {
    return null
  }

  const profile = user.profile || {}
  const bmi = profile.weight && profile.height ? ((profile.weight / ((profile.height / 100) ** 2)) || 0).toFixed(1) : '24.1'

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
        height: Number(form.height) || 0,
        weight: Number(form.weight) || 0,
        age: Number(form.age) || 0,
        calorieGoal: Number(form.calorieGoal) || 0,
        proteinGoal: Number(form.proteinGoal) || 0,
        carbsGoal: Number(form.carbsGoal) || 0,
        fatGoal: Number(form.fatGoal) || 0,
        waterGoal: Number(form.waterGoal) || 0,
        fitnessGoal: form.fitnessGoal || profile.fitnessGoal,
        activityLevel: form.activityLevel || profile.activityLevel,
        gender: form.gender || profile.gender,
        setupComplete: true,
      }
      const updatedUser = await updateProfile(payload)
      setUser(updatedUser)
      setEditing(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f7f7f7]">
      <Sidebar user={user} />
      <main className="flex-1 md:ml-64 min-h-screen">
        <div className="sticky top-0 z-20 border-b border-[#e5e5e5] bg-[#fcfcfc]/90 backdrop-blur">
          <div className="px-4 md:px-6 py-4">
            <p className="section-title">Profile</p>
            <h1 className="text-xl font-semibold">Your foundation</h1>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-5">
          <section className="rounded-[28px] border border-[#e5e5e5] bg-white p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-[#111111] text-white flex items-center justify-center">
                  <UserCircle2 className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{user.name}</h2>
                  <p className="text-sm text-[#666666]">{user.email}</p>
                </div>
              </div>
              <button onClick={() => setEditing((prev) => !prev)} className="button-secondary">
                {editing ? 'Cancel' : 'Edit profile'} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>

          <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: 'Height', value: `${profile.height || 178} cm` },
              { label: 'Weight', value: `${profile.weight || 72} kg` },
              { label: 'Age', value: `${profile.age || 29} years` },
              { label: 'BMI', value: bmi },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] border border-[#e5e5e5] bg-white p-4 shadow-sm">
                <p className="text-sm text-[#666666]">{item.label}</p>
                <p className="text-2xl font-semibold mt-2">{item.value}</p>
              </div>
            ))}
          </section>

          {editing && (
            <form onSubmit={handleSubmit} className="rounded-[24px] border border-[#e5e5e5] bg-[#fcfcfc] p-5 shadow-sm">
              {error && <div className="mb-4 rounded-2xl border border-[#f1c4c4] bg-[#fff7f7] p-3 text-sm text-[#b91c1c]">{error}</div>}
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold">Height (cm)</label>
                  <input name="height" type="number" value={form.height} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">Weight (kg)</label>
                  <input name="weight" type="number" value={form.weight} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">Age</label>
                  <input name="age" type="number" value={form.age} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">Gender</label>
                  <input name="gender" value={form.gender} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">Fitness goal</label>
                  <select name="fitnessGoal" value={form.fitnessGoal} onChange={handleChange} className="input-field">
                    <option value="weight_loss">Weight Loss</option>
                    <option value="maintain">Maintain</option>
                    <option value="weight_gain">Weight Gain</option>
                    <option value="muscle_gain">Muscle Gain</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">Activity level</label>
                  <select name="activityLevel" value={form.activityLevel} onChange={handleChange} className="input-field">
                    <option value="sedentary">Sedentary</option>
                    <option value="lightly_active">Lightly Active</option>
                    <option value="moderately_active">Moderately Active</option>
                    <option value="very_active">Very Active</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">Calories goal</label>
                  <input name="calorieGoal" type="number" value={form.calorieGoal} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">Protein goal</label>
                  <input name="proteinGoal" type="number" value={form.proteinGoal} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">Carbs goal</label>
                  <input name="carbsGoal" type="number" value={form.carbsGoal} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">Fat goal</label>
                  <input name="fatGoal" type="number" value={form.fatGoal} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">Water goal (L)</label>
                  <input name="waterGoal" type="number" value={form.waterGoal} onChange={handleChange} className="input-field" />
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <button type="submit" disabled={loading} className="button-primary px-5 py-2.5">
                  {loading ? <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Saving</span> : 'Save profile'}
                </button>
              </div>
            </form>
          )}

          <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-5">
            <div className="rounded-[24px] border border-[#e5e5e5] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <HeartPulse className="h-4 w-4" />
                <p className="font-semibold">Targets</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#f7f7f7] p-4">
                  <p className="text-sm text-[#666666]">Target calories</p>
                  <p className="text-xl font-semibold mt-1">{profile.calorieGoal || 2200} kcal</p>
                </div>
                <div className="rounded-2xl bg-[#f7f7f7] p-4">
                  <p className="text-sm text-[#666666]">Target protein</p>
                  <p className="text-xl font-semibold mt-1">{profile.proteinGoal || 160}g</p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-[#e5e5e5] bg-[#f7f7f7] p-5 shadow-sm">
              <p className="font-semibold mb-3">Preferences</p>
              <div className="space-y-3 text-sm text-[#666666]">
                <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-3">
                  <span>Goal</span>
                  <span className="font-semibold text-[#111111]">{profile.fitnessGoal ? profile.fitnessGoal.replace(/_/g, ' ') : 'Weight loss'}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-3">
                  <span>Activity</span>
                  <span className="font-semibold text-[#111111]">{profile.activityLevel ? profile.activityLevel.replace(/_/g, ' ') : 'Lightly active'}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-3">
                  <span>Units</span>
                  <span className="font-semibold text-[#111111]">Metric</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
