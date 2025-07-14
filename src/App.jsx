import { useState, useEffect, useRef } from 'react'
import './App.css'

const heroImages = [
  '/src/assets/hero.jpg',
  '/src/assets/hero2.jpg',
]

const services = [
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="16" stroke="#343631" strokeWidth="2.2"/>
        <path d="M24 14V24L30 28" stroke="#343631" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="24" cy="34" r="1.5" fill="#343631"/>
      </svg>
    ),
    title: 'Project Management & Consulting',
    desc: 'Expert guidance and management for your projects, ensuring successful delivery and strategic growth.'
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="12" width="32" height="24" rx="3" stroke="#343631" strokeWidth="2.2"/>
        <rect x="14" y="18" width="20" height="4" rx="2" fill="#343631"/>
        <rect x="14" y="26" width="12" height="4" rx="2" fill="#343631"/>
      </svg>
    ),
    title: 'Business Digitization & Marketing',
    desc: 'Transform your business with digital solutions and effective marketing strategies for a global reach.'
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="28" height="28" rx="6" stroke="#343631" strokeWidth="2.2"/>
        <path d="M24 18V30" stroke="#343631" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M18 24H30" stroke="#343631" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Business Process Optimization',
    desc: 'Streamline operations and maximize efficiency with tailored process improvements and automation.'
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="14" width="32" height="20" rx="4" stroke="#343631" strokeWidth="2.2"/>
        <circle cx="24" cy="24" r="4" stroke="#343631" strokeWidth="2.2"/>
        <path d="M24 20V24L26 26" stroke="#343631" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Condition Assessment & Evaluation',
    desc: 'Comprehensive assessment and evaluation services to ensure optimal performance and compliance.'
  }
]

const projectImages = [
  { src: '/src/assets/project-slide-1.png', name: 'project-slide-1' },
  { src: '/src/assets/project-slide-2.png', name: 'project-slide-2' },
  { src: '/src/assets/project-slide-3.png', name: 'project-slide-3' },
  { src: '/src/assets/project-slide-4.png', name: 'project-slide-4' },
  { src: '/src/assets/project-slide-5.png', name: 'project-slide-5' },
]

function App() {
  const [heroCurrent, setHeroCurrent] = useState(0)
  const [galleryCurrent, setGalleryCurrent] = useState(0)
  const galleryRef = useRef(null)

  // Hero slider interval
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCurrent(prev => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Gallery slider interval
  useEffect(() => {
    const interval = setInterval(() => {
      setGalleryCurrent(prev => (prev + 1) % projectImages.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (galleryRef.current) {
      const card = galleryRef.current.querySelectorAll('.project-image-card')[galleryCurrent]
      if (card) {
        const gallery = galleryRef.current
        const cardLeft = card.offsetLeft
        const cardWidth = card.offsetWidth
        const galleryWidth = gallery.offsetWidth
        const scrollTo = cardLeft - (galleryWidth - cardWidth) / 2
        gallery.scrollTo({ left: scrollTo, behavior: 'smooth' })
      }
    }
  }, [galleryCurrent])

  return (
    <>
      <header className="header simple-header">
        <div className="header-logo">
          <img src="/src/assets/logo.jpeg" alt="Vian Global Logo" className="header-logo-img" />
        </div>
        <nav className="nav">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>
      <main>
        <section className="hero-section" id="home">
          <div
            className="hero-bg"
            style={{
              backgroundImage: `url(${heroImages[heroCurrent]})`,
            }}
          />
          <div className="hero-overlay" />
          <div className="hero-content">
            <h1>Empowering Businesses with Smart,<br />Scalable Technical Solutions</h1>
            <a href="#contact" className="cta-btn">Get Started</a>
          </div>
        </section>
        <section className="vian-way-section" id="about">
          <div className="vian-way-container">
            <div className="vian-way-header">
              <h2>The Vian Way</h2>
              <p className="vian-way-lead">Professional technical solutions for businesses to reach a global audience.</p>
            </div>
            <div className="vian-way-cards">
              <div className="vian-way-card fade-in">
                <h3>Tailored Solutions</h3>
                <p>Our solutions are aligned with your business processes and focused on increasing productivity and optimizing cost.</p>
              </div>
              <div className="vian-way-card fade-in">
                <h3>Expert Management</h3>
                <p>Operations are managed by professionals with compliance to best practices and industry standards.</p>
              </div>
              <div className="vian-way-card fade-in">
                <h3>Global Reach</h3>
                <p>We help you expand your business to a global audience with scalable, smart technical solutions.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="our-portals-section" id="portals">
          <div className="our-portals-container">
            <h2 className="our-portals-title">Our Products</h2>
            <div className="our-portals-content">
              <div className="our-portals-img-wrapper">
                <img src="/src/assets/squaress.png" alt="Squaress" className="our-portals-img" />
              </div>
              <div className="our-portals-info">
                <h3>SpareS.com Portal</h3>
                <p>Our portal is designed and launched by Vian Global for marketing, buying, and selling new or used parts and services applicable for the Marine & Offshore industries. The online portal is easy to access and available across website and mobile platforms.</p>
                <a className="our-portals-link" href="#" tabIndex={-1}>Visit Our Portals</a>
              </div>
            </div>
          </div>
        </section>
        <section className="navigator-section" id="navigator">
          <div className="our-portals-container">
            <div className="navigator-content">
              <div className="our-portals-img-wrapper">
                <img src="/src/assets/navigator.jpeg" alt="Navigator" className="navigator-img" />
              </div>
              <div className="navigator-info">
                <h3>Navigator Platform</h3>
                <p>Navigator is our digital platform to help businesses streamline operations, connect globally, and unlock new opportunities. With a focus on innovation and user experience, Navigator empowers your business to thrive in the digital age.</p>
                <a className="our-portals-link" href="#" tabIndex={-1}>Visit Navigator</a>
              </div>
            </div>
          </div>
        </section>
        <section className="services-section" id="services">
          <div className="services-container">
            <h2 className="services-title">Our Services</h2>
            <div className="services-grid">
              {services.map((service, idx) => (
                <div className="service-card" key={idx}>
                  <div className="service-icon">{service.icon}</div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-desc">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="projects-section" id="projects">
          <div className="projects-container">
            <h2 className="projects-title">
              <span className="projects-title-bold">Look Into</span> Our Accomplished <span className="projects-title-bold">Projects</span>
            </h2>
            <div className="projects-gallery" ref={galleryRef}>
              <div className="projects-gallery-track">
                {projectImages.map((img, idx) => (
                  <div className="project-image-card" key={idx}>
                    <img src={img.src} alt={`Project ${idx+1}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="contact-section" id="contact">
          <div className="contact-container">
            <div className="contact-form-area">
              <h2 className="contact-title">Contact Us</h2>
              <form className="contact-form" autoComplete="off" onSubmit={e => e.preventDefault()}>
                <div className="form-row">
                  <input type="text" name="name" placeholder="Your Name" required />
                </div>
                <div className="form-row">
                  <input type="email" name="email" placeholder="Your Email" required />
                </div>
                <div className="form-row">
                  <textarea name="message" placeholder="Your Message" rows={5} required></textarea>
                </div>
                <button type="submit" className="cta-btn">Send Message</button>
              </form>
            </div>
            <div className="contact-info-area">
              <h3>Business Address</h3>
              <p>Vian Global LLP<br/>Chennai, Tamil Nadu, India</p>
              <h3>Phone</h3>
              <p><a href="tel:+919884026978">+91 9884 026 978</a></p>
              <h3>Email</h3>
              <p><a href="mailto:info@vianglobal.net">info@vianglobal.net</a></p>
      </div>
      </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-menus">
            <nav className="footer-nav">
              <a href="#home">Home</a>
              <a href="#about">About</a>
              <a href="#services">Services</a>
              <a href="#projects">Projects</a>
              <a href="#contact">Contact</a>
            </nav>
            <div className="footer-social">
              <a href="https://www.linkedin.com/company/vian-global-llp/" target="_blank" rel="noopener" aria-label="LinkedIn">
                <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><rect width="28" height="28" rx="6" fill="#366a82"/><path d="M8.5 11.5v7h2.25v-7H8.5zm1.125-3.5a1.312 1.312 0 1 0 0 2.625 1.312 1.312 0 0 0 0-2.625zM12.25 11.5v7h2.25v-3.5c0-.966.784-1.75 1.75-1.75s1.75.784 1.75 1.75v3.5H20.5v-4.25c0-2.071-1.679-3.75-3.75-3.75s-3.75 1.679-3.75 3.75z" fill="#fff"/></svg>
              </a>
              <a href="mailto:info@vianglobal.net" aria-label="Email">
                <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><rect width="28" height="28" rx="6" fill="#366a82"/><path d="M7.5 9.5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-9zm2.25.25v.01l4.25 3.25 4.25-3.25v-.01a.75.75 0 0 0-.75-.75h-7a.75.75 0 0 0-.75.75zm8.5 1.82-3.98 3.05a1 1 0 0 1-1.24 0l-3.98-3.05V18a.75.75 0 0 0 .75.75h7a.75.75 0 0 0 .75-.75v-6.43z" fill="#fff"/></svg>
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>&copy; {new Date().getFullYear()} Vian Global LLP. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
