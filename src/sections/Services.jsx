import SectionWrapper from '../components/SectionWrapper'
import { FaHome, FaBuilding, FaUtensils, FaRulerCombined, FaCouch, FaDraftingCompass } from 'react-icons/fa'
import servicesImg from '../assets/images/services.jpg'

const services = [
  { icon: FaHome, title: 'Residential Interior Design', desc: 'Bespoke living spaces with luxurious textures and thoughtful layouts.' },
  { icon: FaBuilding, title: 'Commercial Space Design', desc: 'Elegant and efficient environments for brands and teams to thrive.' },
  { icon: FaUtensils, title: 'Modular Kitchen', desc: 'Premium, ergonomic kitchens tailored to your lifestyle.' },
  { icon: FaRulerCombined, title: 'Space Planning', desc: 'Optimized flows for comfort, utility, and aesthetics.' },
  { icon: FaCouch, title: 'Furniture Customization', desc: 'Tailor-made furniture pieces to complete your space.' },
  { icon: FaDraftingCompass, title: 'Architecture Consultation', desc: 'Expert guidance from concept to execution.' },
]

const bgUrl = `url(${servicesImg})`

const Services = () => {
  return (
    <div className="relative parallax-bg" style={{ backgroundImage: bgUrl }}>
      <div className="absolute inset-0 bg-black/60" />
      <SectionWrapper className="py-20 relative">
        <h2 className="text-3xl md:text-4xl display mb-10">Our Services</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl bg-neutral-900/60 border border-white/10 p-6 hover:bg-neutral-900/80 transition shadow-lux">
              <Icon className="text-[var(--lux-accent)] text-2xl mb-3" />
              <h3 className="text-xl font-semibold mb-1">{title}</h3>
              <p className="text-neutral-300 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>
    </div>
  )
}

export default Services
