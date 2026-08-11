import React, { useState } from 'react';
import './Projects.css';

interface Highlight {
  icon: string;
  title: string;
  desc: string;
}

interface ArchGroup {
  name: string;
  color: 'purple' | 'cyan' | 'green';
  nodes: { label: string; sub: string; icon: string; badge?: string }[];
}

interface ArchConnection {
  label: string;
}

interface Project {
  id: number;
  title: string;
  category: string;
  filename: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  highlights: Highlight[];
  archGroups: ArchGroup[];
  archConnections: ArchConnection[];
  codeSnippet: string;
  codeLanguage: string;
}

const Projects: React.FC = () => {
  const [activeTabs, setActiveTabs] = useState<{ [key: number]: 'highlights' | 'architecture' | 'code' }>({});
  const [showAll, setShowAll] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const INITIAL_COUNT = 3;

  const triggerLiriForProject = (title: string) => {
    window.dispatchEvent(
      new CustomEvent('open-liri-chat', {
        detail: { prompt: `Tell me about the architecture, tech stack, and features of the project "${title}".` },
      })
    );
  };

  const projects: Project[] = [
    {
      id: 1,
      title: 'LiveSurvey',
      category: 'Real-Time',
      filename: 'LiveSurvey.config.ts',
      description:
        'LiveSurvey is a full-stack real-time survey platform built to handle dynamic form creation and live analytics streaming. It implements an event-driven communication model using Socket.io to process and push survey responses instantly to connected clients. The application integrates Chart.js for real-time data visualization, enabling interactive dashboards that update as responses are submitted.',
      technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'JWT', 'Chart.js', 'Tailwind CSS'],
      githubUrl: 'https://github.com/lokeshhh-10/LiveSurvey',
      liveUrl: 'https://live-survey-rho.vercel.app/',
      highlights: [
        { icon: '⚡', title: 'Event-Driven Stream', desc: 'Real-time response broadcasting via Socket.io channels' },
        { icon: '📊', title: 'Dynamic Visual Analytics', desc: 'Live Chart.js integration for streaming response metrics' },
        { icon: '🔒', title: 'JWT Authentication', desc: 'Secure user identity verification and role authorization' },
        { icon: '🗄️', title: 'NoSQL Aggregations', desc: 'MongoDB schema optimized for dynamic survey templates' },
      ],
      archGroups: [
        {
          name: 'CLIENT TIER',
          color: 'purple',
          nodes: [
            { label: 'React Form Engine', sub: 'Dynamic Survey UI', icon: '💻' },
            { label: 'Chart.js Dashboard', sub: 'Streaming Analytics', icon: '📊' },
          ],
        },
        {
          name: 'REAL-TIME & API TIER',
          color: 'cyan',
          nodes: [
            { label: 'Socket.io Hub', sub: 'Event Bus (WSS)', icon: '⚡' },
            { label: 'Express API Handler', sub: 'Node.js Service', icon: '🛠️' },
          ],
        },
        {
          name: 'DATA & STORAGE TIER',
          color: 'green',
          nodes: [
            { label: 'MongoDB Database', sub: 'Survey Collections', icon: '🗄️' },
            { label: 'JWT Auth Engine', sub: 'Session Validation', icon: '🔒' },
          ],
        },
      ],
      archConnections: [
        { label: 'WSS Event' },
        { label: 'MongoDB Query' },
      ],
      codeLanguage: 'typescript',
      codeSnippet: `// LiveSurvey Real-Time Socket Event Processor
io.on('connection', (socket) => {
  socket.on('submit_response', async ({ surveyId, optionId }) => {
    const updatedSurvey = await SurveyModel.findByIdAndUpdate(
      surveyId,
      { $inc: { [\`results.\${optionId}\`]: 1 } },
      { new: true }
    );

    // Broadcast updated chart analytics to room subscribers
    io.to(surveyId).emit('analytics_update', updatedSurvey.results);
  });
});`,
    },
    {
      id: 2,
      title: 'JewelryPro',
      category: 'ERP / CRM',
      filename: 'JewelryPro.schema.prisma',
      description:
        'JEWELRYPRO is a scalable, full-stack Jewelry ERP platform developed for a jewelry business to modernize and digitize core retail operations. The system centralizes billing, inventory tracking, and customer management into a single, secure web application, enabling efficient store operations and role-based access.',
      technologies: ['React', 'Redux', 'MUI', 'Node.js', 'PostgreSQL', 'Prisma', 'Express', 'JWT', 'Cloudinary', 'RBAC'],
      githubUrl: '',
      liveUrl: '',
      highlights: [
        { icon: '💼', title: 'Retail Operations Pipeline', desc: 'Centralized billing, inventory, and customer management' },
        { icon: '🛡️', title: 'Role-Based Access (RBAC)', desc: 'Granular permissions for Admin, Manager, and Staff' },
        { icon: '🗄️', title: 'PostgreSQL & Prisma ORM', desc: 'ACID-compliant relational schema design' },
        { icon: '☁️', title: 'Cloudinary Asset Sync', desc: 'Automated product catalog media storage and optimization' },
      ],
      archGroups: [
        {
          name: 'RETAIL PORTAL',
          color: 'purple',
          nodes: [
            { label: 'React & MUI Portal', sub: 'Billing & Stock Views', icon: '🖥️' },
            { label: 'Redux Toolkit', sub: 'Global Client State', icon: '📦' },
          ],
        },
        {
          name: 'SECURITY & API CONTROLLER',
          color: 'cyan',
          nodes: [
            { label: 'RBAC Guard', sub: 'Role Auth Middleware', icon: '🛡️' },
            { label: 'Express Controllers', sub: 'Billing & Stock Engine', icon: '⚙️' },
          ],
        },
        {
          name: 'DATA & CLOUD STORAGE',
          color: 'green',
          nodes: [
            { label: 'Prisma ORM & Postgres', sub: 'ACID Relational Store', badge: '', icon: '💎' },
            { label: 'Cloudinary Media API', sub: 'Product Catalog Photos', icon: '☁️' },
          ],
        },
      ],
      archConnections: [
        { label: 'REST API' },
        { label: 'Prisma Query' },
      ],
      codeLanguage: 'prisma',
      codeSnippet: `// JewelryPro Inventory Relational Schema
model InventoryItem {
  id          String   @id @default(uuid())
  sku         String   @unique
  name        String
  category    Category @relation(fields: [categoryId], references: [id])
  weightGrams Float
  purityKarat Int
  stockCount  Int      @default(0)
  updatedAt   DateTime @updatedAt
}`,
    },
    {
      id: 3,
      title: 'Liri - Ai Assistant',
      category: 'AI / LLM',
      filename: 'LiriAssistant.service.ts',
      description:
        'LIRI is an AI-powered portfolio assistant designed to make your portfolio interactive and conversational. Instead of just displaying static project details, LIRI intelligently engages with users, answering questions about skills, experience, and projects in real time using Gemini API.',
      technologies: ['React', 'Typescript', 'Node.js', 'Express', 'MongoDB', 'Gemini API'],
      githubUrl: 'https://github.com/lokeshhh-10/Liri-ai-assistant-client',
      liveUrl: '',
      highlights: [
        { icon: '🤖', title: 'Gemini LLM Integration', desc: 'Natural language queries over developer portfolio context' },
        { icon: '💬', title: 'Interactive Chat Widget', desc: 'Non-blocking floating assistant with single-click triggers' },
        { icon: '⚡', title: 'Express API Proxy', desc: 'Secure key proxying with streaming prompt execution' },
        { icon: '📄', title: 'Knowledge Engine', desc: 'Structured system context feeding developer background info' },
      ],
      archGroups: [
        {
          name: 'ASSISTANT WIDGET',
          color: 'purple',
          nodes: [
            { label: 'React Chat Widget', sub: 'Conversational UI', icon: '💬' },
            { label: 'Prompt Dispatcher', sub: 'Single-Click Triggers', icon: '⚡' },
          ],
        },
        {
          name: 'EXPRESS PROXY & CONTEXT',
          color: 'cyan',
          nodes: [
            { label: 'Express Proxy Guard', sub: 'API Token Protection', icon: '🛡️' },
            { label: 'Knowledge Engine', sub: 'Portfolio System Prompt', icon: '📄' },
          ],
        },
        {
          name: 'GEMINI LLM ENGINE',
          color: 'green',
          nodes: [
            { label: 'Gemini 2.0 Flash API', sub: 'Google Inference Service', icon: '🤖' },
            { label: 'MongoDB Log Store', sub: 'Session History', icon: '🗄️' },
          ],
        },
      ],
      archConnections: [
        { label: 'Prompt Payload' },
        { label: 'LLM Stream' },
      ],
      codeLanguage: 'typescript',
      codeSnippet: `// Liri AI Gemini Inference Proxy Service
export const askLiriAI = async (userPrompt: string, history: ChatMessage[]) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: PORTFOLIO_KNOWLEDGE_BASE
  });

  const chat = model.startChat({ history });
  const response = await chat.sendMessage(userPrompt);
  return response.response.text();
};`,
    },
    {
      id: 4,
      title: 'Guest Room Application',
      category: 'Full-Stack',
      filename: 'GuestRoom.controller.ts',
      description:
        'The Guest Room Application is a scalable, full-stack management system engineered to digitize and optimize guest accommodation workflows. It provides a secure, API-driven platform for handling room inventory, guest lifecycle management, and booking operations.',
      technologies: ['React', 'Redux', 'Tailwind CSS', 'Node.js', 'Express', 'JWT', 'Cloudinary', 'MongoDB', 'MVC'],
      githubUrl: 'https://github.com/lokeshhh-10/Guest-Room-App',
      liveUrl: '',
      highlights: [
        { icon: '🏨', title: 'Guest Booking Lifecycle', desc: 'End-to-end room allocation and status tracking' },
        { icon: '🔐', title: 'JWT Session Security', desc: 'Encrypted bearer token auth with role validation' },
        { icon: '🏗️', title: 'MVC Architecture', desc: 'Strict separation of routes, controllers, and services' },
        { icon: '📁', title: 'Cloud Media Store', desc: 'Cloudinary photo upload pipeline for room listings' },
      ],
      archGroups: [
        {
          name: 'BOOKING PORTAL',
          color: 'purple',
          nodes: [
            { label: 'React Booking App', sub: 'Guest UI & Inventory', icon: '🏨' },
            { label: 'Redux State Engine', sub: 'Global Room State', icon: '📦' },
          ],
        },
        {
          name: 'MVC BUSINESS ENGINE',
          color: 'cyan',
          nodes: [
            { label: 'JWT Auth Router', sub: 'Bearer Session Validation', icon: '🔐' },
            { label: 'Room Controllers', sub: 'Allocation & Booking Logic', icon: '⚙️' },
          ],
        },
        {
          name: 'PERSISTENCE & MEDIA',
          color: 'green',
          nodes: [
            { label: 'MongoDB Collections', sub: 'Room & Guest Collections', icon: '🗄️' },
            { label: 'Cloudinary Store', sub: 'Room Photo Gallery', icon: '📁' },
          ],
        },
      ],
      archConnections: [
        { label: 'Bearer Token' },
        { label: 'Mongo DB Op' },
      ],
      codeLanguage: 'typescript',
      codeSnippet: `// Guest Room Booking Controller Handler
export const createBooking = async (req: Request, res: Response) => {
  const { roomId, checkIn, checkOut, guestId } = req.body;
  const isVacant = await verifyRoomAvailability(roomId, checkIn, checkOut);

  if (!isVacant) {
    return res.status(409).json({ error: 'Room unavailable for selected dates' });
  }

  const reservation = await Booking.create({ roomId, guestId, checkIn, checkOut });
  return res.status(201).json({ success: true, reservation });
};`,
    },
  ];

  const categories = ['All', 'Real-Time', 'ERP / CRM', 'AI / LLM', 'Full-Stack'];

  const filteredProjects = selectedFilter === 'All'
    ? projects
    : projects.filter((p) => p.category === selectedFilter);

  const getActiveTab = (projectId: number): 'highlights' | 'architecture' | 'code' => {
    const tab = activeTabs[projectId];
    return tab === 'code' ? 'code' : 'highlights';
  };

  const handleTabChange = (projectId: number, tab: 'highlights' | 'architecture' | 'code') => {
    setActiveTabs((prev) => ({
      ...prev,
      [projectId]: tab,
    }));
  };

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
          const currentTab = getActiveTab(project.id);

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
                    <img src="/liri-logo2.png" alt="Liri logo" className="project-liri-logo-icon" />
                    Ask Liri about this
                  </button>
                </div>
              </div>

              {/* Developer Sandbox Frame replacing screenshot images */}
              <div className="project-image-wrapper">
                <div className="sandbox-window">
                  {/* macOS Browser / Editor Bar */}
                  <div className="sandbox-bar">
                    <div className="sandbox-dots">
                      <span className="sandbox-dot dot-red"></span>
                      <span className="sandbox-dot dot-yellow"></span>
                      <span className="sandbox-dot dot-green"></span>
                    </div>
                    <div className="sandbox-filename">
                      <span className="file-icon">📄</span> {project.filename}
                    </div>
                    <div className="sandbox-tabs">
                      <button
                        className={`sandbox-tab-btn ${currentTab === 'highlights' ? 'active' : ''}`}
                        onClick={() => handleTabChange(project.id, 'highlights')}
                      >
                        ⚡ Highlights
                      </button>
                      {/* Architecture Tab commented out for now per user request */}
                      {/* <button
                        className={`sandbox-tab-btn ${currentTab === 'architecture' ? 'active' : ''}`}
                        onClick={() => handleTabChange(project.id, 'architecture')}
                      >
                        🏗️ Arch
                      </button> */}
                      <button
                        className={`sandbox-tab-btn ${currentTab === 'code' ? 'active' : ''}`}
                        onClick={() => handleTabChange(project.id, 'code')}
                      >
                        💻 Code
                      </button>
                    </div>
                  </div>

                  {/* Sandbox Body Content */}
                  <div className="sandbox-body">
                    {currentTab === 'highlights' && (
                      <div className="sandbox-highlights-grid">
                        {project.highlights.map((h, i) => (
                          <div key={i} className="sandbox-highlight-card">
                            <div className="highlight-header">
                              <span className="highlight-icon">{h.icon}</span>
                              <span className="highlight-title">{h.title}</span>
                            </div>
                            <p className="highlight-desc">{h.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Architecture diagram section commented out for now per user request */}
                    {/* {currentTab === 'architecture' && (
                      <div className="process-diagram-wrapper">
                        {project.archGroups.map((group, groupIdx) => (
                          <React.Fragment key={groupIdx}>
                            <div className={`process-subsystem-box color-${group.color}`}>
                              <div className="subsystem-header-title">{group.name}</div>
                              <div className="subsystem-nodes-column">
                                {group.nodes.map((node, nodeIdx) => (
                                  <div key={nodeIdx} className="process-node-card">
                                    <span className="process-node-icon">{node.icon}</span>
                                    <div className="process-node-meta">
                                      <div className="process-node-label">{node.label}</div>
                                      <div className="process-node-sub">{node.sub}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {groupIdx < project.archGroups.length - 1 && (
                              <div className="process-flow-connector">
                                <div className="connector-line-wrapper">
                                  <span className="connector-label-pill">
                                    {project.archConnections[groupIdx]?.label || 'Data Flow'}
                                  </span>
                                  <div className="connector-arrow">➔</div>
                                </div>
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )} */}

                    {currentTab === 'code' && (
                      <div className="sandbox-code-container">
                        <pre className="sandbox-code-block">
                          <code>{project.codeSnippet}</code>
                        </pre>
                      </div>
                    )}
                  </div>
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
            onClick={() => setShowAll((prev) => !prev)}
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
    </section>
  );
};

export default Projects;