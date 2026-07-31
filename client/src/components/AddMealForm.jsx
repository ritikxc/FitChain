import { useState } from 'react'
import { Check, Loader2, Plus } from 'lucide-react'

const DEFAULT = { name: '', calories: '', protein: '', carbs: '', fats: '' }

export default function AddMealForm({ onAdd }) {
  const [form, setForm] = useState(DEFAULT)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Meal name is required'
    if (!form.calories || Number(form.calories) <= 0) errs.calories = 'Enter valid calories'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setLoading(true)
    try {
      await onAdd({ name: form.name.trim(), calories: Number(form.calories), protein: Number(form.protein) || 0, carbs: Number(form.carbs) || 0, fats: Number(form.fats) || 0 })
      setForm(DEFAULT)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 1800)
    } catch (err) {
      setErrors({ name: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-[24px] border border-[#e5e5e5] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-2xl bg-[#f7f7f7] flex items-center justify-center">
          <Plus className="h-4 w-4 text-[#111111]" />
        </div>
        <div>
          <h3 className="font-semibold">Log a meal</h3>
          <p className="text-sm text-[#666666]">Keep your nutrition clear and simple.</p>
        </div>
        {success && <span className="ml-auto pill">Added</span>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm font-semibold block mb-2">Meal name</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Chicken rice bowl" className="input-field" />
          {errors.name && <p className="text-sm text-[#b91c1c] mt-1">{errors.name}</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold block mb-2">Calories</label>
            <input name="calories" type="number" value={form.calories} onChange={handleChange} placeholder="450" min="0" className="input-field" />
            {errors.calories && <p className="text-sm text-[#b91c1c] mt-1">{errors.calories}</p>}
          </div>
          <div>
            <label className="text-sm font-semibold block mb-2">Protein (g)</label>
            <input name="protein" type="number" value={form.protein} onChange={handleChange} placeholder="35" min="0" className="input-field" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold block mb-2">Carbs (g)</label>
            <input name="carbs" type="number" value={form.carbs} onChange={handleChange} placeholder="55" min="0" className="input-field" />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-2">Fats (g)</label>
            <input name="fats" type="number" value={form.fats} onChange={handleChange} placeholder="12" min="0" className="input-field" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="button-primary w-full py-3">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Adding...</> : <><Plus className="h-4 w-4" /> Add meal</>}
        </button>
      </form>
    </div>
  )
}
