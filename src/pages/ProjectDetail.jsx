import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getData } from '../lib/cms'

const ProjectDetail = () => {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [active, setActive] = useState('')

  useEffect(() => {
    const data = getData()
    setProject((data.projects || []).find(p => p.slug === slug) || null)
  }, [slug])

  if (!project) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-neutral-300">Project not found.</p>
        <Link to="/" className="text-[var(--lux-accent)]">← Back to Home</Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="display text-3xl md:text-4xl">{project.title}</h1>
          <p className="text-neutral-400 mt-2 max-w-3xl">{project.description}</p>
        </div>
        <Link to="/" className="text-sm text-neutral-300 hover:text-white">← Back</Link>
      </div>

      <div className="masonry columns-1 sm:columns-2 lg:columns-3">
        {(project.photos || []).map((src, idx) => (
          <button key={idx} onClick={() => setActive(src.url)} className="group w-full block overflow-hidden rounded-xl border border-white/10">
            <img src={src.url} alt={`${project.title} ${idx+1}`} className="w-full h-auto transition-transform duration-500 group-hover:scale-105" loading="lazy" />
          </button>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setActive('')}>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={active} alt="Full view" className="w-full h-auto rounded-xl shadow-lux" />
            <div className="text-right mt-3">
              <button onClick={() => setActive('')} className="text-neutral-300 hover:text-white">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectDetail
