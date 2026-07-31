import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, ArrowUpRight, Loader2 } from 'lucide-react'
import { AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Sidebar from '../components/Sidebar'
import { getStoredUser, getToken, getWeeklyData } from '../services/api'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-2xl border border-[#e5e5e5] bg-white px-3 py-2 text-xs shadow-sm">
        <p className="font-semibold text-[#111111] mb-2">{label}</p>
        {payload.map((item) => (
          <p key={item.dataKey} style={{ color: item.color }}>
            {item.name}: {item.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function AnalyticsPage() {
  const navigate = useNavigate()
  const [user] = useState(getStoredUser)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!getToken() || !user) {
      navigate('/login')
      return
    }
    getWeeklyData().then(setData).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex min-h-screen bg-[#f7f7f7]">
      <Sidebar user={user} />
      <main className="flex-1 md:ml-64 min-h-screen">
        <div className="sticky top-0 z-20 border-b border-[#e5e5e5] bg-[#fcfcfc]/90 backdrop-blur">
          <div className="px-4 md:px-6 py-4">
            <p className="section-title">Analytics</p>
            <h1 className="text-xl font-semibold">Performance insights</h1>
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
                {[
                  { label: 'Weekly calories', value: '16,240 kcal', note: '+8.2% vs last week' },
                  { label: 'Monthly calories', value: '68,900 kcal', note: 'Steady intake' },
                  { label: 'Average protein', value: '152g', note: 'Above target' },
                  { label: 'Exercise consistency', value: '4.8/7 days', note: 'Strong streak' },
                ].map((item) => (
                  <div key={item.label} className="rounded-[24px] border border-[#e5e5e5] bg-white p-4 shadow-sm">
                    <p className="text-sm text-[#666666]">{item.label}</p>
                    <p className="text-2xl font-semibold mt-2">{item.value}</p>
                    <p className="text-sm text-[#666666] mt-1">{item.note}</p>
                  </div>
                ))}
              </section>

              <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-5">
                <div className="rounded-[24px] border border-[#e5e5e5] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="section-title">Trend</p>
                      <h2 className="text-lg font-semibold">Calories and protein</h2>
                    </div>
                    <div className="pill"><ArrowUpRight className="h-3.5 w-3.5" /> Upward</div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis dataKey="day" tick={{ fill: '#666666', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#666666', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="calories" stroke="#111111" fill="#111111" fillOpacity={0.08} />
                        <Area type="monotone" dataKey="protein" stroke="#2563eb" fill="#2563eb" fillOpacity={0.08} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#e5e5e5] bg-[#f7f7f7] p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="h-4 w-4" />
                    <p className="font-semibold">Goal completion</p>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: 'Calorie target', value: '78%', tone: '#111111' },
                      { label: 'Protein target', value: '95%', tone: '#2563eb' },
                      { label: 'Workout consistency', value: '82%', tone: '#16a34a' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-2">
                          <span>{item.label}</span>
                          <span className="font-semibold">{item.value}</span>
                        </div>
                        <div className="progress-bar">
                          <div style={{ width: item.value, background: item.tone }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
