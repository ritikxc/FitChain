import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, Loader2, Sparkles, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'
import Sidebar from '../components/Sidebar'
import { getStoredUser, getWeeklyData, getToken } from '../services/api'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-2xl border border-[#e5e5e5] bg-white px-3 py-2 text-xs shadow-sm">
        <p className="font-semibold text-[#111111] mb-2">{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} style={{ color: p.color }}>
            {p.name}: {p.value}{p.dataKey === 'calories' ? ' kcal' : 'g'}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function ProgressPage() {
  const navigate = useNavigate()
  const [user] = useState(getStoredUser)
  const [weeklyData, setWeeklyData] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeMetric, setActiveMetric] = useState('calories')

  useEffect(() => {
    if (!getToken() || !user) {
      navigate('/login')
      return
    }
    getWeeklyData().then(setWeeklyData).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const avgCal = weeklyData.length ? Math.round(weeklyData.reduce((s, d) => s + d.calories, 0) / weeklyData.length) : 0
  const avgPro = weeklyData.length ? Math.round(weeklyData.reduce((s, d) => s + d.protein, 0) / weeklyData.length) : 0
  const best = weeklyData.reduce((max, d) => d.calories > (max?.calories || 0) ? d : max, null)
  const tracked = weeklyData.filter((d) => d.calories > 0).length

  const metrics = [
    { id: 'calories', label: 'Calories', color: '#111111' },
    { id: 'protein', label: 'Protein', color: '#2563eb' },
    { id: 'carbs', label: 'Carbs', color: '#16a34a' },
    { id: 'fats', label: 'Fats', color: '#dc2626' },
  ]

  return (
    <div className="flex min-h-screen bg-[#f7f7f7]">
      <Sidebar user={user} />
      <main className="flex-1 md:ml-64 min-h-screen">
        <div className="sticky top-0 z-20 border-b border-[#e5e5e5] bg-[#fcfcfc]/90 backdrop-blur">
          <div className="px-4 md:px-6 py-4">
            <p className="section-title">Progress</p>
            <h1 className="text-xl font-semibold">Weekly review</h1>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-5">
          {loading ? (
            <div className="rounded-[24px] border border-[#e5e5e5] bg-white p-12 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-[#111111]" />
            </div>
          ) : (
            <>
              <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[{ label: 'Avg calories', value: avgCal, unit: 'kcal/day', icon: BarChart3 }, { label: 'Avg protein', value: avgPro, unit: 'g/day', icon: TrendingUp }, { label: 'Best day', value: best?.day || '—', unit: 'highest intake', icon: Sparkles }, { label: 'Days tracked', value: tracked, unit: 'this week', icon: BarChart3 }].map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={stat.label} className="rounded-[24px] border border-[#e5e5e5] bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm text-[#666666]">{stat.label}</p>
                        <Icon className="h-4 w-4 text-[#111111]" />
                      </div>
                      <p className="text-2xl font-semibold">{stat.value}</p>
                      <p className="text-sm text-[#666666] mt-1">{stat.unit}</p>
                    </div>
                  )
                })}
              </section>

              <section className="rounded-[24px] border border-[#e5e5e5] bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <div>
                    <p className="section-title">Breakdown</p>
                    <h2 className="text-lg font-semibold">Daily totals</h2>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {metrics.map((m) => (
                      <button key={m.id} onClick={() => setActiveMetric(m.id)} className={`px-3 py-2 rounded-full text-sm font-medium ${activeMetric === m.id ? 'bg-[#111111] text-white' : 'bg-[#f7f7f7] text-[#666666]'}`}>
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="day" tick={{ fill: '#666666', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#666666', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey={activeMetric} fill={metrics.find((m) => m.id === activeMetric)?.color} radius={[6, 6, 0, 0]} name={metrics.find((m) => m.id === activeMetric)?.label} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="rounded-[24px] border border-[#e5e5e5] bg-white p-5 shadow-sm">
                <p className="section-title mb-4">Macro trend</p>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="day" tick={{ fill: '#666666', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#666666', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }} />
                      <Line type="monotone" dataKey="protein" name="Protein" stroke="#2563eb" strokeWidth={2.5} dot={{ fill: '#2563eb', r: 3, strokeWidth: 0 }} />
                      <Line type="monotone" dataKey="carbs" name="Carbs" stroke="#16a34a" strokeWidth={2.5} dot={{ fill: '#16a34a', r: 3, strokeWidth: 0 }} />
                      <Line type="monotone" dataKey="fats" name="Fats" stroke="#dc2626" strokeWidth={2.5} dot={{ fill: '#dc2626', r: 3, strokeWidth: 0 }} />
                    </LineChart>
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
