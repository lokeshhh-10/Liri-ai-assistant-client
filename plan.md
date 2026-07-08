# Blog CMS Implementation Plan

## Overview

This document outlines the implementation plan for adding a blog management system to an existing **React + Vite** website without using a traditional backend framework such as Express.

The application will use **Vercel Serverless Functions** as the backend layer and **MongoDB Atlas** for persistent data storage.

---

# Objectives

Build a lightweight, secure, and scalable Blog CMS that allows an administrator to:

* Create blog posts
* Edit blog posts
* Delete blog posts
* Publish or save drafts
* Upload cover images
* Display published blogs on the public website

The solution should:

* Avoid using Express or any continuously running backend server.
* Keep MongoDB credentials secure.
* Follow a modular architecture.
* Be production-ready and easy to maintain.

---

# Technology Stack

## Frontend

* React
* Vite
* React Router
* Tailwind CSS
* React Hook Form
* TanStack Query (Recommended)

## Backend

* Vercel Serverless Functions (`/api`)
* MongoDB Atlas
* MongoDB Node Driver

## Authentication

* Single administrator account
* JWT Authentication
* HttpOnly Cookies

## Image Storage

* Cloudinary

---

# Project Structure

```text
project/
│
├── src/
│   ├── components/
│   │   ├── BlogCard/
│   │   ├── BlogEditor/
│   │   ├── BlogList/
│   │   ├── RichTextEditor/
│   │   ├── ImageUploader/
│   │   └── common/
│   │
│   ├── pages/
│   │   ├── Home/
│   │   ├── Blogs/
│   │   ├── BlogDetails/
│   │   ├── Admin/
│   │   ├── Dashboard/
│   │   └── Login/
│   │
│   ├── services/
│   │   ├── blogService.js
│   │   └── authService.js
│   │
│   ├── hooks/
│   ├── utils/
│   ├── context/
│   └── types/
│
├── api/
│   ├── auth/
│   │   ├── login.js
│   │   └── logout.js
│   │
│   ├── blogs/
│   │   ├── create.js
│   │   ├── update.js
│   │   ├── delete.js
│   │   ├── get.js
│   │   ├── getAll.js
│   │   └── publish.js
│   │
│   └── lib/
│       ├── mongodb.js
│       ├── auth.js
│       ├── validation.js
│       └── response.js
│
├── public/
│
├── package.json
└── README.md
```

---

# Database Design

## Collection

```
blogs
```

## Blog Document

```javascript
{
  _id: ObjectId,

  title: String,

  slug: String,

  excerpt: String,

  content: String,

  coverImage: String,

  category: String,

  tags: [String],

  author: String,

  isPublished: Boolean,

  publishedAt: Date,

  createdAt: Date,

  updatedAt: Date
}
```

---

# Application Features

## Public Website

### Blog Listing

Display only published blogs.

Each blog card should include:

* Cover Image
* Title
* Excerpt
* Author
* Category
* Tags
* Published Date
* Read More button

---

### Blog Details

Route:

```
/blog/:slug
```

Display:

* Cover Image
* Blog Title
* Author
* Published Date
* Blog Content
* Categories
* Tags
* Related Articles

---

# Admin Dashboard

Route:

```
/admin
```

This page must be protected and accessible only after successful authentication.

---

## Dashboard Overview

Display statistics:

* Total Blogs
* Published Blogs
* Draft Blogs

Display a management table with:

* Title
* Status
* Published Date
* Last Updated
* Edit
* Delete

---

## Create Blog

The blog editor should provide:

* Title
* Auto-generated Slug (editable)
* Excerpt
* Category
* Tags
* Cover Image Upload
* Rich Text Content
* Publish Toggle

Actions:

* Save Draft
* Publish

---

## Edit Blog

Allow administrators to:

* Modify all blog information
* Update timestamps automatically
* Republish drafts

---

## Delete Blog

Provide confirmation before deletion.

Hard delete is acceptable.

---

# Rich Text Editor

Recommended editor:

* Tiptap

Alternative options:

* React Quill
* Editor.js

The editor should support:

* Headings
* Paragraphs
* Lists
* Code Blocks
* Quotes
* Links
* Images
* Bold
* Italic
* Underline

Store generated HTML inside MongoDB.

---

# Image Upload

Use Cloudinary for media storage.

Workflow:

```
User Selects Image
        │
        ▼
Upload to Cloudinary
        │
        ▼
Receive Image URL
        │
        ▼
Store URL in MongoDB
```

Do not store binary image data inside MongoDB.

---

# API Endpoints

## Authentication

### Login

```
POST /api/auth/login
```

### Logout

```
POST /api/auth/logout
```

---

## Blog APIs

### Get all blogs

```
GET /api/blogs
```

---

### Get blog by slug

```
GET /api/blogs/:slug
```

---

### Create blog

```
POST /api/blogs
```

---

### Update blog

```
PUT /api/blogs/:id
```

---

### Delete blog

```
DELETE /api/blogs/:id
```

---

### Publish or Unpublish

```
PATCH /api/blogs/:id/publish
```

---

# MongoDB Connection

Create a reusable MongoDB utility.

Requirements:

* Singleton connection
* Connection reuse between serverless executions
* Read connection string from environment variables
* Proper error handling

---

# Environment Variables

```env
MONGODB_URI=

DATABASE_NAME=

ADMIN_USERNAME=

ADMIN_PASSWORD=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

---

# Security Requirements

* Never expose MongoDB credentials to the frontend.
* Protect every admin API endpoint using JWT authentication.
* Store authentication token inside an HttpOnly Cookie.
* Validate every request payload.
* Sanitize rich text before rendering.
* Keep all secrets inside environment variables.
* Return consistent API responses.
* Handle authentication and authorization errors properly.

---

# Performance Considerations

* Reuse MongoDB connections.
* Query only published blogs for public pages.
* Add indexes for:

```
slug
isPublished
publishedAt
```

* Lazy load the Rich Text Editor.
* Optimize images using Cloudinary transformations.
* Cache public blog requests where appropriate.

---

# Future Improvements

* Markdown support
* Search functionality
* Categories page
* Tag filtering
* Pagination
* Estimated reading time
* SEO metadata
* Open Graph images
* XML Sitemap
* RSS Feed
* Syntax highlighting
* Scheduled publishing
* Multiple administrator accounts
* Analytics dashboard
* Comment system
* Draft autosave
* Blog preview before publishing

---

# Deliverables

The completed implementation should include:

* Modular React frontend integrated into the existing Vite application.
* Vercel Serverless Functions replacing a traditional Express backend.
* Secure MongoDB Atlas integration.
* Administrator authentication.
* Full blog CRUD functionality.
* Rich text editing experience.
* Cloudinary image uploads.
* Public blog listing and detail pages.
* Clean and maintainable project architecture.
* Environment-based configuration for local development and production.
* Documentation covering setup, deployment, API endpoints, and project structure.

---

# Success Criteria

The project will be considered complete when:

* Administrators can securely log in.
* Blogs can be created, edited, deleted, and published.
* Images are uploaded successfully to Cloudinary.
* Published blogs appear on the public website.
* Draft blogs remain hidden.
* MongoDB credentials are never exposed to the client.
* The application is fully deployable on Vercel without requiring an Express server.
* The codebase is modular, scalable, and well-documented.
* Existing website functionality remains unaffected after integration.
* All features are tested and working as expected.
