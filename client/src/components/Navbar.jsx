import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
      style={{
        background: scrolled ? '#0B0B0B' : 'transparent',
        borderBottom: scrolled ? '1px solid #2A2A2A' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-brand-green rounded flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <svg className="w-6 h-6 text-surface-default" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.5 2C13.5 2 15 7 15 10C15 11.93 13.93 13.5 12 13.5C10.07 13.5 9 11.93 9 10C9 7 10.5 2 10.5 2H13.5Z"/>
                <path d="M4 14C4 14 6 16 6 18C6 19.66 4.66 21 3 21C1.34 21 0 19.66 0 18C0 16 2 14 2 14H4Z" transform="translate(4,0)"/>
                <path d="M20 14C20 14 22 16 22 18C22 19.66 20.66 21 19 21C17.34 21 16 19.66 16 18C16 16 18 14 18 14H20Z" transform="translate(-4,0)"/>
              </svg>
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">
              FitChain
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[['Product','#about'],['Features','#features'],['Pricing','#plans']].map(([label,href]) => (
              <a key={label} href={href} className="text-sm font-medium text-text-secondary hover:text-white transition-colors">
                {label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-white hover:text-brand-green transition-colors">
              Log In
            </Link>
            <Link to="/signup" className="bg-white text-surface-default hover:bg-brand-green font-display font-bold text-sm px-5 py-2.5 rounded transition-colors">
              Get Started
            </Link>
          </div>

          <button className="md:hidden p-2 text-text-secondary hover:text-white transition-colors" onClick={()=>setMobileOpen(!mobileOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/> : <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-surface-border bg-surface-default"
            >
              <div className="py-4 space-y-2">
                {[['Product','#about'],['Features','#features'],['Pricing','#plans']].map(([label,href]) => (
                  <a key={label} href={href} className="block px-4 py-3 text-sm font-medium text-text-secondary hover:text-white hover:bg-surface-hover rounded" onClick={()=>setMobileOpen(false)}>
                    {label}
                  </a>
                ))}
                <div className="pt-4 px-4 flex flex-col gap-3">
                  <Link to="/login" className="btn-glass text-center text-sm w-full" onClick={()=>setMobileOpen(false)}>Log In</Link>
                  <Link to="/signup" className="btn-gradient text-center text-sm w-full" onClick={()=>setMobileOpen(false)}>Get Started</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
