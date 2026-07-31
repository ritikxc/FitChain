import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Activity } from 'lucide-react'

const MACRO_CONFIG = [
  { key: 'protein', label: 'Protein', color: '#111111' },
  { key: 'carbs', label: 'Carbs', color: '#2563eb' },
  { key: 'fats', label: 'Fats', color: '#dc2626' },
]

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-2xl border border-[#e5e5e5] bg-white px-3 py-2 text-xs shadow-sm">
        <p className="font-semibold text-[#111111]">{payload[0].name}</p>
        <p className="text-[#666666] mt-0.5">{payload[0].payload.grams}g</p>
      </div>
    )
  }
  return null
}

export default function MacroChart({ macros }) {
  const { protein, carbs, fats } = macros
  const pieData = [
    { name: 'Protein', value: protein || 1, grams: protein },
    { name: 'Carbs', value: carbs || 1, grams: carbs },
    { name: 'Fats', value: fats || 1, grams: fats },
  ]

  return (
    <div className="rounded-[24px] border border-[#e5e5e5] bg-white p-5 shadow-sm h-[320px] sm:h-[340px]">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#f0f0f0]">
        <div>
          <h3 className="font-semibold text-base">Macro split</h3>
          <p className="text-xs mt-1 text-[#666666] uppercase tracking-[0.16em]">Daily balance</p>
        </div>
        <Activity className="h-5 w-5 text-[#111111]" />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-8 flex-1 min-h-0">
        <div className="h-32 w-32 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={60} paddingAngle={4} dataKey="value" strokeWidth={0}>
                {pieData.map((_, i) => <Cell key={i} fill={MACRO_CONFIG[i].color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 w-full space-y-4">
          {MACRO_CONFIG.map((m) => {
            const total = protein + carbs + fats || 1
            const pct = Math.round((macros[m.key] / total) * 100)
            return (
              <div key={m.key}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#666666]">{m.label}</span>
                  <span className="text-[#111111] font-semibold">{macros[m.key]}g</span>
                </div>
                <div className="w-full h-2 bg-[#f7f7f7] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: m.color }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
