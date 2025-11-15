import { useEffect, useState } from 'react'
import SectionWrapper from '../components/SectionWrapper'
import { motion, AnimatePresence } from 'framer-motion'
import { getData } from '../lib/cms'

const Testimonials = () => {
  const [index, setIndex] = useState(0)
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    const data = getData()
    setReviews(data.testimonials || [])
  }, [])

  useEffect(() => {
    if (reviews.length === 0) return
    const id = setInterval(() => setIndex((i) => (i + 1) % reviews.length), 4000)
    return () => clearInterval(id)
  }, [reviews])

  return (
    <SectionWrapper className="py-20">
      <h2 className="text-3xl md:text-4xl display mb-10">Testimonials</h2>
      <div className="relative overflow-hidden">
        {reviews.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-black/30 p-6 text-sm text-neutral-300 mb-8">
            No testimonials yet. Add some in the <a href="/admin" className="text-[var(--lux-accent)] underline">Admin</a>.
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl bg-neutral-900/60 border border-white/10 p-8 shadow-lux"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg md:text-xl text-neutral-200 mb-3">{reviews[index]?.text ? `“${reviews[index].text}”` : ''}</p>
                <p className="text-sm text-neutral-400">{reviews[index]?.name ? `— ${reviews[index].name}` : ''}</p>
              </div>
              <div className="hidden sm:block text-[var(--lux-accent)] font-semibold">{'★'.repeat(reviews[index]?.rating || 0)}</div>
            </div>
            <div className="mt-4 sm:hidden text-[var(--lux-accent)] font-semibold">{'★'.repeat(reviews[index]?.rating || 0)}</div>
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center gap-3 mt-6 justify-center">
          {reviews.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} className={`h-2 w-2 rounded-full ${i === index ? 'bg-[var(--lux-accent)]' : 'bg-white/20'}`} aria-label={`Go to slide ${i+1}`}/>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}

export default Testimonials
