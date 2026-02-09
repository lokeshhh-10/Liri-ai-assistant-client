import React, { useState } from 'react';
import './About.css';

const About: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const workExperience = [
    {
      company: 'I Bacus Tech labs',
      role: 'Jr.Full Stack Developer',
      location: 'Coimbatore, Tamil Nadu',
      period: 'Sep 2025 - Present',
      achievements: [
        'Proficient in developing front-end applications using React.js, Redux for state management, and Material UI for creating visually appealing and user-friendly interfaces.',
        'Application Architecture & API Design: Architected applications by defining structured route names and API endpoints, ensuring a scalable, and maintainable backend infrastructure. ',
        'Designed and implemented secure authentication systems using JWT (JSON Web Tokens) to enhance data protection, user access control, and overall application security.',
        'Managed and optimized GitHub repositories for multiple collaborators, implementing effective branching strategies, version control workflows, and streamlined code review pipelines for team collaboration.',
        'Architected scalable backend applications with well-structured routes and RESTful API design, ensuring maintainability, consistency, and long-term extensibility across services.',
        'Utilized Prisma ORM and Mongoose for unified database management — implementing type-safe schemas, optimizing queries, and maintaining data consistency across PostgreSQL and MongoDB.',
        'Worked extensively with PostgreSQL, leveraging relational modeling and advanced querying for scalable and efficient data management.',
      ]
    },
    {
      company: 'KGXperience - Incubation Center',
      role: 'Student Mentor',
      location: 'Coimbatore, Tamil Nadu',
      period: 'Sep 2022 - Oct 2024',
      achievements: [
        'Actively engaged in self-learning and applied development across technologies like React, Node.js, Express, MongoDB, SQL, FastAPI, and Python, strengthening full-stack and API architecture expertise.',
        'Mentored and guided 15+ students, fostering technical growth through real-world projects, code reviews, and collaborative learning environments.',
        'Led teams in multiple national-level hackathons including e-Yantra, Yukthi, and Smart India Hackathon, driving innovation in domains such as IoT, AI/ML, and data-driven applications.',
        'Built and deployed end-to-end applications in diverse domains, integrating front-end design with scalable backend systems and automation workflows.',
        'Championed a culture of exploration and continuous learning, encouraging teams to adopt emerging tools and engineering best practices for impactful innovation.'
      ]
    },
  ];

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="about" className="about">
      <div className="about-header-container">
        <div className="about-header">
          <h2 className="section-number">01.</h2>
          <h3 className="section-title">About Me</h3>
        </div>
      </div>
        
      <div className="about-content">
        <div className="about-text">
          <div className="about-description">
  <p>
    Hello! I'm <span className="highlight">Lokeshwaran K</span>, a Full Stack Engineer passionate about building intelligent and scalable digital products. I specialize in creating <span className='highlight'>AI-powerd solutions</span>  and <span className="highlight">architecting API-driven systems</span> that deliver seamless and meaningful user experiences.
  </p>

  <p>
    I work across the stack — from crafting modern web interfaces to designing high-performance backend architectures. My focus is on combining automation, <span className="highlight">AI integration</span>, and efficient system design to build products that scale effortlessly.
  </p>

  <p>
    I'm driven by solving complex engineering challenges and developing systems that make technology feel <span className="highlight">simple</span>, <span className="highlight">powerful</span>, and <span className="highlight">human</span>. Whether it’s architecting full-stack applications, deploying AI agents, or building developer-focused APIs, I love creating solutions that make an impact.
  </p>
</div>

        </div>
        
        <div className="about-image">
          <div className="image-wrapper">
            <div className="image-border"></div>
            <div className="image-container">
              <img src="/Profile.jpeg" alt="Lokeshwaran K" className="profile-image" />
            </div>
          </div>
        </div>
      </div>

      <div className="about-container">
        <div className="experience-section">
          <h4 className="experience-title">Where I've Worked</h4>
          <div className="experience-timeline">
            {workExperience.map((exp, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <div key={index} className={`experience-item ${isExpanded ? 'expanded' : ''}`}>
                  <div 
                    className="experience-header"
                    onClick={() => toggleExpanded(index)}
                  >
                    <div className="experience-role">
                      <span className="experience-company">{exp.company}</span>
                      <span className="experience-position">{exp.role}</span>
                    </div>
                    <div className="experience-header-right">
                      <div className="experience-meta">
                        <span className="experience-location">{exp.location}</span>
                        <span className="experience-period">{exp.period}</span>
                      </div>
                      <div className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 12l4-4-4-4"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className={`experience-content ${isExpanded ? 'expanded' : ''}`}>
                    <ul className="experience-achievements">
                      {exp.achievements.map((achievement, achIndex) => (
                        <li key={achIndex}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;