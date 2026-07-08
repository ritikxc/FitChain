import { useState } from 'react'
import { Loader2, Trash2, Utensils } from 'lucide-react'

export default function MealList({ meals, onDelete, idField='_id' }) {
  const [deleting, setDeleting] = useState(null)

  async function handleDelete(id) {
    setDeleting(id)
    await onDelete(id)
    setDeleting(null)
  }

  if(meals.length === 0) return (
    <div className="py-10 text-center">
      <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 border border-surface-border/60 bg-surface-default/30">
        <Utensils className="w-7 h-7 text-text-muted" />
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
          className="flex items-center gap-3 rounded-xl px-4 py-3 group transition-colors duration-200 border border-surface-border/60 bg-surface-default/20 hover:bg-surface-hover"
        >
          {/* Icon */}
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border border-surface-border/60 bg-surface-default/20">
            <Utensils className="w-4 h-4 text-text-muted" />
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
          <button
            onClick={()=>handleDelete(meal[idField])}
            disabled={deleting===meal[idField]}
            className="opacity-100 md:opacity-0 md:group-hover:opacity-100 ml-1 w-11 h-11 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 border border-surface-border/60 bg-surface-default/20 text-text-muted hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Delete ${meal.name}`}
          >
            {deleting===meal[idField] ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      ))}
    </div>
  )
}
