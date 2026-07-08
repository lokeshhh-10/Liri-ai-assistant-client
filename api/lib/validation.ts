export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export interface BlogCreatePayload {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  author?: string;
  isPublished?: boolean;
}

export interface BlogUpdatePayload {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  author?: string;
  isPublished?: boolean;
}

/**
 * Validates a blog payload for creation.
 */
export function validateBlogCreate(data: BlogCreatePayload): ValidationResult {
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 3) {
    return { valid: false, message: 'Title must be at least 3 characters long.' };
  }
  if (!data.slug || typeof data.slug !== 'string' || !/^[a-z0-9-]+$/.test(data.slug)) {
    return { valid: false, message: 'Slug must be lowercase alphanumeric with hyphens only.' };
  }
  if (!data.content || typeof data.content !== 'string' || data.content.trim().length < 10) {
    return { valid: false, message: 'Content is required (minimum 10 characters).' };
  }
  return { valid: true };
}

/**
 * Validates a blog payload for update (all fields optional).
 */
export function validateBlogUpdate(data: BlogUpdatePayload): ValidationResult {
  if (data.title !== undefined && (typeof data.title !== 'string' || data.title.trim().length < 3)) {
    return { valid: false, message: 'Title must be at least 3 characters long.' };
  }
  if (data.slug !== undefined && (typeof data.slug !== 'string' || !/^[a-z0-9-]+$/.test(data.slug))) {
    return { valid: false, message: 'Slug must be lowercase alphanumeric with hyphens only.' };
  }
  return { valid: true };
}

/**
 * Sanitize a title string into a URL-safe slug.
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
