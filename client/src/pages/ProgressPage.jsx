import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts'
import Sidebar from '../components/Sidebar'
import { getStoredUser, getWeeklyData, getToken } from '../services/api'

const CustomTooltip = ({active,payload,label}) => {
  if(active&&payload?.length) return (
    <div className="rounded-xl p-3 text-xs" style={{background:'rgba(2,4,8,0.95)',border:'1px solid rgba(0,255,135,0.2)',boxShadow:'0 8px 30px rgba(0,0,0,0.5)'}}>
      <p className="font-bold text-white mb-1.5">{label}</p>
      {payload.map(p=>(
        <p key={p.dataKey} className="font-mono" style={{color:p.color}}>
          {p.name}: {p.value}{p.dataKey==='calories'?' kcal':'g'}
        </p>
      ))}
    </div>
  )
  return null
}

export default function ProgressPage() {
  const navigate = useNavigate()
  const [user] = useState(getStoredUser)
  const [weeklyData, setWeeklyData] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeMetric, setActiveMetric] = useState('calories')

  useEffect(()=>{
    if(!getToken()||!user){ navigate('/login'); return }
    getWeeklyData().then(setWeeklyData).catch(()=>{}).finally(()=>setLoading(false))
  },[])

  const avgCal = weeklyData.length ? Math.round(weeklyData.reduce((s,d)=>s+d.calories,0)/weeklyData.length) : 0
  const avgPro = weeklyData.length ? Math.round(weeklyData.reduce((s,d)=>s+d.protein,0)/weeklyData.length) : 0
  const best = weeklyData.reduce((max,d)=>d.calories>(max?.calories||0)?d:max,null)
  const tracked = weeklyData.filter(d=>d.calories>0).length

  const metrics = [
    {id:'calories',label:'Calories',color:'#00ff87'},
    {id:'protein',label:'Protein',color:'#00d4ff'},
    {id:'carbs',label:'Carbs',color:'#ffb700'},
    {id:'fats',label:'Fats',color:'#ff5050'},
  ]

  return (
    <div className="flex min-h-screen" style={{background:'var(--bg-void)'}}>
      <div className="bg-mesh"/>
      <Sidebar user={user}/>
      <main className="flex-1 md:ml-60 min-h-screen relative">
        <div className="sticky top-0 z-20 px-6 py-4"
          style={{background:'rgba(2,4,8,0.9)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
          <h1 className="font-black text-xl text-white" style={{letterSpacing:'-0.02em'}}>Progress Analytics</h1>
          <p className="text-xs mt-0.5" style={{color:'var(--text-muted)'}}>Your nutrition data this week</p>
        </div>

        <div className="p-4 md:p-6 space-y-5 page-enter">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <svg className="animate-spin w-10 h-10" style={{color:'#00ff87'}} fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          ) : (
            <>
              {/* Summary stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {label:'Avg. Calories',value:avgCal,unit:'kcal/day',icon:'🔥',color:'#00ff87'},
                  {label:'Avg. Protein',value:avgPro,unit:'g/day',icon:'💪',color:'#00d4ff'},
                  {label:'Best Day',value:best?.day||'—',unit:'highest intake',icon:'⭐',color:'#ffb700',isText:true},
                  {label:'Days Tracked',value:tracked,unit:'this week',icon:'📅',color:'var(--text-primary)'},
                ].map(s=>(
                  <div key={s.label} className="stat-tile">
                    <span className="text-2xl mb-2 block">{s.icon}</span>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{color:'var(--text-muted)'}}>{s.label}</p>
                    <p className="font-black text-2xl" style={{color:s.color,fontFamily:s.isText?'Outfit':"'JetBrains Mono',monospace"}}>
                      {s.isText ? s.value : s.value.toLocaleString()}
                    </p>
                    <p className="text-xs mt-0.5" style={{color:'var(--text-muted)'}}>{s.unit}</p>
                  </div>
                ))}
              </div>

              {/* Bar chart with metric toggle */}
              <div className="glass-static p-5" style={{border:'1px solid rgba(255,255,255,0.07)'}}>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <div>
                    <h3 className="font-bold text-white text-sm">Weekly Breakdown</h3>
                    <p className="text-xs mt-0.5" style={{color:'var(--text-muted)'}}>Daily totals per metric</p>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {metrics.map(m=>(
                      <button key={m.id} onClick={()=>setActiveMetric(m.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                        style={activeMetric===m.id
                          ? {background:m.color,color:'#020408',boxShadow:`0 0 15px ${m.color}50`}
                          : {background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',color:'var(--text-secondary)'}
                        }>{m.label}</button>
                    ))}
                  </div>
                </div>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData} margin={{top:5,right:5,bottom:0,left:-20}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
                      <XAxis dataKey="day" tick={{fill:'#3a4a5a',fontSize:11}} axisLine={false} tickLine={false}/>
                      <YAxis tick={{fill:'#3a4a5a',fontSize:10,fontFamily:'JetBrains Mono'}} axisLine={false} tickLine={false}/>
                      <Tooltip content={<CustomTooltip/>}/>
                      <Bar dataKey={activeMetric} fill={metrics.find(m=>m.id===activeMetric)?.color} radius={[6,6,0,0]}
                        name={metrics.find(m=>m.id===activeMetric)?.label}
                        style={{filter:`drop-shadow(0 0 6px ${metrics.find(m=>m.id===activeMetric)?.color}60)`}}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Line chart */}
              <div className="glass-static p-5" style={{border:'1px solid rgba(255,255,255,0.07)'}}>
                <h3 className="font-bold text-white text-sm mb-5">Macro Trends</h3>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyData} margin={{top:5,right:5,bottom:0,left:-20}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
                      <XAxis dataKey="day" tick={{fill:'#3a4a5a',fontSize:11}} axisLine={false} tickLine={false}/>
                      <YAxis tick={{fill:'#3a4a5a',fontSize:10}} axisLine={false} tickLine={false}/>
                      <Tooltip content={<CustomTooltip/>}/>
                      <Legend wrapperStyle={{fontSize:'11px',paddingTop:'12px'}} formatter={v=><span style={{color:'var(--text-secondary)'}}>{v}</span>}/>
                      <Line type="monotone" dataKey="protein" name="Protein" stroke="#00d4ff" strokeWidth={2.5} dot={{fill:'#00d4ff',r:3,strokeWidth:0}} activeDot={{r:5,stroke:'rgba(0,212,255,0.3)',strokeWidth:3}}/>
                      <Line type="monotone" dataKey="carbs" name="Carbs" stroke="#ffb700" strokeWidth={2.5} dot={{fill:'#ffb700',r:3,strokeWidth:0}} activeDot={{r:5}}/>
                      <Line type="monotone" dataKey="fats" name="Fats" stroke="#ff5050" strokeWidth={2.5} dot={{fill:'#ff5050',r:3,strokeWidth:0}} activeDot={{r:5}}/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Radar chart */}
              <div className="glass-static p-5" style={{border:'1px solid rgba(255,255,255,0.07)'}}>
                <h3 className="font-bold text-white text-sm mb-1">Daily Macro Distribution</h3>
                <p className="text-xs mb-5" style={{color:'var(--text-muted)'}}>Radar view of macronutrient balance across the week</p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={weeklyData}>
                      <PolarGrid stroke="rgba(255,255,255,0.06)"/>
                      <PolarAngleAxis dataKey="day" tick={{fill:'#3a4a5a',fontSize:11}}/>
                      <Radar name="Protein" dataKey="protein" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.15}/>
                      <Radar name="Carbs" dataKey="carbs" stroke="#ffb700" fill="#ffb700" fillOpacity={0.12}/>
                      <Radar name="Fats" dataKey="fats" stroke="#ff5050" fill="#ff5050" fillOpacity={0.1}/>
                      <Legend wrapperStyle={{fontSize:'11px'}} formatter={v=><span style={{color:'var(--text-secondary)'}}>{v}</span>}/>
                      <Tooltip content={<CustomTooltip/>}/>
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
