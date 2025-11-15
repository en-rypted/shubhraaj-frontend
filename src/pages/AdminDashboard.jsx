import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'
import {
  getData,
  setData,
  addProject,
  updateProject,
  deleteProject,
  setTestimonials,
  setContact,
  setAbout,
  setMapUrls,
  fetchAndCache,
  isAuthed,
  logout,
} from '../lib/cms'

const makeSlug = (t = '') =>
  t.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')

const SmallButton = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  className = ""
}) => {
  const base =
    "rounded-full transition-colors duration-200 font-medium inline-flex items-center justify-center " +
    "disabled:opacity-50 disabled:cursor-not-allowed";

  const sizes = {
    xs: "px-2 py-1 text-xs",     // ⭐ your requested XS size
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-1.5 text-base",
    lg: "px-5 py-2 text-lg"
  };

  const variants = {
    primary:
      "border border-[var(--lux-accent)]/30 text-[var(--lux-accent)] hover:bg-[var(--lux-accent)]/10",
    info: "border border-blue-500/30 text-blue-500 hover:bg-blue-500/10",
    danger: "border border-red-500/30 text-red-500 hover:bg-red-500/10",
    success: "border border-green-500/30 text-green-500 hover:bg-green-500/10",
    warning: "border border-amber-500/30 text-amber-600 hover:bg-amber-500/10",
    outline:
      "border border-gray-400/40 text-gray-700 hover:bg-gray-300/10",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};





// Button component with loading state and animations
// const Button = ({ 
//   children, 
//   onClick, 
//   disabled = false, 
//   isLoading = false, 
//   className = '',
//   variant = 'primary',
//   type = 'button',
//   size = 'md'
// }) => {
//   const baseStyles = 'px-4 py-2 rounded-md font-medium transition-all duration-200 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
//   const variants = {
//     primary: 'bg-[var(--lux-accent)] text-white hover:bg-opacity-90 focus:ring-[var(--lux-accent)]',
//     danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
//     secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
//     outline: 'border border-[var(--lux-accent)] text-[var(--lux-accent)] hover:bg-[var(--lux-accent)] hover:bg-opacity-10 focus:ring-[var(--lux-accent)]'
//   }

//   const sizes = {
//     sm: 'text-sm px-3 py-1.5',
//     md: 'text-base px-4 py-2',
//     lg: 'text-lg px-6 py-3'
//   }

//   return (
//     <button
//       type={type}
//       onClick={onClick}
//       disabled={disabled || isLoading}
//       className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} relative overflow-hidden`}
//     >
//       <span className={`flex items-center justify-center ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
//         {children}
//       </span>
//       {isLoading && (
//         <div className="absolute inset-0 flex items-center justify-center">
//           <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//           </svg>
//         </div>
//       )}
//     </button>
//   )
// }

const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  isLoading = false, 
  className = '',
  variant = 'primary',
  type = 'button',
  size = 'md'
}) => {

  const baseStyles =
    'relative px-4 py-2 rounded-md font-medium cursor-pointer overflow-hidden ' +
    'transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ' +
    'focus:outline-none focus:ring-2 focus:ring-offset-2 hover:-translate-y-[2px] hover:shadow-[0_4px_14px_rgba(0,0,0,0.15)]';

  // ✨ Shine overlay
  const shine =
    'after:content-[""] after:absolute after:top-0 after:left-[-120%] after:w-[120%] after:h-full ' +
    'after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent ' +
    'after:skew-x-[20deg] after:transition-all after:duration-700 hover:after:left-[120%]';

  // 💧 Ripple glow
  const ripple =
    'before:content-[""] before:absolute before:inset-0 before:rounded-md before:bg-black/10 ' +
    'before:scale-0 active:before:scale-100 before:opacity-0 active:before:opacity-100 ' +
    'before:transition-all before:duration-300';

  const variants = {
    primary: 'bg-[var(--lux-accent)] text-black hover:bg-opacity-90 focus:ring-[var(--lux-accent)]',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    secondary: 'bg-gray-300 hover:bg-gray-700 focus:ring-gray-500',
    outline:
      'border border-[var(--lux-accent)] hover:bg-[var(--lux-accent)] hover:bg-opacity-10 focus:ring-[var(--lux-accent)]'
  };

  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${shine} ${ripple} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {/* Button text */}
      <span className={`flex items-center justify-center transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>

      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
    </button>
  );
};


const Section = ({ title, children }) => (
  <section className="rounded-2xl border border-white/10 bg-neutral-900/60 p-6 shadow-lux">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </section>
)

const AdminDashboard = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [tab, setTab] = useState('projects')
  const [store, setStore] = useState(getData())

  useEffect(() => {
    if (!isAuthed()) navigate('/admin')
  }, [navigate])

  // PROJECTS
  const [pTitle, setPTitle] = useState('')
  const [pSlug, setPSlug] = useState('')
  const [pDesc, setPDesc] = useState('')
  const [pPhotos, setPPhotos] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const [editSlug, setEditSlug] = useState('')
  const [isLoading, setIsLoading] = useState({
    addProject: false,
    saveEdit: false,
    deleteProject: false,
    addTestimonial: false,
    removeTestimonial: false,
    saveContact: false,
    saveAbout: false,
    saveMaps: false,
    refresh: false,
    logout: false,
  })

  // Update loading state helper
  const setLoading = (key, value) => {
    setIsLoading(prev => ({
      ...prev,
      [key]: value
    }))
  }

  useEffect(() => { setPSlug(makeSlug(pTitle)) }, [pTitle])

  // File handling functions
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    handleFiles(files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFiles = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    if (imageFiles.length !== files.length) {
      toast('Only image files are allowed', 'warning')
    }
    
    const newPhotos = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    
    setPPhotos(prev => [...prev, ...newPhotos])
  }

  const removeImage = (index) => {
    setPPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const uploadImage = async (file, projectTitle) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_PRESET);
    formData.append("folder", `shubhraaj/projects/${projectTitle}`);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD}/image/upload`,
      { method: "POST", body: formData }
    );

  return res.json();
};

  const onAddProject = async (e) => {
    e.preventDefault()
    if (!pTitle || !pSlug) {
      toast('Please fill in all required fields', 'error')
      return
    }
    
    // In a real app, you would upload the files to a server here
    // and get back the URLs to store in your database
    // For now, we'll just use the file names as placeholders
    const photoUrls = await Promise.all(pPhotos.map(async (photo) =>{
      const res = await uploadImage(photo.file, pTitle)
      return {url: res.secure_url, publicId: res.public_id}
    }))
    console.log(photoUrls);
    
    setLoading('addProject', true)
    try {
      const project = {
        title: pTitle,
        slug: pSlug,
        description: pDesc,
        photos: photoUrls
      }
      await addProject(project)
      await fetchAndCache().then(setStore)
      toast('Project added successfully!')
      setPTitle('')
      setPSlug('')
      setPDesc('')
      setPPhotos([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error adding project:', error)
      toast(error?.message || 'Failed to add project', 'error')
    } finally {
      setLoading('addProject', false)
    }
  }

  const startEdit = (slug) => {
    const p = store.projects.find(x => x.slug === slug)
    if (!p) return
    setEditSlug(slug)
    setPTitle(p.title)
    setPSlug(p.slug)
    setPDesc(p.description)
    // Convert stored photo URLs to the new format
    setPPhotos((p.photos || []).map(photo => ({
      file: { name: photo.publicId.split('/').pop() || 'image.jpg' },
      preview: photo.url
    })))
  }

  const saveEdit = async (e) => {
    e.preventDefault()
    if (!editSlug || !pTitle || !pSlug) return
    setLoading('saveEdit', true)
    try {
      const project =   { 
        title: pTitle, 
        slug: pSlug, 
        description: pDesc, 
        photos: pPhotos.map(photo => ({
          url: photo.preview,
          publicId: photo.file.name
        })) 
      }
      await updateProject(editSlug, project)
      await fetchAndCache().then(setStore)
      toast('Project updated successfully!')
      setEditSlug('')
      setPTitle('')
      setPSlug('')
      setPDesc('')
      setPPhotos([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error updating project:', error)
      toast(error?.message || 'Failed to update project', 'error')
    } finally {
      setLoading('saveEdit', false)
    }
  }

  const onDelete = async (slug) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    setLoading('deleteProject', true)
    try {
      await deleteProject(slug)
      await fetchAndCache().then(setStore)
      toast('Project deleted successfully!')
    } catch (error) {
      console.error('Error deleting project:', error)
      toast(error?.message || 'Failed to delete project', 'error')
    } finally {
      setLoading('deleteProject', false)
    }
  }

  // TESTIMONIALS
  const [tName, setTName] = useState('')
  const [tRating, setTRating] = useState(5)
  const [tText, setTText] = useState('')

  const addTestimonial = async (e) => {
    e.preventDefault()
    if (!tName || !tText) {
      toast('Please fill in all required fields', 'error')
      return
    }
    setLoading('addTestimonial', true)
    try {
      await setTestimonials([...store.testimonials, { name: tName, rating: tRating, text: tText }])
      await fetchAndCache().then(setStore)
      setTName('')
      setTRating(5)
      setTText('')
      toast('Testimonial added successfully!')
    } catch (err) {
      console.error('Failed to add testimonial:', err)
      toast(err?.message || 'Failed to add testimonial', 'error')
    } finally {
      setLoading('addTestimonial', false)
    }
  }

  const removeTestimonial = async (index) => {
    if (!confirm('Are you sure you want to remove this testimonial?')) return
    setLoading('removeTestimonial', true)
    try {
      const updated = [...store.testimonials]
      updated.splice(index, 1)
      await setTestimonials(updated)
      await fetchAndCache().then(setStore)
      toast('Testimonial removed successfully!')
    } catch (error) {
      console.error('Error removing testimonial:', error)
      toast(error?.message || 'Failed to remove testimonial', 'error')
    } finally {
      setLoading('removeTestimonial', false)
    }
  }

  // CONTACT
  const [contact, setContactForm] = useState(store.contact)
  useEffect(() => { setContactForm(store.contact) }, [store])
  const [savingContact, setSavingContact] = useState(false)
  const [contactMsg, setContactMsg] = useState('')
  const [contactErr, setContactErr] = useState('')

  const saveContact = async (e) => {
    e.preventDefault()
    if (!contact?.email || !contact?.phone) {
      toast('Please fill in all required fields', 'error')
      return
    }
    setLoading('saveContact', true)
    try {
      setContact(contact)
      //await fetchAndCache().then(setStore)
      toast('Contact information saved successfully!')
    } catch (error) {
      console.error('Error saving contact:', error)
      toast(error?.message || 'Failed to save contact information', 'error')
    } finally {
      setLoading('saveContact', false)
    }
  }

  // ABOUT
  const [about, setAboutForm] = useState(store.about || { intro: '', mission: '', vision: '', philosophy: '' })
  useEffect(() => { setAboutForm(store.about || about) }, [store])

  const handleAboutChange = (e) => {
    const { name, value } = e.target
    setAboutForm(prev => ({ ...prev, [name]: value }))
  }
  const saveAbout = async (e) => {
    e.preventDefault()
    setLoading('saveAbout', true)
    try {
     await setAbout(about)
      await fetchAndCache().then(setStore)
      toast('About section saved successfully!')
    } catch (error) {
      console.error('Error saving about section:', error)
      toast(error?.message || 'Failed to save about section', 'error')
    } finally {
      setLoading('saveAbout', false)
    }
  }

  // MAP URLS (for Contact tab)
  const [maps, setMaps] = useState(store.contact?.mapUrls || [])
  useEffect(() => { setMaps(store.contact?.mapUrls || []) }, [store])
  const addMap = () => setMaps([...(maps || []), { key: '', name: '', url: '' }])
  const removeMap = (i) => setMaps((maps || []).filter((_, idx) => idx !== i))
  const [savingMaps, setSavingMaps] = useState(false)
  const [mapsMsg, setMapsMsg] = useState('')
  const [mapsErr, setMapsErr] = useState('')
  const saveMaps = async () => {
    setSavingMaps(true); setMapsMsg(''); setMapsErr('')
    try {
      await setMapUrls(maps || [])
      await fetchAndCache().then(setStore)
      toast('Map locations saved successfully!')
    } catch (err) {
      console.error('Failed to save maps:', err)
      toast(err?.message || 'Failed to save map locations', 'error')
    } finally {
      setSavingMaps(false)
      setTimeout(()=>{ setMapsMsg(''); setMapsErr('') }, 2500)
    }
  }

  // Pull latest from server on mount
  useEffect(() => { fetchAndCache().then(setStore).catch(() => {}) }, [])

  const header = (
    <div className="flex items-center justify-between mb-6">
      <div className="flex gap-2">
        <button onClick={() => setTab('projects')} className={`px-3 py-2 rounded-lg text-sm ${tab==='projects'?'bg-white/10':'bg-white/5'}`}>Projects</button>
        <button onClick={() => setTab('testimonials')} className={`px-3 py-2 rounded-lg text-sm ${tab==='testimonials'?'bg-white/10':'bg-white/5'}`}>Testimonials</button>
        <button onClick={() => setTab('contact')} className={`px-3 py-2 rounded-lg text-sm ${tab==='contact'?'bg-white/10':'bg-white/5'}`}>Contact</button>
        <button onClick={() => setTab('about')} className={`px-3 py-2 rounded-lg text-sm ${tab==='about'?'bg-white/10':'bg-white/5'}`}>About</button>
      </div>
      <div className="flex items-center gap-3">
        <SmallButton size='xs' onClick={() =>{ setLoading('refresh', true); fetchAndCache()
          .then(setStore)
          .catch(() => {})
          .finally(() => {setLoading('refresh', false); toast('Data refreshed successfully!')})}} isLoading={isLoading.refresh} variant='info'>Refresh</SmallButton>
        <SmallButton 
          onClick={async () => {  
            setLoading('logout', true)
            await logout(); 
            toast('Logged out successfully!')
            setLoading('logout', false)
            navigate('/'); 
          }} 
          variant='warning'
          size='xs'
          isLoading={isLoading.logout}
          disabled={isLoading.logout}

        >


          Logout
        </SmallButton>
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="display text-3xl mb-2">Admin Dashboard</h1>
      <p className="text-sm text-neutral-400 mb-8">Manage projects, testimonials, and contact info. Data is stored in your browser (localStorage).</p>
      {header}

      {tab === 'projects' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Section title={editSlug ? 'Edit Project' : 'Add Project'}>
            <form onSubmit={editSlug ?  saveEdit : onAddProject} className="grid gap-3">
              <input value={pTitle} onChange={(e)=>setPTitle(e.target.value)} placeholder="Title" className="bg-black/40 border border-white/10 rounded-lg px-4 py-3" />
              <input value={pSlug} onChange={(e)=>setPSlug(makeSlug(e.target.value))} placeholder="Slug" className="bg-black/40 border border-white/10 rounded-lg px-4 py-3" />
              <textarea value={pDesc} onChange={(e)=>setPDesc(e.target.value)} placeholder="Description" rows={4} className="bg-black/40 border border-white/10 rounded-lg px-4 py-3" />
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging ? 'border-[var(--lux-accent)] bg-white/5' : 'border-white/10'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-400">
                      {isDragging ? 'Drop images here' : 'Drag & drop images here, or'}
                    </p>
                    <label className="cursor-pointer text-[var(--lux-accent)] hover:underline">
                      Browse files
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  
                  {pPhotos.length > 0 && (
                    <div className="mt-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {pPhotos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={photo.preview} 
                              alt={`Preview ${index + 1}`} 
                              className="w-full h-24 object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove image"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-gray-400">
                        {pPhotos.length} image{pPhotos.length !== 1 ? 's' : ''} selected
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  isLoading={isLoading.addProject || (editSlug && isLoading.saveEdit)}
                  variant={editSlug ? 'secondary' : 'primary'}
                  className={`rounded-full ${editSlug ? 'bg-white/10' : 'bg-[var(--lux-accent)] text-black'} px-6 py-3 w-full sm:w-auto`}
                >
                  {editSlug ? 'Update Project' : 'Add Project'}
                </Button>
                {editSlug && <Button 
                  type="button" 
                  onClick={()=>{ setEditSlug(''); setPTitle(''); setPSlug(''); setPDesc(''); setPPhotos('') }} 
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>}
              </div>
            </form>
          </Section>

          <Section title="Existing Projects">
            <div className="space-y-3">
              {(store.projects || []).map(p => (
                <div key={p.slug} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-black/30 border border-white/10">
                  <div>
                    <div className="font-medium">{p.title}</div>
                    <div className="text-xs text-neutral-400">/{p.slug}</div>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <SmallButton 
                      onClick={() => startEdit(p.slug)}
                      variant='info'
                      size='xs'
                      isLoading={isLoading.editProject}
                      disabled={isLoading.editProject}
                    >
                      Edit
                    </SmallButton>
                    <SmallButton 
                      onClick={() => onDelete(p.slug)}
                      variant="danger"
                      disabled={isLoading.deleteProject}
                      isLoading={isLoading.deleteProject}
                      size='xs'
                    >
                      { isLoading.deleteProject ? 'Deleting...' : 'Delete'}
                    </SmallButton>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {tab === 'testimonials' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Section title="Add Testimonial">
            <form onSubmit={addTestimonial} className="grid gap-3">
              <input value={tName} onChange={(e)=>setTName(e.target.value)} placeholder="Client Name" className="bg-black/40 border border-white/10 rounded-lg px-4 py-3" />
              <select value={tRating} onChange={(e)=>setTRating(e.target.value)} className="bg-black/40 border border-white/10 rounded-lg px-4 py-3">
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r>1?'s':''}</option>)}
              </select>
              <textarea value={tText} onChange={(e)=>setTText(e.target.value)} placeholder="Review" rows={4} className="bg-black/40 border border-white/10 rounded-lg px-4 py-3" />
              <Button 
                type="submit" 
                isLoading={isLoading.addTestimonial}
                className="rounded-full bg-[var(--lux-accent)] text-black px-6 py-3 w-full sm:w-auto"
              >
                Add Testimonial
              </Button>
            </form>
          </Section>
          <Section title="Existing Testimonials">
            <div className="space-y-3">
              {(store.testimonials || []).map((t, i) => (
                <div key={i} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-black/30 border border-white/10">
                  <div>
                    <div className="font-medium">{t.name} <span className="text-[var(--lux-accent)]">{'★'.repeat(t.rating)}</span></div>
                    <div className="text-xs text-neutral-400">{t.text}</div>
                  </div>
                  <SmallButton 
                    onClick={(e) => {
                      removeTestimonial(i);
                    }}
                    variant="danger"
                    size="xs"
                    disabled={isLoading.removeTestimonial}
                  >
                    {isLoading.removeTestimonial ? 'Removing...' : 'Remove'}
                  </SmallButton>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {tab === 'contact' && (
        <div className="grid gap-6">
          <Section title="Contact Information">
            <form onSubmit={saveContact} className="grid gap-3">
              <input value={contact.phone || ''} onChange={(e)=>setContactForm({...contact, phone: e.target.value})} placeholder="Phone" className="bg-black/40 border border-white/10 rounded-lg px-4 py-3" />
              <input value={contact.email || ''} onChange={(e)=>setContactForm({...contact, email: e.target.value})} placeholder="Email" className="bg-black/40 border border-white/10 rounded-lg px-4 py-3" />
              <div className="grid md:grid-cols-3 gap-3">
                <input value={contact?.socials?.instagram || ''} onChange={(e)=>setContactForm({...contact, socials:{...contact.socials, instagram: e.target.value}})} placeholder="Instagram URL" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2" />
                <input value={contact?.socials?.facebook || ''} onChange={(e)=>setContactForm({...contact, socials:{...contact.socials, facebook: e.target.value}})} placeholder="Facebook URL" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2" />
                <input value={contact?.socials?.linkedin || ''} onChange={(e)=>setContactForm({...contact, socials:{...contact.socials, linkedin: e.target.value}})} placeholder="LinkedIn URL" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2" />
              </div>
              {contactMsg && <div className="text-xs text-emerald-400">{contactMsg}</div>}
              {contactErr && <div className="text-xs text-red-400">{contactErr}</div>}
              <Button 
                type="submit"
                isLoading={isLoading.saveContact}
                className="rounded-full bg-[var(--lux-accent)] text-black px-6 py-3 w-full sm:w-auto"
              >
                Save Contact
              </Button>
            </form>
          </Section>

          <Section title="Locations (Map URLs)">
            <div className="space-y-3">
              {(!maps || maps.length === 0) && (
                <div className="rounded-lg bg-black/30 border border-white/10 p-4 text-sm text-neutral-300">
                  No locations found. You can add your own, or load sample cities.
                  <div className="mt-3 flex gap-3">
                    <Button 
                      type="button" 
                      onClick={() => setMaps([
                        { key: 'nashik', name: 'Nashik', url: 'https://maps.google.com/maps?q=Nashik&t=&z=12&ie=UTF8&iwloc=&output=embed' },
                        { key: 'ahilyanagar', name: 'Ahilyanagar', url: 'https://maps.google.com/maps?q=Ahmednagar&t=&z=12&ie=UTF8&iwloc=&output=embed' },
                        { key: 'pune', name: 'Pune', url: 'https://maps.google.com/maps?q=Pune&t=&z=12&ie=UTF8&iwloc=&output=embed' },
                      ])}
                      className="rounded-full bg-[var(--lux-accent)] text-black px-6 py-3"
                    >
                      Load Sample Locations
                    </Button>
                  </div>
                </div>
              )}
              {maps.map((m, i) => (
                <div key={i} className="grid md:grid-cols-3 gap-3 bg-black/30 border border-white/10 p-3 rounded-lg">
                  <input value={m.key} onChange={(e)=>{ const v=[...maps]; v[i] = {...v[i], key:e.target.value}; setMaps(v) }} placeholder="Key (e.g., nashik)" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2" />
                  <input value={m.name} onChange={(e)=>{ const v=[...maps]; v[i] = {...v[i], name:e.target.value}; setMaps(v) }} placeholder="Name" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2" />
                  <input value={m.url} onChange={(e)=>{ const v=[...maps]; v[i] = {...v[i], url:e.target.value}; setMaps(v) }} placeholder="Google Maps Embed URL" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2" />
                  <div className="md:col-span-3 text-right">
                    <SmallButton  
                      onClick={()=>removeMap(i)}
                      variant="danger"
                      size="xs"
                      isLoading={isLoading.saveMaps}
                      disabled={isLoading.saveMaps}
                    >
                      Remove
                    </SmallButton>
                  </div>
                </div>
              ))}
              {mapsMsg && <div className="text-xs text-emerald-400">{mapsMsg}</div>}
              {mapsErr && <div className="text-xs text-red-400">{mapsErr}</div>}
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  onClick={addMap} 
                  className="rounded-full bg-[var(--lux-accent)] text-black px-6 py-3"
                >
                  Add Location
                </Button>
                <Button 
                  type="button" 
                  onClick={saveMaps} 
                  isLoading={isLoading.saveMaps}
                  className="rounded-full bg-[var(--lux-accent)] text-black px-6 py-3"
                >
                  Save All
                </Button>
              </div>
            </div>
          </Section>
        </div>
      )}

      {tab === 'about' && (
        <div className="grid gap-6">
          <Section title="About Content">
            <form onSubmit={saveAbout} className="grid gap-3">
              <textarea value={about.intro || ''} onChange={handleAboutChange} name="intro" placeholder="Intro" rows={4} className="bg-black/40 border border-white/10 rounded-lg px-4 py-3" />
              <input value={about.mission || ''} onChange={handleAboutChange} name="mission" placeholder="Mission" className="bg-black/40 border border-white/10 rounded-lg px-4 py-3" />
              <input value={about.vision || ''} onChange={handleAboutChange} name="vision" placeholder="Vision" className="bg-black/40 border border-white/10 rounded-lg px-4 py-3" />
              <textarea value={about.philosophy || ''} onChange={handleAboutChange} name="philosophy" placeholder="Design Philosophy" rows={3} className="bg-black/40 border border-white/10 rounded-lg px-4 py-3" />
              <Button 
                type="submit" 
                isLoading={isLoading.saveAbout}
              >
                Save About
              </Button>
            </form>
          </Section>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
