import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Activity } from 'lucide-react'

const MACRO_CONFIG = [
  { key:'protein', label:'Protein', color:'#A3FF12' },
  { key:'carbs', label:'Carbs', color:'#FF7A00' },
  { key:'fats', label:'Fats', color:'#EF4444' },
]

const CustomTooltip = ({ active, payload }) => {
  if(active && payload?.length) return (
    <div className="rounded-lg p-2 text-xs border border-surface-border bg-surface-default">
      <p className="font-semibold text-white">{payload[0].name}</p>
      <p className="text-text-secondary mt-0.5 font-mono">{payload[0].payload.grams}g</p>
    </div>
  )
  return null
}

export default function MacroChart({ macros }) {
  const { protein, carbs, fats } = macros

  const pieData = [
    { name:'Protein', value: protein||1, grams:protein },
    { name:'Carbs', value: carbs||1, grams:carbs },
    { name:'Fats', value: fats||1, grams:fats },
  ]

  return (
    <div className="bg-surface-card border border-surface-border p-5 rounded-xl flex flex-col h-full min-h-[320px]">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-surface-border/50">
        <div>
          <h3 className="font-display font-medium text-white text-base">Nutrition Distribution</h3>
          <p className="text-xs mt-1 text-text-muted uppercase tracking-wider font-semibold">Macronutrient split</p>
        </div>
        <Activity className="w-5 h-5 text-brand-green" />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-8 flex-1">
        {/* Pie */}
        <div className="h-32 w-32 flex-shrink-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={60}
                paddingAngle={4} dataKey="value" strokeWidth={0}>
                {pieData.map((_,i) => (
                  <Cell key={i} fill={MACRO_CONFIG[i].color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip/>}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Macro bars */}
        <div className="flex-1 w-full space-y-4">
          {MACRO_CONFIG.map(m => {
            const total = protein + carbs + fats || 1
            const pct = Math.round((macros[m.key] / total) * 100)
            return (
              <div key={m.key}>
                <div className="flex justify-between text-xs mb-1.5 font-mono">
                  <span className="text-text-secondary">{m.label}</span>
                  <span className="text-white font-medium">{macros[m.key]}g</span>
                </div>
                <div className="w-full h-1.5 bg-surface-default rounded-sm overflow-hidden border border-surface-border/50">
                  <div className="h-full rounded-sm transition-all duration-300 ease-out"
                    style={{width:`${pct}%`, background:m.color}}/>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
