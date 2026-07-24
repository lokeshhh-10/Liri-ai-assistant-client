import React from 'react';
import './Hero.css';

interface HeroProps {
  onOpenResume?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenResume }) => {
  const handleResumeDownload = () => {
    const link = document.createElement('a');
    link.href = '/Resume_Lokesh.pdf';
    link.download = 'Resume_Lokesh.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerLiri = (prompt: string) => {
    window.dispatchEvent(
      new CustomEvent('open-liri-chat', {
        detail: { prompt },
      })
    );
  };

  return (
    <section id="hero" className="hero">
      <div className="hero-container">
        <div className="hero-content">
          {/* Live Status Badge */}
          <div className="hero-status-badge">
            <span className="status-dot"></span>
            <span>Available for Full-Time Roles & Projects</span>
          </div>

          <p className="hero-greeting">Hi, my name is</p>
          <h1 className="hero-name">Lokeshwaran K.</h1>
          
          {/* Static Hero Title */}
          <h2 className="hero-title">I build software that thinks.</h2>

          <p className="hero-description">
            I’m a software engineer specializing in building high-quality, scalable applications, with a strong
            focus on AI-powered and data-driven solutions. My current work centers on developing human-centered
            products using clean, efficient, and maintainable code. I’m passionate about crafting reliable systems 
            that leverage data and intelligence to deliver meaningful user experiences and <span className="highlight-company">long-term value</span>.
          </p>

          {/* Liri AI Prompt Chips inside Hero */}
          <div className="hero-liri-prompt-container">
            <span className="hero-liri-label">🤖 Ask my AI Assistant (Liri):</span>
            <div className="hero-liri-chips">
              <button 
                className="hero-chip-btn" 
                onClick={() => triggerLiri("What are Lokesh's top technical skills and experience?")}
              >
                "Top Tech Skills"
              </button>
              <button 
                className="hero-chip-btn" 
                onClick={() => triggerLiri("Tell me about Lokesh's work at I Bacus Tech labs")}
              >
                "Work Experience"
              </button>
              <button 
                className="hero-chip-btn" 
                onClick={() => triggerLiri("What real-time applications has Lokesh built?")}
              >
                "Featured Projects"
              </button>
            </div>
          </div>

          <div className="hero-cta">
            <a href="#projects" className="btn btn-primary">
              Check out my work!
            </a>

            {onOpenResume && (
              <button onClick={onOpenResume} className="btn btn-secondary highlight-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                View Resume
              </button>
            )}

            <button onClick={handleResumeDownload} className="btn btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;