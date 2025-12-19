import React from 'react';
import './Tech.css';

const Tech: React.FC = () => {
  const technologies = [
    { name: 'JavaScript', icon: 'JS' },
    { name: 'TypeScript', icon: 'TS' },
    { name: 'React', icon: '⚛' },
    { name: 'Node.js', icon: '⬢' },
    { name: 'Redux', icon: '⚛' },
    { name: 'Express', icon: 'Ex' },
    { name: 'Tailwind CSS', icon: 'TW' },
    { name: 'Python', icon: 'PY' },
    { name: 'Fast API', icon: 'JV' },
    { name: 'Prisma', icon: 'PR' },
    { name: 'PostgreSQL', icon: 'PG' },
    { name: 'MongoDB', icon: 'MG' },
    { name: 'Git', icon: 'G' },
    { name: 'Github', icon: 'GH' },
    { name: 'Postman', icon: 'PM' },
    { name: 'Figma', icon: 'FG' },
    { name: 'RAG', icon: 'AI' },
    { name: 'Gen AI', icon: 'AI' },
  ];

  return (
    <section id="tech" className="tech">
      <div className="tech-container">
        <div className="tech-header">
          <h2 className="section-number">04.</h2>
          <h3 className="section-title">Technologies I Work With</h3>
        </div>
        
        <div className="tech-list">
          {technologies.map((tech, index) => (
            <div key={index} className="tech-item">
              <span className="tech-icon">{tech.icon}</span>
              <span className="tech-name">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tech;
