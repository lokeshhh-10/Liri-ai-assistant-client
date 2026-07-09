import React, { useEffect, useState } from 'react';
import { getPinnedBlogs } from '../services/blogService';
import type { Blog } from '../services/blogService';
import './Blogs.css';

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPinnedBlogs()
      .then(data => setBlogs(data.blogs))
      .catch(() => setError('Could not load blogs.'))
      .finally(() => setIsLoading(false));
  }, []);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const getReadTime = (content: string) => {
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  // Don't render the section at all if there are no pinned blogs and we've finished loading
  if (!isLoading && !error && blogs.length === 0) {
    return null;
  }

  return (
    <section id="blogs" className="blogs-section">
      <div className="blogs-header-container">
        <div className="blogs-header">
          <h2 className="section-number">04.</h2>
          <h3 className="blogs-section-title">Latest Writing</h3>
        </div>
        <a href="/blogs" className="blogs-view-more">
          View all
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>

      {isLoading ? (
        <div className="blogs-loading">
          {[1, 2, 3].map(i => (
            <div key={i} className="blog-card-skeleton">
              <div className="skeleton-tag" />
              <div className="skeleton-title" />
              <div className="skeleton-title short" />
              <div className="skeleton-excerpt" />
              <div className="skeleton-excerpt short" />
              <div className="skeleton-meta" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="blogs-error">{error}</div>
      ) : (
        <div className="blogs-grid">
          {blogs.map((blog, index) => (
            <a
              key={blog._id}
              href={`/blog/${blog.slug}`}
              className={`blog-card ${index === 0 ? 'blog-card--featured' : ''}`}
              aria-label={`Read: ${blog.title}`}
            >
              {blog.coverImage && (
                <div className="blog-card-image">
                  <img src={blog.coverImage} alt={blog.title} loading="lazy" />
                  <div className="blog-card-image-overlay" />
                </div>
              )}
              <div className="blog-card-body">
                <div className="blog-card-meta-top">
                  {blog.category && (
                    <span className="blog-card-category">{blog.category}</span>
                  )}
                  <span className="blog-card-read-time">{getReadTime(blog.content)} min read</span>
                </div>
                <h4 className="blog-card-title">{blog.title}</h4>
                {blog.excerpt && (
                  <p className="blog-card-excerpt">{blog.excerpt}</p>
                )}
                <div className="blog-card-footer">
                  <span className="blog-card-date">{formatDate(blog.publishedAt)}</span>
                  <span className="blog-card-cta">
                    Read more
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* View More Posts button */}
      {!isLoading && !error && blogs.length > 0 && (
        <div className="blogs-view-more-wrap">
          <a href="/blogs" className="blogs-view-more-btn">
            View More Posts
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      )}
    </section>
  );
};

export default Blogs;
