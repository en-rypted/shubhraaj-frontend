import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const navItems = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#projects', label: 'Projects' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#contact', label: 'Contact' },
]

const Header = () => {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const [tap, setTap] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-colors ${solid ? 'bg-black/80 backdrop-blur-soft border-b border-white/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#home" className="text-lg md:text-xl font-semibold tracking-wide" onClick={() => {
          const next = tap + 1
          setTap(next)
          if (next >= 6) { setTap(0); navigate('/admin') }
        }} title="">
          <span className="text-[var(--lux-accent)]">Shubh</span>Raaj
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-neutral-300 hover:text-white transition">
              {item.label}
            </a>
          ))}
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <svg width="26" height="26" fill="none" stroke="currentColor" className="text-white"><path strokeWidth="2" d="M4 7h18M4 13h18M4 19h18"/></svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10 bg-black/90 px-4 pb-4">
          <nav className="flex flex-col">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="py-3 text-neutral-200">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
