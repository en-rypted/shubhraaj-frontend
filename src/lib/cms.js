// CMS layer with backend integration (JWT) and localStorage fallback
// Data shape: {
//   about: { intro, mission, vision, philosophy },
//   projects: [{slug,title,description,photos:[] }],
//   testimonials: [{name, text, rating}],
//   contact: { phone, email, socials: {instagram, facebook, linkedin}, mapUrls: [{key,name,url}] }
// }

const KEY = 'sr_cms'
const AUTH_KEY = 'sr_auth' // legacy local auth flag (kept for compatibility)
const   TOKEN_KEY = 'sr_jwt'
const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:5000'

async function api(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) headers['Authorization'] = `Bearer ${token}`
  }
  const res = await fetch(`${API_BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json?.message || `Request failed: ${res.status}`)
  return json
}

const defaultData = {
  about: {
    intro: 'At ShubhRaaj Interiors, we believe every space tells a story. Our design philosophy blends timeless elegance with functional precision, crafting interiors that resonate with personality and purpose.',
    mission: 'Deliver bespoke interiors that balance aesthetics and comfort, tailored to every lifestyle.',
    vision: 'To be a benchmark for luxury interiors through innovation, craftsmanship, and empathy.',
    philosophy: 'Minimal, warm, and modern—using textures, natural light, and curated materials to elevate experiences.'
  },
  projects: [
    {
      slug: 'luxury-living-suite',
      title: 'Luxury Living Suite',
      description: 'A warm, elegant living suite featuring textured walls, brass accents, and curated lighting.',
      photos: [
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1499955085172-a104c9463ece?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop'
      ]
    },
    {
      slug: 'modern-office-lounge',
      title: 'Modern Office Lounge',
      description: 'Refined workspace lounge with muted palette and linear textures for calm productivity.',
      photos: [
        'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop'
      ]
    }
  ],
  testimonials: [
    { name: 'Aarav Mehta', rating: 5, text: 'Exceptional attention to detail. Our living room feels luxurious yet warm.' },
    { name: 'Ishita Kapoor', rating: 5, text: 'From concept to execution, the team delivered beyond expectations.' },
    { name: 'Rahul Verma', rating: 4, text: 'Great design sensibility and timely delivery. Highly recommend.' },
  ],
  contact: {
    phone: '+91 98765 43210',
    email: 'hello@shubhraaj.in',
    socials: {
      instagram: 'https://instagram.com/',
      facebook: 'https://facebook.com/',
      linkedin: 'https://linkedin.com/'
    },
    mapUrls: [
      { key: 'nashik', name: 'Nashik', url: 'https://maps.google.com/maps?q=Nashik&t=&z=12&ie=UTF8&iwloc=&output=embed' },
      { key: 'ahilyanagar', name: 'Ahilyanagar', url: 'https://maps.google.com/maps?q=Ahmednagar&t=&z=12&ie=UTF8&iwloc=&output=embed' },
      { key: 'pune', name: 'Pune', url: 'https://maps.google.com/maps?q=Pune&t=&z=12&ie=UTF8&iwloc=&output=embed' },
    ]
  }
}

export function getData() {
  try {
    // Prefer server data when available
    // Note: this is a sync API, so we opportunistically return cached local copy.
    const raw = localStorage.getItem(KEY)
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(defaultData))
      return defaultData
    }
    const data = JSON.parse(raw)
    // Simple migration to ensure new fields exist when older data is present
    let changed = false
    if (!data.about) { data.about = defaultData.about; changed = true }
    if (!data.projects) { data.projects = defaultData.projects; changed = true }
    if (!data.testimonials) { data.testimonials = defaultData.testimonials; changed = true }
    if (!data.contact) { data.contact = defaultData.contact; changed = true }
    if (data.contact && !data.contact.mapUrls) { data.contact.mapUrls = defaultData.contact.mapUrls; changed = true }
    if (changed) setData(data)
    return data
  } catch {
    return defaultData
  }
}

export function setData(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
  try { if (typeof window !== 'undefined') window.dispatchEvent(new Event('sr_cms_updated')) } catch {}
}

// Async: pull latest from backend and cache locally
export async function fetchAndCache() {
  try {
    const resp = await api('/api/data')
    const serverData = resp?.data || resp
    setData(serverData)
    return serverData
  } catch (e) {
    // keep local copy if offline
    return getData()
  }
}

export function addProject(project) {
  const data = getData()
  data.projects = [project, ...(data.projects || [])]
  // try server first
  saveProjects(data.projects).catch(() => setData(data))
}

export function updateProject(slug, next) {
  const data = getData()
  const idx = data.projects.findIndex(p => p.slug === slug)
  if (idx >= 0) data.projects[idx] = { ...data.projects[idx], ...next }
  saveProjects(data.projects).catch(() => setData(data))
}

export function deleteProject(slug) {
  const data = getData()
  data.projects = data.projects.filter(p => p.slug !== slug)
  saveProjects(data.projects).catch(() => setData(data))
}

export function setTestimonials(list) {
  // try server first
  saveTestimonials(list).catch(() => {
    const data = getData(); data.testimonials = list; setData(data)
  })
}

export function setContact(contact) {
  saveContact(contact).catch(() => {
    const data = getData(); data.contact = contact; setData(data)
  })
}

export function setAbout(about) {
  saveAbout(about).catch(() => {
    const data = getData(); data.about = about; setData(data)
  })
}

export function setMapUrls(list) {
  const contact = { ...(getData().contact || {}), mapUrls: list }
  setContact(contact)
}

// Auth (JWT)
export async function login(username, password) {
  const resp = await api('/api/admin/login', { method: 'POST', body: { username, password } })
  const token = resp?.data?.token
  if (!token) throw new Error('Invalid login response')
  localStorage.setItem(TOKEN_KEY, token)
//   // clear legacy flag; use token as primary auth
//   localStorage.setItem(AUTH_KEY, '1')
  try { if (typeof window !== 'undefined') window.dispatchEvent(new Event('sr_cms_updated')) } catch {}
  return true
}

export function logout() {
  // Simply remove the JWT token and auth flags
  localStorage.removeItem(TOKEN_KEY)
  //localStorage.removeItem(AUTH_KEY)
  
  // Optional: Clear any cached data if needed
  // localStorage.removeItem('sr_cms_data')
  
  // Notify the app about the auth state change
  try { 
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('sr_cms_updated')) 
  } catch (e) {}
}

export function isAuthed() {
  return !!localStorage.getItem(TOKEN_KEY) //|| localStorage.getItem(AUTH_KEY) === '1'
}

// Section-specific server saves
async function saveProjects(projects) {
  const resp = await api('/api/projects', { method: 'PATCH', body: projects, auth: true })
  const data = getData(); data.projects = resp?.data || projects; setData(data)
}

async function saveTestimonials(testimonials) {
  const resp = await api('/api/testimonials', { method: 'PATCH', body: testimonials, auth: true })
  const data = getData(); data.testimonials = resp?.data || testimonials; setData(data)
}

async function saveAbout(about) {
  const resp = await api('/api/about', { method: 'PATCH', body: about, auth: true })
  const data = getData(); data.about = resp?.data || about; setData(data)
}

async function saveContact(contact) {
  const resp = await api('/api/contact', { method: 'PATCH', body: contact, auth: true })
  const data = getData(); data.contact = resp?.data || contact; setData(data)
}
