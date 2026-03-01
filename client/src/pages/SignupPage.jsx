import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../services/api'

export default function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  function handleChange(e) {
    const {name,value} = e.target
    setForm(p=>({...p,[name]:value}))
    if(errors[name]) setErrors(p=>({...p,[name]:''}))
    setApiError('')
  }

  function validate() {
    const errs = {}
    if(!form.name.trim()) errs.name = 'Name is required'
    if(!form.email.trim()) errs.email = 'Email is required'
    else if(!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format'
    if(!form.password) errs.password = 'Password is required'
    else if(form.password.length < 6) errs.password = 'Minimum 6 characters'
    if(form.password !== form.confirm) errs.confirm = 'Passwords do not match'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if(Object.keys(errs).length){ setErrors(errs); return }
    setLoading(true)
    try {
      await signUp({ name:form.name.trim(), email:form.email.trim(), password:form.password })
      navigate('/dashboard')
    } catch(err) {
      setApiError(err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative" style={{background:'var(--bg-void)'}}>
      <div className="bg-mesh"/>
      <div className="bg-grid-pattern absolute inset-0 pointer-events-none"/>
      <div className="orb orb-green" style={{width:'400px',height:'400px',top:'-100px',right:'-50px'}}/>
      <div className="orb orb-purple" style={{width:'300px',height:'300px',bottom:'-50px',left:'-50px'}}/>

      <div className="relative w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{background:'linear-gradient(135deg,#00ff87,#00d4ff)',boxShadow:'0 0 20px rgba(0,255,135,0.4)'}}>
              <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-6a6 6 0 100 12A6 6 0 0010 4z" clipRule="evenodd"/>
              </svg>
            </div>
            <span className="font-black text-xl"><span className="text-white">Fit</span><span className="text-gradient-green">Chain</span></span>
          </Link>
          <h1 className="font-black text-2xl text-white mt-6 mb-1" style={{letterSpacing:'-0.02em'}}>Create your account</h1>
          <p className="text-sm" style={{color:'var(--text-secondary)'}}>Start building your chain today</p>
        </div>

        <div className="glass-static rounded-2xl p-6 relative" style={{border:'1px solid rgba(255,255,255,0.09)',boxShadow:'0 20px 60px rgba(0,0,0,0.5)'}}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,rgba(0,255,135,0.5),transparent)'}}/>

          {apiError && (
            <div className="flex items-center gap-2 rounded-xl px-4 py-3 mb-4 text-sm animate-scale-in"
              style={{background:'rgba(255,80,80,0.08)',border:'1px solid rgba(255,80,80,0.2)',color:'#ff8080'}}>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-neon">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Alex Johnson"
                className={`input-neon ${errors.name?'error':''}`}/>
              {errors.name && <p className="text-xs mt-1" style={{color:'#ff5050'}}>{errors.name}</p>}
            </div>
            <div>
              <label className="label-neon">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="alex@example.com"
                className={`input-neon ${errors.email?'error':''}`}/>
              {errors.email && <p className="text-xs mt-1" style={{color:'#ff5050'}}>{errors.email}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-neon">Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min 6 chars"
                  className={`input-neon ${errors.password?'error':''}`}/>
                {errors.password && <p className="text-xs mt-1" style={{color:'#ff5050'}}>{errors.password}</p>}
              </div>
              <div>
                <label className="label-neon">Confirm</label>
                <input name="confirm" type="password" value={form.confirm} onChange={handleChange} placeholder="Repeat"
                  className={`input-neon ${errors.confirm?'error':''}`}/>
                {errors.confirm && <p className="text-xs mt-1" style={{color:'#ff5050'}}>{errors.confirm}</p>}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-gradient w-full py-3.5 mt-1" style={{borderRadius:'12px',fontSize:'0.95rem'}}>
              {loading ? (
                <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Creating account...</>
              ) : 'Create Account →'}
            </button>
          </form>

          <p className="text-xs text-center mt-4" style={{color:'var(--text-muted)'}}>
            By signing up you agree to our <a href="#" style={{color:'#00ff87'}}>Terms</a> &amp; <a href="#" style={{color:'#00ff87'}}>Privacy Policy</a>
          </p>
        </div>

        <p className="text-center text-sm mt-5" style={{color:'var(--text-muted)'}}>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold" style={{color:'#00ff87'}}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
