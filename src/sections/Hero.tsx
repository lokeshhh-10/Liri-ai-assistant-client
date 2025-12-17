import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  const handleResumeDownload = () => {
    const link = document.createElement('a');
    link.href = '/Resume_Lokesh.pdf';
    link.download = 'Resume_Lokesh.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="hero" className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <p className="hero-greeting">Hi, my name is</p>
          <h1 className="hero-name">
            Lokeshwaran K.
          </h1>
          <h2 className="hero-title">I build things for the web.</h2>
          {/* <p className="hero-description">
            I'm a software engineer specializing in building (and occasionally designing)
            exceptional applications. Currently, I’m focused on building human-centered, 
            high-quality products with clean and  <span className="highlight-company">efficient code</span>.
          </p> */}
          <p className="hero-description">
            I’m a software engineer specializing in building high-quality, scalable applications, with a strong
            focus on AI-powered and data-driven solutions. My current work centers on developing human-centered
            products using clean, efficient, and maintainable code. I’m passionate about crafting reliable systems 
            that leverage data and intelligence to deliver meaningful user experiences and <span className="highlight-company">long-term value</span>.
          </p>
          <div className="hero-cta">
            <a 
              href="#projects"
              className="btn btn-primary"
            >
              Check out my work!
            </a>
            <button 
              onClick={handleResumeDownload}
              className="btn btn-secondary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download Resume
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;