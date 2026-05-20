import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    loading: true,
  });
  const [recentArticles, setRecentArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/news');
        const data = await response.json();

        if (response.ok && data.success) {
          const articles = data.articles;
          const published = articles.filter(a => a.status === 'published').length;
          const drafts = articles.filter(a => a.status === 'draft').length;

          setStats({
            total: articles.length,
            published,
            drafts,
            loading: false,
          });

          // Show the latest 3 articles
          setRecentArticles(articles.slice(0, 3));
        }
      } catch (error) {
        console.error('Stats loading error:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <h1 className="dashboard-title">System Overview</h1>
        <p className="dashboard-subtitle">Real-time status of your website publications and drafts</p>
      </div>

      {stats.loading ? (
        <div className="stats-gridloading">
          <div className="admin-spinner" />
        </div>
      ) : (
        <>
          {/* ── STATS GRID ───────────────────────────────────── */}
          <div className="stats-grid">
            <div className="stat-card-glass">
              <div className="stat-card-glow blue" />
              <div className="stat-icon-wrapper">📰</div>
              <div className="stat-meta">
                <span className="stat-label">Total Articles</span>
                <h2 className="stat-number">{stats.total}</h2>
              </div>
            </div>

            <div className="stat-card-glass">
              <div className="stat-card-glow green" />
              <div className="stat-icon-wrapper">🟢</div>
              <div className="stat-meta">
                <span className="stat-label">Published</span>
                <h2 className="stat-number">{stats.published}</h2>
              </div>
            </div>

            <div className="stat-card-glass">
              <div className="stat-card-glow orange" />
              <div className="stat-icon-wrapper">🟡</div>
              <div className="stat-meta">
                <span className="stat-label">Drafts</span>
                <h2 className="stat-number">{stats.drafts}</h2>
              </div>
            </div>
          </div>

          {/* ── QUICK ACTIONS & RECENT WORK ────────────────── */}
          <div className="dashboard-content-split">
            {/* Quick Actions Card */}
            <div className="dashboard-action-card">
              <h3 className="section-card-title">Quick Actions</h3>
              <div className="action-buttons-flex">
                <button
                  type="button"
                  className="quick-action-btn premium-blue"
                  onClick={() => navigate('/admin/articles/new')}
                >
                  <span className="btn-icon">✍️</span>
                  <span>Create New Article</span>
                </button>

                <button
                  type="button"
                  className="quick-action-btn premium-glass"
                  onClick={() => navigate('/admin/articles')}
                >
                  <span className="btn-icon">📁</span>
                  <span>Manage Articles</span>
                </button>

                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quick-action-btn premium-glass"
                >
                  <span className="btn-icon">🌐</span>
                  <span>Preview Live Site</span>
                </a>
              </div>
            </div>

            {/* Recent Articles Card */}
            <div className="dashboard-recent-card">
              <h3 className="section-card-title">Recently Added</h3>
              <div className="recent-list">
                {recentArticles.length === 0 ? (
                  <p className="no-recent-articles">No articles added yet. Start by creating one!</p>
                ) : (
                  recentArticles.map(article => (
                    <div key={article._id} className="recent-item-row">
                      <div className="recent-item-meta">
                        <span className="recent-item-title">{article.title}</span>
                        <span className="recent-item-date">
                          {new Date(article.dateCreated).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <span className={`status-pill ${article.status}`}>
                        {article.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
