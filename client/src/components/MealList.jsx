import { useState } from 'react'

export default function MealList({ meals, onDelete, idField='_id' }) {
  const [deleting, setDeleting] = useState(null)

  async function handleDelete(id) {
    setDeleting(id)
    await onDelete(id)
    setDeleting(null)
  }

  if(meals.length === 0) return (
    <div className="glass-static p-10 text-center" style={{border:'1px solid rgba(255,255,255,0.06)'}}>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)'}}>
        <svg className="w-7 h-7" style={{color:'var(--text-muted)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
        </svg>
      </div>
      <p className="font-semibold text-sm" style={{color:'var(--text-secondary)'}}>No meals logged yet</p>
      <p className="text-xs mt-1" style={{color:'var(--text-muted)'}}>Add your first meal above</p>
    </div>
  )

  const macroConfig = [
    { key:'protein', label:'P', color:'#00d4ff' },
    { key:'carbs', label:'C', color:'#ffb700' },
    { key:'fats', label:'F', color:'#ff5050' },
  ]

  return (
    <div className="space-y-2">
      {meals.map((meal, i) => (
        <div key={meal[idField]}
          className="flex items-center gap-3 rounded-xl px-4 py-3 group transition-all duration-200"
          style={{
            background:'rgba(255,255,255,0.03)',
            border:'1px solid rgba(255,255,255,0.06)',
            animationDelay:`${i*60}ms`
          }}
          onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(0,255,135,0.15)'}
          onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'}
        >
          {/* Icon */}
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base">
            🍽️
          </div>

          {/* Name + macros */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{color:'var(--text-primary)'}}>{meal.name}</p>
            <div className="flex items-center gap-2 mt-1">
              {macroConfig.map(m => meal[m.key] > 0 && (
                <span key={m.key} className="text-xs font-mono font-semibold" style={{color:m.color, opacity:0.8}}>
                  {m.label}{meal[m.key]}g
                </span>
              ))}
            </div>
          </div>

          {/* Calories */}
          <div className="text-right flex-shrink-0">
            <p className="font-bold font-mono" style={{color:'#00ff87', fontSize:'1rem'}}>{meal.calories}</p>
            <p className="text-xs" style={{color:'var(--text-muted)'}}>kcal</p>
          </div>

          {/* Delete */}
          <button onClick={()=>handleDelete(meal[idField])} disabled={deleting===meal[idField]}
            className="opacity-0 group-hover:opacity-100 ml-1 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0"
            style={{color:'var(--text-muted)'}}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,80,80,0.12)';e.currentTarget.style.color='#ff5050'}}
            onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='var(--text-muted)'}}>
            {deleting===meal[idField]
              ? <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            }
          </button>
        </div>
      ))}
    </div>
  )
}
