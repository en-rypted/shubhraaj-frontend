import { useEffect, useState } from 'react'
import SectionWrapper from '../components/SectionWrapper'
import { getData } from '../lib/cms'

const About = () => {
  const [about, setAbout] = useState(getData().about || {})

  useEffect(() => {
    const onUpdate = () => setAbout(getData().about || {})
    if (typeof window !== 'undefined') {
      window.addEventListener('sr_cms_updated', onUpdate)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('sr_cms_updated', onUpdate)
      }
    }
  }, [])

  return (
    <SectionWrapper className="py-20 md:py-28 bg-[var(--lux-bg)]">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="rounded-2xl bg-neutral-900/60 border border-white/10 p-8 shadow-lux">
          <h2 className="text-3xl md:text-4xl display mb-4">About ShubhRaaj</h2>
          <p className="text-neutral-300 leading-relaxed">
            {about.intro}
          </p>
        </div>
        <div className="grid gap-6">
          <div className="rounded-xl bg-neutral-900/60 border border-white/10 p-6">
            <h3 className="text-xl font-semibold mb-2">Mission</h3>
            <p className="text-neutral-300">{about.mission}</p>
          </div>
          <div className="rounded-xl bg-neutral-900/60 border border-white/10 p-6">
            <h3 className="text-xl font-semibold mb-2">Vision</h3>
            <p className="text-neutral-300">{about.vision}</p>
          </div>
          <div className="rounded-xl bg-neutral-900/60 border border-white/10 p-6">
            <h3 className="text-xl font-semibold mb-2">Design Philosophy</h3>
            <p className="text-neutral-300">{about.philosophy}</p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

export default About
