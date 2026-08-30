import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Check, Database, Moon, MoonStar, Shield, SlidersHorizontal, Sun } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { getStoredUser, getToken, updateProfile } from '../services/api'

export default function SettingsPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(getStoredUser)
  const [darkMode, setDarkMode] = useState(() => user?.profile?.darkMode || false)
  const [unitSystem, setUnitSystem] = useState(() => user?.profile?.unitSystem || 'metric')
  const [dailySync, setDailySync] = useState(true)
  const [offlineCache, setOfflineCache] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  if (!getToken() || !user) {
    navigate('/login')
    return null
  }

  async function handleToggleDarkMode() {
    const nextMode = !darkMode
    setDarkMode(nextMode)
    setSaving(true)
    try {
      if (nextMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      const updatedUser = await updateProfile({ darkMode: nextMode })
      setUser(updatedUser)
      setToast('Theme preference updated!')
      setTimeout(() => setToast(''), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  async function handleUnitChange(newUnit) {
    setUnitSystem(newUnit)
    setSaving(true)
    try {
      const updatedUser = await updateProfile({ unitSystem: newUnit })
      setUser(updatedUser)
      setToast(`Units updated to ${newUnit === 'metric' ? 'Metric (kg, cm)' : 'Imperial (lbs, in)'}!`)
      setTimeout(() => setToast(''), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f7f7f7]">
      <Sidebar user={user} />
      <main className="flex-1 md:ml-64 min-h-screen">
        <div className="sticky top-0 z-20 border-b border-[#e5e5e5] bg-[#fcfcfc]/90 backdrop-blur">
          <div className="flex items-center justify-between px-4 md:px-6 py-4">
            <div>
              <p className="section-title">Configuration</p>
              <h1 className="text-xl font-semibold">Settings</h1>
            </div>
            {toast && <span className="pill bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0] font-medium">{toast}</span>}
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-5">
          <div className="grid lg:grid-cols-2 gap-5">
            {/* Appearance & Dark Mode */}
            <section className="rounded-[28px] border border-[#e5e5e5] bg-white p-5 md:p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <MoonStar className="h-5 w-5 text-[#111111]" />
                <h2 className="text-lg font-semibold">Appearance & Theme</h2>
              </div>
              <p className="text-xs text-[#666666]">Customize your visual theme and interface mode.</p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between rounded-2xl bg-[#f7f7f7] p-4 border border-[#e5e5e5]">
                  <div className="flex items-center gap-3">
                    {darkMode ? <Moon className="h-5 w-5 text-[#111111]" /> : <Sun className="h-5 w-5 text-[#111111]" />}
                    <div>
                      <p className="font-semibold text-sm">Dark Mode</p>
                      <p className="text-xs text-[#666666]">Enable darker palette for reduced eye strain</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleDarkMode}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      darkMode ? 'bg-[#111111]' : 'bg-[#e5e5e5]'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        darkMode ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </section>

            {/* Unit Preferences */}
            <section className="rounded-[28px] border border-[#e5e5e5] bg-white p-5 md:p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <SlidersHorizontal className="h-5 w-5 text-[#111111]" />
                <h2 className="text-lg font-semibold">Unit Preferences</h2>
              </div>
              <p className="text-xs text-[#666666]">Choose your measurement standard for weights, height, and volumes.</p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleUnitChange('metric')}
                  className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition ${
                    unitSystem === 'metric' ? 'border-[#111111] bg-[#f7f7f7]' : 'border-[#e5e5e5] bg-white hover:bg-[#fafafa]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <p className="font-semibold text-sm">Metric System</p>
                    {unitSystem === 'metric' && <Check className="h-4 w-4 text-[#111111]" />}
                  </div>
                  <p className="text-xs text-[#666666] mt-2">Kilograms (kg), Centimeters (cm), Liters (L)</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleUnitChange('imperial')}
                  className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition ${
                    unitSystem === 'imperial' ? 'border-[#111111] bg-[#f7f7f7]' : 'border-[#e5e5e5] bg-white hover:bg-[#fafafa]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <p className="font-semibold text-sm">Imperial System</p>
                    {unitSystem === 'imperial' && <Check className="h-4 w-4 text-[#111111]" />}
                  </div>
                  <p className="text-xs text-[#666666] mt-2">Pounds (lbs), Inches (in), Fluid Oz (fl oz)</p>
                </button>
              </div>
            </section>
          </div>

          {/* Data Preferences Section */}
          <section className="rounded-[28px] border border-[#e5e5e5] bg-white p-5 md:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-5 w-5 text-[#111111]" />
              <h2 className="text-lg font-semibold">Data Preferences</h2>
            </div>
            <p className="text-xs text-[#666666]">Configure how your fitness metrics and local state are synced and managed.</p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between rounded-2xl bg-[#f7f7f7] p-4 border border-[#e5e5e5]">
                <div>
                  <p className="font-semibold text-sm">Cloud Data Synchronization</p>
                  <p className="text-xs text-[#666666]">Automatically synchronize meals, water logs, and workout sets with the backend database</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDailySync(!dailySync)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    dailySync ? 'bg-[#111111]' : 'bg-[#e5e5e5]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      dailySync ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-[#f7f7f7] p-4 border border-[#e5e5e5]">
                <div>
                  <p className="font-semibold text-sm">Local Session Caching</p>
                  <p className="text-xs text-[#666666]">Persist active workout reps and draft logs offline in browser local storage</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOfflineCache(!offlineCache)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    offlineCache ? 'bg-[#111111]' : 'bg-[#e5e5e5]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      offlineCache ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
