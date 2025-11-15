import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SectionWrapper from '../components/SectionWrapper'
import { getData } from '../lib/cms'

const getProjects = () => {
  // Ensure seeding happens and pull from the single source of truth
  const data = getData()
  return data.projects || []
}

const Projects = () => {
  const [active, setActive] = useState(null)
  const [projects, setProjects] = useState([])

  useEffect(() => {
    setProjects(getProjects())
  }, [])

  return (
    <SectionWrapper className="py-20">
      <div className="flex items-end justify-between mb-8">
        <h2 className="text-3xl md:text-4xl display">Projects</h2>
        <p className="text-sm text-neutral-400">Curated gallery of our recent interiors</p>
      </div>

      {projects.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-black/30 p-6 text-sm text-neutral-300 mb-8">
          No projects yet. Add some in the <Link to="/admin" className="text-[var(--lux-accent)] underline">Admin</Link>.
        </div>
      )}

      <div className="masonry columns-1 sm:columns-2 lg:columns-3">
        {projects.map((p) => (
          <div key={p.slug} className="break-inside-avoid mb-4">
            <Link to={`/project/${p.slug}`} className="group w-full block overflow-hidden rounded-xl border border-white/10">
              <img
                src={p.photos?.[0]}
                alt={p.title}
                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </Link>
            <div className="px-1 pt-2">
              <h3 className="text-sm text-neutral-200">{p.title}</h3>
              <p className="text-xs text-neutral-400 line-clamp-2">{p.description}</p>
            </div>
          </div>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setActive(null)}>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={active} alt="Full view" className="w-full h-auto rounded-xl shadow-lux" />
            <div className="text-right mt-3">
              <button onClick={() => setActive(null)} className="text-neutral-300 hover:text-white">Close</button>
            </div>
          </div>
        </div>
      )}
    </SectionWrapper>
  )
}

export default Projects
