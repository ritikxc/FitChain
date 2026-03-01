import { Link, useLocation, useNavigate } from 'react-router-dom'
import { logout, getStoredUser } from '../services/api'

const NAV = [
  { label:'Dashboard', path:'/dashboard', icon:<svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width:'18px',height:'18px'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z"/></svg> },
  { label:'Workouts', path:'/workouts', icon:<svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width:'18px',height:'18px'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> },
  { label:'Progress', path:'/progress', icon:<svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width:'18px',height:'18px'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/></svg> },
]

export default function Sidebar({ user }) {
  const location = useLocation()
  const navigate = useNavigate()
  const displayUser = user || getStoredUser()
  const initials = displayUser?.name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) || 'U'

  function handleLogout() { logout(); navigate('/') }

  return (
    <aside className="hidden md:flex flex-col w-60 fixed left-0 top-0 bottom-0 z-30"
      style={{ background:'rgba(2,4,8,0.95)', borderRight:'1px solid rgba(255,255,255,0.06)', backdropFilter:'blur(20px)' }}>

      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{borderColor:'rgba(255,255,255,0.06)'}}>
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background:'linear-gradient(135deg,#00ff87,#00d4ff)', boxShadow:'0 0 15px rgba(0,255,135,0.35)' }}>
            <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-6a6 6 0 100 12A6 6 0 0010 4z" clipRule="evenodd"/>
            </svg>
          </div>
          <span className="font-bold text-lg">
            <span className="text-white">Fit</span>
            <span className="text-gradient-green">Chain</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-widest" style={{color:'var(--text-muted)',letterSpacing:'0.12em'}}>Menu</p>
        {NAV.map(item => {
          const active = location.pathname === item.path
          return (
            <Link key={item.path} to={item.path} className={`sidebar-item ${active?'active':''}`}>
              <span style={{color: active ? '#00ff87' : 'var(--text-muted)'}}>{item.icon}</span>
              {item.label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background:'#00ff87',boxShadow:'0 0 6px #00ff87'}}/>}
            </Link>
          )
        })}

        {/* Stats preview in sidebar */}
        <div className="mt-6 pt-4 border-t" style={{borderColor:'rgba(255,255,255,0.05)'}}>
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-widest" style={{color:'var(--text-muted)',letterSpacing:'0.12em'}}>Today</p>
          <div className="mx-3 mt-2 rounded-xl p-3" style={{background:'rgba(0,255,135,0.05)', border:'1px solid rgba(0,255,135,0.1)'}}>
            <p className="text-xs" style={{color:'var(--text-secondary)'}}>Calories</p>
            <p className="text-xl font-bold mt-0.5" style={{color:'#00ff87', fontFamily:"'JetBrains Mono',monospace"}}>— kcal</p>
            <div className="progress-track mt-2">
              <div className="progress-fill" style={{width:'0%'}}/>
            </div>
          </div>
        </div>
      </nav>

      {/* User */}
      <div className="p-3 border-t" style={{borderColor:'rgba(255,255,255,0.06)'}}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)'}}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-black"
            style={{ background:'linear-gradient(135deg,#00ff87,#00d4ff)' }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{color:'var(--text-primary)'}}>{displayUser?.name || 'User'}</p>
            <p className="text-xs truncate" style={{color:'var(--text-muted)'}}>{displayUser?.email || ''}</p>
          </div>
          <button onClick={handleLogout} title="Logout" className="p-1 rounded-lg transition-colors flex-shrink-0"
            style={{color:'var(--text-muted)'}}
            onMouseEnter={e=>e.currentTarget.style.color='#ff5050'}
            onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
