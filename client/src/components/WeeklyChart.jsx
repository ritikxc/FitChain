import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-2xl border border-[#e5e5e5] bg-white px-3 py-2 text-xs shadow-sm">
        <p className="font-semibold text-[#111111] mb-2">{label}</p>
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center justify-between gap-4">
            <span className="text-[#666666]">{p.name}</span>
            <span style={{ color: p.color }} className="font-semibold">{p.value}{p.dataKey === 'calories' ? ' kcal' : 'g'}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function WeeklyChart({ data }) {
  return (
    <div className="rounded-[24px] border border-[#e5e5e5] bg-white p-5 shadow-sm flex flex-col h-[360px] sm:h-[380px]">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#f0f0f0]">
        <div>
          <h3 className="font-semibold text-base">Weekly trend</h3>
          <p className="text-xs mt-1 text-[#666666] uppercase tracking-[0.16em]">7-day pulse</p>
        </div>
        <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.16em] text-[#666666]">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#111111]" />Calories</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#2563eb]" />Protein</span>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: '#666666', fontSize: 10, fontFamily: 'Inter' }} axisLine={false} tickLine={false} tickMargin={10} />
            <YAxis tick={{ fill: '#666666', fontSize: 10, fontFamily: 'Inter' }} axisLine={false} tickLine={false} tickMargin={10} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="calories" name="Calories" stroke="#111111" strokeWidth={2} fill="#111111" fillOpacity={0.08} dot={{ fill: '#111111', strokeWidth: 0, r: 3 }} activeDot={{ r: 4, fill: '#111111', stroke: '#ffffff', strokeWidth: 2 }} />
            <Area type="monotone" dataKey="protein" name="Protein" stroke="#2563eb" strokeWidth={2} fill="#2563eb" fillOpacity={0.08} dot={{ fill: '#2563eb', strokeWidth: 0, r: 3 }} activeDot={{ r: 4, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
