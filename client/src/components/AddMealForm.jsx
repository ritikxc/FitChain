import { useState } from 'react'

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
    <div className="glass-static p-5 relative overflow-hidden" style={{border:'1px solid rgba(0,255,135,0.1)'}}>
      {/* Header glow line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,#00ff87,#00d4ff,transparent)'}}/>

      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:'rgba(0,255,135,0.1)',border:'1px solid rgba(0,255,135,0.2)'}}>
          <svg className="w-4 h-4" style={{color:'#00ff87'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">Log Meal</h3>
          <p className="text-xs" style={{color:'var(--text-muted)'}}>Track your nutrition</p>
        </div>
        {success && (
          <span className="ml-auto badge-green text-xs animate-scale-in">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
            Added!
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

        <div className="grid grid-cols-2 gap-3">
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-neon">Carbs (g)</label>
            <input name="carbs" type="number" value={form.carbs} onChange={handleChange} placeholder="55" min="0" className="input-neon"/>
          </div>
          <div>
            <label className="label-neon">Fats (g)</label>
            <input name="fats" type="number" value={form.fats} onChange={handleChange} placeholder="12" min="0" className="input-neon"/>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-gradient w-full mt-1" style={{borderRadius:'12px'}}>
          {loading ? (
            <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Adding...</>
          ) : (
            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>Add Meal</>
          )}
        </button>
      </form>
    </div>
  )
}
