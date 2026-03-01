import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

function NeonRing({ value, goal }) {
  const [animated, setAnimated] = useState(0)
  const pct = Math.min((value / goal) * 100, 100)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(pct), 200)
    return () => clearTimeout(timer)
  }, [pct])

  const r = 48
  const circ = 2 * Math.PI * r
  const dash = (animated / 100) * circ
  const color = pct > 100 ? '#ff5050' : pct > 85 ? '#ffb700' : '#00ff87'
  const glowColor = pct > 100 ? 'rgba(255,80,80,0.4)' : 'rgba(0,255,135,0.4)'

  return (
    <div className="relative flex items-center justify-center">
      <svg width="128" height="128" className="-rotate-90" style={{filter:`drop-shadow(0 0 8px ${glowColor})`}}>
        {/* Track */}
        <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
        {/* Fill */}
        <circle cx="64" cy="64" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition:'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1), stroke 0.3s ease' }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute flex flex-col items-center">
        <span className="font-bold text-xl" style={{color, fontFamily:"'JetBrains Mono',monospace"}}>{value}</span>
        <span className="text-xs" style={{color:'var(--text-muted)'}}>/ {goal}</span>
      </div>
    </div>
  )
}

const MACRO_CONFIG = [
  { key:'protein', label:'Protein', color:'#00d4ff', bg:'rgba(0,212,255,0.1)', border:'rgba(0,212,255,0.2)' },
  { key:'carbs', label:'Carbs', color:'#ffb700', bg:'rgba(255,183,0,0.1)', border:'rgba(255,183,0,0.2)' },
  { key:'fats', label:'Fats', color:'#ff5050', bg:'rgba(255,80,80,0.1)', border:'rgba(255,80,80,0.2)' },
]

const CustomTooltip = ({ active, payload }) => {
  if(active && payload?.length) return (
    <div className="rounded-xl px-3 py-2 text-sm" style={{background:'rgba(5,10,16,0.95)',border:'1px solid rgba(0,255,135,0.2)'}}>
      <p className="font-bold text-white">{payload[0].name}</p>
      <p style={{color:'var(--text-secondary)'}}>{payload[0].payload.grams}g</p>
    </div>
  )
  return null
}

export default function MacroChart({ macros, calorieGoal=2200 }) {
  const { calories, protein, carbs, fats } = macros

  const pieData = [
    { name:'Protein', value: protein||1, grams:protein },
    { name:'Carbs', value: carbs||1, grams:carbs },
    { name:'Fats', value: fats||1, grams:fats },
  ]

  return (
    <div className="glass-static p-5" style={{border:'1px solid rgba(255,255,255,0.07)'}}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-white text-sm">Nutrition Overview</h3>
          <p className="text-xs mt-0.5" style={{color:'var(--text-muted)'}}>Today's macronutrients</p>
        </div>
        <span className="badge-green text-xs">Live</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Calorie Ring */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <NeonRing value={calories} goal={calorieGoal}/>
          <p className="text-xs font-semibold" style={{color:'var(--text-secondary)'}}>Daily Calories</p>
        </div>

        {/* Macro breakdown */}
        <div className="flex-1 w-full">
          {/* Pie */}
          <div className="h-28 mb-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={30} outerRadius={48}
                  paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {pieData.map((_,i) => (
                    <Cell key={i} fill={MACRO_CONFIG[i].color} opacity={0.85}/>
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip/>}/>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Macro bars */}
          <div className="space-y-2.5">
            {MACRO_CONFIG.map(m => {
              const total = protein + carbs + fats || 1
              const pct = Math.round((macros[m.key] / total) * 100)
              return (
                <div key={m.key} className="flex items-center gap-3">
                  <span className="text-xs font-semibold w-12 flex-shrink-0" style={{color:m.color}}>{m.label}</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.06)'}}>
                    <div className="h-full rounded-full transition-all duration-1000"
                      style={{width:`${pct}%`, background:m.color, boxShadow:`0 0 6px ${m.color}60`}}/>
                  </div>
                  <span className="text-xs font-mono w-10 text-right flex-shrink-0" style={{color:'var(--text-secondary)'}}>{macros[m.key]}g</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
