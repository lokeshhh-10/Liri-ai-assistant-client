import React, { useState, useEffect } from 'react';
import './Projects.css';

const Projects: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});
  const [activeLightboxProject, setActiveLightboxProject] = useState<number | null>(null);
  const [activeLightboxImageIndex, setActiveLightboxImageIndex] = useState<number>(0);
  const [showAll, setShowAll] = useState(false);

  const INITIAL_COUNT = 3;

  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const triggerLiriForProject = (title: string) => {
    window.dispatchEvent(
      new CustomEvent('open-liri-chat', {
        detail: { prompt: `Tell me about the architecture, tech stack, and features of the project "${title}".` },
      })
    );
  };

  const getProjectImages = (projectId: number): string[] => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return [];
    return project.images || (project.image ? [project.image] : []);
  };

  const projects = [
    {
      id: 1,
      title: 'LiveSurvey',
      category: 'Real-Time',
      description: 'LiveSurvey is a full-stack real-time survey platform built to handle dynamic form creation and live analytics streaming. It implements an event-driven communication model using Socket.io to process and push survey responses instantly to connected clients. The application integrates Chart.js for real-time data visualization, enabling interactive dashboards that update as responses are submitted.',
      technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'JWT', 'Chart.js', 'Tailwind CSS'],
      githubUrl: 'https://github.com/lokeshhh-10/LiveSurvey',
      liveUrl: 'https://live-survey-rho.vercel.app/',
      images: ['/Live_1.png', '/Live_2.png', '/Live_3.png', '/Live_4.png']
    },
    {
      id: 2,
      title: 'JewelryPro',
      category: 'ERP / CRM',
      description: 'JEWELRYPRO is a scalable, full-stack Jewelry ERP platform developed for a jewelry business to modernize and digitize core retail operations. The system centralizes billing, inventory tracking, and customer management into a single, secure web application, enabling efficient store operations and role-based access.',
      technologies: ['React', 'Redux', 'MUI', 'Node.js', 'PostgreSQL', 'Prisma', 'Express', 'JWT', 'Cloudinary', 'RBAC'],
      githubUrl: '',
      liveUrl: '',
      images: ['/Jewellery_1.png', '/Jewellery_2.png', '/Jewellery_3.png', '/Jewellery_4.png', '/Jewellery_5.png', '/Jewellery_6.png', '/Jewellery_7.png', '/Jewellery_8.png', '/Jewellery_9.png', '/Jewellery_10.png']
    },
    {
      id: 3,
      title: 'Liri - Ai Assistant',
      category: 'AI / LLM',
      description: 'LIRI is an AI-powered portfolio assistant designed to make your portfolio interactive and conversational. Instead of just displaying static project details, LIRI intelligently engages with users, answering questions about skills, experience, and projects in real time using Gemini API.',
      technologies: ['React', 'Typescript', 'Node.js', 'Express', 'MongoDB', 'Gemini API'],
      githubUrl: 'https://github.com/lokeshhh-10/Liri-ai-assistant-client',
      liveUrl: '',
      image: '/Liri.png'
    },
    {
      id: 4,
      title: 'Guest Room Application',
      category: 'Full-Stack',
      description: 'The Guest Room Application is a scalable, full-stack management system engineered to digitize and optimize guest accommodation workflows. It provides a secure, API-driven platform for handling room inventory, guest lifecycle management, and booking operations.',
      technologies: ['React', 'Redux', 'Tailwind CSS', 'Node.js', 'Express', 'JWT', 'Cloudinary', 'MongoDB', 'MVC'],
      githubUrl: 'https://github.com/lokeshhh-10/Guest-Room-App',
      liveUrl: '',
      images: ['/Guest_1.png', '/Guest_2.png', '/Guest_3.png', '/Guest_4.png', '/Guest_5.png']
    }
  ];

  const filteredProjects = selectedFilter === 'All' 
    ? projects 
    : projects.filter(p => p.category === selectedFilter);

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

  const handleLightboxImageChange = (direction: 'prev' | 'next') => {
    if (activeLightboxProject === null) return;
    const images = getProjectImages(activeLightboxProject);
    if (images.length <= 1) return;

    if (direction === 'next') {
      setActiveLightboxImageIndex((prev) => (prev + 1) % images.length);
    } else {
      setActiveLightboxImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  useEffect(() => {
    if (activeLightboxProject === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleLightboxImageChange('next');
      } else if (e.key === 'ArrowLeft') {
        handleLightboxImageChange('prev');
      } else if (e.key === 'Escape') {
        setActiveLightboxProject(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeLightboxProject, activeLightboxImageIndex]);

  const categories = ['All', 'Real-Time', 'ERP / CRM', 'AI / LLM', 'Full-Stack'];

  return (
    <section id="projects" className="projects">
      <div className="projects-header-container">
        <div className="projects-header">
          <h2 className="section-number">02.</h2>
          <h3 className="section-title">Some Things I've Built</h3>
        </div>

        {/* Filter Tabs */}
        <div className="projects-filter-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${selectedFilter === cat ? 'active' : ''}`}
              onClick={() => setSelectedFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="projects-list">
        {(showAll ? filteredProjects : filteredProjects.slice(0, INITIAL_COUNT)).map((project) => {
          const currentIndex = project.images ? (currentImageIndex[project.id] || 0) : 0;
          const displayImage = project.image || (project.images ? project.images[currentIndex] : null);

          return (
            <div key={project.id} className="project-item">
              <div className="project-content">
                <div className="project-label">Featured Project • {project.category}</div>
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
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub Link"
                      className="project-link"
                      title="View GitHub Source"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="External Link"
                      className="project-link"
                      title="View Live Demo"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                  )}
                  
                  {/* Ask Liri Button */}
                  <button
                    className="ask-liri-project-btn"
                    onClick={() => triggerLiriForProject(project.title)}
                    title={`Ask Liri AI about ${project.title}`}
                  >
                    🤖 Ask Liri about this
                  </button>
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
                                    loading="lazy"
                                    src={displayImage}
                                    alt={`${project.title} - Screenshot ${currentIndex + 1}`}
                                    className="project-screenshot clickable-image"
                                    onClick={() => {
                                      setActiveLightboxProject(project.id);
                                      setActiveLightboxImageIndex(currentIndex);
                                    }}
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
                                      <path d="M10 12l-4-4 4-4" />
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
                                      <path d="M6 12l4-4-4-4" />
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
                              <img
                                src={displayImage}
                                alt={project.title}
                                className="project-screenshot clickable-image"
                                onClick={() => {
                                  if (displayImage) {
                                    setActiveLightboxProject(project.id);
                                    setActiveLightboxImageIndex(0);
                                  }
                                }}
                              />
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

      {filteredProjects.length > INITIAL_COUNT && (
        <div className="projects-show-more">
          <button
            className="projects-show-more-btn"
            onClick={() => setShowAll(prev => !prev)}
            aria-expanded={showAll}
          >
            {showAll ? (
              <>
                Show Less
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </>
            ) : (
              <>
                Show More ({filteredProjects.length - INITIAL_COUNT} more)
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      {activeLightboxProject !== null && (() => {
        const project = projects.find(p => p.id === activeLightboxProject);
        if (!project) return null;
        const images = getProjectImages(activeLightboxProject);
        const currentImg = images[activeLightboxImageIndex];

        return (
          <div
            className="lightbox-overlay"
            onClick={() => setActiveLightboxProject(null)}
          >
            <button
              className="lightbox-close"
              onClick={() => setActiveLightboxProject(null)}
              aria-label="Close lightbox"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {images.length > 1 && (
              <button
                className="lightbox-btn lightbox-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLightboxImageChange('prev');
                }}
                aria-label="Previous image"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
            )}

            <div className="lightbox-image-container" onClick={(e) => e.stopPropagation()}>
              <img
                src={currentImg}
                alt={`${project.title} - Zoomed View`}
                className="lightbox-img"
              />
              <div className="lightbox-footer">
                <span className="lightbox-title">{project.title}</span>
                {images.length > 1 && (
                  <span className="lightbox-counter">
                    {activeLightboxImageIndex + 1} / {images.length}
                  </span>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <button
                className="lightbox-btn lightbox-next"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLightboxImageChange('next');
                }}
                aria-label="Next image"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            )}
          </div>
        );
      })()}
    </section>
  );
};

export default Projects;