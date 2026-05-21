import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import heroImg from '../assets/hero.jpg'

function NewsArticle() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [prevArticle, setPrevArticle] = useState(null)
  const [nextArticle, setNextArticle] = useState(null)
  const [moreArticles, setMoreArticles] = useState([])

  useEffect(() => {
    const fetchArticleAndNav = async () => {
      try {
        // 1. Fetch single article by slug
        const resSingle = await fetch(`/api/news/${slug}`);
        const dataSingle = await resSingle.json();

        if (!resSingle.ok || !dataSingle.success) {
          setError(true);
          setLoading(false);
          return;
        }

        const currentArticle = dataSingle.article;
        
        // Ensure that drafts are not viewable publicly
        if (currentArticle.status === 'draft') {
          setError(true);
          setLoading(false);
          return;
        }

        setArticle(currentArticle);

        // Update SEO tags dynamically
        document.title = currentArticle.seo?.metaTitle || `${currentArticle.title} | Vian Global`;
        
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.setAttribute('name', 'description');
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', currentArticle.seo?.metaDescription || currentArticle.excerpt);

        // Update Canonical
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
          canonical = document.createElement('link');
          canonical.setAttribute('rel', 'canonical');
          document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', currentArticle.seo?.canonicalUrl || window.location.href);

        // 2. Fetch all published articles to build navigation
        const resList = await fetch('/api/news');
        const dataList = await resList.json();

        if (resList.ok && dataList.success) {
          // Public view only gets published articles
          const list = dataList.articles.filter(a => a.status === 'published');
          const currentIdx = list.findIndex(a => a.slug === slug || a._id === currentArticle._id);
          
          if (currentIdx !== -1) {
            setPrevArticle(list[currentIdx - 1] || null);
            setNextArticle(list[currentIdx + 1] || null);
          }
          
          setMoreArticles(list.filter(a => a.slug !== slug && a._id !== currentArticle._id).slice(0, 2));
        }
      } catch (err) {
        console.error('Error loading article:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    setError(false);
    setArticle(null);
    setPrevArticle(null);
    setNextArticle(null);
    setMoreArticles([]);
    
    fetchArticleAndNav();

    // Scroll to top on load
    window.scrollTo({ top: 0, behavior: 'instant' });

    return () => {
      document.title = 'Vian Global LLP - Professional Technical Solutions for Global Business Growth';
    };
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="admin-loading-screen" style={{ position: 'relative', minHeight: '60vh', background: '#242424' }}>
          <div className="admin-loader-container">
            <div className="admin-spinner" />
            <p className="admin-loading-text">Loading Article...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error || !article) {
    return (
      <>
        <Header />
        <main className="article-page" role="main" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#242424' }}>
          <div className="article-content-wrapper" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1.5rem', opacity: 0.3 }}>🔍</span>
            <h1 className="article-title" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#ffffff' }}>Article Not Found</h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.5)', maxWidth: '500px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
              The article you are trying to view does not exist, has been moved, or is currently saved as a draft.
            </p>
            <Link to="/#news" className="article-back-btn" style={{ display: 'inline-flex', margin: '0 auto' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              Back to News
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="article-page" role="main">

        {/* ── HERO (static image) ───────────── */}
        <div className="article-hero">
          <img
            src={heroImg}
            alt=""
            className="article-hero-img"
            loading="eager"
          />
          <div className="article-hero-overlay" aria-hidden="true" />
          <div className="article-hero-badge">{article.category || 'General'}</div>
        </div>

        {/* ── CONTENT ──────────────────────── */}
        <div className="article-content-wrapper">

          {/* Breadcrumb */}
          <nav className="article-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true"> / </span>
            <Link to="/#news">News</Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{article.title}</span>
          </nav>

          <article className="article-body">
            <header className="article-header">
              <div className="article-meta">
                <span className="article-category-tag">{article.category || 'General'}</span>
                <time className="article-date" dateTime={article.dateCreated}>
                  {new Date(article.dateCreated).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              <h1 className="article-title">{article.title}</h1>
              <p className="article-lead">{article.excerpt}</p>
              <div className="article-divider" aria-hidden="true" />
            </header>

            {article.image && (
              <figure className="article-featured-image">
                <img src={article.image} alt={article.title} loading="lazy" />
              </figure>
            )}

            <div
              className="article-rich-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>

          {/* ── PREV / NEXT ───────────────── */}
          {(prevArticle || nextArticle) && (
            <nav className="article-pagination" aria-label="Article navigation">
              {prevArticle ? (
                <Link to={`/news/${prevArticle.slug}`} className="article-pagination-link prev">
                  <span className="pagination-direction">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="19" y1="12" x2="5" y2="12"/>
                      <polyline points="12 19 5 12 12 5"/>
                    </svg>
                    Previous
                  </span>
                  <span className="pagination-title">{prevArticle.title}</span>
                </Link>
              ) : <div />}
              {nextArticle ? (
                <Link to={`/news/${nextArticle.slug}`} className="article-pagination-link next">
                  <span className="pagination-direction">
                    Next
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </span>
                  <span className="pagination-title">{nextArticle.title}</span>
                </Link>
              ) : <div />}
            </nav>
          )}

          {/* ── MORE ARTICLES ─────────────── */}
          {moreArticles.length > 0 && (
            <section className="article-more" aria-label="More articles">
              <h2 className="article-more-title">More from Vian News</h2>
              <div className="article-more-grid">
                {moreArticles.map(a => (
                  <Link to={`/news/${a.slug}`} key={a._id} className="article-more-card">
                    <img src={a.image} alt="" className="article-more-img" loading="lazy" />
                    <div className="article-more-body">
                      <span className="article-more-category">{a.category || 'General'}</span>
                      <h3 className="article-more-heading">{a.title}</h3>
                      <time className="article-more-date">
                        {new Date(a.dateCreated).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── BACK BUTTON ───────────────── */}
          <div className="article-back-wrapper">
            <Link to="/#news" className="article-back-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              Back to News
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}

export default NewsArticle
