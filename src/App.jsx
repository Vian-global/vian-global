import { useState, useEffect, useRef } from 'react'
import './App.css'
import projectManagementImg from './assets/project management.jpeg'
import conditionEvaluationImg from './assets/Condition Evalution.jpeg'
import businessProcessImg from './assets/business process.jpeg'
import businessDigitalizationImg from './assets/business digitalization.jpeg'
import newVianLogo from './assets/new-vian-logo.png'

// Mobile optimization styles
const mobileStyles = `
  @media (max-width: 768px) {
    html { scroll-behavior: smooth; -webkit-overflow-scrolling: touch; }
    .hero-section { padding-top: 70px !important; overflow: hidden !important; }
    .hero-bg { height: 110% !important; top: -5% !important; position: absolute !important; }
    .hero-content h1 { font-size: 1.8rem !important; text-align: center !important; }
    .vian-way-section { padding: 2rem 1rem !important; }
    .vian-way-container { padding: 0 0.5rem !important; }
    .vian-way-header h2 { font-size: 1.8rem !important; }
    .vian-way-lead { font-size: 0.95rem !important; }
    .vian-way-card { padding: 1.3rem 1rem !important; }
    .vian-way-card h3 { font-size: 1.1rem !important; }
    .vian-way-card p { font-size: 0.9rem !important; }
    .our-portals-section, .navigator-section, .services-section { padding: 2rem 1rem !important; }
    .projects-title, .projects-title-bold { font-size: 1.8rem !important; }
    .project-image-card { min-width: 300px !important; max-width: 300px !important; }
    .project-image-card img { height: 220px !important; }
    .contact-section { padding: 2rem 0 !important; }
    .contact-container { padding: 0 1rem !important; }
    .contact-form-area, .contact-info-area { padding: 1.8rem 1.3rem !important; }
    .contact-title { font-size: 1.8rem !important; }
    .services-title, .our-portals-title, .navigator-title { font-size: 1.8rem !important; }
  }
`;

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
      document.body.classList.add('nav-open')
    } else {
      document.body.classList.remove('nav-open')
    }
    
    // Cleanup on component unmount
    return () => {
      document.body.classList.remove('nav-open')
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
        
        /* Fix all container elements */
        .header, .simple-header, main, section, .container, 
        .vian-way-container, .our-portals-container, .navigator-container,
        .services-container, .projects-container, .contact-container,
        .footer-container {
          overflow-x: hidden !important;
          max-width: 100vw !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
        
        @media (max-width: 768px) {
          /* Enhanced Mobile Scrolling */
          html { 
            scroll-behavior: smooth !important; 
            -webkit-overflow-scrolling: touch !important;
            overflow-x: hidden !important;
            max-width: 100vw !important;
            width: 100% !important;
            height: 100% !important;
          }
          body { 
            -webkit-overflow-scrolling: touch !important;
            overflow-x: hidden !important;
            max-width: 100vw !important;
            width: 100% !important;
            overscroll-behavior: none !important;
            -webkit-overscroll-behavior: none !important;
            touch-action: pan-y !important;
            -webkit-touch-action: pan-y !important;
            position: relative !important;
            min-height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          * {
            -webkit-overflow-scrolling: touch !important;
            overscroll-behavior: auto !important;
            -webkit-overscroll-behavior: auto !important;
            box-sizing: border-box !important;
            max-width: 100% !important;
          }
          
          /* Fix container scrolling */
          #root {
            overflow-x: hidden !important;
            max-width: 100vw !important;
            width: 100% !important;
            min-height: 100vh !important;
            -webkit-overflow-scrolling: touch !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* FIXED HAMBURGER MENU */
          .header, .simple-header {
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 1rem 1.5rem !important;
            min-height: 70px !important;
            height: 70px !important;
            background: var(--primary) !important;
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1) !important;
            border-radius: 0 !important;
            position: fixed !important;
            width: 100vw !important;
            max-width: 100vw !important;
            box-sizing: border-box !important;
            z-index: 1000 !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            overflow: hidden !important;
            -webkit-overflow-scrolling: touch !important;
            margin: 0 !important;
          }
          
          .header-logo {
            display: flex !important;
            align-items: center !important;
            margin: 0 !important;
            overflow: hidden !important;
          }
          
          .header-logo-img {
            height: 50px !important;
            margin: 0 !important;
            background: transparent !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            filter: brightness(1.1) contrast(1.05) !important;
            max-width: 100% !important;
          }
          
          .hamburger {
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            width: 44px !important;
            height: 44px !important;
            background: rgba(255, 255, 255, 0.15) !important;
            border: none !important;
            border-radius: 8px !important;
            cursor: pointer !important;
            z-index: 1002 !important;
            position: relative !important;
            transition: all 0.3s ease !important;
            overflow: hidden !important;
          }
          
          .hamburger:hover {
            background: rgba(255, 255, 255, 0.2) !important;
            transform: scale(1.05) !important;
          }
          
          .hamburger .bar {
            width: 22px !important;
            height: 2px !important;
            background: #fff !important;
            margin: 2px 0 !important;
            border-radius: 2px !important;
            transition: all 0.3s ease !important;
          }
          
          .hamburger.active .bar:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px) !important;
          }
          
          .hamburger.active .bar:nth-child(2) {
            opacity: 0 !important;
          }
          
          .hamburger.active .bar:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px) !important;
          }

          /* Mobile Navigation */
          .nav {
            display: none !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100vw !important;
            max-width: 100vw !important;
            height: 100vh !important;
            background: linear-gradient(135deg, rgba(54, 106, 130, 0.98) 0%, rgba(24, 26, 27, 0.98) 100%) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 0 !important;
            z-index: 1001 !important;
            gap: 1.5rem !important;
            transform: translateX(-100%) !important;
            transition: transform 0.3s ease-out !important;
            overflow: hidden !important;
            margin: 0 !important;
          }
          
          .nav.nav-open {
            display: flex !important;
            transform: translateX(0) !important;
          }
          
          .nav a {
            color: #fff !important;
            font-size: 1.2rem !important;
            font-family: 'Orbitron', Arial, sans-serif !important;
            font-weight: 700 !important;
            padding: 0.8rem 2rem !important;
            margin: 0.3rem 0 !important;
            text-align: center !important;
            border-radius: 12px !important;
            background: rgba(255, 255, 255, 0.1) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            min-width: 220px !important;
            max-width: 280px !important;
            transition: all 0.3s ease !important;
            letter-spacing: 1px !important;
            text-decoration: none !important;
            box-sizing: border-box !important;
          }
          
          .nav a:hover, .nav a:active {
            background: rgba(255, 255, 255, 0.2) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2) !important;
          }
          
          .nav-overlay {
            position: fixed !important;
            top: 0 !important; 
            left: 0 !important; 
            right: 0 !important; 
            bottom: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: rgba(0, 0, 0, 0.5) !important;
            z-index: 1000 !important;
            backdrop-filter: blur(2px) !important;
            -webkit-backdrop-filter: blur(2px) !important;
            cursor: pointer !important;
            opacity: 0 !important;
            transition: opacity 0.3s ease !important;
            overflow: hidden !important;
          }
          
          .nav-overlay.active {
            opacity: 1 !important;
          }
          
          /* Hero Section - More Compact */
          .hero-section { 
            padding-top: 70px !important; 
            overflow: hidden !important;
            min-height: 85vh !important;
            height: 85vh !important;
            -webkit-overflow-scrolling: touch !important;
            width: 100vw !important;
            max-width: 100vw !important;
            margin: 0 !important;
            box-sizing: border-box !important;
          }
          .hero-bg { 
            height: 110% !important; 
            top: -5% !important; 
            position: absolute !important;
            width: 100% !important;
            max-width: 100% !important;
            overflow: hidden !important;
          }
          .hero-content { 
            width: 100% !important;
            max-width: 90% !important;
            margin: 0 auto !important;
            padding: 0 1rem !important;
            box-sizing: border-box !important;
          }
          .hero-content h1 { 
            font-size: 1.7rem !important; 
            text-align: center !important; 
            line-height: 1.3 !important;
            margin-bottom: 1rem !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .hero-content .cta-btn {
            font-size: 0.95rem !important;
            padding: 0.8rem 1.8rem !important;
            margin-top: 1rem !important;
            min-height: 42px !important;
            border-radius: 22px !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          
          /* All Sections - No Horizontal Scroll */
          .vian-way-section, .our-portals-section, .navigator-section, 
          .services-section, .projects-section, .contact-section {
            -webkit-overflow-scrolling: touch !important;
            overflow-x: hidden !important;
            overflow-y: visible !important;
            position: relative !important;
            width: 100vw !important;
            max-width: 100vw !important;
            margin: 0 !important;
            box-sizing: border-box !important;
          }
          
          /* Vian Way Section - REDUCED BOX HEIGHT */
          .vian-way-section { 
            padding: 1.5rem 1rem !important; 
            background: linear-gradient(135deg, #ddf3fe 60%, #89d0ee 100%) !important;
          }
          .vian-way-container { 
            padding: 0 0.8rem !important; 
            max-width: 100% !important;
            width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
          }
          .vian-way-header { 
            text-align: center !important;
            margin-bottom: 1.2rem !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .vian-way-header h2 { 
            font-size: 1.8rem !important; 
            margin-bottom: 0.6rem !important;
            color: var(--primary) !important;
            font-weight: 800 !important;
            width: 100% !important;
          }
          .vian-way-lead { 
            font-size: 0.9rem !important; 
            padding: 0 0.5rem !important;
            text-align: center !important;
            line-height: 1.3 !important;
            color: var(--primary) !important;
            margin: 0 auto !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .vian-way-cards { 
            gap: 0.8rem !important; 
            margin-bottom: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .vian-way-card { 
            padding: 0.8rem 0.6rem !important; 
            margin-bottom: 0 !important;
            text-align: center !important;
            width: 100% !important;
            max-width: 300px !important;
            min-height: auto !important;
            height: auto !important;
            background: #926f47 !important;
            color: #fff !important;
            border-radius: 14px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            box-sizing: border-box !important;
          }
          .vian-way-card h3 { 
            font-size: 1rem !important; 
            margin-bottom: 0.4rem !important;
            text-align: center !important;
            color: #fff !important;
            font-weight: 700 !important;
            line-height: 1.2 !important;
            width: 100% !important;
          }
          .vian-way-card p { 
            font-size: 0.8rem !important; 
            line-height: 1.3 !important; 
            margin: 0 !important;
            text-align: center !important;
            color: #fff !important;
            font-weight: 500 !important;
            width: 100% !important;
          }

          /* Products Section - CENTERED BOXES WITH OPTIMIZED BUTTONS */
          .our-portals-section, .navigator-section { 
            padding: 1.2rem 1rem !important; 
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }
          .our-portals-container, .navigator-container {
            max-width: 100% !important;
            width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            padding: 0 0.5rem !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
          }
          .our-portals-title, .navigator-title {
            font-size: 1.8rem !important;
            margin-bottom: 1rem !important;
            padding: 0 0.5rem !important;
            text-align: center !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .our-portals-content, .navigator-content { 
            padding: 1.2rem 1rem !important; 
            gap: 1rem !important;
            border-radius: 14px !important;
            min-height: auto !important;
            height: auto !important;
            width: 100% !important;
            max-width: 340px !important;
            margin: 0 auto !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            box-sizing: border-box !important;
          }
          .our-portals-img, .navigator-img {
            width: 100% !important;
            max-width: 100% !important;
            height: 160px !important;
            object-fit: cover !important;
            border-radius: 10px !important;
          }
          .our-portals-info, .navigator-info {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .our-portals-info h3, .navigator-info h3 { 
            font-size: 1.1rem !important; 
            margin-bottom: 0.6rem !important;
            text-align: center !important;
            width: 100% !important;
          }
          .our-portals-info p, .navigator-info p { 
            font-size: 0.85rem !important; 
            line-height: 1.4 !important; 
            margin-bottom: 1rem !important;
            text-align: center !important;
            width: 100% !important;
          }
          .our-portals-link {
            font-size: 0.8rem !important;
            padding: 0.7rem 1.2rem !important;
            text-transform: none !important;
            letter-spacing: 0.3px !important;
            white-space: nowrap !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
            border-radius: 20px !important;
            background: var(--primary) !important;
            color: #fff !important;
            text-decoration: none !important;
            font-weight: 700 !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 4px 15px rgba(54, 106, 130, 0.2) !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          .our-portals-link:hover {
            background: var(--accent) !important;
            color: var(--primary) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(54, 106, 130, 0.3) !important;
          }

          /* Services Section - IMPROVED BOXES WITH WIDER WIDTH */
          .services-section { 
            padding: 1.5rem 0.8rem !important; 
          }
          .services-container {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 auto !important;
            padding: 0 0.5rem !important;
            box-sizing: border-box !important;
          }
          .services-title {
            font-size: 1.8rem !important;
            margin-bottom: 1rem !important;
            padding: 0 0.5rem !important;
            width: 100% !important;
            text-align: center !important;
          }
          .service-card-custom { 
            padding: 1rem 1.2rem !important; 
            margin-bottom: 0.8rem !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: auto !important;
            height: auto !important;
            border-radius: 14px !important;
            box-sizing: border-box !important;
          }
          .service-card-custom .service-img { 
            width: 50px !important; 
            height: 50px !important; 
            margin: 0 0 0.8rem 0 !important; 
          }
          .service-card-custom h3 { 
            font-size: 1.05rem !important; 
            margin-bottom: 0.5rem !important;
            padding-right: 0.5rem !important;
            width: 100% !important;
          }
          .service-card-custom p { 
            font-size: 0.85rem !important; 
            line-height: 1.3 !important;
            padding: 0 0.5rem 0 0 !important;
            width: 100% !important;
          }

          /* Projects Section - OPTIMIZED TEXT AND SPACING */
          .projects-section { 
            padding: 1.5rem 0.8rem !important; 
          }
          .projects-container {
            padding: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
          }
          .projects-title { 
            font-size: 1.7rem !important; 
            margin-bottom: 1rem !important; 
            line-height: 1.2 !important;
            text-align: center !important;
            padding: 0 0.5rem !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .projects-title-bold { 
            font-size: 1.7rem !important; 
            font-weight: 900 !important;
            display: inline !important;
          }
          .projects-gallery {
            -webkit-overflow-scrolling: touch !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
            scroll-behavior: smooth !important;
            overscroll-behavior-x: contain !important;
            -webkit-overscroll-behavior-x: contain !important;
            margin-top: 0.5rem !important;
            width: 100% !important;
            max-width: 100vw !important;
            box-sizing: border-box !important;
          }
          .projects-gallery-track {
            display: flex !important;
            gap: 1rem !important;
            padding: 0 1rem !important;
            box-sizing: border-box !important;
          }
          .project-image-card { 
            min-width: 270px !important; 
            max-width: 270px !important;
            flex-shrink: 0 !important;
            box-sizing: border-box !important;
          }
          .project-image-card img { 
            height: 190px !important;
            width: 100% !important;
            object-fit: cover !important;
          }

          /* CONTACT FORM - PHONE COMPATIBLE & CENTERED */
          .contact-section { 
            padding: 1.5rem 0 !important; 
            background: var(--primary) !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            width: 100vw !important;
            max-width: 100vw !important;
            margin: 0 !important;
            box-sizing: border-box !important;
          }
          .contact-container { 
            padding: 0 !important; 
            gap: 1rem !important;
            display: flex !important;
            flex-direction: column !important;
            max-width: 340px !important;
            width: 90% !important;
            margin: 0 auto !important;
            align-items: center !important;
            box-sizing: border-box !important;
          }
          .contact-form-area { 
            padding: 1.5rem 1.2rem !important;
            margin-bottom: 0 !important;
            background: #fff !important;
            border-radius: 16px !important;
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15) !important;
            position: relative !important;
            overflow: visible !important;
            display: block !important;
            visibility: visible !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          .contact-info-area { 
            padding: 1.5rem 1.2rem !important;
            margin-bottom: 0 !important;
            background: #fff !important;
            border-radius: 16px !important;
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15) !important;
            position: relative !important;
            overflow: visible !important;
            display: block !important;
            visibility: visible !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          .contact-title { 
            font-size: 1.6rem !important; 
            margin-bottom: 1.2rem !important;
            text-align: center !important;
            color: var(--primary) !important;
            font-weight: 800 !important;
            display: block !important;
            visibility: visible !important;
            font-family: 'Orbitron', Arial, sans-serif !important;
            letter-spacing: 0.5px !important;
            position: relative !important;
            width: 100% !important;
          }
          .contact-title::after {
            content: '' !important;
            position: absolute !important;
            bottom: -6px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            width: 50px !important;
            height: 2px !important;
            background: linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%) !important;
            border-radius: 2px !important;
          }
          .contact-form {
            display: block !important;
            visibility: visible !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .form-row {
            width: 100% !important;
            max-width: 100% !important;
            margin-bottom: 1rem !important;
            display: block !important;
            position: relative !important;
            box-sizing: border-box !important;
          }
          .contact-form input, .contact-form textarea { 
            font-size: 0.95rem !important; 
            padding: 1.1rem 1.2rem !important; 
            margin-bottom: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            display: block !important;
            border: 2px solid #e8f4f8 !important;
            border-radius: 10px !important;
            background: #f8fcff !important;
            color: var(--dark) !important;
            font-family: 'Montserrat', Arial, sans-serif !important;
            outline: none !important;
            transition: all 0.3s ease !important;
          }
          .contact-form input:focus, .contact-form textarea:focus {
            border: 2px solid var(--primary) !important;
            background: #fff !important;
            box-shadow: 0 0 0 3px rgba(54, 106, 130, 0.1) !important;
            transform: translateY(-1px) !important;
          }
          .contact-form input::placeholder, .contact-form textarea::placeholder {
            color: #94a3b8 !important;
            font-weight: 500 !important;
          }
          .contact-form textarea { 
            min-height: 100px !important;
            resize: vertical !important;
          }
          .contact-form button { 
            padding: 1.1rem 1.5rem !important; 
            font-size: 0.95rem !important; 
            min-height: 46px !important;
            margin-top: 1rem !important;
            width: 100% !important;
            max-width: 100% !important;
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%) !important;
            color: #fff !important;
            border: none !important;
            border-radius: 12px !important;
            font-weight: 800 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 4px 15px rgba(54, 106, 130, 0.3) !important;
            box-sizing: border-box !important;
          }
          .contact-form button:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(54, 106, 130, 0.4) !important;
          }

          /* Contact Info Area */
          .contact-info-area h3 {
            font-size: 1.1rem !important;
            margin-top: 1.2rem !important;
            margin-bottom: 0.6rem !important;
            color: var(--primary) !important;
            font-weight: 800 !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.6rem !important;
            letter-spacing: 0.5px !important;
            width: 100% !important;
          }
          .contact-info-area h3:first-child {
            margin-top: 0 !important;
          }
          .contact-info-area h3::before {
            content: '' !important;
            width: 6px !important;
            height: 6px !important;
            background: linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%) !important;
            border-radius: 50% !important;
            display: inline-block !important;
            box-shadow: 0 1px 4px rgba(54, 106, 130, 0.3) !important;
          }
          .contact-info-area p {
            font-size: 0.9rem !important;
            line-height: 1.5 !important;
            margin-bottom: 1rem !important;
            padding-left: 1.2rem !important;
            color: var(--dark) !important;
            font-weight: 500 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .contact-info-area a {
            color: var(--primary) !important;
            text-decoration: none !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
          }
          .contact-info-area a:hover {
            color: var(--accent) !important;
          }

          /* FOOTER - VERTICAL MENU & REDUCED SPACING */
          .site-footer { 
            background: linear-gradient(135deg, #1a1c1d 0%, #2d3034 100%) !important;
            padding: 1.2rem 0 0.8rem 0 !important;
            width: 100vw !important;
            max-width: 100vw !important;
            margin: 0 !important;
            box-sizing: border-box !important;
          }
          .footer-container { 
            padding: 0 1rem !important; 
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
          }
          .footer-menus {
            flex-direction: column !important;
            gap: 0.8rem !important;
            align-items: flex-start !important;
            margin-bottom: 1rem !important;
            width: 100% !important;
          }
          .footer-nav { 
            display: flex !important;
            flex-direction: column !important;
            gap: 0.6rem !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            justify-content: flex-start !important;
            align-items: flex-start !important;
            overflow: visible !important;
            padding: 0 !important;
          }
          .footer-nav a { 
            font-size: 0.9rem !important; 
            padding: 0.3rem 0 !important;
            border-radius: 0 !important;
            background: none !important;
            text-align: left !important;
            color: #f3f3f3 !important;
            text-decoration: none !important;
            font-weight: 500 !important;
            white-space: nowrap !important;
            border: none !important;
            min-width: auto !important;
            margin: 0 !important;
            display: block !important;
            width: auto !important;
            max-width: 100% !important;
          }
          .footer-nav a:hover {
            color: var(--accent) !important;
            background: none !important;
            transform: none !important;
            box-shadow: none !important;
          }
          .footer-social { 
            justify-content: flex-start !important;
            margin: 0.8rem 0 0.5rem 0 !important; 
            gap: 0.8rem !important;
            width: 100% !important;
          }
          .footer-social a { 
            width: 36px !important; 
            height: 36px !important; 
            margin-right: 0 !important;
          }
          .footer-bottom { 
            text-align: left !important; 
            font-size: 0.8rem !important; 
            margin-top: 0.8rem !important;
            padding-top: 0.8rem !important;
            border-top: 1px solid rgba(137, 208, 238, 0.2) !important;
            width: 100% !important;
            max-width: 100% !important;
          }

          /* Standardized Typography */
          .services-title, .our-portals-title, .navigator-title, .partners-title { 
            font-size: 1.8rem !important; 
            margin-bottom: 1rem !important; 
            padding: 0 0.5rem !important;
            line-height: 1.2 !important;
            width: 100% !important;
            max-width: 100% !important;
          }

          /* Responsive breakpoints */
          @media (max-width: 414px) {
            .hero-content h1 { font-size: 1.6rem !important; }
            .vian-way-card { padding: 0.7rem 0.5rem !important; }
            .service-card-custom { padding: 0.8rem 1rem !important; }
            .contact-container { max-width: 320px !important; width: 95% !important; }
            .contact-form-area, .contact-info-area { padding: 1.2rem 1rem !important; }
            .contact-title { font-size: 1.5rem !important; }
            .our-portals-content, .navigator-content { max-width: 320px !important; }
          }
          @media (max-width: 375px) {
            .hero-content h1 { font-size: 1.5rem !important; }
            .projects-title, .services-title { font-size: 1.6rem !important; }
            .project-image-card { min-width: 250px !important; max-width: 250px !important; }
            .vian-way-card { padding: 0.6rem 0.4rem !important; }
            .contact-container { max-width: 300px !important; }
            .contact-title { font-size: 1.4rem !important; }
            .our-portals-content, .navigator-content { max-width: 300px !important; }
          }
        }
      `}</style>
      <header className="header simple-header">
        <div className="header-logo">
          <img src={newVianLogo} alt="Vian Global Logo" className="header-logo-img" />
        </div>
        <button className={`hamburger ${navOpen ? 'active' : ''}`} onClick={() => setNavOpen(!navOpen)} aria-label="Open navigation">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <nav className={`nav${navOpen ? ' nav-open' : ''}`}>
          <a href="#home" onClick={() => setNavOpen(false)}>Home</a>
          <a href="#about" onClick={() => setNavOpen(false)}>About</a>
          <a href="#services" onClick={() => setNavOpen(false)}>Services</a>
          <a href="#projects" onClick={() => setNavOpen(false)}>Projects</a>
          <a href="#contact" onClick={() => setNavOpen(false)}>Contact</a>
        </nav>
        {navOpen && <div className="nav-overlay" onClick={() => setNavOpen(false)}></div>}
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
            <h1 className="scroll-fade-in">Empowering Businesses with Smart,<br />Scalable Technical Solutions</h1>
            <a href="#contact" className="cta-btn scroll-fade-in">Get Started</a>
          </div>
        </section>
        <section className="vian-way-section" id="about">
          <div className="vian-way-container">
            <div className="vian-way-header">
              <h2 className="scroll-fade-in">The Vian Way</h2>
              <p className="vian-way-lead scroll-fade-in">Professional technical solutions for businesses to reach a global audience.</p>
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
                <img src="/sqaress.com.jpeg" alt="Sparess" className="our-portals-img" />
              </div>
              <div className="our-portals-info scroll-fade-in">
                <h3>Sparess.com Portal</h3>
                <p>Designed and launched by Vian Global for marketing, buying, and selling new or used parts and services applicable for the Marine & Offshore industries. The online portal is easy to access and available across website and mobile platforms.</p>
                <a className="our-portals-link" href="https://sparess.com" target="_blank" rel="noopener noreferrer">Visit Our Portal</a>
              </div>
            </div>
          </div>
        </section>
        <section className="navigator-section" id="navigator">
          <div className="our-portals-container">
            <div className="navigator-content">
              <div className="our-portals-img-wrapper scroll-fade-in">
                <img src="/navigator.jpeg" alt="NavigatorsRus" className="navigator-img" />
              </div>
              <div className="navigator-info scroll-fade-in">
                <h3>NavigatorsRus</h3>
                <p>NavigatorsRus online marketing portal is fully developed by Vian Global for UAE client. The portal is a gateway for effortlessly marketing products and services to a global audience. It connects buyers and sellers from every corner of the globe enabling boosting sales.<br/><br/>VIAN developed the concept, finalized UI, designed the portal and integrated third party services necessary for a fully functional portal. The portal operates as website and mobile app.</p>
                <a className="our-portals-link" href="https://navigatorsrus.com/" target="_blank" rel="noopener noreferrer">Visit NavigatorsRus</a>
              </div>
            </div>
          </div>
        </section>
        {/* Services Sections */}
        <section className="services-section" id="services">
          <div className="services-container">
            <h2 className="services-title scroll-fade-in">Our Services</h2>
            <div className="services-content">
              <div className="service-card-custom scroll-fade-in">
                <div className="accent-bar" />
                <img src={projectManagementImg} alt="Project Management and Consulting" className="service-img" />
                <div className="service-info">
                  <h3>Project Management and Consulting</h3>
                  <p>Be it Industrial development or business process optimization, we offer expert guidance and project management services during product design, engineering, development and marketing.</p>
                </div>
              </div>
              <div className="service-card-custom scroll-fade-in reverse">
                <div className="accent-bar" />
                <img src={conditionEvaluationImg} alt="Condition Assessment and Evaluation" className="service-img" />
                <div className="service-info">
                  <h3>Condition Assessment and Evaluation</h3>
                  <p>We specialize in inspecting, analyzing and reporting the physical and operational state of assets, infrastructure or equipment enabling clients to understand the current condition, risks, life expectancy and necessary maintenance or replacement actions for critical assets.</p>
                </div>
              </div>
              <div className="service-card-custom scroll-fade-in">
                <div className="accent-bar" />
                <img src={businessProcessImg} alt="Business Process Optimization" className="service-img" />
                <div className="service-info">
                  <h3>Business Process Optimization</h3>
                  <p>We offer tailored solutions to streamline and improve core business operations by analyzing redesigning and digitizing workflows enabling businesses to increase efficiency, reduce costs, eliminate waste and enhance overall performance.</p>
                </div>
              </div>
              <div className="service-card-custom scroll-fade-in reverse">
                <div className="accent-bar" />
                <img src={businessDigitalizationImg} alt="Business Digitalization and Marketing" className="service-img" />
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
            <div className="projects-gallery" ref={galleryRef}>
              <div className="projects-gallery-track">
                {projectImages.map((img, idx) => (
                  <div className="project-image-card scroll-fade-in" key={idx}>
                    <img src={img.src} alt={`Project ${idx+1}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="contact-section" id="contact">
          <div className="contact-container">
            <div className="contact-form-area scroll-fade-in">
              <h2 className="contact-title scroll-fade-in">Contact Us</h2>
              {formSubmitted ? (
                <div className="thank-you-message scroll-fade-in">
                  <h3>Thank you!</h3>
                  <p>Your message has been sent. We appreciate your interest and will get back to you soon.</p>
                </div>
              ) : (
                <form className="contact-form" autoComplete="off" onSubmit={handleFormSubmit}>
                <div className="form-row">
                  <input type="text" name="name" placeholder="Your Name" required className="scroll-fade-in" />
                </div>
                <div className="form-row">
                  <input type="email" name="email" placeholder="Your Email" required className="scroll-fade-in" />
                </div>
                <div className="form-row">
                  <textarea name="message" placeholder="Your Message" rows={5} required className="scroll-fade-in"></textarea>
                </div>
                <button type="submit" className="cta-btn scroll-fade-in" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
              )}
            </div>
            <div className="contact-info-area scroll-fade-in">
              <h3>Business Address</h3>
              <p>Vian Global LLP<br/>Chennai, Tamil Nadu, India</p>
              <h3>Phone</h3>
              <p><a href="tel:+919884026978">+91 9884 026 978</a></p>
              <h3>Email</h3>
              <p><a href="mailto:vianglobal@icloud.com">vianglobal@icloud.com</a></p>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-menus">
            <nav className="footer-nav scroll-fade-in">
              <a href="#home">Home</a>
              <a href="#about">About</a>
              <a href="#services">Services</a>
              <a href="#projects">Projects</a>
              <a href="#contact">Contact</a>
            </nav>
            <div className="footer-social scroll-fade-in">
              <a href="https://www.instagram.com/viangloballlp/" target="_blank" rel="noopener" aria-label="Instagram">
                <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
                  <rect width="28" height="28" rx="6" fill="#366a82"/>
                  <g transform="translate(6, 6)">
                    <rect x="0" y="0" width="16" height="16" rx="5.33" fill="none" stroke="#fff" strokeWidth="1.5"/>
                    <circle cx="8" cy="8" r="3.5" fill="none" stroke="#fff" strokeWidth="1.5"/>
                    <circle cx="12.5" cy="3.5" r="1" fill="#fff"/>
                  </g>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/vian-global-llp/" target="_blank" rel="noopener" aria-label="LinkedIn">
                <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><rect width="28" height="28" rx="6" fill="#366a82"/><path d="M8.5 11.5v7h2.25v-7H8.5zm1.125-3.5a1.312 1.312 0 1 0 0 2.625 1.312 1.312 0 0 0 0-2.625zM12.25 11.5v7h2.25v-3.5c0-.966.784-1.75 1.75-1.75s1.75.784 1.75 1.75v3.5H20.5v-4.25c0-2.071-1.679-3.75-3.75-3.75s-3.75 1.679-3.75 3.75z" fill="#fff"/></svg>
              </a>
              <a href="mailto:vianglobal@icloud.com" aria-label="Email">
                <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><rect width="28" height="28" rx="6" fill="#366a82"/><path d="M7.5 9.5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-9zm2.25.25v.01l4.25 3.25 4.25-3.25v-.01a.75.75 0 0 0-.75-.75h-7a.75.75 0 0 0-.75.75zm8.5 1.82-3.98 3.05a1 1 0 0 1-1.24 0l-3.98-3.05V18a.75.75 0 0 0 .75.75h7a.75.75 0 0 0 .75-.75v-6.43z" fill="#fff"/></svg>
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
