import React, { useState, useEffect, useCallback } from 'react';
import './AdminDashboard.css';
import { useAuth } from '../../contexts/AuthContext';
import { getAllBlogs, deleteBlog, togglePublish } from '../../services/blogService';
import type { Blog } from '../../services/blogService';

interface AdminDashboardProps {
  onNewPost: () => void;
  onEditPost: (blog: Blog) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNewPost, onEditPost }) => {
  const { logout } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getAllBlogs();
      setBlogs(data.blogs);
    } catch (err: any) {
      setError(err.message || 'Failed to load blogs.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteBlog(id);
      setBlogs(prev => prev.filter(b => b._id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete blog.');
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  const handleTogglePublish = async (blog: Blog) => {
    setTogglingId(blog._id);
    try {
      const updated = await togglePublish(blog._id);
      setBlogs(prev => prev.map(b => b._id === blog._id ? updated.blog : b));
    } catch (err: any) {
      alert(err.message || 'Failed to update status.');
    } finally {
      setTogglingId(null);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const totalBlogs = blogs.length;
  const publishedBlogs = blogs.filter(b => b.isPublished).length;
  const draftBlogs = blogs.filter(b => !b.isPublished).length;

  return (
    <div className="admin-page">
      {/* Admin Header */}
      <header className="admin-header">
        <div className="admin-header-inner">
          <div className="admin-header-brand">
            <span className="admin-brand-mono">lokeshhh-10</span>
            <span className="admin-brand-sep">/</span>
            <span className="admin-brand-admin">admin</span>
          </div>
          <div className="admin-header-actions">
            <a href="/" className="admin-portfolio-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Portfolio
            </a>
            <button className="admin-logout-btn" onClick={logout}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        {/* Page title */}
        <div className="admin-page-title">
          <div>
            <h1 className="admin-h1">Blog Dashboard</h1>
            <p className="admin-h1-sub">Manage your blog posts</p>
          </div>
          <button className="admin-new-btn" onClick={onNewPost}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Post
          </button>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-icon total">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div className="admin-stat-info">
              <span className="admin-stat-value">{totalBlogs}</span>
              <span className="admin-stat-label">Total Posts</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon published">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="admin-stat-info">
              <span className="admin-stat-value">{publishedBlogs}</span>
              <span className="admin-stat-label">Published</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon drafts">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="admin-stat-info">
              <span className="admin-stat-value">{draftBlogs}</span>
              <span className="admin-stat-label">Drafts</span>
            </div>
          </div>
        </div>

        {/* Blog Table */}
        <div className="admin-table-section">
          <div className="admin-table-header">
            <h2 className="admin-table-title">All Posts</h2>
            <button className="admin-refresh-btn" onClick={fetchBlogs} title="Refresh">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            </button>
          </div>

          {isLoading ? (
            <div className="admin-loading">
              <div className="admin-loading-spinner" />
              <span>Loading posts...</span>
            </div>
          ) : error ? (
            <div className="admin-error-state">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p>{error}</p>
              <button onClick={fetchBlogs} className="admin-retry-btn">Retry</button>
            </div>
          ) : blogs.length === 0 ? (
            <div className="admin-empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <p>No blog posts yet.</p>
              <button className="admin-new-btn" onClick={onNewPost}>Write your first post</button>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Published</th>
                    <th>Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map(blog => (
                    <tr key={blog._id} className="admin-table-row">
                      <td className="admin-td-title">
                        <div className="admin-blog-title">{blog.title}</div>
                        <div className="admin-blog-slug">/{blog.slug}</div>
                      </td>
                      <td className="admin-td-category">
                        {blog.category ? (
                          <span className="admin-category-badge">{blog.category}</span>
                        ) : '—'}
                      </td>
                      <td>
                        <button
                          className={`admin-status-badge ${blog.isPublished ? 'published' : 'draft'}`}
                          onClick={() => handleTogglePublish(blog)}
                          disabled={togglingId === blog._id}
                          title={blog.isPublished ? 'Click to unpublish' : 'Click to publish'}
                        >
                          {togglingId === blog._id ? (
                            <span className="admin-mini-spinner" />
                          ) : (
                            <span className="admin-status-dot" />
                          )}
                          {blog.isPublished ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="admin-td-date">{formatDate(blog.publishedAt)}</td>
                      <td className="admin-td-date">{formatDate(blog.updatedAt)}</td>
                      <td>
                        <div className="admin-row-actions">
                          <button
                            className="admin-action-btn edit"
                            onClick={() => onEditPost(blog)}
                            title="Edit post"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            className="admin-action-btn delete"
                            onClick={() => setDeleteConfirm(blog._id)}
                            title="Delete post"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <h3 className="admin-modal-title">Delete Post?</h3>
            <p className="admin-modal-body">
              This action is permanent and cannot be undone. The blog post will be removed from your site.
            </p>
            <div className="admin-modal-actions">
              <button className="admin-modal-cancel" onClick={() => setDeleteConfirm(null)} disabled={isDeleting}>
                Cancel
              </button>
              <button
                className="admin-modal-confirm"
                onClick={() => handleDelete(deleteConfirm)}
                disabled={isDeleting}
              >
                {isDeleting ? <span className="login-spinner" /> : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
