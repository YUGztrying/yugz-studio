import { useEffect, useRef, useState, useCallback, createContext, useContext } from 'react'
import { HashRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'
import { ArrowRight, ArrowLeft, Play, Sparkles, Users, Globe, Image, ExternalLink, Quote, MessageCircle, Languages, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger, SplitText)

const CALENDLY = 'https://calendly.com/guyismaelmbengue/30min'
const SKOOL = 'https://www.skool.com/yugz-fam-5520/about'

// ─── i18n ───────────────────────────────────────────
const LangContext = createContext({ lang: 'en', setLang: () => {}, t: (en, fr) => en })

function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('yugz-lang')
    if (saved) return saved
    const browserLang = navigator.language?.slice(0, 2)
    return browserLang === 'fr' ? 'fr' : 'en'
  })

  useEffect(() => {
    localStorage.setItem('yugz-lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const t = useCallback((en, fr) => lang === 'fr' ? fr : en, [lang])

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

function useLang() { return useContext(LangContext) }

// ─── AI VISUAL CATEGORIES ─────────────────────────────
const AI_CATEGORIES = [
  {
    slug: 'afro-surrealism',
    title: ['Afro Surrealism & Digital Collage', 'Afro-Surréalisme & Collage Digital'],
    description: ['Neo-Afrofuturist portraits blending culture and technology', 'Portraits néo-afrofuturistes mêlant culture et technologie'],
    cover: '/ai-visuals/afro-surrealism-01.png',
    tags: ['Afro Surrealism', 'AI Art'],
    images: Array.from({ length: 9 }, (_, i) => `/ai-visuals/afro-surrealism-${String(i + 1).padStart(2, '0')}.png`),
  },
  {
    slug: 'goyard-campaign',
    title: ['Goyard Luxury Campaign', 'Campagne Luxe Goyard'],
    description: ['AI-generated luxury fashion campaign concept', 'Concept de campagne mode luxe générée par IA'],
    cover: '/ai-visuals/goyard-01.png',
    tags: ['Luxury', 'Brand Campaign'],
    images: Array.from({ length: 11 }, (_, i) => `/ai-visuals/goyard-${String(i + 1).padStart(2, '0')}.png`),
  },
  {
    slug: 'fashion-editorials',
    title: ['Fashion Editorials', 'Éditoriaux Mode'],
    description: ['AI-styled editorial shoots replacing $50k photo sessions', 'Shootings éditoriaux IA remplaçant des séances photo à 50k$'],
    cover: '/ai-visuals/fashion-01.jpeg',
    tags: ['Fashion', 'AI Photography'],
    images: [
      ...Array.from({ length: 6 }, (_, i) => `/ai-visuals/fashion-${String(i + 1).padStart(2, '0')}.jpeg`),
      ...Array.from({ length: 5 }, (_, i) => `/ai-visuals/fashion-${String(i + 7).padStart(2, '0')}.png`),
    ],
  },
  {
    slug: 'african-portraits',
    title: ['African Portrait Photography', 'Photographie Portrait Africaine'],
    description: ['Hyper-realistic AI portraits celebrating African beauty', 'Portraits IA hyperréalistes célébrant la beauté africaine'],
    cover: '/ai-visuals/african-portrait-01.png',
    tags: ['Portrait', 'Cultural Art'],
    images: Array.from({ length: 18 }, (_, i) => `/ai-visuals/african-portrait-${String(i + 1).padStart(2, '0')}.png`),
  },
  {
    slug: 'brand-lifestyle',
    title: ['YUG Brand & Lifestyle', 'Marque YUG & Lifestyle'],
    description: ['Personal brand visuals and lifestyle content', 'Visuels de marque personnelle et contenu lifestyle'],
    cover: '/ai-visuals/brand-01.jpeg',
    tags: ['Branding', 'Lifestyle'],
    images: Array.from({ length: 8 }, (_, i) => `/ai-visuals/brand-${String(i + 1).padStart(2, '0')}.jpeg`),
  },
  {
    slug: 'sports-athletic',
    title: ['Sports & Athletic Series', 'Série Sports & Athlétisme'],
    description: ['Dynamic AI-generated athletic photography', 'Photographie sportive dynamique générée par IA'],
    cover: '/ai-visuals/sports-01.png',
    tags: ['Sports', 'Dynamic'],
    images: Array.from({ length: 2 }, (_, i) => `/ai-visuals/sports-${String(i + 1).padStart(2, '0')}.png`),
  },
  {
    slug: '3d-avatars',
    title: ['3D Avatar Collection', 'Collection Avatars 3D'],
    description: ['Hyper-stylized 3D avatar headshots for digital identity', 'Avatars 3D hyper-stylisés pour identité digitale'],
    cover: '/ai-visuals/avatar-01.png',
    tags: ['3D', 'Avatars'],
    images: Array.from({ length: 8 }, (_, i) => `/ai-visuals/avatar-${String(i + 1).padStart(2, '0')}.png`),
  },
  {
    slug: 'cinematic-action',
    title: ['Cinematic & Action Shots', 'Plans Cinématiques & Action'],
    description: ['Cinematic AI scenes with dramatic lighting and composition', 'Scènes IA cinématiques avec éclairage et composition dramatiques'],
    cover: '/ai-visuals/cinematic-01.png',
    tags: ['Cinematic', 'Action'],
    images: ['/ai-visuals/cinematic-01.png'],
  },
  {
    slug: 'street-photography',
    title: ['Street Photography AI', 'Photographie de Rue IA'],
    description: ['Tilt-shift and flash street photography powered by AI', 'Photographie de rue tilt-shift et flash alimentée par IA'],
    cover: '/ai-visuals/street-01.png',
    tags: ['Street', 'Photography'],
    images: Array.from({ length: 5 }, (_, i) => `/ai-visuals/street-${String(i + 1).padStart(2, '0')}.png`),
  },
]

// ─── PORTFOLIO ITEMS (used for the grid on homepage) ──
const PORTFOLIO_ITEMS = [
  ...AI_CATEGORIES.map((cat, i) => ({
    id: i + 1,
    category: 'ai-visuals',
    title: cat.title,
    description: cat.description,
    image: cat.cover,
    tags: cat.tags,
    slug: cat.slug,
  })),
  // ── Websites ──
  {
    id: 100, category: 'websites',
    title: ['K-Rion Cybersecurity', 'K-Rion Cybersécurité'],
    description: ['Corporate cybersecurity website with modern dark design', 'Site web cybersécurité corporate au design sombre moderne'],
    image: '/websites/K-RION CYBERSECURITY/K-RION CYBERSECURITY.png',
    tags: ['Next.js', 'Vercel', 'Cybersecurity'],
    link: 'https://k-rion.vercel.app/',
  },
  {
    id: 101, category: 'websites',
    title: ['Automation Agency', 'Agence d\'Automatisation'],
    description: ['AI automation agency landing page built with Framer', 'Landing page d\'agence d\'automatisation IA construite avec Framer'],
    image: '/websites/AUTOMATION AGENCY/AUTOMATION AGENCY.png',
    tags: ['Framer', 'Landing Page', 'AI'],
    link: 'https://yugzagency.framer.website/',
  },
  {
    id: 102, category: 'websites',
    title: ['Apartment Rental Platform', 'Plateforme Location Appartements'],
    description: ['Property rental website with booking system', 'Site de location immobilière avec système de réservation'],
    image: '/websites/APPARTMENT RENTAL/APPARTMENT RENTAL.png',
    tags: ['Framer', 'Real Estate'],
    link: 'https://exuberant-pictogram-259979.framer.app/',
  },
  {
    id: 103, category: 'websites',
    title: ['Portfolio Website', 'Site Portfolio'],
    description: ['Personal creative portfolio with immersive design', 'Portfolio créatif personnel au design immersif'],
    image: '/websites/PORTFOLIO/PORTFOLIO.png',
    tags: ['Framer', 'Portfolio', 'Design'],
    link: 'https://real-windows-249313.framer.app/',
  },
  // ── Web Apps ──
  {
    id: 200, category: 'websites',
    title: ['YECARS — Mobile Car Wash', 'YECARS — Lavage Auto Mobile'],
    description: ['Full-stack booking platform for mobile car wash service in Abidjan with subscriptions & admin dashboard', 'Plateforme de réservation full-stack pour lavage auto mobile à Abidjan avec abonnements & dashboard admin'],
    image: '/webapp/YECARS/YECARS.png',
    tags: ['Next.js', 'Supabase', 'Full-Stack'],
    link: 'https://yecars.vercel.app/',
  },
  {
    id: 201, category: 'websites',
    title: ['Bada Guesthouse', 'Bada Guesthouse'],
    description: ['Guesthouse booking website deployed on Vercel', 'Site de réservation de maison d\'hôtes déployé sur Vercel'],
    image: '/webapp/BADAGUESTHOUSE/BADAGUESTHOUSE.png',
    tags: ['Next.js', 'Vercel', 'Booking'],
    link: 'https://badaguesthouse.vercel.app/',
  },
  {
    id: 202, category: 'websites',
    title: ['MonCap Barber', 'MonCap Barber'],
    description: ['Barber shop website with online booking system', 'Site de salon de coiffure avec système de réservation en ligne'],
    image: '/webapp/MONCAP BARBER/MONCAP BARBER.png',
    tags: ['Web App', 'Booking', 'Business'],
    link: 'https://moncapbarber.com/',
  },
  {
    id: 203, category: 'websites',
    title: ['FinSpreading — Financial Analysis', 'FinSpreading — Analyse Financière'],
    description: ['Internal IFC tool automating financial statement analysis for African banks & MFIs with AI-powered CAMELS scoring', 'Outil interne IFC automatisant l\'analyse d\'états financiers de banques & IMF africaines avec scoring CAMELS par IA'],
    image: '/webapp/FIN ANALYSIS/FINANCIAL ANALYSIS APP.png',
    tags: ['Next.js', 'Supabase', 'Claude AI'],
  },
  {
    id: 204, category: 'websites',
    title: ['IDD Screening App', 'App de Screening IDD'],
    description: ['AI-powered integrity due diligence platform for investment compliance teams with automated PEP checks & risk reports', 'Plateforme de due diligence d\'intégrité par IA pour équipes de conformité avec vérifications PEP & rapports de risques automatisés'],
    image: '/webapp/IDD APP/IFC IDD APP.png',
    tags: ['Next.js', 'Supabase', 'AI', 'Compliance'],
  },
]

const TESTIMONIALS = [
  {
    quote: "Guy, you changed my life.",
    name: "Client",
    context: ["Said in person", "Dit en personne"],
    highlight: true,
  },
  {
    quote: "Franchement Guy Ismaël, je suis plus que satisfaite de ton travail ! Qualité 10/10, professionnalisme 10/10, contenu visuel parfait ! Tout a été respecté ! Je reviendrai c'est sûr !",
    translation: "Honestly Guy Ismaël, I'm more than satisfied with your work! Quality 10/10, professionalism 10/10, visual content perfect! Everything was respected! I'll be back for sure!",
    name: "Client", context: "Instagram DM",
  },
  {
    quote: "Enfaite ta fibre artistique est magique ❤️ Comment tu arrives à mettre en valeur ton produit et un beau mannequin en même temps ? Tout ça AI generated.",
    translation: "Your artistic sense is magical. How do you manage to showcase your product and a beautiful model at the same time? All AI generated.",
    name: "Client", context: "WhatsApp",
  },
  {
    quote: "QUOI?!!! Attend damnnn tu vas me dire que la PUB c'est full IA ?! Si c'est ça la vie t'es chaud ngl continue",
    translation: "WHAT?!!! Wait damnnn you're telling me the AD is full AI?! If that's it you're insane ngl keep going",
    name: "Client", context: "Instagram DM",
  },
  {
    quote: "C'est top, très instructif.",
    translation: "It's great, very instructive.",
    name: "Mohamed Ly", context: "Microsoft Teams",
  },
  {
    quote: "Honnêtement j'ai trouvé que c'était grave intéressant. Ça se voit que c'est un sujet que tu maîtrises et qui t'intéresse. Le concept de train les gens à utiliser la bonne plateforme AI pour la bonne tâche je trouve que c'est innovant de ouf.",
    translation: "Honestly I found it really interesting. You can tell it's a subject you master and that interests you. The concept of training people to use the right AI platform for the right task — I think it's insanely innovative.",
    name: "Astou Ryanna Dem", context: "Microsoft Teams",
  },
  {
    quote: "Ce cours est top ! En quelques leçons, on comprend beaucoup mieux l'IA et on apprend à mieux générer des prompts. La méthode est excellente. Je le recommande à tout le monde !",
    translation: "This course is amazing! In just a few lessons, you understand AI so much better and learn to generate better prompts. The method is excellent. I recommend it to everyone!",
    name: "Student", context: ["Course Review", "Avis de cours"],
  },
  {
    quote: "Grand merci. C'est excellent ce que tu as fait.",
    translation: "Big thank you. What you did is excellent.",
    name: "Mahamoud Magassouba", context: "Outlook Email",
  },
]

// ─── LIGHTBOX COMPONENT ────────────────────────────────
function Lightbox({ images, currentIndex, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-obsidian/95 backdrop-blur-xl" />

      {/* Counter */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 text-sm font-mono text-ivory/40">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Close */}
      <button onClick={onClose} className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-ivory/5 border border-ivory/10 flex items-center justify-center text-ivory/60 hover:text-ivory hover:bg-ivory/10 transition-all">
        <X size={18} />
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          className="absolute left-4 md:left-8 z-10 w-12 h-12 rounded-full bg-ivory/5 border border-ivory/10 flex items-center justify-center text-ivory/60 hover:text-ivory hover:bg-ivory/10 transition-all"
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext() }}
          className="absolute right-4 md:right-8 z-10 w-12 h-12 rounded-full bg-ivory/5 border border-ivory/10 flex items-center justify-center text-ivory/60 hover:text-ivory hover:bg-ivory/10 transition-all"
        >
          <ChevronRight size={22} />
        </button>
      )}

      {/* Image */}
      <img
        src={images[currentIndex]}
        alt=""
        className="relative z-10 max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}

// ─── GALLERY PAGE (Category Detail) ───────────────────
function GalleryPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { t } = useLang()
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const gridRef = useRef(null)

  const category = AI_CATEGORIES.find(c => c.slug === slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    if (!gridRef.current || !category) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const imgs = gridRef.current.querySelectorAll('.gallery-img')
    const headerEls = gridRef.current.querySelectorAll('.gallery-header > *')
    const ctx = gsap.context(() => {
      gsap.fromTo(imgs,
        { y: 40, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.06, duration: 0.5, ease: 'power3.out', delay: 0.15,
          onComplete: () => { imgs.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none' }) }
        }
      )
      gsap.fromTo(headerEls,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: 'power3.out',
          onComplete: () => { headerEls.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none' }) }
        }
      )
    }, gridRef)
    // Safety: force visibility after 1.5s
    const safety = setTimeout(() => {
      imgs.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none' })
      headerEls.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none' })
    }, 1500)
    return () => { ctx.revert(); clearTimeout(safety); imgs.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none' }) }
  }, [category])

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-ivory/40 mb-4">{t('Category not found', 'Catégorie introuvable')}</p>
          <Link to="/" className="text-champagne hover:underline">{t('Back to portfolio', 'Retour au portfolio')}</Link>
        </div>
      </div>
    )
  }

  const openLightbox = (i) => setLightboxIndex(i)
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () => setLightboxIndex((prev) => (prev - 1 + category.images.length) % category.images.length)
  const nextImage = () => setLightboxIndex((prev) => (prev + 1) % category.images.length)

  return (
    <div ref={gridRef} className="min-h-screen bg-obsidian">
      {/* Navigation bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-obsidian/80 backdrop-blur-xl border-b border-ivory/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-ivory/60 hover:text-ivory transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">{t('Back to Portfolio', 'Retour au Portfolio')}</span>
          </button>
          <Link to="/" className="font-bold text-lg tracking-[-0.04em] text-ivory">YUGZ</Link>
          <LangToggle />
        </div>
      </nav>

      {/* Header */}
      <div className="gallery-header pt-28 pb-12 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-4">
          {category.tags.map((tag) => (
            <span key={tag} className="text-[10px] font-mono px-3 py-1 rounded-full border border-champagne/20 text-champagne/70 tracking-wider uppercase">{tag}</span>
          ))}
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] text-ivory mb-4">
          {t(...category.title)}
        </h1>
        <p className="text-lg text-ivory/50 max-w-2xl leading-relaxed">
          {t(...category.description)}
        </p>
        <div className="flex items-center gap-4 mt-6">
          <span className="text-sm font-mono text-ivory/30">{category.images.length} {t('visuals', 'visuels')}</span>
          <span className="w-1 h-1 rounded-full bg-ivory/20" />
          <span className="text-sm font-mono text-ivory/30">{t('Click to enlarge', 'Cliquer pour agrandir')}</span>
        </div>
      </div>

      {/* Masonry-style Grid */}
      <div className="px-6 md:px-12 max-w-7xl mx-auto pb-24">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {category.images.map((img, i) => (
            <div
              key={i}
              className="gallery-img break-inside-avoid group relative overflow-hidden rounded-2xl border border-ivory/5 hover:border-champagne/30 transition-all duration-500 cursor-pointer"
              onClick={() => openLightbox(i)}
            >
              <img
                src={img}
                alt={`${t(...category.title)} — ${i + 1}`}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/30 transition-all duration-500 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-ivory/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500">
                  <ZoomIn size={20} className="text-ivory" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Browse Other Categories */}
      <div className="px-6 md:px-12 max-w-7xl mx-auto pb-24">
        <h3 className="text-xs font-mono text-ivory/30 tracking-[0.2em] uppercase mb-6">{t('Browse Other Categories', 'Parcourir les Autres Catégories')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {AI_CATEGORIES.filter(c => c.slug !== slug).map((cat) => (
            <Link
              key={cat.slug}
              to={`/gallery/${cat.slug}`}
              className="group relative overflow-hidden rounded-xl border border-ivory/5 hover:border-champagne/30 transition-all duration-500 aspect-square"
            >
              <img src={cat.cover} alt={t(...cat.title)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-sm font-bold text-ivory group-hover:text-champagne transition-colors truncate">{t(...cat.title)}</p>
                <p className="text-[10px] font-mono text-ivory/30 mt-1">{cat.images.length} {t('visuals', 'visuels')}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA at bottom */}
      <div className="px-6 md:px-12 max-w-7xl mx-auto pb-16 text-center">
        <p className="text-ivory/40 mb-4">{t('Like what you see?', 'Tu aimes ce que tu vois ?')}</p>
        <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-champagne text-white font-semibold px-8 py-4 rounded-full text-base hover:brightness-110 transition-all">
          {t('Book Free Strategy Call', 'Réserver un Appel Gratuit')} <ArrowRight size={18} />
        </a>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={category.images}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </div>
  )
}

// ─── LANGUAGE TOGGLE ────────────────────────────────
function LangToggle() {
  const { lang, setLang } = useLang()
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ivory/5 hover:bg-ivory/10 border border-ivory/10 text-xs font-mono text-ivory/60 hover:text-ivory transition-all duration-300"
      aria-label="Switch language"
    >
      <Languages size={12} />
      <span className="uppercase font-semibold">{lang === 'en' ? 'FR' : 'EN'}</span>
    </button>
  )
}

// ─── NAVBAR ─────────────────────────────────────────
function Navbar() {
  const navRef = useRef(null)
  const { t } = useLang()

  useEffect(() => {
    const hero = document.querySelector('#hero')
    if (!hero || !navRef.current) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        navRef.current?.classList.toggle('scrolled', !entry.isIntersecting)
      },
      { threshold: 0.1 }
    )
    obs.observe(hero)
    return () => obs.disconnect()
  }, [])

  return (
    <nav
      ref={navRef}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 md:gap-8 px-4 md:px-8 py-3 rounded-full border border-transparent transition-all duration-500"
      style={{ background: 'transparent' }}
    >
      <Link to="/" className="font-bold text-lg tracking-[-0.04em] text-ivory">
        YUGZ
      </Link>
      <div className="hidden md:flex items-center gap-6 text-sm text-ivory/70">
        <a href="#work" className="hover:text-champagne transition-colors">{t('Work', 'Portfolio')}</a>
        <a href="#community" className="hover:text-champagne transition-colors">{t('Community', 'Communaut\u00e9')}</a>
        <a href="#about" className="hover:text-champagne transition-colors">{t('About', '\u00c0 propos')}</a>
      </div>
      <div className="flex items-center gap-2">
        <LangToggle />
        <a
          href="#cta"
          className="magnetic-btn bg-champagne text-white text-sm font-semibold px-5 py-2 rounded-full whitespace-nowrap"
        >
          <span>{t("Let's Talk", 'Parlons')}</span>
        </a>
      </div>

      <style>{`
        nav.scrolled {
          background: rgba(5, 5, 5, 0.7) !important;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-color: rgba(220, 38, 38, 0.15) !important;
          box-shadow: 0 4px 30px rgba(0,0,0,0.5);
        }
      `}</style>
    </nav>
  )
}

// ─── HERO ───────────────────────────────────────────
function Hero() {
  const heroRef = useRef(null)
  const { t } = useLang()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const heroEls = heroRef.current?.querySelectorAll('.hero-line-1, .hero-line-2, .hero-sub, .hero-cta, .hero-badge, .hero-stats > div')
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3, onComplete: () => {
        heroEls?.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none' })
      }})
      tl.fromTo('.hero-line-1', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
        .fromTo('.hero-line-2', { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.5')
        .fromTo('.hero-sub', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.4')
        .fromTo('.hero-cta', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.3')
        .fromTo('.hero-badge', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }, '-=0.2')
        .fromTo('.hero-stats > div', { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power3.out' }, '-=0.2')
    }, heroRef)
    return () => { ctx.revert(); heroEls?.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none' }) }
  }, [])

  const stats = [
    { value: '150+', label: t('AI Visuals Created', 'Visuels IA Cr\u00e9\u00e9s') },
    { value: '30+', label: t('Websites & Apps Shipped', 'Sites & Apps Livr\u00e9s') },
    { value: '12+', label: t('Community Members', 'Membres Communaut\u00e9') },
    { value: '80%', label: t('Avg. Cost Reduction', 'R\u00e9duction Co\u00fbts Moy.') },
  ]

  return (
    <section id="hero" ref={heroRef} className="relative min-h-[100dvh] flex items-end overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&q=80&auto=format" alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/80 to-obsidian/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full px-6 md:px-12 pb-16 md:pb-24 pt-40">
        <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-champagne/20 bg-champagne/5 mb-8">
          <Sparkles size={14} className="text-champagne" />
          <span className="text-xs font-mono text-champagne tracking-wide uppercase">{t('AI Creative Studio', 'Studio Cr\u00e9atif IA')}</span>
        </div>

        <h1 className="hero-line-1 font-bold text-5xl md:text-7xl lg:text-8xl tracking-[-0.04em] leading-[0.95] text-ivory mb-2">
          {t('I create with', 'Je cr\u00e9e avec')}
        </h1>
        <p className="hero-line-2 font-drama italic text-7xl md:text-[9rem] lg:text-[11rem] leading-[0.85] tracking-[-0.02em] text-champagne">
          {t("l'IA.", "l'IA.")}
        </p>

        <p className="hero-sub text-lg md:text-xl text-ivory/60 max-w-xl mt-8 leading-relaxed">
          {t(
            <>AI visuals. Automated workflows. Websites & apps built at lightning speed. This is the portfolio of <span className="text-ivory font-medium">YUGZ</span> — the AI&nbsp;specialist.</>,
            <>Visuels IA. Workflows automatis\u00e9s. Sites & apps construits \u00e0 la vitesse de l\u2019\u00e9clair. Voici le portfolio de <span className="text-ivory font-medium">YUGZ</span> — le sp\u00e9cialiste&nbsp;IA.</>
          )}
        </p>

        <div className="hero-cta flex flex-wrap items-center gap-4 mt-10">
          <a href="#work" className="magnetic-btn inline-flex items-center gap-2 bg-champagne text-white font-semibold px-8 py-4 rounded-full text-base">
            <span className="flex items-center gap-2">
              {t('View My Work', 'Voir Mon Travail')} <ArrowRight size={18} />
            </span>
          </a>
          <a href="#cta" className="inline-flex items-center gap-2 text-ivory/50 hover:text-ivory transition-colors text-sm">
            <Play size={14} /> {t('Book a Call', 'R\u00e9server un Appel')}
          </a>
        </div>

        <div className="hero-stats flex flex-wrap gap-8 md:gap-12 mt-16 pt-8 border-t border-ivory/5">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-2xl md:text-3xl font-bold text-champagne">{s.value}</div>
              <div className="text-xs font-mono text-ivory/30 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40">
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-ivory/50">{t('Scroll', 'D\u00e9filer')}</span>
        <div className="w-px h-8 bg-gradient-to-b from-champagne/60 to-transparent" />
      </div>
    </section>
  )
}

// ─── PORTFOLIO GRID ─────────────────────────────────
function PortfolioItem({ item, index }) {
  const { t } = useLang()

  const isAI = item.category === 'ai-visuals' && item.slug
  const hasLink = item.link

  // AI visuals → gallery page, websites with link → external site, others → no link
  const content = (
    <div className="relative w-full h-full min-h-[280px] md:min-h-[320px]">
      <img src={item.image} alt={t(...item.title)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 to-transparent opacity-100 transition-opacity duration-500" />
      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span key={tag} className="text-[10px] font-mono px-2 py-1 rounded-full bg-obsidian/60 backdrop-blur-sm border border-ivory/10 text-ivory/60">{tag}</span>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-xl font-bold tracking-tight text-ivory mb-1 group-hover:text-champagne transition-colors duration-300">{t(...item.title)}</h3>
        <p className="text-sm text-ivory/50 leading-relaxed">{t(...item.description)}</p>
        <div className="mt-3 flex items-center gap-2 text-champagne text-xs font-mono opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          {isAI ? (
            <>{t('View Gallery', 'Voir la Galerie')} <ArrowRight size={14} /></>
          ) : hasLink ? (
            <>{t('Visit Site', 'Visiter le Site')} <ExternalLink size={14} /></>
          ) : (
            <>{t('Internal Tool', 'Outil Interne')} — {item.tags.join(' · ')}</>
          )}
        </div>
      </div>
    </div>
  )

  const baseClass = `portfolio-item group relative overflow-hidden rounded-[1.5rem] border border-ivory/5 hover:border-champagne/30 transition-all duration-500 block ${
    index === 0 || index === 5 ? 'md:col-span-2 md:row-span-2' : ''
  }`

  if (isAI) {
    return <Link to={`/gallery/${item.slug}`} className={`${baseClass} cursor-pointer`}>{content}</Link>
  }
  if (hasLink) {
    return <a href={item.link} target="_blank" rel="noopener noreferrer" className={`${baseClass} cursor-pointer`}>{content}</a>
  }
  return <div className={baseClass}>{content}</div>
}

function Portfolio() {
  const sectionRef = useRef(null)
  const [filter, setFilter] = useState('all')
  const [showAll, setShowAll] = useState(false)
  const { t } = useLang()
  const filters = [
    { key: 'all', label: t('All Work', 'Tout') },
    { key: 'ai-visuals', label: t('AI Visuals', 'Visuels IA') },
    { key: 'websites', label: t('Websites & Apps', 'Sites & Apps') },
  ]
  const allFiltered = filter === 'all' ? PORTFOLIO_ITEMS : PORTFOLIO_ITEMS.filter(i => i.category === filter)
  const filtered = showAll ? allFiltered : allFiltered.slice(0, 9)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const items = sectionRef.current?.querySelectorAll('.portfolio-item')
    if (!items?.length) return
    const ctx = gsap.context(() => {
      gsap.fromTo(items,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 90%', once: true },
          onComplete: () => { items.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none' }) }
        }
      )
    }, sectionRef)
    return () => { ctx.revert(); items.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none' }) }
  }, [filter, showAll])

  return (
    <section id="work" ref={sectionRef} className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <span className="text-xs font-mono text-champagne/60 tracking-[0.2em] uppercase">Portfolio</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.04em] mt-4 text-ivory">
            {t(<>Selected <span className="font-drama italic text-champagne">work</span>.</>, <><span className="font-drama italic text-champagne">Travaux</span> s\u00e9lectionn\u00e9s.</>)}
          </h2>
        </div>
        <div className="flex gap-2">
          {filters.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === f.key ? 'bg-champagne text-white' : 'bg-ivory/5 text-ivory/50 hover:text-ivory hover:bg-ivory/10'}`}
            >{f.label}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[280px] md:auto-rows-[320px]">
        {filtered.map((item, i) => <PortfolioItem key={item.id} item={item} index={i} />)}
      </div>
      {allFiltered.length > 9 && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-8 py-3 rounded-full border border-ivory/10 text-ivory/60 hover:text-ivory hover:border-champagne/40 transition-all duration-300 text-sm font-medium"
          >
            {showAll ? t('Show Less', 'Voir Moins') : t(`Show All (${allFiltered.length})`, `Tout Voir (${allFiltered.length})`)}
          </button>
        </div>
      )}
    </section>
  )
}

// ─── TESTIMONIALS ───────────────────────────────────
function Testimonials() {
  const sectionRef = useRef(null)
  const scrollRef = useRef(null)
  const { lang, t } = useLang()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cards = sectionRef.current?.querySelectorAll('.testimonial-card')
    if (!cards?.length) return
    const ctx = gsap.context(() => {
      gsap.fromTo(cards,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 90%', once: true },
          onComplete: () => { cards.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none' }) }
        }
      )
    }, sectionRef)
    return () => { ctx.revert(); cards.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none' }) }
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    let raf
    const step = () => {
      el.scrollLeft += 0.5
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth) el.scrollLeft = 0
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    const pause = () => cancelAnimationFrame(raf)
    const resume = () => { raf = requestAnimationFrame(step) }
    el.addEventListener('mouseenter', pause)
    el.addEventListener('mouseleave', resume)
    return () => { cancelAnimationFrame(raf); el.removeEventListener('mouseenter', pause); el.removeEventListener('mouseleave', resume) }
  }, [])

  const getContext = (ctx) => Array.isArray(ctx) ? t(...ctx) : ctx

  return (
    <section id="testimonials" ref={sectionRef} className="py-32 overflow-hidden">
      <div className="px-6 md:px-12 max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="text-xs font-mono text-champagne/60 tracking-[0.2em] uppercase">{t('Testimonials', 'T\u00e9moignages')}</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.04em] mt-4 text-ivory">
              {t(<>What people <span className="font-drama italic text-champagne">say</span>.</>, <>Ce qu'on <span className="font-drama italic text-champagne">dit</span> de moi.</>)}
            </h2>
          </div>
          <p className="text-sm text-ivory/40 max-w-sm">
            {t('Real messages from real clients and students. Unscripted, unfiltered.', 'De vrais messages de vrais clients et \u00e9tudiants. Sans filtre.')}
          </p>
        </div>
      </div>

      {/* Hero testimonial */}
      <div className="px-6 md:px-12 max-w-7xl mx-auto mb-12">
        <div className="testimonial-card relative p-10 md:p-16 rounded-[2rem] border border-champagne/20 bg-gradient-to-br from-champagne/5 to-transparent overflow-hidden">
          <Quote size={48} className="text-champagne/15 absolute top-6 left-6" />
          <blockquote className="relative z-10">
            <p className="font-drama italic text-4xl md:text-6xl lg:text-7xl text-ivory leading-[1.1] tracking-[-0.02em]">
              {t(
                <>"Guy, you changed <span className="text-champagne">my life</span>."</>,
                <>"Guy, tu as chang\u00e9 <span className="text-champagne">ma vie</span>."</>
              )}
            </p>
          </blockquote>
          <div className="mt-6 flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-champagne" />
            <span className="text-sm text-ivory/40 font-mono">— {t('Said in person by a client', 'Dit en personne par un client')}</span>
          </div>
        </div>
      </div>

      {/* Scrolling cards */}
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto px-6 md:px-12 pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {TESTIMONIALS.filter(x => !x.highlight).map((item, i) => (
          <div key={i} className="testimonial-card flex-shrink-0 w-[340px] md:w-[400px] p-6 rounded-[1.5rem] bg-obsidian-light border border-ivory/5 hover:border-champagne/20 transition-all duration-500">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle size={14} className="text-champagne/50" />
              <span className="text-[10px] font-mono text-ivory/30 tracking-wider uppercase">{getContext(item.context)}</span>
            </div>
            <blockquote className="text-sm text-ivory/70 leading-relaxed mb-4 italic">"{item.quote}"</blockquote>
            {item.translation && (
              <p className="text-xs text-ivory/30 leading-relaxed mb-4 border-l-2 border-champagne/20 pl-3">
                {lang === 'fr' ? item.quote : item.translation}
              </p>
            )}
            <div className="flex items-center gap-2 mt-auto pt-3 border-t border-ivory/5">
              <div className="w-7 h-7 rounded-full bg-champagne/10 flex items-center justify-center text-[10px] font-bold text-champagne">{item.name.charAt(0)}</div>
              <span className="text-sm text-ivory/50 font-medium">{item.name}</span>
            </div>
          </div>
        ))}
      </div>
      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
    </section>
  )
}

// ─── SKOOL COMMUNITY ────────────────────────────────
function Community() {
  const sectionRef = useRef(null)
  const { t } = useLang()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      SplitText.create('.community-heading', {
        type: 'words', autoSplit: true,
        onSplit(self) {
          gsap.fromTo(self.words,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, stagger: 0.05, duration: 0.8, ease: 'power3.out',
              scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
              onComplete: () => { self.words.forEach(w => { w.style.opacity = '1'; w.style.transform = 'none' }) }
            }
          )
        },
      })
      const cards = document.querySelectorAll('.community-card')
      gsap.fromTo(cards,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.12, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: '.community-grid', start: 'top 90%', once: true },
          onComplete: () => { cards.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none' }) }
        }
      )
    }, sectionRef)
    return () => { ctx.revert(); document.querySelectorAll('.community-card').forEach(el => { el.style.opacity = '1'; el.style.transform = 'none' }) }
  }, [])

  const perks = [
    { icon: '\ud83c\udf93', title: t('AI Mastery Courses', 'Cours Ma\u00eetrise IA'), description: t('Step-by-step tutorials on AI image generation, automation, and prompt engineering.', 'Tutoriels \u00e9tape par \u00e9tape sur la g\u00e9n\u00e9ration d\'images IA, l\'automatisation et le prompt engineering.') },
    { icon: '\ud83d\udee0\ufe0f', title: t('Templates & Workflows', 'Templates & Workflows'), description: t('Pre-built automation templates, prompt libraries, and development boilerplates.', 'Templates d\'automatisation, biblioth\u00e8ques de prompts et boilerplates de d\u00e9veloppement.') },
    { icon: '\ud83e\udd1d', title: t('Live Workshops', 'Ateliers en Direct'), description: t('Weekly live sessions where we build AI projects together from scratch.', 'Sessions live hebdomadaires o\u00f9 on construit des projets IA ensemble de z\u00e9ro.') },
    { icon: '\ud83d\udcac', title: t('Private Community', 'Communaut\u00e9 Priv\u00e9e'), description: t('Network with creators, entrepreneurs, and developers pushing AI boundaries.', 'R\u00e9seautez avec des cr\u00e9ateurs, entrepreneurs et d\u00e9veloppeurs qui repoussent les limites de l\'IA.') },
  ]

  return (
    <section id="community" ref={sectionRef} className="relative py-40 px-6 md:px-12 overflow-hidden" style={{ background: 'linear-gradient(180deg, #050505 0%, #0A0000 50%, #050505 100%)' }}>
      <div className="absolute inset-0 z-0 opacity-8">
        <img src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1920&q=80&auto=format" alt="" className="w-full h-[120%] object-cover -translate-y-[10%]" style={{ animation: 'float 20s ease-in-out infinite' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Users size={16} className="text-champagne" />
          <span className="text-xs font-mono text-champagne/60 tracking-[0.2em] uppercase">{t('Skool Community', 'Communaut\u00e9 Skool')}</span>
        </div>

        <h2 className="community-heading font-drama italic text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-[-0.02em] mb-6">
          {t(
            <>Join the <span className="text-champagne">YUGZ</span> community. Learn AI. Build faster. <span className="text-champagne">Together</span>.</>,
            <>Rejoins la communaut\u00e9 <span className="text-champagne">YUGZ</span>. Apprends l'IA. Construis plus vite. <span className="text-champagne">Ensemble</span>.</>
          )}
        </h2>

        <p className="text-lg text-ivory/40 max-w-2xl mb-16 leading-relaxed">
          {t(
            'A private Skool community where I share everything \u2014 the tools, the techniques, the workflows. Whether you want to create AI content, automate your business, or build apps faster.',
            'Une communaut\u00e9 Skool priv\u00e9e o\u00f9 je partage tout \u2014 les outils, les techniques, les workflows. Que tu veuilles cr\u00e9er du contenu IA, automatiser ton business ou construire des apps plus vite.'
          )}
        </p>

        <div className="community-grid grid md:grid-cols-2 gap-4 mb-12">
          {perks.map((perk) => (
            <div key={perk.title} className="community-card p-6 rounded-[1.5rem] bg-obsidian-light/80 border border-ivory/5 hover:border-champagne/20 transition-all duration-500 backdrop-blur-sm">
              <span className="text-2xl mb-3 block">{perk.icon}</span>
              <h3 className="text-lg font-bold text-ivory mb-2">{perk.title}</h3>
              <p className="text-sm text-ivory/40 leading-relaxed">{perk.description}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <a href={SKOOL} target="_blank" rel="noopener noreferrer" className="magnetic-btn inline-flex items-center gap-2 bg-champagne text-white font-semibold px-8 py-4 rounded-full text-base">
            <span className="flex items-center gap-2">{t('Join the Community', 'Rejoindre la Communaut\u00e9')} <ExternalLink size={16} /></span>
          </a>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-obsidian-mid border-2 border-obsidian flex items-center justify-center text-[10px] font-mono text-ivory/40">{String.fromCharCode(64 + i)}</div>
              ))}
            </div>
            <span className="text-sm text-ivory/30">{t('12+ members learning AI', '12+ membres apprenant l\'IA')}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── ABOUT ──────────────────────────────────────────
function About() {
  const sectionRef = useRef(null)
  const { t } = useLang()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const els = sectionRef.current?.querySelectorAll('.about-content > *')
    if (!els?.length) return
    const ctx = gsap.context(() => {
      gsap.fromTo(els,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 90%', once: true },
          onComplete: () => { els.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none' }) }
        }
      )
    }, sectionRef)
    return () => { ctx.revert(); els.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none' }) }
  }, [])

  const services = [
    { icon: <Image size={20} />, title: t('AI Visuals & Content', 'Visuels IA & Contenu'), description: t('Brand imagery, social media content, product photography, video concepts \u2014 all generated with AI at a fraction of traditional costs.', 'Imagerie de marque, contenu r\u00e9seaux sociaux, photo produit, concepts vid\u00e9o \u2014 tout g\u00e9n\u00e9r\u00e9 par IA \u00e0 une fraction du co\u00fbt traditionnel.') },
    { icon: <Sparkles size={20} />, title: t('Automation & AI Tools', 'Automatisation & Outils IA'), description: t("Custom workflows that eliminate repetitive tasks. CRM automations, content pipelines, data processing \u2014 if it's manual, I can automate it.", 'Workflows personnalis\u00e9s qui \u00e9liminent les t\u00e2ches r\u00e9p\u00e9titives. Automatisations CRM, pipelines de contenu, traitement de donn\u00e9es \u2014 si c\'est manuel, je peux l\'automatiser.') },
    { icon: <Globe size={20} />, title: t('Websites & Apps', 'Sites Web & Apps'), description: t('High-performance websites, dashboards, and apps built in days. From landing pages to full-stack platforms \u2014 AI-accelerated development.', 'Sites web performants, dashboards et apps construits en quelques jours. Des landing pages aux plateformes full-stack \u2014 d\u00e9veloppement acc\u00e9l\u00e9r\u00e9 par l\'IA.') },
  ]

  return (
    <section id="about" ref={sectionRef} className="py-32 px-6 md:px-12 max-w-6xl mx-auto">
      <div className="about-content">
        <span className="text-xs font-mono text-champagne/60 tracking-[0.2em] uppercase">{t('What I Do', 'Ce Que Je Fais')}</span>
        <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.04em] mt-4 mb-6 text-ivory">
          {t(<>The AI specialist that<br /><span className="font-drama italic text-champagne">builds & creates</span>.</>, <>Le sp\u00e9cialiste IA qui<br /><span className="font-drama italic text-champagne">construit & cr\u00e9e</span>.</>)}
        </h2>
        <p className="text-lg text-ivory/40 max-w-2xl mb-16 leading-relaxed">
          {t('I combine creative AI, automation, and rapid development to help businesses move faster and cost less. No fluff, no bloated teams \u2014 just results.', 'Je combine IA cr\u00e9ative, automatisation et d\u00e9veloppement rapide pour aider les entreprises \u00e0 aller plus vite et d\u00e9penser moins. Pas de blabla, pas d\'\u00e9quipes gonfl\u00e9es \u2014 juste des r\u00e9sultats.')}
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.title} className="p-8 rounded-[2rem] bg-obsidian-light border border-ivory/5 hover:border-champagne/20 transition-all duration-500 group">
              <div className="w-12 h-12 rounded-2xl bg-champagne/10 flex items-center justify-center text-champagne mb-6 group-hover:bg-champagne/20 transition-colors duration-300">{s.icon}</div>
              <h3 className="text-xl font-bold text-ivory mb-3">{s.title}</h3>
              <p className="text-sm text-ivory/40 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── MARQUEE ────────────────────────────────────────
function Marquee() {
  const items = ['AI VISUALS', 'AUTOMATION', 'WEB DEVELOPMENT', 'APP DEVELOPMENT', 'PROMPT ENGINEERING', 'BRAND DESIGN', 'CONTENT CREATION', 'SKOOL COMMUNITY']
  return (
    <div className="py-8 border-y border-ivory/5 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="mx-8 text-sm font-mono text-ivory/20 tracking-[0.2em] uppercase flex items-center gap-4">
            {item}<span className="w-1.5 h-1.5 rounded-full bg-champagne/30" />
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
      `}</style>
    </div>
  )
}

// ─── CTA ────────────────────────────────────────────
function CTA() {
  const sectionRef = useRef(null)
  const { t } = useLang()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const els = sectionRef.current?.querySelectorAll('.cta-content > *')
    if (!els?.length) return
    const ctx = gsap.context(() => {
      gsap.fromTo(els,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 90%', once: true },
          onComplete: () => { els.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none' }) }
        }
      )
    }, sectionRef)
    return () => { ctx.revert(); els.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none' }) }
  }, [])

  return (
    <section id="cta" ref={sectionRef} className="py-40 px-6 md:px-12 text-center" style={{ background: 'radial-gradient(ellipse at center, rgba(220,38,38,0.06) 0%, transparent 70%)' }}>
      <div className="cta-content max-w-3xl mx-auto">
        <span className="text-xs font-mono text-champagne/60 tracking-[0.2em] uppercase">{t("Let's Work Together", 'Travaillons Ensemble')}</span>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] mt-6 mb-4 text-ivory">
          {t(<>Ready to build your<br /><span className="font-drama italic text-champagne">unfair advantage</span>?</>, <>Pr\u00eat \u00e0 construire ton<br /><span className="font-drama italic text-champagne">avantage d\u00e9cisif</span> ?</>)}
        </h2>
        <p className="text-lg text-ivory/50 max-w-xl mx-auto mb-10 leading-relaxed">
          {t(
            "Book a free 30-minute strategy call. I'll audit your workflows, identify your biggest opportunities, and show you exactly how AI can transform your business.",
            'R\u00e9serve un appel strat\u00e9gique gratuit de 30 minutes. J\'auditerai tes workflows, identifierai tes plus grandes opportunit\u00e9s et te montrerai exactement comment l\'IA peut transformer ton business.'
          )}
        </p>
        <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="magnetic-btn inline-flex items-center gap-3 bg-champagne text-white font-bold px-10 py-5 rounded-full text-lg">
          <span className="flex items-center gap-3">
            {t('Book Free Strategy Call', 'R\u00e9server un Appel Gratuit')} <ArrowRight size={20} />
          </span>
        </a>
        <p className="mt-6 text-xs text-ivory/30 font-mono">{t('No commitment. No pitch deck. Just answers.', 'Sans engagement. Sans pitch deck. Juste des r\u00e9ponses.')}</p>
      </div>
    </section>
  )
}

// ─── FOOTER ─────────────────────────────────────────
function Footer() {
  const { t } = useLang()
  return (
    <footer className="bg-obsidian-light rounded-t-[3rem] border-t border-ivory/5">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          <div className="md:col-span-1">
            <span className="text-2xl font-bold tracking-[-0.04em] text-ivory">YUGZ</span>
            <p className="text-sm text-ivory/40 mt-3 max-w-xs leading-relaxed">
              {t('The AI specialist that combines creative AI, automation, and development to help businesses move faster and cost less.', 'Le sp\u00e9cialiste IA qui combine IA cr\u00e9ative, automatisation et d\u00e9veloppement pour aider les entreprises \u00e0 aller plus vite et d\u00e9penser moins.')}
            </p>
          </div>
          <div>
            <div className="text-xs font-mono text-ivory/30 uppercase tracking-[0.15em] mb-4">{t('Navigate', 'Naviguer')}</div>
            <ul className="space-y-2 text-sm text-ivory/50">
              <li><a href="#work" className="hover:text-champagne transition-colors">{t('Work', 'Portfolio')}</a></li>
              <li><a href="#community" className="hover:text-champagne transition-colors">{t('Community', 'Communaut\u00e9')}</a></li>
              <li><a href="#about" className="hover:text-champagne transition-colors">{t('About', '\u00c0 propos')}</a></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-mono text-ivory/30 uppercase tracking-[0.15em] mb-4">{t('Connect', 'Contact')}</div>
            <ul className="space-y-2 text-sm text-ivory/50">
              <li><a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="hover:text-champagne transition-colors">{t('Book a Call', 'R\u00e9server un Appel')}</a></li>
              <li><a href={SKOOL} target="_blank" rel="noopener noreferrer" className="hover:text-champagne transition-colors">{t('Skool Community', 'Communaut\u00e9 Skool')}</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-ivory/5">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" style={{ animation: 'pulse-dot 2s ease infinite' }} />
            <span className="text-[10px] font-mono text-ivory/30 tracking-wider">{t('AVAILABLE FOR PROJECTS', 'DISPONIBLE POUR DES PROJETS')}</span>
          </div>
          <span className="text-[10px] font-mono text-ivory/20">&copy; {new Date().getFullYear()} YUGZ. {t('All rights reserved.', 'Tous droits r\u00e9serv\u00e9s.')}</span>
        </div>
      </div>
    </footer>
  )
}

// ─── MAGNETIC BUTTONS ───────────────────────────────
function useMagneticButtons() {
  useEffect(() => {
    if ('ontouchstart' in window) return
    const buttons = document.querySelectorAll('.magnetic-btn')
    const cleanups = []
    buttons.forEach(btn => {
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3' })
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3' })
      const onMove = (e) => { const r = btn.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * 0.3); yTo((e.clientY - r.top - r.height / 2) * 0.3) }
      const onLeave = () => { xTo(0); yTo(0) }
      btn.addEventListener('mousemove', onMove)
      btn.addEventListener('mouseleave', onLeave)
      cleanups.push(() => { btn.removeEventListener('mousemove', onMove); btn.removeEventListener('mouseleave', onLeave) })
    })
    return () => cleanups.forEach(fn => fn())
  }, [])
}

// ─── HOMEPAGE ──────────────────────────────────────
function HomePage() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    const raf1 = requestAnimationFrame(() => ScrollTrigger.refresh())
    const raf2 = setTimeout(() => ScrollTrigger.refresh(), 300)
    // Safety net: force-show any elements stuck at opacity 0
    const safety = setTimeout(() => {
      document.querySelectorAll('.portfolio-item, .testimonial-card, .community-card, .about-content > *, .cta-content > *, .hero-line-1, .hero-line-2, .hero-sub, .hero-cta, .hero-badge, .hero-stats > div, .community-heading div').forEach(el => {
        if (parseFloat(getComputedStyle(el).opacity) < 0.1 && !el.className?.includes('opacity-0') && !el.className?.includes('opacity-8')) {
          el.style.opacity = '1'
          el.style.transform = 'none'
        }
      })
    }, 2000)

    return () => { lenis.destroy(); gsap.ticker.remove(lenis.raf); cancelAnimationFrame(raf1); clearTimeout(raf2); clearTimeout(safety) }
  }, [])

  useMagneticButtons()

  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <Portfolio />
      <Testimonials />
      <Community />
      <About />
      <Marquee />
      <CTA />
      <Footer />
    </>
  )
}

// ─── APP ────────────────────────────────────────────
function App() {
  return (
    <LangProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gallery/:slug" element={<GalleryPage />} />
        </Routes>
      </HashRouter>
    </LangProvider>
  )
}

export default App
