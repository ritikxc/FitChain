import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, HeartPulse, UserCircle2 } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { getStoredUser, getToken } from '../services/api'

export default function ProfilePage() {
  const navigate = useNavigate()
  const [user] = useState(getStoredUser)

  if (!getToken() || !user) {
    navigate('/login')
    return null
  }

  const profile = user.profile || {}
  const bmi = profile.weight && profile.height ? ((profile.weight / ((profile.height / 100) ** 2)) || 0).toFixed(1) : '24.1'

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
              <button className="button-secondary">
                Edit profile <ArrowRight className="h-4 w-4" />
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
                  <span className="font-semibold text-[#111111]">{profile.goal || 'Hypertrophy'}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-3">
                  <span>Location</span>
                  <span className="font-semibold text-[#111111]">{profile.location || 'Gym'}</span>
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
