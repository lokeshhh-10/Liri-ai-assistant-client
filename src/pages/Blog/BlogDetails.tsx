import React, { useEffect, useState } from 'react';
import './BlogDetails.css';
import { getBlogBySlug } from '../../services/blogService';
import type { Blog } from '../../services/blogService';

interface BlogDetailsProps {
  slug: string;
}

const BlogDetails: React.FC<BlogDetailsProps> = ({ slug }) => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const data = await getBlogBySlug(slug);
        if (!cancelled) {
          setBlog(data.blog);
          document.title = `${data.blog.title} - Lokeshwaran K`;
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Failed to load blog post.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBlog();
    return () => { cancelled = true; };
  }, [slug]);

  if (error) {
    return (
      <div className="blog-details-error">
        <h2>Post Not Found</h2>
        <p>{error}</p>
        <a href="/" className="blog-back-link">← Back to Portfolio</a>
      </div>
    );
  }

  // Show content skeleton while loading — gives the user immediate visual feedback
  // and prevents the page from feeling blank during the API call.
  if (loading) {
    return (
      <div className="blog-details-container blog-details-skeleton" aria-busy="true" aria-label="Loading blog post">
        <div className="skeleton-line skeleton-back" />
        <div className="skeleton-line skeleton-category" />
        <div className="skeleton-line skeleton-h1" />
        <div className="skeleton-line skeleton-h1 skeleton-h1-short" />
        <div className="skeleton-line skeleton-author" />
        <div className="skeleton-cover" />
        <div className="skeleton-line skeleton-body" />
        <div className="skeleton-line skeleton-body" />
        <div className="skeleton-line skeleton-body skeleton-body-short" />
        <div className="skeleton-line skeleton-body" />
        <div className="skeleton-line skeleton-body" />
        <div className="skeleton-line skeleton-body skeleton-body-shorter" />
      </div>
    );
  }

  if (!blog) return null;

  return (
    <article className="blog-details-container">
      <header className="blog-details-header">
        <a href="/" className="blog-back-link">← Back to Portfolio</a>
        <div className="blog-meta">
          {blog.category && <span className="blog-category">{blog.category}</span>}
          <span className="blog-date">
            {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric'
            })}
          </span>
        </div>
        <h1 className="blog-title">{blog.title}</h1>
        {blog.author && <p className="blog-author">By {blog.author}</p>}
      </header>

      {blog.coverImage && (
        <div className="blog-cover-wrapper">
          {/*
           * fetchpriority="high" tells the browser to treat this image as
           * the highest-priority resource — equivalent to a preload link.
           * This is the LCP element, so this directly reduces LCP time.
           */}
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="blog-cover-image"
            fetchPriority="high"
            loading="eager"
            decoding="async"
          />
        </div>
      )}

      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {blog.tags && blog.tags.length > 0 && (
        <div className="blog-tags">
          {blog.tags.map(tag => (
            <span key={tag} className="blog-tag">#{tag}</span>
          ))}
        </div>
      )}

      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        <a href="/blogs" className="blog-details-more-btn">
          Read more posts
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.5rem' }}>
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>
    </article>
  );
};

export default BlogDetails;
