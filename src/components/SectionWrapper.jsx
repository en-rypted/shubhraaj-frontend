import { motion } from 'framer-motion'

const SectionWrapper = ({ id, children, className = '' }) => {
  return (
    <section id={id} className={`w-full ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {children}
      </motion.div>
    </section>
  )
}

export default SectionWrapper
