import React, { useState, useCallback, useEffect, useRef } from 'react';
import './BlogEditor.css';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import CodeBlockLowlight from '@tiptap/extension-code-block';
import Placeholder from '@tiptap/extension-placeholder';
import { createBlog, updateBlog, uploadImage } from '../../services/blogService';
import type { Blog, BlogFormData } from '../../services/blogService';

interface BlogEditorProps {
  blog?: Blog | null;
  onSuccess: () => void;
  onCancel: () => void;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

const CATEGORIES = ['Technology', 'Programming', 'AI & ML', 'Web Development', 'Career', 'Tutorial', 'Opinion', 'Other'];

const BlogEditor: React.FC<BlogEditorProps> = ({ blog, onSuccess, onCancel }) => {
  const isEditing = !!blog;

  const [title, setTitle] = useState(blog?.title || '');
  const [slug, setSlug] = useState(blog?.slug || '');
  const [slugEdited, setSlugEdited] = useState(!!blog);
  const [excerpt, setExcerpt] = useState(blog?.excerpt || '');
  const [category, setCategory] = useState(blog?.category || '');
  const [customCategory, setCustomCategory] = useState('');
  const [tags, setTags] = useState<string[]>(blog?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [coverImage, setCoverImage] = useState(blog?.coverImage || '');
  const [coverImagePreview, setCoverImagePreview] = useState(blog?.coverImage || '');
  const [isPublished, setIsPublished] = useState(blog?.isPublished || false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'editor-link' } }),
      CodeBlockLowlight.configure({ HTMLAttributes: { class: 'editor-code-block' } }),
      Placeholder.configure({ placeholder: 'Start writing your blog post here...' }),
    ],
    content: blog?.content || '',
    editorProps: {
      attributes: {
        class: 'tiptap-editor-content',
        spellcheck: 'true',
      },
    },
  });

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugEdited && title) {
      setSlug(generateSlug(title));
    }
  }, [title, slugEdited]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugEdited(true);
    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,+$/, '');
      if (newTag && !tags.includes(newTag)) {
        setTags(prev => [...prev, newTag]);
      }
      setTagInput('');
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(prev => prev.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag));

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size (max 5MB)
    if (!file.type.startsWith('image/')) {
      setSaveError('Please select a valid image file (PNG, JPG, WebP, GIF).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setSaveError('Image must be smaller than 5MB.');
      return;
    }

    // Preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setCoverImagePreview(dataUrl);

      // Upload to Cloudinary
      setIsUploading(true);
      setSaveError('');
      uploadImage(dataUrl)
        .then(res => {
          setCoverImage(res.url);
          setCoverImagePreview(res.url);
        })
        .catch((err) => {
          setSaveError(err.message || 'Image upload failed.');
          // Keep the local preview, clear the URL
          setCoverImage('');
        })
        .finally(() => setIsUploading(false));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCoverImage = () => {
    setCoverImage('');
    setCoverImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getEffectiveCategory = () => {
    if (category === 'Other') return customCategory.trim();
    return category;
  };

  const handleSave = useCallback(async (publishOverride?: boolean) => {
    setSaveError('');
    const contentHtml = editor?.getHTML() || '';

    if (!title.trim()) { setSaveError('Title is required.'); return; }
    if (!slug.trim()) { setSaveError('Slug is required.'); return; }
    if (!/^[a-z0-9-]+$/.test(slug)) { setSaveError('Slug must be lowercase alphanumeric with hyphens only.'); return; }
    if (!contentHtml || contentHtml === '<p></p>') { setSaveError('Content cannot be empty.'); return; }
    if (isUploading) { setSaveError('Please wait for the image upload to complete.'); return; }

    const finalIsPublished = publishOverride !== undefined ? publishOverride : isPublished;

    const payload: Partial<BlogFormData> = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content: contentHtml,
      coverImage,
      category: getEffectiveCategory(),
      tags,
      author: 'Lokeshwaran K.',
      isPublished: finalIsPublished,
    };

    setIsSaving(true);
    try {
      if (isEditing && blog) {
        await updateBlog(blog._id, payload);
      } else {
        await createBlog(payload as BlogFormData);
      }
      onSuccess();
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [editor, title, slug, excerpt, coverImage, category, customCategory, tags, isPublished, isEditing, blog, isUploading]);

  const addImageToEditor = () => {
    const url = prompt('Enter image URL:');
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  };

  const setLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    } else {
      editor?.chain().focus().unsetLink().run();
    }
  };

  if (!editor) return null;

  return (
    <div className="editor-page">
      {/* Editor Header */}
      <header className="editor-header">
        <div className="editor-header-inner">
          <button className="editor-back-btn" onClick={onCancel}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Dashboard
          </button>
          <h1 className="editor-header-title">
            {isEditing ? 'Edit Post' : 'New Post'}
          </h1>
          <div className="editor-header-actions">
            <button
              className="editor-draft-btn"
              onClick={() => handleSave(false)}
              disabled={isSaving}
            >
              {isSaving && !isPublished ? <span className="admin-mini-spinner" /> : null}
              Save Draft
            </button>
            <button
              className="editor-publish-btn"
              onClick={() => handleSave(true)}
              disabled={isSaving}
            >
              {isSaving && isPublished ? <span className="admin-mini-spinner" /> : null}
              {isEditing && blog?.isPublished ? 'Update' : 'Publish'}
            </button>
          </div>
        </div>
      </header>

      <div className="editor-layout">
        {/* Main content */}
        <div className="editor-main">
          {saveError && (
            <div className="editor-error" role="alert">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {saveError}
            </div>
          )}

          {/* Title */}
          <input
            id="blog-title"
            type="text"
            className="editor-title-input"
            placeholder="Post title..."
            value={title}
            onChange={handleTitleChange}
          />

          {/* Slug */}
          <div className="editor-slug-row">
            <span className="editor-slug-prefix">lokeshhh-10.vercel.app/blog/</span>
            <input
              id="blog-slug"
              type="text"
              className="editor-slug-input"
              value={slug}
              onChange={handleSlugChange}
              placeholder="your-post-slug"
            />
          </div>

          {/* Tab bar */}
          <div className="editor-tabs">
            <button
              className={`editor-tab ${activeTab === 'write' ? 'active' : ''}`}
              onClick={() => setActiveTab('write')}
            >Write</button>
            <button
              className={`editor-tab ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >Preview</button>
          </div>

          {/* Rich Text Editor */}
          {activeTab === 'write' ? (
            <div className="editor-wrapper">
              {/* Toolbar */}
              <div className="editor-toolbar">
                <div className="toolbar-group">
                  <button
                    className={`toolbar-btn ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    title="Heading 1"
                  >H1</button>
                  <button
                    className={`toolbar-btn ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    title="Heading 2"
                  >H2</button>
                  <button
                    className={`toolbar-btn ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    title="Heading 3"
                  >H3</button>
                </div>
                <div className="toolbar-divider" />
                <div className="toolbar-group">
                  <button
                    className={`toolbar-btn ${editor.isActive('bold') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    title="Bold"
                  ><strong>B</strong></button>
                  <button
                    className={`toolbar-btn ${editor.isActive('italic') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    title="Italic"
                  ><em>I</em></button>
                  <button
                    className={`toolbar-btn ${editor.isActive('underline') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    title="Underline"
                  ><u>U</u></button>
                </div>
                <div className="toolbar-divider" />
                <div className="toolbar-group">
                  <button
                    className={`toolbar-btn ${editor.isActive('bulletList') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    title="Bullet List"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>
                  </button>
                  <button
                    className={`toolbar-btn ${editor.isActive('orderedList') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    title="Ordered List"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
                  </button>
                  <button
                    className={`toolbar-btn ${editor.isActive('blockquote') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    title="Blockquote"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
                  </button>
                  <button
                    className={`toolbar-btn ${editor.isActive('codeBlock') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    title="Code Block"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                  </button>
                  <button
                    className={`toolbar-btn ${editor.isActive('code') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    title="Inline Code"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 0-2 2h-3"/></svg>
                  </button>
                </div>
                <div className="toolbar-divider" />
                <div className="toolbar-group">
                  <button
                    className={`toolbar-btn ${editor.isActive('link') ? 'active' : ''}`}
                    onClick={setLink}
                    title="Link"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  </button>
                  <button
                    className="toolbar-btn"
                    onClick={addImageToEditor}
                    title="Insert Image"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </button>
                </div>
                <div className="toolbar-divider" />
                <div className="toolbar-group">
                  <button
                    className="toolbar-btn"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Undo"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
                  </button>
                  <button
                    className="toolbar-btn"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Redo"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/></svg>
                  </button>
                </div>
              </div>
              <EditorContent editor={editor} className="editor-content-area" />
            </div>
          ) : (
            <div
              className="editor-preview"
              dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
            />
          )}
        </div>

        {/* Sidebar */}
        <aside className="editor-sidebar">
          {/* Publish toggle */}
          <div className="editor-sidebar-card">
            <h3 className="editor-sidebar-title">Status</h3>
            <div className="editor-publish-toggle">
              <span className="editor-toggle-label">
                {isPublished ? 'Published' : 'Draft'}
              </span>
              <button
                className={`editor-toggle-switch ${isPublished ? 'on' : 'off'}`}
                onClick={() => setIsPublished(prev => !prev)}
                role="switch"
                aria-checked={isPublished}
                aria-label="Toggle publish status"
              >
                <span className="editor-toggle-knob" />
              </button>
            </div>
          </div>

          {/* Excerpt */}
          <div className="editor-sidebar-card">
            <h3 className="editor-sidebar-title">Excerpt</h3>
            <textarea
              id="blog-excerpt"
              className="editor-sidebar-textarea"
              placeholder="A short summary of your post..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              maxLength={300}
            />
            <span className="editor-char-count">{excerpt.length}/300</span>
          </div>

          {/* Category */}
          <div className="editor-sidebar-card">
            <h3 className="editor-sidebar-title">Category</h3>
            <select
              id="blog-category"
              className="editor-sidebar-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select category...</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {category === 'Other' && (
              <input
                type="text"
                className="editor-sidebar-input"
                placeholder="Custom category..."
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                style={{ marginTop: '0.5rem' }}
              />
            )}
          </div>

          {/* Tags */}
          <div className="editor-sidebar-card">
            <h3 className="editor-sidebar-title">Tags</h3>
            <div className="editor-tags-input">
              {tags.map(tag => (
                <span key={tag} className="editor-tag">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="editor-tag-remove" aria-label={`Remove ${tag}`}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </span>
              ))}
              <input
                type="text"
                className="editor-tag-field"
                placeholder={tags.length === 0 ? 'Add tags...' : ''}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
            </div>
            <p className="editor-tags-hint">Press Enter or , to add</p>
          </div>

          {/* Cover Image */}
          <div className="editor-sidebar-card">
            <h3 className="editor-sidebar-title">Cover Image</h3>
            {coverImagePreview ? (
              <div className="editor-cover-preview">
                <img src={coverImagePreview} alt="Cover preview" />
                {isUploading && (
                  <div className="editor-cover-uploading">
                    <span className="admin-loading-spinner" style={{ width: 24, height: 24 }} />
                    <span>Uploading...</span>
                  </div>
                )}
                <button className="editor-cover-remove" onClick={handleRemoveCoverImage}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  Remove
                </button>
                {coverImage && (
                  <p className="editor-cover-url">✓ Uploaded to Cloudinary</p>
                )}
              </div>
            ) : (
              <div className="editor-cover-upload" onClick={() => fileInputRef.current?.click()}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <p>Click to upload cover image</p>
                <span>PNG, JPG, WebP, GIF • Max 5MB</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp, image/gif, image/*, .gif, .webp"
              onChange={handleImageFileChange}
              style={{ display: 'none' }}
            />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogEditor;
