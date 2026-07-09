import React, { useEffect, useState, useRef } from 'react';
import { getAllBlogs } from '../../services/blogService';
import type { Blog } from '../../services/blogService';
import './BlogList.css';

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = 'Blog — Lokeshwaran K';
    getAllBlogs()
      .then(data => setBlogs(data.blogs))
      .catch(() => setError('Could not load blogs. Please try again.'))
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

  // Derive unique categories from loaded blogs
  const categories = ['All', ...Array.from(new Set(blogs.map(b => b.category).filter(Boolean)))];

  // Filter by category + search
  const filtered = blogs.filter(blog => {
    const matchesCategory = activeCategory === 'All' || blog.category === activeCategory;
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      blog.title.toLowerCase().includes(q) ||
      blog.excerpt?.toLowerCase().includes(q) ||
      blog.category?.toLowerCase().includes(q) ||
      blog.tags?.some(t => t.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="blog-list-page">
      {/* ── Header ── */}
      <header className="blog-list-header">
        <div className="blog-list-header-inner">
          <a href="/" className="blog-list-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Portfolio
          </a>
          <div className="blog-list-heading">
            <h1 className="blog-list-title">All Writing</h1>
            <p className="blog-list-subtitle">
              Thoughts on software, system design, and the things I'm learning.
            </p>
          </div>
        </div>
      </header>

      {/* ── Controls ── */}
      <div className="blog-list-controls">
        <div className="blog-list-controls-inner">
          {/* Search */}
          <div className="blog-list-search-wrap" onClick={() => searchRef.current?.focus()}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={searchRef}
              type="text"
              className="blog-list-search"
              placeholder="Search posts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search blog posts"
            />
            {search && (
              <button className="blog-list-search-clear" onClick={() => setSearch('')} aria-label="Clear search">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="blog-list-cats" role="group" aria-label="Filter by category">
            {categories.map(cat => (
              <button
                key={cat}
                className={`blog-list-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="blog-list-main">
        <div className="blog-list-inner">

          {isLoading ? (
            <div className="blog-list-grid">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="blog-list-skeleton">
                  <div className="bls-img" />
                  <div className="bls-body">
                    <div className="bls-line bls-cat" />
                    <div className="bls-line bls-title" />
                    <div className="bls-line bls-title bls-short" />
                    <div className="bls-line bls-excerpt" />
                    <div className="bls-line bls-excerpt bls-short" />
                    <div className="bls-line bls-meta" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="blog-list-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p>{error}</p>
              <button className="blog-list-retry" onClick={() => window.location.reload()}>Try again</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="blog-list-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <p>No posts match <strong>"{search || activeCategory}"</strong></p>
              <button className="blog-list-retry" onClick={() => { setSearch(''); setActiveCategory('All'); }}>Clear filters</button>
            </div>
          ) : (
            <>
              <p className="blog-list-count">
                {filtered.length} {filtered.length === 1 ? 'post' : 'posts'}
                {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
                {search ? ` matching "${search}"` : ''}
              </p>
              <div className="blog-list-grid">
                {filtered.map(blog => (
                  <a
                    key={blog._id}
                    href={`/blog/${blog.slug}`}
                    className="blog-list-card"
                    aria-label={`Read: ${blog.title}`}
                  >
                    {blog.coverImage && (
                      <div className="blog-list-card-img">
                        <img src={blog.coverImage} alt={blog.title} loading="lazy" />
                        <div className="blog-list-card-img-overlay" />
                      </div>
                    )}
                    <div className="blog-list-card-body">
                      <div className="blog-list-card-meta-top">
                        {blog.category && (
                          <span className="blog-list-card-cat">{blog.category}</span>
                        )}
                        <span className="blog-list-card-readtime">{getReadTime(blog.content)} min read</span>
                      </div>
                      <h2 className="blog-list-card-title">{blog.title}</h2>
                      {blog.excerpt && (
                        <p className="blog-list-card-excerpt">{blog.excerpt}</p>
                      )}
                      <div className="blog-list-card-footer">
                        <span className="blog-list-card-date">{formatDate(blog.publishedAt)}</span>
                        <span className="blog-list-card-cta">
                          Read more
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default BlogList;
