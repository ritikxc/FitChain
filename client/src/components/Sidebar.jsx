import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Activity, BarChart3, Dumbbell, LayoutDashboard, LogOut, Settings2, Sparkles, TrendingUp, Utensils, UserCircle2 } from 'lucide-react'
import { logout, getStoredUser } from '../services/api'

const NAV = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Workouts', path: '/workouts', icon: Dumbbell },
  { label: 'Progress', path: '/progress', icon: TrendingUp },
  { label: 'Nutrition', path: '/nutrition', icon: Utensils },
  { label: 'Analytics', path: '/analytics', icon: Activity },
  { label: 'Profile', path: '/profile', icon: UserCircle2 },
  { label: 'Settings', path: '/settings', icon: Settings2 },
]

export default function Sidebar({ user }) {
  const location = useLocation()
  const navigate = useNavigate()
  const displayUser = user || getStoredUser()
  const initials = displayUser?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 z-30 bg-[#fcfcfc] border-r border-[#e5e5e5]">
      <div className="px-5 py-6 border-b border-[#e5e5e5]">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-[#111111] text-white flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">FitChain</p>
            <p className="text-sm text-[#666666]">Fitness OS</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#666666]">Menu</p>
        {NAV.map((item) => {
          const active = location.pathname === item.path
          const Icon = item.icon
          return (
            <Link key={item.path} to={item.path} className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${active ? 'bg-[#111111] text-white' : 'text-[#666666] hover:bg-[#f7f7f7]'}`}>
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}

        <div className="mt-6 rounded-3xl border border-[#e5e5e5] bg-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-4 w-4 text-[#111111]" />
            <p className="text-sm font-semibold">Today</p>
          </div>
          <p className="text-xs text-[#666666]">Calories remaining</p>
          <p className="text-xl font-semibold mt-1">1,140 kcal</p>
          <div className="progress-bar mt-3">
            <div className="w-[64%] bg-[#111111]" />
          </div>
        </div>
      </nav>

      <div className="p-3 border-t border-[#e5e5e5]">
        <div className="flex items-center gap-3 rounded-2xl border border-[#e5e5e5] bg-white p-3">
          <div className="h-9 w-9 rounded-full bg-[#111111] text-white flex items-center justify-center text-sm font-semibold">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{displayUser?.name || 'User'}</p>
            <p className="text-xs text-[#666666] truncate">{displayUser?.email || ''}</p>
          </div>
          <button onClick={handleLogout} title="Logout" className="p-2 rounded-xl text-[#666666] hover:bg-[#f7f7f7]">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
