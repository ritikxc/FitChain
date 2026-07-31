import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, MoonStar, Shield, SlidersHorizontal, Trash2 } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { getStoredUser, getToken } from '../services/api'

export default function SettingsPage() {
  const navigate = useNavigate()
  const [user] = useState(getStoredUser)

  if (!getToken() || !user) {
    navigate('/login')
    return null
  }

  return (
    <div className="flex min-h-screen bg-[#f7f7f7]">
      <Sidebar user={user} />
      <main className="flex-1 md:ml-64 min-h-screen">
        <div className="sticky top-0 z-20 border-b border-[#e5e5e5] bg-[#fcfcfc]/90 backdrop-blur">
          <div className="px-4 md:px-6 py-4">
            <p className="section-title">Settings</p>
            <h1 className="text-xl font-semibold">Preferences and privacy</h1>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-5">
          <section className="grid lg:grid-cols-2 gap-5">
            <div className="rounded-[24px] border border-[#e5e5e5] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <MoonStar className="h-4 w-4" />
                <p className="font-semibold">Appearance</p>
              </div>
              <div className="space-y-3">
                {['Light mode', 'Default accent'].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-2xl bg-[#f7f7f7] px-3 py-3 text-sm">
                    <span>{item}</span>
                    <span className="font-semibold">Enabled</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-[#e5e5e5] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="h-4 w-4" />
                <p className="font-semibold">Notifications</p>
              </div>
              <div className="space-y-3">
                {['Daily reminders', 'Weekly recap'].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-2xl bg-[#f7f7f7] px-3 py-3 text-sm">
                    <span>{item}</span>
                    <span className="font-semibold">On</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid lg:grid-cols-2 gap-5">
            <div className="rounded-[24px] border border-[#e5e5e5] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="h-4 w-4" />
                <p className="font-semibold">Units and data</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl bg-[#f7f7f7] px-3 py-3">
                  <span>Weight units</span>
                  <span className="font-semibold">kg</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-[#f7f7f7] px-3 py-3">
                  <span>Distance</span>
                  <span className="font-semibold">km</span>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-[#e5e5e5] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-4 w-4" />
                <p className="font-semibold">Privacy</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl bg-[#f7f7f7] px-3 py-3">
                  <span>Export data</span>
                  <button className="button-secondary px-3 py-2 text-sm">Export</button>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-[#f7f7f7] px-3 py-3">
                  <span>Delete account</span>
                  <button className="px-3 py-2 rounded-full border border-[#e5e5e5] text-[#b91c1c] text-sm">Delete</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
