import React, { useState } from 'react';
import './Projects.css';

const Projects: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  const projects = [
    {
      id: 1,
      title: 'Edemenu',
      description: 'A B2B and B2C digital menu management platform with AI-powered menu generation from PDFs using GPT-5. Built with microservices architecture featuring analytics, multi-authentication, and payment integrations, all containerized with Docker and deployed on AWS.',
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'OpenAI GPT-5', 'Prisma'],
      githubUrl: 'https://github.com/EdemenuOrg',
      liveUrl: 'https://edemenu.com/',
      image: '/Edemenu_preview.png'
    },
    {
      id: 2,
      title: 'TrojAuth',
      description: 'A secure login application with React frontend and Spring Boot backend, featuring JWT authentication, OAuth 2.0 (Google & GitHub), and multi-factor authentication with email OTP and TOTP support. Built with microservices architecture and deployed using Docker and Kubernetes.',
      technologies: ['React', 'Spring Boot', 'Java', 'MySQL', 'JWT', 'OAuth 2.0', 'Docker', 'Kubernetes'],
      githubUrl: 'https://github.com/Shreyas2877/LogIn/tree/stable-v1.1',
      liveUrl: 'https://medium.com/@shreyas.raviprakash/building-a-secure-scalable-login-application-with-microservices-oauth-mfa-react-spring-mysql-daa2983ddc3e',
      images: ['/TrojApp.jpg', '/TrojApp_1.jpg', '/TrojApp2.jpg']
    },
    {
      id: 3,
      title: 'Troj-MCP',
      description: 'A comprehensive Model Context Protocol (MCP) server providing powerful tools for system integration, file operations, calendar management, and email handling. Built with Python and FastAPI, featuring 95%+ test coverage, comprehensive logging, and secure command execution with input validation. Includes Docker support for easy deployment and supports calendar integration, email management, and system monitoring capabilities.',
      technologies: ['Python', 'FastAPI', 'MCP', 'Docker', 'Pydantic', 'Ruff', 'MyPy'],
      githubUrl: 'https://github.com/Shreyas2877/Troj-MCP',
      liveUrl: '',
      image: '/TrojMCP.png'
    }
  ];

  const handleImageChange = (projectId: number, direction: 'prev' | 'next') => {
    const project = projects.find(p => p.id === projectId);
    if (!project || !project.images) return;

    const currentIndex = currentImageIndex[projectId] || 0;
    const totalImages = project.images.length;
    
    if (direction === 'next') {
      setCurrentImageIndex({
        ...currentImageIndex,
        [projectId]: (currentIndex + 1) % totalImages
      });
    } else {
      setCurrentImageIndex({
        ...currentImageIndex,
        [projectId]: currentIndex === 0 ? totalImages - 1 : currentIndex - 1
      });
    }
  };

  return (
    <section id="projects" className="projects">
      <div className="projects-header-container">
        <div className="projects-header">
          <h2 className="section-number">02.</h2>
          <h3 className="section-title">Some Things I've Built</h3>
        </div>
      </div>
      
      <div className="projects-list">
        {projects.map((project) => {
          const currentIndex = project.images ? (currentImageIndex[project.id] || 0) : 0;
          const displayImage = project.image || (project.images ? project.images[currentIndex] : null);
          
          return (
            <div key={project.id} className="project-item">
              <div className="project-content">
                <div className="project-label">Featured Project</div>
                <h4 className="project-title">
                  {project.liveUrl ? (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="project-title-link"
                    >
                      {project.title}
                    </a>
                  ) : (
                    <span className="project-title-link">{project.title}</span>
                  )}
                </h4>
                <div className="project-description-wrapper">
                  <p className="project-description">{project.description}</p>
                </div>
                <ul className="project-tech-list">
                  {project.technologies.map((tech, techIndex) => (
                    <li key={techIndex}>{tech}</li>
                  ))}
                </ul>
                <div className="project-links">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub Link"
                    className="project-link"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  </a>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="External Link"
                      className="project-link"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
              <div className="project-image-wrapper">
                <div className={`project-image ${displayImage ? 'has-image' : ''}`}>
                  {displayImage ? (
                    <div className="monitor-frame">
                      <div className="monitor-screen">
                        <div className="browser-window">
                          <div className="browser-header">
                            <div className="browser-dots">
                              <span className="browser-dot dot-red"></span>
                              <span className="browser-dot dot-yellow"></span>
                              <span className="browser-dot dot-green"></span>
                            </div>
                            <div className="browser-url">
                              {project.title === 'TrojAuth' 
                                ? 'login.dev' 
                                : project.title === 'Troj-MCP' 
                                ? 'troj-mcp.local' 
                                : 'edemenu.com'}
                            </div>
                          </div>
                          <div className="browser-content">
                            {project.images && project.images.length > 1 ? (
                              <>
                                <div className="image-carousel">
                                  <img 
                                    src={displayImage} 
                                    alt={`${project.title} - Screenshot ${currentIndex + 1}`} 
                                    className="project-screenshot"
                                    onError={() => {
                                      setImageErrors({
                                        ...imageErrors,
                                        [displayImage]: true
                                      });
                                    }}
                                    onLoad={() => {
                                      setImageErrors({
                                        ...imageErrors,
                                        [displayImage]: false
                                      });
                                    }}
                                  />
                                  <button 
                                    className="carousel-btn carousel-prev"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleImageChange(project.id, 'prev');
                                    }}
                                    aria-label="Previous image"
                                  >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M10 12l-4-4 4-4"/>
                                    </svg>
                                  </button>
                                  <button 
                                    className="carousel-btn carousel-next"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleImageChange(project.id, 'next');
                                    }}
                                    aria-label="Next image"
                                  >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M6 12l4-4-4-4"/>
                                    </svg>
                                  </button>
                                </div>
                                <div className="carousel-indicators">
                                  {project.images.map((_, idx) => (
                                    <button
                                      key={idx}
                                      className={`carousel-indicator ${idx === currentIndex ? 'active' : ''}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentImageIndex({
                                          ...currentImageIndex,
                                          [project.id]: idx
                                        });
                                      }}
                                      aria-label={`Go to image ${idx + 1}`}
                                    />
                                  ))}
                                </div>
                              </>
                            ) : (
                              <img src={displayImage} alt={project.title} className="project-screenshot" />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="monitor-base"></div>
                    </div>
                  ) : (
                    <div className="project-image-placeholder">
                      <span>💻</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Projects;