const API_BASE = '/api';

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type BlogFormData = Omit<Blog, '_id' | 'createdAt' | 'updatedAt' | 'publishedAt'>;

async function apiRequest(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    credentials: 'include',
    ...options,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const getAllBlogs = (): Promise<{ blogs: Blog[] }> =>
  apiRequest('/blogs');

export const getBlogById = (id: string): Promise<{ blog: Blog }> =>
  apiRequest(`/blogs/${id}`);

export const getBlogBySlug = (slug: string): Promise<{ blog: Blog }> =>
  apiRequest(`/blogs/slug/${slug}`);

export const createBlog = (data: BlogFormData): Promise<{ blog: Blog }> =>
  apiRequest('/blogs', { method: 'POST', body: JSON.stringify(data) });

export const updateBlog = (id: string, data: Partial<BlogFormData>): Promise<{ blog: Blog }> =>
  apiRequest(`/blogs/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteBlog = (id: string): Promise<{ message: string }> =>
  apiRequest(`/blogs/${id}`, { method: 'DELETE' });

export const togglePublish = (id: string): Promise<{ blog: Blog }> =>
  apiRequest(`/blogs/${id}/publish`, { method: 'PATCH' });

export const uploadImage = (base64Image: string): Promise<{ url: string }> =>
  apiRequest('/upload/image', { method: 'POST', body: JSON.stringify({ image: base64Image }) });
