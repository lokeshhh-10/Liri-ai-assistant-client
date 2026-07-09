import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import Tech from './sections/Tech';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Blogs from './sections/Blogs';
import Login from './pages/Login/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import BlogEditor from './pages/Admin/BlogEditor';
import BlogDetails from './pages/Blog/BlogDetails';
import BlogList from './pages/Blog/BlogList';
import { useState } from 'react';
import type { Blog } from './services/blogService';

// ---- Admin App Shell ----
type AdminView = 'dashboard' | 'new' | 'edit';

function AdminApp() {
  const { isAuthenticated, isCheckingAuth } = useAuth();
  const [view, setView] = useState<AdminView>('dashboard');
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  if (isCheckingAuth) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: 32,
          height: 32,
          border: '2px solid var(--border-color)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  if (view === 'new') {
    return (
      <BlogEditor
        blog={null}
        onSuccess={() => setView('dashboard')}
        onCancel={() => setView('dashboard')}
      />
    );
  }

  if (view === 'edit' && editingBlog) {
    return (
      <BlogEditor
        blog={editingBlog}
        onSuccess={() => { setView('dashboard'); setEditingBlog(null); }}
        onCancel={() => { setView('dashboard'); setEditingBlog(null); }}
      />
    );
  }

  return (
    <AdminDashboard
      onNewPost={() => setView('new')}
      onEditPost={(blog) => { setEditingBlog(blog); setView('edit'); }}
    />
  );
}

// ---- Root App ----
const isAdminRoute = window.location.pathname.startsWith('/admin');
const isBlogRoute = window.location.pathname.startsWith('/blog/');
const isBlogsListRoute = window.location.pathname === '/blogs';

function App() {
  if (isAdminRoute) {
    return (
      <ThemeProvider>
        <AuthProvider>
          <AdminApp />
        </AuthProvider>
      </ThemeProvider>
    );
  }

  if (isBlogsListRoute) {
    return (
      <ThemeProvider>
        <div className="App">
          <BlogList />
        </div>
      </ThemeProvider>
    );
  }

  if (isBlogRoute) {
    const slug = window.location.pathname.split('/blog/')[1];
    return (
      <ThemeProvider>
        <div className="App">
          <Header />
          <main>
            <BlogDetails slug={slug} />
          </main>
          <Footer />
          <ChatWidget />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="App">
        <Header />
        <main>
          <Hero />
          <About />
          <Projects />
          <Tech />
          <Blogs />
          <Contact />
        </main>
        <Footer />
        <ChatWidget />
      </div>
    </ThemeProvider>
  );
}

export default App;