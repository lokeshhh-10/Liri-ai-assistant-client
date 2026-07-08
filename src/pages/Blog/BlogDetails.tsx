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
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const data = await getBlogBySlug(slug);
        setBlog(data.blog);
        document.title = `${data.blog.title} - Lokeshwaran K`;
      } catch (err: any) {
        setError(err.message || 'Failed to load blog post.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="blog-details-loading">
        <div className="blog-details-spinner"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="blog-details-error">
        <h2>Post Not Found</h2>
        <p>{error || 'The blog post you are looking for does not exist.'}</p>
        <a href="/" className="blog-back-link">← Back to Portfolio</a>
      </div>
    );
  }

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
          <img src={blog.coverImage} alt={blog.title} className="blog-cover-image" />
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
    </article>
  );
};

export default BlogDetails;
