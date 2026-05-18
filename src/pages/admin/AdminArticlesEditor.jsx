import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RichTextEditor from '../../components/RichTextEditor';

const AdminArticlesEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form States
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState('draft');
  const [category, setCategory] = useState('General');
  const [tags, setTags] = useState('');
  const [author, setAuthor] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // SEO States
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');

  // UX States
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Load article if in Edit Mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/news/${id}`);
        const data = await response.json();

        if (response.ok && data.success) {
          const art = data.article;
          setTitle(art.title);
          setSlug(art.slug);
          setExcerpt(art.excerpt);
          setContent(art.content);
          setImage(art.image);
          setStatus(art.status);
          setCategory(art.category || 'General');
          setTags(art.tags ? art.tags.join(', ') : '');
          setAuthor(art.author || '');
          setIsFeatured(art.isFeatured || false);

          // SEO Fields
          if (art.seo) {
            setMetaTitle(art.seo.metaTitle || '');
            setMetaDescription(art.seo.metaDescription || '');
            setOgImage(art.seo.ogImage || '');
            setCanonicalUrl(art.seo.canonicalUrl || '');
          }
        } else {
          setErrorMessage(data.message || 'Failed to fetch article details.');
        }
      } catch (error) {
        console.error('Fetch article error:', error);
        setErrorMessage('Failed to connect to backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, isEditMode]);

  // Auto-generate slug and canonical URL in Create Mode
  const handleTitleChange = (val) => {
    setTitle(val);
    if (!isEditMode) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // remove special chars
        .trim()
        .replace(/\s+/g, '-') // spaces to hyphens
        .replace(/-+/g, '-'); // collapse multiple hyphens

      setSlug(generatedSlug);
      setCanonicalUrl(`https://www.vianglobal.co/news/${generatedSlug}`);
      
      // Auto fill SEO Meta Title
      setMetaTitle(val);
    }
  };

  const handleSlugChange = (val) => {
    const cleanSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    setSlug(cleanSlug);
    setCanonicalUrl(`https://www.vianglobal.co/news/${cleanSlug}`);
  };

  // Cloudinary Secure Base64 File Uploader
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('File size exceeds the 8MB limit. Please upload a smaller image.');
      return;
    }

    setUploading(true);
    setErrorMessage('');

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const base64Data = reader.result;

        const response = await fetch('/api/news/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Data }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setImage(data.url);
          // Set OG image fallback too if not edited
          if (!ogImage) setOgImage(data.url);
        } else {
          setErrorMessage(data.message || 'Image upload failed. Please try again.');
        }
      } catch (error) {
        console.error('Image upload error:', error);
        setErrorMessage('Image upload failed due to a network connection issue.');
      } finally {
        setUploading(false);
      }
    };
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!title.trim() || !slug.trim() || !excerpt.trim() || !content.trim() || !image.trim()) {
      setErrorMessage('Please fill in all core fields (Title, Slug, Excerpt, Image, and Content).');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    const payload = {
      title,
      slug,
      content,
      excerpt,
      image,
      status,
      category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      author: author.trim() || undefined,
      isFeatured,
      seo: {
        metaTitle: metaTitle.trim() || title,
        metaDescription: metaDescription.trim() || excerpt,
        ogImage: ogImage.trim() || image,
        canonicalUrl: canonicalUrl.trim() || `https://www.vianglobal.co/news/${slug}`,
      },
    };

    try {
      const url = isEditMode ? `/api/news/${id}` : '/api/news';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(isEditMode ? 'Article updated successfully!' : 'Article created successfully!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          navigate('/admin/articles');
        }, 1500);
      } else {
        setErrorMessage(data.message || 'Failed to save article.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Save article error:', error);
      setErrorMessage('Failed to connect to the backend server.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="manager-loading-screen">
        <div className="admin-spinner" />
        <p className="manager-loading-text">Loading Article Editor...</p>
      </div>
    );
  }

  return (
    <div className="editor-page-wrapper">
      <div className="articles-header-flex scroll-fade-in">
        <div className="header-meta">
          <h1 className="dashboard-title">{isEditMode ? 'Edit Article' : 'Create Article'}</h1>
          <p className="dashboard-subtitle">
            {isEditMode ? `Updating /news/${slug}` : 'Draft and publish a premium new post'}
          </p>
        </div>
        <div className="editor-controls-actions">
          <button
            type="button"
            className="editor-action-btn secondary"
            onClick={() => setShowPreview(true)}
            disabled={!title || !content}
          >
            👁️ Live Preview
          </button>
          <button
            type="button"
            className="editor-action-btn secondary"
            onClick={() => navigate('/admin/articles')}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* ── NOTIFICATION BANNERS ────────────────────────── */}
      {errorMessage && (
        <div className="editor-banner error scroll-fade-in" role="alert">
          <span>⚠️ {errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="editor-banner success scroll-fade-in" role="alert">
          <span>✅ {successMessage}</span>
        </div>
      )}

      {/* ── FORM CONTAINER ──────────────────────────────── */}
      <form onSubmit={handleSave} className="editor-form-grid scroll-fade-in">
        
        {/* Left Column: Editor Core */}
        <div className="editor-left-pane">
          <div className="editor-form-card">
            <div className="form-group-glass">
              <label htmlFor="article-title">Article Title</label>
              <input
                type="text"
                id="article-title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter article title"
                required
              />
            </div>

            <div className="form-group-glass">
              <label htmlFor="article-slug">URL Slug (lowercase, unique)</label>
              <input
                type="text"
                id="article-slug"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="auto-generated-slug-path"
                required
              />
            </div>

            <div className="form-group-glass">
              <label htmlFor="article-excerpt">Short Excerpt (Grid description)</label>
              <textarea
                id="article-excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Enter a brief, engaging summary to be displayed on grids..."
                rows="3"
                required
              />
            </div>

            <div className="form-group-glass">
              <label>Article Content (Rich Text Editor)</label>
              <RichTextEditor value={content} onChange={setContent} />
            </div>
          </div>
        </div>

        {/* Right Column: Settings & SEO */}
        <div className="editor-right-pane">
          
          {/* Settings Card */}
          <div className="editor-form-card side">
            <h3 className="pane-card-title">Settings</h3>

            <div className="form-group-glass">
              <label>Publication Status</label>
              <div className="status-toggle-container">
                <button
                  type="button"
                  className={`status-toggle-btn draft ${status === 'draft' ? 'active' : ''}`}
                  onClick={() => setStatus('draft')}
                >
                  Draft
                </button>
                <button
                  type="button"
                  className={`status-toggle-btn publish ${status === 'published' ? 'active' : ''}`}
                  onClick={() => setStatus('published')}
                >
                  Publish
                </button>
              </div>
            </div>

            {/* Cloudinary Image Manager */}
            <div className="form-group-glass">
              <label>Featured Image</label>
              <div className="image-uploader-container">
                {image ? (
                  <div className="uploader-preview-wrapper">
                    <img src={image} alt="Featured Preview" className="uploader-preview-img" />
                    <button
                      type="button"
                      className="uploader-remove-btn"
                      onClick={() => setImage('')}
                    >
                      ✕ Remove
                    </button>
                  </div>
                ) : (
                  <label className="image-upload-clickable-box">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                      disabled={uploading}
                    />
                    {uploading ? (
                      <div className="uploader-loader-flex">
                        <div className="uploader-spinner" />
                        <span>Uploading to Cloudinary...</span>
                      </div>
                    ) : (
                      <div className="uploader-placeholder-flex">
                        <span className="upload-icon">📸</span>
                        <span className="upload-text">Upload Featured Image</span>
                        <span className="upload-limit">PNG, JPG, WEBP (Max 8MB)</span>
                      </div>
                    )}
                  </label>
                )}
              </div>
            </div>

            <div className="form-group-glass">
              <label htmlFor="article-category">Category</label>
              <input
                type="text"
                id="article-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Product Launch, Technology"
              />
            </div>

            <div className="form-group-glass">
              <label htmlFor="article-tags">Tags (comma-separated)</label>
              <input
                type="text"
                id="article-tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. trade, uae, logistics"
              />
            </div>

            <div className="form-group-glass">
              <label htmlFor="article-author">Author Override</label>
              <input
                type="text"
                id="article-author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Vian Team"
              />
            </div>

            <div className="form-group-glass checkbox">
              <label className="checkbox-label-glass">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                <span className="checkbox-text">Feature this article at the top</span>
              </label>
            </div>
          </div>

          {/* SEO Optimizations Card */}
          <div className="editor-form-card side">
            <h3 className="pane-card-title">🔍 Search Engine Optimization (SEO)</h3>

            <div className="form-group-glass">
              <label htmlFor="seo-title">Meta Title (Search Engine Header)</label>
              <input
                type="text"
                id="seo-title"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Enter title search engine text"
              />
            </div>

            <div className="form-group-glass">
              <label htmlFor="seo-description">Meta Description (Snippet)</label>
              <textarea
                id="seo-description"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Enter rich search description text snippet..."
                rows="3"
              />
            </div>

            <div className="form-group-glass">
              <label htmlFor="seo-canonical">Canonical URL</label>
              <input
                type="url"
                id="seo-canonical"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                placeholder="https://www.vianglobal.co/news/slug-path"
              />
            </div>

            <div className="form-group-glass">
              <label htmlFor="seo-og-image">Open Graph Social Image (optional override)</label>
              <input
                type="text"
                id="seo-og-image"
                value={ogImage}
                onChange={(e) => setOgImage(e.target.value)}
                placeholder="Enter custom absolute social image URL..."
              />
            </div>
          </div>

          {/* Main Save Bar */}
          <button
            type="submit"
            className="editor-submit-main-btn-premium"
            disabled={saving}
          >
            {saving ? (
              <span className="btn-loading-flex">
                <span className="btn-spinner" />
                Saving Changes...
              </span>
            ) : (
              isEditMode ? '💾 Update & Publish' : '🚀 Save Article'
            )}
          </button>
        </div>
      </form>

      {/* ── LIVE PREVIEW MODAL (AWARD-WINNING SIMULATOR) ─────── */}
      {showPreview && (
        <div className="editor-preview-modal-overlay">
          <div className="editor-preview-modal-card">
            <div className="preview-modal-header">
              <div className="preview-label-tag">LIVE VISUAL PREVIEW SIMULATOR</div>
              <button
                type="button"
                className="preview-close-btn"
                onClick={() => setShowPreview(false)}
              >
                ✕ Close Preview
              </button>
            </div>
            
            {/* Embedded Live Reading Page Frame (Using Actual CSS Layout!) */}
            <div className="preview-modal-content-scroller">
              <main className="article-page" style={{ paddingTop: 0 }}>
                {/* Hero Banner */}
                <div className="article-hero" style={{ height: '320px' }}>
                  <img src={image || '/hero.jpg'} alt="" className="article-hero-img" />
                  <div className="article-hero-overlay" />
                  <span className="article-hero-badge">{category || 'General'}</span>
                </div>

                <div className="article-content-wrapper" style={{ padding: '2rem 1.5rem 4rem' }}>
                  {/* Breadcrumb Simulation */}
                  <nav className="article-breadcrumb">
                    <span>Home</span>
                    <span>/</span>
                    <span>News</span>
                    <span>/</span>
                    <span style={{ opacity: 0.6 }}>{title || 'Untitled Post'}</span>
                  </nav>

                  {/* Body Container */}
                  <article className="article-body">
                    <div className="article-meta">
                      <span className="article-category-tag">{category || 'General'}</span>
                      <span className="article-date">
                        {new Date().toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <h1 className="article-title">{title || 'Untitled Article'}</h1>
                    <p className="article-lead">{excerpt || 'Excerpt description text goes here...'}</p>
                    <div className="article-divider" />

                    {/* Rich HTML Content Rendering! */}
                    <div
                      className="article-rich-content"
                      dangerouslySetInnerHTML={{ __html: content || '<p>Content goes here...</p>' }}
                    />
                  </article>
                </div>
              </main>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArticlesEditor;
