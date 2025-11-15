import { Routes, Route, useLocation } from 'react-router-dom'
import { ToastProvider } from './components/Toast'
import { useEffect, useState } from 'react'
import { getData, fetchAndCache } from './lib/cms'
import Header from './components/Header'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import About from './sections/About'
import Services from './sections/Services'
import Projects from './sections/Projects'
import Testimonials from './sections/Testimonials'
import Contact from './sections/Contact'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ProjectDetail from './pages/ProjectDetail'

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard')

  const [loading, setLoading] = useState(true)

  // Server-first: wait for backend before rendering sections; fallback to local if it fails
  useEffect(() => {
    (async () => {
      try {
        await fetchAndCache()
      } catch (_) {
        // fallback: ensure local defaults exist so UI can render
        getData()
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[var(--lux-bg)] text-[var(--lux-ink)]">
      {!isAdminRoute && <Header />}
      <main>
        <Routes>
          <Route path="/" element={
            loading ? (
              <div className="min-h-[60vh] grid place-items-center">
                <div className="flex items-center gap-3 text-neutral-300">
                  <span className="h-3 w-3 rounded-full bg-[var(--lux-accent)] animate-pulse" />
                  <span>Loading content…</span>
                </div>
              </div>
            ) : (
              <>
                <section id="home"><Hero /></section>
                <section id="about"><About /></section>
                <section id="services"><Services /></section>
                <section id="projects"><Projects /></section>
                <section id="testimonials"><Testimonials /></section>
                <section id="contact"><Contact /></section>
              </>
            )
          } />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/project/:slug" element={<ProjectDetail />} />
        </Routes>
      </main>
        {!isAdminRoute && <Footer />}
      </div>
    </ToastProvider>
  )
}

export default App
