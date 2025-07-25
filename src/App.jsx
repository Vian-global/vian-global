import { useState, useEffect, useRef } from 'react'
import './App.css'
import projectManagementImg from './assets/project management.jpeg'
import conditionEvaluationImg from './assets/Condition Evalution.jpeg'
import businessProcessImg from './assets/business process.jpeg'
import businessDigitalizationImg from './assets/business digitalization.jpeg'
import newVianLogo from './assets/new-vian-logo.png'

const heroImages = [
  '/hero.jpg',
  '/hero2.jpg',
]

const services = [
  {
    bgImage: '/project-slide-1.png',
    title: 'Project Management and Consulting',
    desc: 'Be it Industrial development or business process optimization, we offer expert guidance and project management services during product design, engineering, development and marketing.'
  },
  {
    bgImage: '/project-slide-2.png',
    title: 'Business Digitization and Marketing',
    desc: 'With our existing software development partners, we can take your businesses to next level by developing modernized tools for process optimization, sales & marketing, e-commerce, data compiling & analysis requirements.'
  },
  {
    bgImage: '/project-slide-3.png',
    title: 'Business Process Optimization',
    desc: 'We offer tailored solutions to streamline and improve core business operations by analyzing redesigning and digitizing workflows enabling businesses to increase efficiency, reduce costs, eliminate waste and enhance overall performance.'
  },
  {
    bgImage: '/project-slide-4.png',
    title: 'Condition Assessment and Evaluation',
    desc: 'We specialize in inspecting, analyzing and reporting the physical and operational state of assets, infrastructure or equipment enabling clients to understand the current condition, risks, life expectancy and necessary maintenance or replacement actions for critical assets.'
  }
]

const projectImages = [
  { src: '/project-slide-1.png', name: 'project-slide-1' },
  { src: '/project-slide-2.png', name: 'project-slide-2' },
  { src: '/project-slide-3.png', name: 'project-slide-3' },
  { src: '/project-slide-4.png', name: 'project-slide-4' },
  { src: '/project-slide-5.png', name: 'project-slide-5' },
]

function App() {
  const [heroCurrent, setHeroCurrent] = useState(0)
  const [galleryCurrent, setGalleryCurrent] = useState(0)
  const [navOpen, setNavOpen] = useState(false)
  const galleryRef = useRef(null)
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    const fadeEls = document.querySelectorAll('.scroll-fade-in')
    const onScroll = () => {
      fadeEls.forEach(el => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight - 60) {
          el.classList.add('visible')
        }
      })
    }
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Handle body scroll lock when menu is open
  useEffect(() => {
    if (navOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
    
    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [navOpen])

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const formValues = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFormSubmitted(true);
        // Optional: Reset form
        e.target.reset
      } else {
        // Handle error
        alert(result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle navigation close
  const handleNavClose = () => {
    setNavOpen(false)
  }

  // Handle navigation link click
  const handleNavClick = (e) => {
    e.preventDefault()
    const href = e.target.getAttribute('href')
    if (href && href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setNavOpen(false)
  }

  return (
    <>
      <style>{`
        /* PREVENT HORIZONTAL SCROLLING ON ALL DEVICES */
        * {
          box-sizing: border-box !important;
        }
        html, body {
          overflow-x: hidden !important;
          max-width: 100vw !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        #root {
          overflow-x: hidden !important;
          max-width: 100vw !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* MOBILE RESPONSIVE FIXES */
        @media (max-width: 768px) {
          /* Enhanced Hamburger Menu */
          .hamburger {
            width: 48px !important;
            height: 48px !important;
            border-radius: 12px !important;
            background: rgba(255, 255, 255, 0.15) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            position: relative !important;
            z-index: 1003 !important;
            cursor: pointer !important;
          }
          
          .hamburger:hover {
            background: rgba(255, 255, 255, 0.25) !important;
            transform: scale(1.05) !important;
            border-color: rgba(255, 255, 255, 0.4) !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
          }
          
          .hamburger:active {
            transform: scale(0.95) !important;
          }
          
          .hamburger .bar {
            width: 24px !important;
            height: 3px !important;
            background: #fff !important;
            margin: 3px 0 !important;
            border-radius: 3px !important;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
            transform-origin: center !important;
          }
          
          /* Enhanced X icon animation */
          .hamburger.active .bar:nth-child(1) {
            transform: rotate(45deg) translate(7px, 7px) !important;
            background: #fff !important;
          }
          
          .hamburger.active .bar:nth-child(2) {
            opacity: 0 !important;
            transform: translateX(20px) !important;
          }
          
          .hamburger.active .bar:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -7px) !important;
            background: #fff !important;
          }
          
          /* Enhanced Off-Canvas Mobile Navigation */
          .nav {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 280px !important;
            height: 100vh !important;
            background: linear-gradient(135deg, rgba(54, 106, 130, 0.98) 0%, rgba(24, 26, 27, 0.98) 100%) !important;
            backdrop-filter: blur(30px) !important;
            -webkit-backdrop-filter: blur(30px) !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            justify-content: flex-start !important;
            z-index: 1002 !important;
            transform: translateX(-100%) !important;
            transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
            box-shadow: 4px 0 20px rgba(0, 0, 0, 0.3) !important;
            padding: 2rem 0 !important;
            overflow-y: auto !important;
          }
          
          .nav.nav-open {
            transform: translateX(0) !important;
          }
          
          /* Close button for mobile nav */
          .nav-close-btn {
            position: absolute !important;
            top: 1rem !important;
            right: 1rem !important;
            width: 40px !important;
            height: 40px !important;
            background: rgba(255, 255, 255, 0.1) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            z-index: 1003 !important;
          }
          
          .nav-close-btn:hover {
            background: rgba(255, 255, 255, 0.2) !important;
            transform: scale(1.1) !important;
          }
          
          .nav-close-btn::before,
          .nav-close-btn::after {
            content: '' !important;
            position: absolute !important;
            width: 20px !important;
            height: 2px !important;
            background: #fff !important;
            border-radius: 1px !important;
            transition: all 0.3s ease !important;
          }
          
          .nav-close-btn::before {
            transform: rotate(45deg) !important;
          }
          
          .nav-close-btn::after {
            transform: rotate(-45deg) !important;
          }
          
          .nav a {
            color: #fff !important;
            font-size: 1.2rem !important;
            font-family: 'Orbitron', Arial, sans-serif !important;
            font-weight: 600 !important;
            padding: 1rem 2rem !important;
            margin: 0.5rem 0 !important;
            text-align: left !important;
            border-radius: 0 !important;
            background: transparent !important;
            border: none !important;
            border-left: 3px solid transparent !important;
            width: 100% !important;
            min-width: auto !important;
            transition: all 0.3s ease !important;
            letter-spacing: 0.5px !important;
            text-decoration: none !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            position: relative !important;
            overflow: hidden !important;
            touch-action: manipulation !important;
            -webkit-tap-highlight-color: transparent !important;
            display: block !important;
            box-sizing: border-box !important;
          }
          
          .nav a:hover, .nav a:active, .nav a:focus {
            background: rgba(255, 255, 255, 0.1) !important;
            border-left-color: var(--accent) !important;
            color: var(--accent) !important;
            transform: translateX(10px) !important;
            box-shadow: none !important;
          }
          
          /* Navigation header */
          .nav-header {
            width: 100% !important;
            padding: 0 2rem 1rem 2rem !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
            margin-bottom: 1rem !important;
          }
          
          .nav-header h3 {
            color: #fff !important;
            font-size: 1.1rem !important;
            font-weight: 600 !important;
            margin: 0 !important;
            opacity: 0.8 !important;
          }
          
          .nav a::before {
            content: '' !important;
            position: absolute !important;
            top: 0 !important;
            left: -100% !important;
            width: 100% !important;
            height: 100% !important;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent) !important;
            transition: left 0.5s ease !important;
          }
          
          .nav a:hover::before {
            left: 100% !important;
          }
          
          /* Navigation overlay */
          .nav-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: rgba(0, 0, 0, 0.6) !important;
            z-index: 1001 !important;
            backdrop-filter: blur(2px) !important;
            -webkit-backdrop-filter: blur(2px) !important;
            cursor: pointer !important;
            transition: opacity 0.3s ease !important;
            opacity: 0 !important;
            visibility: hidden !important;
            display: none !important;
          }
          
          .nav-overlay.active {
            opacity: 1 !important;
            visibility: visible !important;
            display: block !important;
          }
          
          /* Enhanced animations */
          @keyframes slideInNavLink {
            to {
              transform: translateY(0) !important;
              opacity: 1 !important;
            }
          }
          
          /* Improved hero section for mobile */
          .hero-section {
            padding-top: 80px !important;
            min-height: 100vh !important;
            height: 100vh !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            position: relative !important;
            overflow: hidden !important;
          }
          
          .hero-bg {
            background-size: cover !important;
            background-position: center center !important;
            background-attachment: scroll !important;
            width: 100% !important;
            height: 100% !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            z-index: 0 !important;
          }
          
          .hero-overlay {
            background: linear-gradient(135deg, rgba(20, 40, 60, 0.7) 0%, rgba(54, 106, 130, 0.6) 100%) !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            z-index: 1 !important;
          }
          
          .hero-content {
            text-align: center !important;
            padding: 0 1.5rem !important;
            max-width: 95% !important;
            width: 100% !important;
            z-index: 2 !important;
            position: relative !important;
          }
          
          .hero-content h1 {
            font-size: 2.2rem !important;
            line-height: 1.3 !important;
            margin-bottom: 2rem !important;
            text-align: center !important;
            font-weight: 800 !important;
            text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
            max-width: 100% !important;
            color: #fff !important;
          }
          
          .hero-content .cta-btn {
            font-size: 1.2rem !important;
            padding: 1.3rem 2.8rem !important;
            margin-top: 1.5rem !important;
            border-radius: 30px !important;
            box-shadow: 0 8px 30px rgba(54, 106, 130, 0.4) !important;
            min-height: 56px !important;
            width: auto !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%) !important;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
          
          .hero-content .cta-btn:hover {
            transform: translateY(-3px) scale(1.05) !important;
            box-shadow: 0 15px 40px rgba(54, 106, 130, 0.5) !important;
          }
          
          /* Enhanced section spacing */
          .vian-way-section, .our-portals-section, .navigator-section, 
          .services-section, .projects-section, .contact-section {
            padding: 4rem 1.5rem !important;
            position: relative !important;
            width: 100% !important;
            max-width: 100vw !important;
            overflow-x: hidden !important;
            margin: 0 !important;
            left: 0 !important;
            right: 0 !important;
          }
          
          /* Enhanced typography */
          .services-title, .our-portals-title, .projects-title, 
          .contact-title, .navigator-title, .vian-way-header h2 {
            font-size: 2.2rem !important;
            margin-bottom: 2.5rem !important;
            text-align: center !important;
            line-height: 1.2 !important;
            font-weight: 800 !important;
            letter-spacing: 1px !important;
          }
          
          /* Enhanced touch targets and interactions */
          .cta-btn, .our-portals-link, .navigator-link, 
          .contact-form button, .footer-nav a, .nav a {
            min-height: 48px !important;
            min-width: 48px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
            line-height: 1 !important;
            touch-action: manipulation !important;
            -webkit-tap-highlight-color: transparent !important;
          }
          
          /* Enhanced form elements */
          .contact-form input, .contact-form textarea {
            min-height: 48px !important;
            font-size: 16px !important;
            padding: 1.2rem 1.5rem !important;
            border-radius: 12px !important;
            touch-action: manipulation !important;
            -webkit-appearance: none !important;
          }
        }
        
        /* Extra small screens */
        @media (max-width: 414px) {
          .nav a {
            font-size: 1.1rem !important;
            padding: 1rem 2rem !important;
            min-width: 250px !important;
          }
          
          .hero-content h1 {
            font-size: 1.9rem !important;
          }
          
          .hero-content .cta-btn {
            font-size: 1.1rem !important;
            padding: 1.1rem 2.3rem !important;
          }
          
          .services-title, .our-portals-title, .projects-title, 
          .contact-title, .navigator-title, .vian-way-header h2 {
            font-size: 1.9rem !important;
          }
        }
        
        /* Very small screens */
        @media (max-width: 375px) {
          .nav a {
            font-size: 1rem !important;
            padding: 0.9rem 1.8rem !important;
            min-width: 220px !important;
          }
          
          .hero-content h1 {
            font-size: 1.7rem !important;
          }
          
          .hamburger {
            width: 44px !important;
            height: 44px !important;
          }
          
          .hamburger .bar {
            width: 20px !important;
            height: 2px !important;
          }
        }
        
        /* Enhanced Project Gallery for Mobile */
        @media (max-width: 768px) {
          .project-image-card {
            min-width: 320px !important;
            max-width: 320px !important;
            border-radius: 16px !important;
            overflow: hidden !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
            background: #fff !important;
            margin: 0 1rem !important;
          }
          
          .project-image-card img {
            height: 240px !important;
            width: 100% !important;
            object-fit: cover !important;
            display: block !important;
            border-radius: 16px !important;
            transition: transform 0.3s ease !important;
          }
          
          .project-image-card:hover img {
            transform: scale(1.05) !important;
          }
          
          .projects-gallery {
            padding: 1rem 0 !important;
            margin: 0 -1rem !important;
          }
          
          .projects-gallery-track {
            gap: 1.5rem !important;
            padding: 0 1rem !important;
          }
          
          /* Enhanced Contact Form Layout */
          .contact-container {
            flex-direction: column !important;
            gap: 2rem !important;
            padding: 0 1rem !important;
            max-width: 100% !important;
          }
          
          .contact-form-area, .contact-info-area {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 2.5rem 2rem !important;
            border-radius: 20px !important;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
            background: #fff !important;
            border: 2px solid #e8f4f8 !important;
            position: relative !important;
            overflow: hidden !important;
          }
          
          .contact-form-area::before, .contact-info-area::before {
            content: '' !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            height: 4px !important;
            background: linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%) !important;
          }
          
          .contact-form {
            width: 100% !important;
          }
          
          .form-row {
            margin-bottom: 1.5rem !important;
            width: 100% !important;
          }
          
          .contact-form input, .contact-form textarea {
            width: 100% !important;
            box-sizing: border-box !important;
            font-size: 16px !important;
            padding: 1.3rem 1.8rem !important;
            border-radius: 12px !important;
            border: 2px solid #e8f4f8 !important;
            background: #f8fcff !important;
            margin-bottom: 0 !important;
            font-family: 'Montserrat', Arial, sans-serif !important;
            color: var(--dark) !important;
            transition: all 0.3s ease !important;
            outline: none !important;
          }
          
          .contact-form input:focus, .contact-form textarea:focus {
            border-color: var(--primary) !important;
            background: #fff !important;
            box-shadow: 0 0 0 4px rgba(54, 106, 130, 0.1) !important;
            transform: translateY(-1px) !important;
          }
          
          .contact-form input::placeholder, .contact-form textarea::placeholder {
            color: #94a3b8 !important;
            font-weight: 500 !important;
          }
          
          .contact-form textarea {
            min-height: 120px !important;
            resize: vertical !important;
          }
          
          .contact-form button {
            width: 100% !important;
            padding: 1.2rem 2rem !important;
            font-size: 1.1rem !important;
            font-weight: 700 !important;
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%) !important;
            color: #fff !important;
            border: none !important;
            border-radius: 16px !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            margin-top: 1rem !important;
            min-height: 56px !important;
          }
          
          .contact-form button:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 25px rgba(54, 106, 130, 0.3) !important;
          }
          
          .contact-info-area {
            margin-top: 1rem !important;
          }
          
          .contact-info-area h3 {
            font-size: 1.3rem !important;
            margin-top: 1.5rem !important;
            margin-bottom: 0.8rem !important;
            color: var(--primary) !important;
            font-weight: 700 !important;
          }
          
          .contact-info-area h3:first-child {
            margin-top: 0 !important;
          }
          
          .contact-info-area p {
            font-size: 1.1rem !important;
            line-height: 1.6 !important;
            margin-bottom: 1rem !important;
            color: var(--dark) !important;
          }
          
          .contact-info-area a {
            color: var(--primary) !important;
            text-decoration: none !important;
            font-weight: 600 !important;
            transition: color 0.3s ease !important;
          }
          
          .contact-info-area a:hover {
            color: var(--accent) !important;
          }
          
          /* Enhanced Footer for Mobile */
          .footer-menus {
            flex-direction: column !important;
            gap: 2rem !important;
            align-items: flex-start !important;
            width: 100% !important;
            padding: 0 !important;
          }
          
          .footer-nav {
            flex-direction: column !important;
            gap: 0.8rem !important;
            align-items: flex-start !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .footer-nav a {
            background: none !important;
            border: none !important;
            padding: 0.6rem 0 !important;
            margin: 0 !important;
            font-size: 1.1rem !important;
            color: #f3f3f3 !important;
            text-decoration: none !important;
            font-weight: 500 !important;
            letter-spacing: 0.5px !important;
            min-width: auto !important;
            min-height: auto !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            transition: color 0.3s ease !important;
            display: block !important;
            width: 100% !important;
            text-align: left !important;
            position: relative !important;
          }
          
          .footer-nav a:hover {
            background: none !important;
            color: var(--accent) !important;
            transform: none !important;
            box-shadow: none !important;
            padding-left: 5px !important;
          }
          
          .footer-nav a::before {
            content: '•' !important;
            position: absolute !important;
            left: -15px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            color: var(--accent) !important;
            opacity: 0 !important;
            transition: opacity 0.3s ease !important;
          }
          
          .footer-nav a:hover::before {
            opacity: 1 !important;
          }
          
          .footer-social {
            justify-content: flex-start !important;
            gap: 1rem !important;
            margin-top: 1rem !important;
          }
          
          .footer-bottom {
            margin-top: 2rem !important;
            text-align: left !important;
            width: 100% !important;
          }
        }
      `}</style>
      <header className="header simple-header">
        <div className="header-logo">
          <img 
            src={newVianLogo} 
            alt="Vian Global Logo" 
            className="header-logo-img"
            loading="eager"
            width="200"
            height="200"
          />
        </div>
        <button 
          className={`hamburger ${navOpen ? 'active' : ''}`} 
          onClick={() => setNavOpen(!navOpen)} 
          aria-label={navOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={navOpen}
          aria-controls="main-navigation"
          type="button"
        >
          <span className="bar" aria-hidden="true"></span>
          <span className="bar" aria-hidden="true"></span>
          <span className="bar" aria-hidden="true"></span>
        </button>
        <nav 
          className={`nav${navOpen ? ' nav-open' : ''}`}
          id="main-navigation"
          role="navigation"
          aria-label="Main navigation"
        >
          <button 
            className="nav-close-btn" 
            onClick={handleNavClose}
            aria-label="Close navigation menu"
            type="button"
          ></button>
          <div className="nav-header">
            <h3>Navigation Menu</h3>
          </div>
          <a href="#home" onClick={handleNavClick} role="menuitem">Home</a>
          <a href="#about" onClick={handleNavClick} role="menuitem">About</a>
          <a href="#services" onClick={handleNavClick} role="menuitem">Services</a>
          <a href="#projects" onClick={handleNavClick} role="menuitem">Projects</a>
          <a href="#contact" onClick={handleNavClick} role="menuitem">Contact</a>
        </nav>
        {navOpen && (
          <div 
            className={`nav-overlay ${navOpen ? 'active' : ''}`} 
            onClick={handleNavClose}
            aria-hidden="true"
          ></div>
        )}
      </header>
      <main role="main">
        <section className="hero-section" id="home">
          <div
            className="hero-bg"
            style={{
              backgroundImage: `url(${heroImages[heroCurrent]})`,
            }}
            role="img"
            aria-label="Hero background image"
          />
          <div className="hero-overlay" aria-hidden="true" />
          <div className="hero-content">
            <h1 className="scroll-fade-in">
              Empowering Businesses with Smart,<br />
              Scalable Technical Solutions
            </h1>
            <a 
              href="#contact" 
              className="cta-btn scroll-fade-in"
              onClick={handleNavClick}
              role="button"
              aria-label="Get started with our services"
            >
              Get Started
            </a>
          </div>
        </section>
        
        <section className="vian-way-section" id="about">
          <div className="vian-way-container">
            <div className="vian-way-header">
              <h2 className="scroll-fade-in">The Vian Way</h2>
              <p className="vian-way-lead scroll-fade-in">
                Professional technical solutions for businesses to reach a global audience.
              </p>
            </div>
            <div className="vian-way-cards">
              <div className="vian-way-card scroll-fade-in">
                <h3>Tailored Solutions</h3>
                <p>Solutions are aligned with business processes and focused on increasing productivity and optimizing cost.</p>
              </div>
              <div className="vian-way-card scroll-fade-in">
                <h3>Expert Management</h3>
                <p>Our operations are managed by professionals with compliance to best practices and industry standards.</p>
              </div>
              <div className="vian-way-card scroll-fade-in">
                <h3>Consistent Quality</h3>
                <p>We ensure high sense of quality across all levels of our work to align with internationally recognized benchmarks.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="our-portals-section" id="portals">
          <div className="our-portals-container">
            <h2 className="our-portals-title scroll-fade-in">Our Products</h2>
            <div className="our-portals-content">
              <div className="our-portals-img-wrapper scroll-fade-in">
                <img 
                  src="/sqaress.com.jpeg" 
                  alt="Sparess.com Portal - Marine & Offshore parts marketplace" 
                  className="our-portals-img"
                  loading="lazy"
                  width="320"
                  height="240"
                />
              </div>
              <div className="our-portals-info scroll-fade-in">
                <h3>Sparess.com Portal</h3>
                <p>Designed and launched by Vian Global for marketing, buying, and selling new or used parts and services applicable for the Marine & Offshore industries. The online portal is easy to access and available across website and mobile platforms.</p>
                <a 
                  className="our-portals-link" 
                  href="https://sparess.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Visit Sparess.com portal (opens in new tab)"
                >
                  Visit Our Portal
                </a>
              </div>
            </div>
          </div>
        </section>
        
        <section className="navigator-section" id="navigator">
          <div className="our-portals-container">
            <div className="navigator-content">
              <div className="our-portals-img-wrapper scroll-fade-in">
                <img 
                  src="/navigator.jpeg" 
                  alt="NavigatorsRus - Global marketing portal" 
                  className="navigator-img"
                  loading="lazy"
                  width="320"
                  height="240"
                />
              </div>
              <div className="navigator-info scroll-fade-in">
                <h3>NavigatorsRus</h3>
                <p>NavigatorsRus online marketing portal is fully developed by Vian Global for UAE client. The portal is a gateway for effortlessly marketing products and services to a global audience. It connects buyers and sellers from every corner of the globe enabling boosting sales.<br/><br/>VIAN developed the concept, finalized UI, designed the portal and integrated third party services necessary for a fully functional portal. The portal operates as website and mobile app.</p>
                <a 
                  className="our-portals-link" 
                  href="https://navigatorsrus.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Visit NavigatorsRus portal (opens in new tab)"
                >
                  Visit NavigatorsRus
                </a>
              </div>
            </div>
          </div>
        </section>
        
        <section className="services-section" id="services">
          <div className="services-container">
            <h2 className="services-title scroll-fade-in">Our Services</h2>
            <div className="services-content">
              <div className="service-card-custom scroll-fade-in">
                <div className="accent-bar" aria-hidden="true" />
                <img 
                  src={projectManagementImg} 
                  alt="Project Management and Consulting" 
                  className="service-img"
                  loading="lazy"
                  width="120"
                  height="120"
                />
                <div className="service-info">
                  <h3>Project Management and Consulting</h3>
                  <p>Be it Industrial development or business process optimization, we offer expert guidance and project management services during product design, engineering, development and marketing.</p>
                </div>
              </div>
              <div className="service-card-custom scroll-fade-in reverse">
                <div className="accent-bar" aria-hidden="true" />
                <img 
                  src={conditionEvaluationImg} 
                  alt="Condition Assessment and Evaluation" 
                  className="service-img"
                  loading="lazy"
                  width="120"
                  height="120"
                />
                <div className="service-info">
                  <h3>Condition Assessment and Evaluation</h3>
                  <p>We specialize in inspecting, analyzing and reporting the physical and operational state of assets, infrastructure or equipment enabling clients to understand the current condition, risks, life expectancy and necessary maintenance or replacement actions for critical assets.</p>
                </div>
              </div>
              <div className="service-card-custom scroll-fade-in">
                <div className="accent-bar" aria-hidden="true" />
                <img 
                  src={businessProcessImg} 
                  alt="Business Process Optimization" 
                  className="service-img"
                  loading="lazy"
                  width="120"
                  height="120"
                />
                <div className="service-info">
                  <h3>Business Process Optimization</h3>
                  <p>We offer tailored solutions to streamline and improve core business operations by analyzing redesigning and digitizing workflows enabling businesses to increase efficiency, reduce costs, eliminate waste and enhance overall performance.</p>
                </div>
              </div>
              <div className="service-card-custom scroll-fade-in reverse">
                <div className="accent-bar" aria-hidden="true" />
                <img 
                  src={businessDigitalizationImg} 
                  alt="Business Digitalization and Marketing" 
                  className="service-img"
                  loading="lazy"
                  width="120"
                  height="120"
                />
                <div className="service-info">
                  <h3>Business Digitalization and Marketing</h3>
                  <p>With our existing software development partners, we can take your businesses to next level by developing modernized tools for process optimization, sales & marketing, e-commerce, data compiling & analysis requirements.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="projects-section" id="projects">
          <div className="projects-container">
            <h2 className="projects-title scroll-fade-in">
              <span className="projects-title-bold">Look Into</span> Our Accomplished <span className="projects-title-bold">Projects</span>
            </h2>
            <div className="projects-gallery" ref={galleryRef} role="region" aria-label="Project gallery">
              <div className="projects-gallery-track">
                {projectImages.map((img, idx) => (
                  <div className="project-image-card scroll-fade-in" key={idx}>
                    <img 
                      src={img.src} 
                      alt={`Project ${idx+1}: ${img.name}`}
                      loading="lazy"
                      width="380"
                      height="270"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        <section className="contact-section" id="contact">
          <div className="contact-container">
            <div className="contact-form-area scroll-fade-in">
              <h2 className="contact-title">Contact Us</h2>
              {formSubmitted ? (
                <div className="thank-you-message scroll-fade-in">
                  <h3>Thank you!</h3>
                  <p>Your message has been sent. We appreciate your interest and will get back to you soon.</p>
                </div>
              ) : (
                <form className="contact-form" autoComplete="off" onSubmit={handleFormSubmit} noValidate>
                  <div className="form-row">
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="Your Name" 
                      required 
                      className="scroll-fade-in"
                      aria-label="Your name"
                      autoComplete="name"
                    />
                  </div>
                  <div className="form-row">
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="Your Email" 
                      required 
                      className="scroll-fade-in"
                      aria-label="Your email address"
                      autoComplete="email"
                    />
                  </div>
                  <div className="form-row">
                    <textarea 
                      name="message" 
                      placeholder="Your Message" 
                      rows={5} 
                      required 
                      className="scroll-fade-in"
                      aria-label="Your message"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="cta-btn scroll-fade-in" 
                    disabled={isSubmitting}
                    aria-label={isSubmitting ? 'Sending message...' : 'Send message'}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
            <div className="contact-info-area scroll-fade-in">
              <h3>Business Address</h3>
              <p>Vian Global LLP<br/>Chennai, Tamil Nadu, India</p>
              <h3>Phone</h3>
              <p><a href="tel:+919884026978" aria-label="Call us at +91 9884 026 978">+91 9884 026 978</a></p>
              <h3>Email</h3>
              <p><a href="mailto:vianglobal@icloud.com" aria-label="Send email to vianglobal@icloud.com">vianglobal@icloud.com</a></p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="site-footer" role="contentinfo">
        <div className="footer-container">
          <div className="footer-menus">
            <nav className="footer-nav scroll-fade-in" role="navigation" aria-label="Footer navigation">
              <a href="#home" onClick={handleNavClick}>Home</a>
              <a href="#about" onClick={handleNavClick}>About</a>
              <a href="#services" onClick={handleNavClick}>Services</a>
              <a href="#projects" onClick={handleNavClick}>Projects</a>
              <a href="#contact" onClick={handleNavClick}>Contact</a>
            </nav>
            <div className="footer-social scroll-fade-in" role="list" aria-label="Social media links">
              <a 
                href="https://www.instagram.com/viangloballlp/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Follow us on Instagram (opens in new tab)"
                role="listitem"
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 28 28" aria-hidden="true">
                  <rect width="28" height="28" rx="6" fill="#366a82"/>
                  <g transform="translate(6, 6)">
                    <rect x="0" y="0" width="16" height="16" rx="5.33" fill="none" stroke="#fff" strokeWidth="1.5"/>
                    <circle cx="8" cy="8" r="3.5" fill="none" stroke="#fff" strokeWidth="1.5"/>
                    <circle cx="12.5" cy="3.5" r="1" fill="#fff"/>
                  </g>
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/company/vian-global-llp/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Connect with us on LinkedIn (opens in new tab)"
                role="listitem"
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 28 28" aria-hidden="true">
                  <rect width="28" height="28" rx="6" fill="#366a82"/>
                  <path d="M8.5 11.5v7h2.25v-7H8.5zm1.125-3.5a1.312 1.312 0 1 0 0 2.625 1.312 1.312 0 0 0 0-2.625zM12.25 11.5v7h2.25v-3.5c0-.966.784-1.75 1.75-1.75s1.75.784 1.75 1.75v3.5H20.5v-4.25c0-2.071-1.679-3.75-3.75-3.75s-3.75 1.679-3.75 3.75z" fill="#fff"/>
                </svg>
              </a>
              <a 
                href="mailto:vianglobal@icloud.com" 
                aria-label="Send us an email"
                role="listitem"
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 28 28" aria-hidden="true">
                  <rect width="28" height="28" rx="6" fill="#366a82"/>
                  <path d="M7.5 9.5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-9zm2.25.25v.01l4.25 3.25 4.25-3.25v-.01a.75.75 0 0 0-.75-.75h-7a.75.75 0 0 0-.75.75zm8.5 1.82-3.98 3.05a1 1 0 0 1-1.24 0l-3.98-3.05V18a.75.75 0 0 0 .75.75h7a.75.75 0 0 0 .75-.75v-6.43z" fill="#fff"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="footer-bottom scroll-fade-in">
            <span>&copy; {new Date().getFullYear()} Vian Global LLP. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App