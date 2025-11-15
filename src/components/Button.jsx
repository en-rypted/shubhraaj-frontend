import { motion } from 'framer-motion'

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const base = 'inline-flex items-center gap-2 cursor-pointer rounded-full px-6 py-3 text-sm md:text-base transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black';
  const styles = {
    primary: 'bg-[var(--lux-accent)] text-black hover:brightness-110 backdrop-blur-soft',
    ghost: 'bg-transparent border border-white/20 text-[var(--lux-ink)] hover:bg-white/10 backdrop-blur-soft',
  };

  return (
    <motion.button
      whileHover={{ y: -1, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${base} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button
