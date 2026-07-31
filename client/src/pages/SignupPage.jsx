import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Mail, Sparkles, UserCircle2 } from 'lucide-react'
import { signUp } from '../services/api'

export default function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }))
    setApiError('')
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters'
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match'
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
      await signUp({ name: form.name.trim(), email: form.email.trim(), password: form.password })
      navigate('/dashboard')
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen app-shell flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl grid lg:grid-cols-[1fr_1.1fr] rounded-[32px] overflow-hidden panel">
        <div className="p-6 sm:p-10 lg:p-12 bg-white flex flex-col justify-center">
          <div className="mb-8">
            <p className="section-title mb-3">Create account</p>
            <h2 className="text-3xl font-semibold">Join FitChain</h2>
            <p className="text-sm text-[#666666] mt-2">Start a more deliberate fitness routine today.</p>
          </div>

          {apiError && (
            <div className="rounded-2xl border border-[#f1c4c4] bg-[#fff7f7] p-3 text-sm text-[#b91c1c] mb-4">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold block mb-2">Full name</label>
              <div className="relative">
                <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999999]" />
                <input name="name" value={form.name} onChange={handleChange} placeholder="Alex Morgan" className="input-field pl-10" />
              </div>
              {errors.name && <p className="text-sm text-[#b91c1c] mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold block mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999999]" />
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="alex@email.com" className="input-field pl-10" />
              </div>
              {errors.email && <p className="text-sm text-[#b91c1c] mt-1">{errors.email}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold block mb-2">Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min 6 chars" className="input-field" />
                {errors.password && <p className="text-sm text-[#b91c1c] mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">Confirm</label>
                <input name="confirm" type="password" value={form.confirm} onChange={handleChange} placeholder="Repeat" className="input-field" />
                {errors.confirm && <p className="text-sm text-[#b91c1c] mt-1">{errors.confirm}</p>}
              </div>
            </div>

            <button type="submit" disabled={loading} className="button-primary w-full py-3.2">
              {loading ? 'Creating account…' : 'Create account'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#666666]">
            Already have an account? <Link to="/login" className="font-semibold text-[#111111]">Sign in</Link>
          </div>
        </div>

        <div className="hidden lg:flex flex-col justify-between bg-[#f5f5f5] p-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#111111] text-white flex items-center justify-center"><Sparkles className="h-5 w-5" /></div>
            <div>
              <p className="text-sm font-semibold">Minimal by design</p>
              <p className="text-sm text-[#666666]">High clarity, low noise.</p>
            </div>
          </div>
          <div className="space-y-5">
            <div className="rounded-3xl border border-[#e5e5e5] bg-white p-6">
              <p className="section-title mb-3">Why it feels different</p>
              <ul className="space-y-3 text-sm text-[#666666]">
                <li>• Clear nutrition and activity goals</li>
                <li>• Calm, premium visual language</li>
                <li>• Consistent updates across every screen</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-[#e5e5e5] bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Weekly streak</p>
                  <p className="text-sm text-[#666666]">5 days in a row</p>
                </div>
                <span className="pill">+12%</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-[#666666]">Focus on the work. Let the app stay in the background.</p>
        </div>
      </div>
    </div>
  )
}
