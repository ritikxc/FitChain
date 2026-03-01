import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavScroll } from '../hooks/useAnimations'

export default function Navbar() {
  const { scrolled } = useNavScroll()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(2,4,8,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,255,135,0.1)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{ background: 'linear-gradient(135deg,#00ff87,#00d4ff)', boxShadow:'0 0 15px rgba(0,255,135,0.4)' }}>
              <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.5 2C13.5 2 15 7 15 10C15 11.93 13.93 13.5 12 13.5C10.07 13.5 9 11.93 9 10C9 7 10.5 2 10.5 2H13.5Z"/>
                <path d="M4 14C4 14 6 16 6 18C6 19.66 4.66 21 3 21C1.34 21 0 19.66 0 18C0 16 2 14 2 14H4Z" transform="translate(4,0)"/>
                <path d="M20 14C20 14 22 16 22 18C22 19.66 20.66 21 19 21C17.34 21 16 19.66 16 18C16 16 18 14 18 14H20Z" transform="translate(-4,0)"/>
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight">
              <span className="text-white">Fit</span>
              <span className="text-gradient-green">Chain</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[['About','#about'],['Features','#features'],['Plans','#plans'],['Contact','#contact']].map(([label,href]) => (
              <a key={label} href={href} className="nav-link-modern">{label}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="btn-glass !py-2 !px-4 !text-sm">Log In</Link>
            <Link to="/signup" className="btn-gradient !py-2 !px-5 !text-sm">
              Get Started
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </Link>
          </div>

          <button className="md:hidden p-2 rounded-lg" style={{color: mobileOpen?'#00ff87':'var(--text-secondary)'}} onClick={()=>setMobileOpen(!mobileOpen)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
            </svg>
          </button>
        </div>

        <div className="md:hidden overflow-hidden transition-all duration-300" style={{maxHeight:mobileOpen?'280px':'0',opacity:mobileOpen?1:0}}>
          <div className="pb-4 pt-2 space-y-1 border-t mt-1" style={{borderColor:'rgba(255,255,255,0.05)'}}>
            {[['About','#about'],['Features','#features'],['Plans','#plans'],['Contact','#contact']].map(([label,href]) => (
              <a key={label} href={href} className="block px-3 py-2.5 text-sm font-medium" style={{color:'var(--text-secondary)'}} onClick={()=>setMobileOpen(false)}>{label}</a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/login" className="btn-glass text-center !text-sm" onClick={()=>setMobileOpen(false)}>Log In</Link>
              <Link to="/signup" className="btn-gradient text-center !text-sm" onClick={()=>setMobileOpen(false)}>Get Started →</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
