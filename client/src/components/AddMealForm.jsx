import { useState } from 'react'
import { Check, Loader2, Plus } from 'lucide-react'

const DEFAULT = { name:'', calories:'', protein:'', carbs:'', fats:'' }

export default function AddMealForm({ onAdd }) {
  const [form, setForm] = useState(DEFAULT)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function handleChange(e) {
    const {name,value} = e.target
    setForm(p=>({...p,[name]:value}))
    if(errors[name]) setErrors(p=>({...p,[name]:''}))
  }

  function validate() {
    const errs = {}
    if(!form.name.trim()) errs.name = 'Meal name is required'
    if(!form.calories || Number(form.calories)<=0) errs.calories = 'Enter valid calories'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if(Object.keys(errs).length){ setErrors(errs); return }
    setLoading(true)
    try {
      await onAdd({ name:form.name.trim(), calories:Number(form.calories), protein:Number(form.protein)||0, carbs:Number(form.carbs)||0, fats:Number(form.fats)||0 })
      setForm(DEFAULT)
      setSuccess(true)
      setTimeout(()=>setSuccess(false), 2000)
    } catch(err) {
      setErrors({name: err.message})
    } finally { setLoading(false) }
  }

  return (
    <div className="rounded-xl border border-surface-border bg-surface-card p-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl border border-surface-border/60 bg-surface-default/30 flex items-center justify-center flex-shrink-0">
          <Plus className="w-4 h-4 text-brand-green" />
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-bold text-sm text-white">Log meal</h3>
          <p className="text-xs text-text-muted truncate">Track your nutrition</p>
        </div>
        {success && (
          <span className="ml-auto badge-green text-xs">
            <Check className="w-3 h-3" />
            Added
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="label-neon">Meal Name</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Chicken & Rice"
            className={`input-neon ${errors.name?'error':''}`}/>
          {errors.name && <p className="text-xs mt-1" style={{color:'#ff5050'}}>{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="label-neon">Calories *</label>
            <input name="calories" type="number" value={form.calories} onChange={handleChange} placeholder="450" min="0"
              className={`input-neon ${errors.calories?'error':''}`}/>
            {errors.calories && <p className="text-xs mt-1" style={{color:'#ff5050'}}>{errors.calories}</p>}
          </div>
          <div>
            <label className="label-neon">Protein (g)</label>
            <input name="protein" type="number" value={form.protein} onChange={handleChange} placeholder="35" min="0" className="input-neon"/>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="label-neon">Carbs (g)</label>
            <input name="carbs" type="number" value={form.carbs} onChange={handleChange} placeholder="55" min="0" className="input-neon"/>
          </div>
          <div>
            <label className="label-neon">Fats (g)</label>
            <input name="fats" type="number" value={form.fats} onChange={handleChange} placeholder="12" min="0" className="input-neon"/>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-gradient w-full mt-1 rounded-xl min-h-[44px]">
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</>
          ) : (
            <><Plus className="w-4 h-4" /> Add meal</>
          )}
        </button>
      </form>
    </div>
  )
}
