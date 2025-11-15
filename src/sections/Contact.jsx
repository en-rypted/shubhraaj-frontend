import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionWrapper from '../components/SectionWrapper'
import contactImg from '../assets/images/contact.jpg'
import { getData } from '../lib/cms'

const Contact = () => {
  return (
    <div className="relative parallax-bg" style={{ backgroundImage: `url(${contactImg})` }}>
      <div className="absolute inset-0 bg-black/70" />
      <SectionWrapper className="py-20 relative">
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="rounded-2xl bg-neutral-900/70 border border-white/10 p-8">
            <h2 className="text-3xl md:text-4xl display mb-6">Contact Us</h2>
            <form className="grid gap-4">
              <input className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 placeholder:text-neutral-500" placeholder="Name"/>
              <input type="email" className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 placeholder:text-neutral-500" placeholder="Email"/>
              <textarea rows="5" className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 placeholder:text-neutral-500" placeholder="Message"/>
              <button type="submit" className="rounded-full bg-[var(--lux-accent)] text-black px-6 py-3 w-fit">Send Message</button>
            </form>
            <div className="mt-6 text-sm text-neutral-300">
              {(() => { const c = getData().contact; return (
                <>
                  <p>Phone: {c.phone}</p>
                  <p>Email: {c.email}</p>
                </>
              )})()}
              <div className="flex gap-4 mt-2">
                {(() => { const c = getData().contact; return (
                  <>
                    <a href={c.socials?.instagram || '#'} className="hover:text-white" target="_blank">Instagram</a>
                    <a href={c.socials?.facebook || '#'} className="hover:text-white" target="_blank">Facebook</a>
                    <a href={c.socials?.linkedin || '#'} className="hover:text-white" target="_blank">LinkedIn</a>
                  </>
                )})()}
              </div>
            </div>
          </div>
          <MapCarousel />
        </div>
      </SectionWrapper>
    </div>
  )
}

function MapCarousel() {
  const [index, setIndex] = useState(0)
  const [cities, setCities] = useState(() => getData().contact?.mapUrls || [])

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % (cities.length || 1)), 5000)
    return () => clearInterval(id)
  }, [cities.length])

  useEffect(() => {
    const onUpdate = () => setCities(getData().contact?.mapUrls || [])
    if (typeof window !== 'undefined') {
      window.addEventListener('sr_cms_updated', onUpdate)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('sr_cms_updated', onUpdate)
      }
    }
  }, [])

  const prev = () => setIndex((i) => (i - 1 + cities.length) % cities.length)
  const next = () => setIndex((i) => (i + 1) % cities.length)

  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-900/40 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Studios & Service Locations</h3>
        <div className="flex items-center gap-2">
          <button aria-label="Previous" onClick={prev} className="h-8 w-8 grid place-items-center rounded-full bg-white/10 hover:bg-white/20">‹</button>
          <button aria-label="Next" onClick={next} className="h-8 w-8 grid place-items-center rounded-full bg-white/10 hover:bg-white/20">›</button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/30">
        <div className="px-4 pt-4">
          <p className="text-sm text-neutral-300">{cities[index]?.name || 'Location'}</p>
        </div>
        <div className="aspect-[16/10] w-full">
          <AnimatePresence mode="wait">
            {cities.length > 0 ? (
              <motion.iframe
                key={cities[index].key}
                title={`Map ${cities[index].name}`}
                src={cities[index].url}
                className="w-full h-full"
                loading="lazy"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <motion.div
                key="empty"
                className="w-full h-full grid place-items-center text-sm text-neutral-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                No locations yet. Add them in Admin → Maps.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-3">
        {cities.map((c, i) => (
          <button
            key={c.key}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full ${i === index ? 'bg-[var(--lux-accent)]' : 'bg-white/20'}`}
            aria-label={`Go to ${c.name}`}
          />
        ))}
      </div>
      <p className="text-xs text-neutral-400 mt-3 text-center">Swipe or use controls to switch locations. Zoom and pan inside the map.</p>
    </div>
  )
}

export default Contact
