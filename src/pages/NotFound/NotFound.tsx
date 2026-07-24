import React, { useState, useEffect } from 'react';
import inboxZeroDark from '../../assets/inbox-zero-dark.svg';
import './NotFound.css';

const DEV_EXCUSES = [
  "This page worked on my local machine ¯\\_(ツ)_/¯",
  "404: Page got stuck in an unresolved git merge conflict.",
  "Looks like this route took a `git reset --hard` into oblivion.",
  "Tried fetching this page, but got a 404 from the multiverse.",
  "This page was refactored into non-existence.",
  "Error 404: Page was garbage-collected by V8.",
  "This route went to grab coffee and hasn't returned yet.",
];

const NotFound: React.FC = () => {
  const [excuseIndex, setExcuseIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cmdInput, setCmdInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "Type 'help' or 'options' to see available commands, or 'home' to return.",
  ]);

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/404';

  useEffect(() => {
    document.title = '404: Page Not Found — Lokeshwaran K';
    
    // Select a random excuse on mount
    setExcuseIndex(Math.floor(Math.random() * DEV_EXCUSES.length));

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Normalize mouse coordinates from -1 to 1
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleNextExcuse = () => {
    setExcuseIndex((prev) => (prev + 1) % DEV_EXCUSES.length);
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = cmdInput.trim().toLowerCase();
    if (!cmd) return;

    let newOutputs: string[] = [...terminalOutput, `$ ${cmdInput}`];

    if (cmd === 'help' || cmd === 'options' || cmd === 'ls' || cmd === 'dir') {
      newOutputs.push('Available commands: home, blogs, projects, joke, sudo, clear');
    } else if (cmd === 'home' || cmd === 'cd ~' || cmd === 'cd /') {
      newOutputs.push('Redirecting to home page...');
      setTimeout(() => { window.location.href = '/'; }, 600);
    } else if (cmd === 'blogs' || cmd === 'cd /blogs') {
      newOutputs.push('Redirecting to blogs...');
      setTimeout(() => { window.location.href = '/blogs'; }, 600);
    } else if (cmd === 'projects' || cmd === 'cd /projects') {
      newOutputs.push('Redirecting to projects...');
      setTimeout(() => { window.location.href = '/#projects'; }, 600);
    } else if (cmd === 'joke') {
      const nextJoke = DEV_EXCUSES[(excuseIndex + 1) % DEV_EXCUSES.length];
      newOutputs.push(`💬 "${nextJoke}"`);
    } else if (cmd.startsWith('sudo')) {
      newOutputs.push('🔒 Nice try! Permission denied by System Admin 🤖');
    } else if (cmd === 'clear') {
      newOutputs = [];
    } else {
      newOutputs.push(`bash: ${cmd}: command not found. Type 'help' or 'options' to list commands.`);
    }

    setTerminalOutput(newOutputs);
    setCmdInput('');
  };

  return (
    <div className="nf-container">
      {/* Background Starfield Grid */}
      <div className="nf-grid-bg" />

      {/* Floating Star Particles */}
      <div className="nf-star s1" />
      <div className="nf-star s2" />
      <div className="nf-star s3" />
      <div className="nf-star s4" />

      {/* Floating Parallax Layers across viewport */}
      <div
        className="nf-parallax-layer"
        style={{
          transform: `translate3d(${mousePos.x * -18}px, ${mousePos.y * -18}px, 0)`,
        }}
      >
        {/* Top Left: Liri AI Radar Badge */}
        <div className="nf-floating-icon nf-badge-radar" title="Liri AI Radar — Scanning System">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nf-radar-icon">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="12" cy="12" r="1" />
            <path d="M12 12L18.36 5.64" />
          </svg>
          <span className="nf-radar-dot" />
          <span>Liri AI: Signal Lost</span>
        </div>

        {/* Middle Left: System Badge */}
        <div className="nf-floating-icon nf-badge-sys">
          <span>v8::GarbageCollector</span>
        </div>

        {/* Bottom Left: Git Pill */}
        <div className="nf-floating-icon nf-badge-git">
          <code>git checkout main</code>
        </div>

        {/* Top Right: HTTP 404 Status */}
        <div className="nf-floating-icon nf-badge-404">
          <span>HTTP 404</span>
        </div>

        {/* Middle Right: Error Card */}
        <div className="nf-floating-icon nf-badge-err">
          <span>ERR_PAGE_NOT_FOUND</span>
        </div>

        {/* Bottom Right: Commit Pill */}
        <div className="nf-floating-icon nf-badge-commit">
          <code>commit: 0xdeadbeef</code>
        </div>
      </div>

      <div
        className="nf-content"
        style={{
          transform: `translate3d(${mousePos.x * 8}px, ${mousePos.y * 8}px, 0)`,
        }}
      >
        {/* Main 404 Hero */}
        <div className="nf-header">
          <div className="nf-illustration-wrapper">
            <img src={inboxZeroDark} alt="404 Page Illustration" className="nf-illustration-img" />
          </div>
          <div className="nf-code-tag">&lt;Error 404 /&gt;</div>
          <h1 className="nf-title">404</h1>
          <h2 className="nf-subtitle">This is not the page you are looking for</h2>
          <p className="nf-excuse" onClick={handleNextExcuse} title="Click for another excuse!">
            "{DEV_EXCUSES[excuseIndex]}"
            <span className="nf-shuffle-hint"> 🎲 Click for next excuse</span>
          </p>
        </div>

        {/* Interactive Terminal Window */}
        <div className="nf-terminal-card">
          <div className="nf-terminal-bar">
            <div className="nf-terminal-dots">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
            </div>
            <div className="nf-terminal-title">bash — 404: {currentPath}</div>
          </div>
          <div className="nf-terminal-body">
            <div className="nf-terminal-log">
              <p className="nf-log-err">
                fatal: pathspec '{currentPath}' did not match any file(s) known to git.
              </p>
              {terminalOutput.map((line, idx) => (
                <p key={idx} className="nf-log-line">{line}</p>
              ))}
            </div>
            <form onSubmit={handleCommandSubmit} className="nf-terminal-form">
              <span className="nf-prompt">guest@lokesh-portfolio:~$&nbsp;</span>
              <input
                type="text"
                className="nf-terminal-input"
                value={cmdInput}
                onChange={(e) => setCmdInput(e.target.value)}
                placeholder="type 'help' or 'home'..."
                autoFocus
              />
            </form>
          </div>
        </div>

        {/* Quick Action Navigation */}
        <div className="nf-actions">
          <a href="/" className="nf-btn nf-btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Return to Safety
          </a>
          <a href="/blogs" className="nf-btn nf-btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            Read Blogs
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
