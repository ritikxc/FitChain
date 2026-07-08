import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if(active && payload?.length) return (
    <div className="rounded-lg p-2 text-xs border border-surface-border bg-surface-default">
      <p className="font-medium text-white mb-2">{label}</p>
      <div className="space-y-1">
        {payload.map(p => (
          <div key={p.dataKey} className="flex items-center justify-between gap-4">
            <span className="text-text-secondary">{p.name}</span>
            <span style={{color:p.color}} className="font-mono">{p.value}{p.dataKey==='calories'?' kcal':'g'}</span>
          </div>
        ))}
      </div>
    </div>
  )
  return null
}

export default function WeeklyChart({ data }) {
  return (
    <div className="bg-surface-card border border-surface-border p-5 rounded-xl flex flex-col h-[360px] sm:h-[380px]">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-surface-border/50">
        <div>
          <h3 className="font-display font-medium text-white text-base">Weekly Trajectory</h3>
          <p className="text-xs mt-1 text-text-muted uppercase tracking-wider font-semibold">7-Day Trend</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-text-secondary">
            <span className="w-1.5 h-1.5 rounded-full" style={{background:'#A3FF12'}}/>Calories
          </span>
          <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-text-secondary">
            <span className="w-1.5 h-1.5 rounded-full" style={{background:'#FF7A00'}}/>Protein
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{top:5,right:0,bottom:0,left:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false}/>
            <XAxis dataKey="day" tick={{fill:'#6B7280',fontSize:10,fontFamily:'Inter'}} axisLine={false} tickLine={false} tickMargin={10}/>
            <YAxis tick={{fill:'#6B7280',fontSize:10,fontFamily:'Inter'}} axisLine={false} tickLine={false} tickMargin={10}/>
            <Tooltip content={<CustomTooltip/>}/>
            <Area type="monotone" dataKey="calories" name="Calories" stroke="#A3FF12" strokeWidth={2}
              fill="#A3FF12" fillOpacity={0.12} dot={{fill:'#A3FF12',strokeWidth:0,r:3}}
              activeDot={{r:4,fill:'#A3FF12',stroke:'#0B0B0B',strokeWidth:2}}/>
            <Area type="monotone" dataKey="protein" name="Protein" stroke="#FF7A00" strokeWidth={2}
              fill="#FF7A00" fillOpacity={0.12} dot={{fill:'#FF7A00',strokeWidth:0,r:3}}
              activeDot={{r:4,fill:'#FF7A00',stroke:'#0B0B0B',strokeWidth:2}}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
