import React, { useState } from 'react';
import './Projects.css';

const Projects: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  const projects = [
    {
      id: 1,
      // title: 'JEWELRYPRO',
      title: 'JewelryPro',
      // description: 'JEWELRYPRO is a full-stack CRM (Customer Relationship Management) system created to digitize and streamline jewelry retail workflows for a jewelry business. It focuses on simplifying billing, inventory, and customer management through a single, user-friendly web application.',
      description: 'JEWELRYPRO is a scalable, full-stack Jewelry Retail CRM platform developed for a jewelry business to modernize and digitize core retail operations. The system centralizes billing, inventory tracking, and customer management into a single, secure web application, enabling efficient store operations, accurate data handling, and role-based access for different staff members.',
      technologies: ['React', 'Redux', 'MUI', 'Node.js', 'PostgreSQL', 'Prisma', 'Express', 'JWT', 'Cloudinary', 'RBAC'],
      // githubUrl: '',
      // liveUrl: '',
      image: '/Jewellery.png'
    },
    {
      id: 2,
      title: 'Liri - Ai Assistant',
      description: 'LIRI is an AI-powered portfolio assistant designed to make your portfolio interactive and conversational. Instead of just displaying static project details, LIRI intelligently engages with users, answering questions about your skills, experience, and projects in real time — like a chatbot tailored for your personal portfolio. It represents a modern, AI-driven approach to personal branding — combining AI + Web Development + Natural Language Understanding.',
      technologies: ['React', 'Typescript', 'Node.js', 'Express', 'MongoDB', 'Gemini API', 'RAG(Vector DB)',],
      githubUrl: 'https://github.com/lokeshhh-10/Liri-ai-assistant-client',
      liveUrl: '',
      image: '/Liri.png'
    },
    {
      id: 3,
      title: 'Guest Room Application',
      description: 'The Guest Room Application is a scalable, full-stack management system engineered to digitize and optimize guest accommodation workflows. It provides a secure, API-driven platform for handling room inventory, guest lifecycle management, and booking operations, built with a modular architecture that emphasizes performance optimization, maintainability, and seamless user experience.',
      technologies: ['React', 'Redux', 'Tailwind CSS', 'Node.js', 'Express', 'JWT', 'Cloudinary', 'MongoDB', 'MVC'],
      githubUrl: 'https://github.com/lokeshhh-10/Guest-Room-App',
      liveUrl: '',
      images: ['/Guest_1.png', '/Guest_2.png', '/Guest_3.png', '/Guest_4.png', '/Guest_5.png' ]
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
                              {project.title === 'JewelryPro' 
                                ? 'JewelryPro' 
                                : project.title === 'Liri - Ai Assistant' 
                                ? 'Liri Ai Assistant' 
                                : 'Guest Room App'}
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