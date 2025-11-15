import SectionWrapper from '../components/SectionWrapper'
import Button from '../components/Button'
import { motion } from 'framer-motion'
import heroImg from '../assets/images/hero.jpg'

const Hero = () => {
  return (
    <div className="relative h-[100svh] parallax-bg" style={{ backgroundImage: `url(${heroImg})` }}>
      <div className="absolute inset-0 bg-black/70" />
      <SectionWrapper>
        <div className="h-[100svh] flex flex-col items-center justify-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="display text-5xl md:text-7xl lg:text-8xl mb-4 leading-[0.95] drop-shadow-[0_3px_22px_rgba(0,0,0,0.65)]"
          >
            <span className="text-[#f5efe6]">ShubhRaaj</span>
            <span className="text-[#f5efe6]"> Interiors</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="subtitle text-lg md:text-2xl max-w-2xl drop-shadow-[0_1px_12px_rgba(0,0,0,0.6)] text-[#efe9de]"
          >
            Crafting Spaces. Creating Stories.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <a href="#projects"><Button>View Projects</Button></a>
            <a href="#contact"><Button variant="ghost">Contact Us</Button></a>
          </motion.div>
        </div>
      </SectionWrapper>
    </div>
  )
}

export default Hero
