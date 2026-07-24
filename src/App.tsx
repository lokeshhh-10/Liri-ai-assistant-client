import './App.css';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
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
import NotFound from './pages/NotFound/NotFound';
import ResumeModal from './components/ResumeModal';
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

// Wrapper for BlogDetails to extract slug param
const BlogDetailsWrapper = () => {
  const { slug } = useParams<{ slug: string }>();
  return <BlogDetails slug={slug || ''} />;
};

// Home View Component
const HomeView = ({ onOpenResume }: { onOpenResume: () => void }) => {
  return (
    <div className="App">
      <Header />
      <main>
        <Hero onOpenResume={onOpenResume} />
        <About />
        <Projects />
        <Tech />
        <Blogs />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
};

import ChatPage from './pages/Chat/ChatPage';

// Root App with react-router-dom
function App() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeView onOpenResume={() => setIsResumeOpen(true)} />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route
            path="/blogs"
            element={
              <div className="App">
                <Header minimal={true} />
                <BlogList />
                <ChatWidget />
              </div>
            }
          />
          <Route
            path="/blog/:slug"
            element={
              <div className="App">
                <Header minimal={true} />
                <main>
                  <BlogDetailsWrapper />
                </main>
                <Footer />
                <ChatWidget />
              </div>
            }
          />
          <Route
            path="/admin/*"
            element={
              <AuthProvider>
                <AdminApp />
              </AuthProvider>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>


        {/* Resume Modal */}
        <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;