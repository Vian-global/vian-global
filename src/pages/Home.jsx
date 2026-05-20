import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import Header from '../components/Header'
import Footer from '../components/Footer'
import projectManagementImg from '../assets/project management.jpeg'
import conditionEvaluationImg from '../assets/Condition Evalution.jpeg'
import businessProcessImg from '../assets/business process.jpeg'
import businessDigitalizationImg from '../assets/business digitalization.jpeg'
import tradooImg from '../assets/Tradoo.jpeg'

const heroImages = [
  '/hero.jpg',
  '/hero2.jpg',
]

function Home() {
  const [heroCurrent, setHeroCurrent] = useState(0)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [articles, setArticles] = useState([])
  const [loadingArticles, setLoadingArticles] = useState(true)

  // Fetch published news articles dynamically from database
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch('/api/news');
        const data = await res.json();
        if (res.ok && data.success) {
          // Public grid only displays published articles
          const published = data.articles.filter(a => a.status === 'published');
          setArticles(published);
        }
      } catch (err) {
        console.error('Error fetching live news:', err);
      } finally {
        setLoadingArticles(false);
      }
    };
    fetchArticles();
  }, []);

  // Hero slider interval
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCurrent(prev => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Scroll fade-in observer (re-run when articles load)
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
  }, [articles])

  // Scroll to hash on page load (if navigated from another page)
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 300)
    }
  }, [])

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.target)
    try {
      const SERVICE_ID = 'service_kmr8pmn'
      const TEMPLATE_ID = 'template_b1mvcu9'
      const PUBLIC_KEY = 'IGJCApvi5xnmFHPPf'
      const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        date_time: new Date().toLocaleString(),
      }, PUBLIC_KEY)
      if (result.status === 200) {
        setFormSubmitted(true)
        e.target.reset()
      }
    } catch (error) {
      console.error('EmailJS error:', error)
      alert('Failed to send message. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNavClick = (e) => {
    e.preventDefault()
    const href = e.target.getAttribute('href')
    if (href && href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <Header />
      <main role="main">
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="hero-section" id="home">
          <div
            className="hero-bg"
            style={{ backgroundImage: `url(${heroImages[heroCurrent]})` }}
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

        {/* ── VIAN WAY ─────────────────────────────────────────── */}
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

        {/* ── OUR PRODUCTS ─────────────────────────────────────── */}
        <section className="navigator-section" id="navigator">
          <div className="our-portals-container">
            <h2 className="our-portals-title scroll-fade-in">Our Products</h2>
            <div className="navigator-content">
              <div className="our-portals-img-wrapper scroll-fade-in">
                <img
                  src={tradooImg}
                  alt="Tradoo.ae - Online Marketplace"
                  className="navigator-img"
                  loading="lazy"
                  width="320"
                  height="240"
                />
              </div>
              <div className="navigator-info scroll-fade-in">
                <h3>Tradoo.ae</h3>
                <p>Tradoo.ae is an online marketplace developed by Vian Global LLP for UAE client. VIAN developed the concept, designed the logics and managed the online portal development project. The portal has been successful in the UAE and operates on website and on Google and Apple Play stores.</p>
                <a
                  className="our-portals-link"
                  href="https://www.tradoo.ae"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Tradoo.ae portal"
                >
                  Visit WWW.TRADOO.AE
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── SERVICES ─────────────────────────────────────────── */}
        <section className="services-section" id="services">
          <div className="services-container">
            <h2 className="services-title scroll-fade-in">Our Services</h2>
            <div className="services-content">
              <div className="service-card-custom scroll-fade-in">
                <div className="accent-bar" aria-hidden="true" />
                <img src={projectManagementImg} alt="Project Management and Consulting" className="service-img" loading="lazy" width="120" height="120" />
                <div className="service-info">
                  <h3>Project Management and Consulting</h3>
                  <p>Be it Industrial development or business process optimization, we offer expert guidance and project management services during product design, engineering, development and marketing.</p>
                </div>
              </div>
              <div className="service-card-custom scroll-fade-in reverse">
                <div className="accent-bar" aria-hidden="true" />
                <img src={conditionEvaluationImg} alt="Condition Assessment and Evaluation" className="service-img" loading="lazy" width="120" height="120" />
                <div className="service-info">
                  <h3>Condition Assessment and Evaluation</h3>
                  <p>We specialize in inspecting, analyzing and reporting the physical and operational state of assets, infrastructure or equipment enabling clients to understand the current condition, risks, life expectancy and necessary maintenance or replacement actions for critical assets.</p>
                </div>
              </div>
              <div className="service-card-custom scroll-fade-in">
                <div className="accent-bar" aria-hidden="true" />
                <img src={businessProcessImg} alt="Business Process Optimization" className="service-img" loading="lazy" width="120" height="120" />
                <div className="service-info">
                  <h3>Business Process Optimization</h3>
                  <p>We offer tailored solutions to streamline and improve core business operations by analyzing redesigning and digitizing workflows enabling businesses to increase efficiency, reduce costs, eliminate waste and enhance overall performance.</p>
                </div>
              </div>
              <div className="service-card-custom scroll-fade-in reverse">
                <div className="accent-bar" aria-hidden="true" />
                <img src={businessDigitalizationImg} alt="Business Digitalization and Marketing" className="service-img" loading="lazy" width="120" height="120" />
                <div className="service-info">
                  <h3>Business Digitalization and Marketing</h3>
                  <p>With our existing software development partners, we can take your businesses to next level by developing modernized tools for process optimization, sales &amp; marketing, e-commerce, data compiling &amp; analysis requirements.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── VIAN NEWS ────────────────────────────────────────── */}
        <section className="news-section" id="news">
          <div className="news-container">
            <div className="news-header scroll-fade-in">
              <span className="news-eyebrow">Latest Updates</span>
              <h2 className="news-title">Vian News</h2>
              <p className="news-subtitle">Stay informed with our latest projects, company updates, and industry insights.</p>
            </div>

            <div className="news-grid">
              {loadingArticles ? (
                <div className="admin-loader-container" style={{ gridColumn: '1 / -1', padding: '4rem 0', minHeight: '200px' }}>
                  <div className="admin-spinner" />
                  <p className="admin-loading-text" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>Fetching latest publications...</p>
                </div>
              ) : articles.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem' }}>
                  <span style={{ fontSize: '2.5rem', opacity: 0.3, display: 'block', marginBottom: '1rem' }}>📰</span>
                  <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.95rem' }}>No dynamic articles published yet. Check back soon!</p>
                </div>
              ) : (
                articles.map((article, idx) => (
                  <article className="news-card scroll-fade-in" key={article.slug || article._id} aria-labelledby={`news-title-${article.slug || article._id}`}>
                    <Link to={`/news/${article.slug}`} className="news-card-img-link" tabIndex="-1" aria-hidden="true">
                      <div className="news-card-img-wrapper">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="news-card-img"
                          loading={idx === 0 ? 'eager' : 'lazy'}
                        />
                        <span className="news-card-category">{article.category || 'General'}</span>
                      </div>
                    </Link>
                    <div className="news-card-body">
                      <time className="news-card-date" dateTime={article.dateCreated}>
                        {new Date(article.dateCreated).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                      <h3 className="news-card-title" id={`news-title-${article.slug || article._id}`}>
                        <Link to={`/news/${article.slug}`}>{article.title}</Link>
                      </h3>
                      <p className="news-card-excerpt">{article.excerpt}</p>
                      <Link to={`/news/${article.slug}`} className="news-read-more" aria-label={`Read more about ${article.title}`}>
                        Read Article
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <line x1="5" y1="12" x2="19" y2="12"/>
                          <polyline points="12 5 19 12 12 19"/>
                        </svg>
                      </Link>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ── CONTACT ──────────────────────────────────────────── */}
        <section className="contact-section" id="contact">
          <div className="contact-container">
            <div className="contact-form-area scroll-fade-in">
              <h2 className="contact-title">Contact Us</h2>
              {formSubmitted ? (
                <div className="thank-you-message">
                  <h3>Thank you!</h3>
                  <p>Your message has been sent. We appreciate your interest and will get back to you soon.</p>
                </div>
              ) : (
                <form className="contact-form" autoComplete="off" onSubmit={handleFormSubmit} noValidate>
                  <div className="form-row">
                    <input type="text" name="name" placeholder="Your Name" required className="scroll-fade-in" aria-label="Your name" autoComplete="name" />
                  </div>
                  <div className="form-row">
                    <input type="email" name="email" placeholder="Your Email" required className="scroll-fade-in" aria-label="Your email address" autoComplete="email" />
                  </div>
                  <div className="form-row">
                    <textarea name="message" placeholder="Your Message" rows={5} required className="scroll-fade-in" aria-label="Your message"></textarea>
                  </div>
                  <button type="submit" className="cta-btn scroll-fade-in" disabled={isSubmitting} aria-label={isSubmitting ? 'Sending message...' : 'Send message'}>
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
              <p><a href="mailto:viangloballlp@vianglobal.co" aria-label="Send email to viangloballlp@vianglobal.co">viangloballlp@vianglobal.co</a></p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Home
