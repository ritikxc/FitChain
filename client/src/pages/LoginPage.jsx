import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Lock, Mail, Sparkles } from 'lucide-react'
import { login } from '../services/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
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
    if (!form.email.trim()) errs.email = 'Email is required'
    if (!form.password) errs.password = 'Password is required'
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
      const currentUser = await login({ email: form.email.trim(), password: form.password })
      navigate(currentUser?.profile?.setupComplete ? '/dashboard' : '/onboarding')
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen app-shell flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl grid lg:grid-cols-[1.1fr_0.9fr] rounded-[32px] overflow-hidden panel">
        <div className="hidden lg:flex flex-col justify-between bg-[#f5f5f5] p-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#111111] text-white flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">FitChain</p>
              <p className="text-sm text-[#666666]">Premium fitness OS</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="section-title mb-3">Mindful performance</p>
              <h1 className="text-4xl font-semibold leading-tight">Track progress with calm clarity.</h1>
            </div>
            <div className="rounded-3xl border border-[#e5e5e5] bg-white p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Daily focus</p>
                  <p className="text-sm text-[#666666]">Nutrition and training in one place.</p>
                </div>
                <span className="pill">On track</span>
              </div>
              <div className="progress-bar">
                <div className="w-[78%] bg-[#111111]" />
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-2xl bg-[#f7f7f7] p-3">
                  <p className="text-[#666666]">Protein</p>
                  <p className="font-semibold">152g</p>
                </div>
                <div className="rounded-2xl bg-[#f7f7f7] p-3">
                  <p className="text-[#666666]">Water</p>
                  <p className="font-semibold">3.2L</p>
                </div>
                <div className="rounded-2xl bg-[#f7f7f7] p-3">
                  <p className="text-[#666666]">Steps</p>
                  <p className="font-semibold">12k</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-[#666666]">Built for people who want to feel strong, informed, and consistent.</p>
        </div>

        <div className="p-6 sm:p-10 lg:p-12 bg-white flex flex-col justify-center">
          <div className="mb-8">
            <p className="section-title mb-3">Welcome back</p>
            <h2 className="text-3xl font-semibold">Sign in to your account</h2>
            <p className="text-sm text-[#666666] mt-2">Continue your plan without friction.</p>
          </div>

          {apiError && (
            <div className="rounded-2xl border border-[#f1c4c4] bg-[#fff7f7] p-3 text-sm text-[#b91c1c] mb-4">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold block mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999999]" />
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="name@email.com" className="input-field pl-10" />
              </div>
              {errors.email && <p className="text-sm text-[#b91c1c] mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold block mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999999]" />
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter your password" className="input-field pl-10" />
              </div>
              {errors.password && <p className="text-sm text-[#b91c1c] mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="button-primary w-full py-3.2">
              {loading ? 'Signing in…' : 'Continue'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#666666]">
            New here? <Link to="/signup" className="font-semibold text-[#111111]">Create account</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
