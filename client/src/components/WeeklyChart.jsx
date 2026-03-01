import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if(active && payload?.length) return (
    <div className="rounded-xl p-3 text-sm" style={{background:'rgba(2,4,8,0.95)',border:'1px solid rgba(0,255,135,0.2)',boxShadow:'0 8px 30px rgba(0,0,0,0.5)'}}>
      <p className="font-bold text-white mb-1.5 text-xs">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} className="text-xs font-mono" style={{color:p.color}}>
          {p.name}: {p.value}{p.dataKey==='calories'?' kcal':'g'}
        </p>
      ))}
    </div>
  )
  return null
}

export default function WeeklyChart({ data }) {
  return (
    <div className="glass-static p-5" style={{border:'1px solid rgba(255,255,255,0.07)'}}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-white text-sm">Weekly Trends</h3>
          <p className="text-xs mt-0.5" style={{color:'var(--text-muted)'}}>Last 7 days of nutrition data</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs" style={{color:'var(--text-secondary)'}}>
            <span className="w-2 h-2 rounded-full" style={{background:'#00ff87'}}/>Calories
          </span>
          <span className="flex items-center gap-1.5 text-xs" style={{color:'var(--text-secondary)'}}>
            <span className="w-2 h-2 rounded-full" style={{background:'#00d4ff'}}/>Protein
          </span>
        </div>
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{top:5,right:5,bottom:0,left:-20}}>
            <defs>
              <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ff87" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#00ff87" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="proGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
            <XAxis dataKey="day" tick={{fill:'#3a4a5a',fontSize:11,fontFamily:'Outfit'}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:'#3a4a5a',fontSize:10,fontFamily:'JetBrains Mono'}} axisLine={false} tickLine={false}/>
            <Tooltip content={<CustomTooltip/>}/>
            <Area type="monotone" dataKey="calories" name="Calories" stroke="#00ff87" strokeWidth={2}
              fill="url(#calGrad)" dot={{fill:'#00ff87',strokeWidth:0,r:3}}
              activeDot={{r:5,fill:'#00ff87',stroke:'rgba(0,255,135,0.3)',strokeWidth:3}}/>
            <Area type="monotone" dataKey="protein" name="Protein" stroke="#00d4ff" strokeWidth={2}
              fill="url(#proGrad)" dot={{fill:'#00d4ff',strokeWidth:0,r:3}}
              activeDot={{r:5,fill:'#00d4ff',stroke:'rgba(0,212,255,0.3)',strokeWidth:3}}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
