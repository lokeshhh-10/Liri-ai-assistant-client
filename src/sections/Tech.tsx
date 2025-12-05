import React from 'react';
import './Tech.css';

const Tech: React.FC = () => {
  const technologies = [
    { name: 'JavaScript', icon: 'JS' },
    { name: 'TypeScript', icon: 'TS' },
    { name: 'React', icon: '⚛' },
    { name: 'Node.js', icon: '⬢' },
    { name: 'Python', icon: 'PY' },
    { name: 'Java', icon: 'JV' },
    { name: 'PostgreSQL', icon: 'PG' },
    { name: 'Kubernetes', icon: 'K8s' },
    { name: 'Docker', icon: 'D' },
    { name: 'AWS', icon: 'AWS' },
    { name: 'Agentic AI', icon: 'AI' },
    { name: 'MCP', icon: 'MCP' },
    { name: 'Git', icon: 'G' }
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
