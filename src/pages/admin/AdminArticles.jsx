import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/news');
        const data = await response.json();
        if (response.ok && data.success) {
          setArticles(data.articles);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you absolutely sure you want to permanently delete the article:\n"${title}"?`)) {
      // Optimistic UI update: remove article immediately from state
      const originalArticles = [...articles];
      setArticles(prev => prev.filter(article => article._id !== id));

      try {
        const response = await fetch(`/api/news/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to delete article');
        }

        alert('Article deleted successfully.');
      } catch (error) {
        console.error('Delete error:', error);
        alert(`Failed to delete article: ${error.message}`);
        // Rollback state if server request fails
        setArticles(originalArticles);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus, title) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const action = newStatus === 'published' ? 'publish' : 'unpublish';

    if (!window.confirm(`Are you sure you want to ${action} "${title}"?`)) return;

    const originalArticles = [...articles];
    setArticles(prev =>
      prev.map(a => a._id === id ? { ...a, status: newStatus } : a)
    );

    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || `Failed to ${action} article`);
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      alert(`Failed to ${action} article: ${error.message}`);
      setArticles(originalArticles);
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="articles-manager-wrapper">
      <div className="articles-header-flex">
        <div className="header-meta">
          <h1 className="dashboard-title">Blog Publications</h1>
          <p className="dashboard-subtitle">Manage, edit, publish, or delete your content pieces</p>
        </div>
        <button
          type="button"
          className="create-article-main-btn"
          onClick={() => navigate('/admin/articles/new')}
        >
          <span className="btn-icon">✍️</span>
          <span>Create Article</span>
        </button>
      </div>

      {/* ── SEARCH & FILTERS BAR ────────────────────────── */}
      <div className="articles-filters-bar">
        <div className="search-input-wrapper-glass">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title..."
            aria-label="Search articles"
          />
        </div>
      </div>

      {/* ── ARTICLES TABLE ────────────────────────────── */}
      {loading ? (
        <div className="manager-loading-screen">
          <div className="admin-spinner" />
          <p className="manager-loading-text">Loading Publications...</p>
        </div>
      ) : (
        <div className="articles-table-container">
          {filteredArticles.length === 0 ? (
            <div className="table-empty-state">
              <span className="empty-icon">📁</span>
              <h3>No Articles Found</h3>
              <p>Try refining your search query or create a brand new blog post!</p>
            </div>
          ) : (
            <table className="articles-table">
              <thead>
                <tr>
                  <th scope="col">Image</th>
                  <th scope="col">Title</th>
                  <th scope="col">Status</th>
                  <th scope="col">Date Created</th>
                  <th scope="col" className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map(article => (
                  <tr key={article._id} className="article-row">
                    <td>
                      <img
                        src={article.image}
                        alt=""
                        className="article-table-thumbnail"
                        loading="lazy"
                      />
                    </td>
                    <td>
                      <div className="article-table-title-meta">
                        <span className="table-main-title">{article.title}</span>
                        <span className="table-subtitle">/news/{article.slug}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-pill ${article.status}`}>
                        {article.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <span className="table-date-text">
                        {new Date(article.dateCreated).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="table-actions-flex">
                        <button
                          type="button"
                          className={`table-action-btn ${article.status === 'published' ? 'unpublish' : 'publish'}`}
                          onClick={() => handleToggleStatus(article._id, article.status, article.title)}
                          title={article.status === 'published' ? 'Unpublish Article' : 'Publish Article'}
                        >
                          {article.status === 'published' ? '⏸️ Unpublish' : '🚀 Publish'}
                        </button>
                        <button
                          type="button"
                          className="table-action-btn edit"
                          onClick={() => navigate(`/admin/articles/edit/${article._id}`)}
                          title="Edit Article"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          type="button"
                          className="table-action-btn delete"
                          onClick={() => handleDelete(article._id, article.title)}
                          title="Delete Article"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminArticles;
