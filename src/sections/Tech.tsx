import React from 'react';
import './Tech.css';

const Tech: React.FC = () => {

  const technologies = [
    { name: "JavaScript", icon: "devicon-javascript-plain" },
    { name: "TypeScript", icon: "devicon-typescript-plain" },
    { name: "React", icon: "devicon-react-original" },
    { name: "Node.js", icon: "devicon-nodejs-plain" },
    { name: "Redux", icon: "devicon-redux-original" },
    { name: "Express", icon: "devicon-express-original" },
    { name: "Chart.js", icon: "devicon-chartjs-plain" },
    { name: "Bootstrap", icon: "devicon-bootstrap-plain" },
    { name: "Socket.io", icon: "devicon-socketio-plain" },
    { name: "Material UI", icon: "devicon-materialui-plain"},
    { name: "Tailwind CSS", icon: "devicon-tailwindcss-plain" },
    { name: "Python", icon: "devicon-python-plain" },
    { name: "FastAPI", icon: "devicon-fastapi-plain" },
    { name: "Prisma", icon: "devicon-prisma-original" },
    { name: "PostgreSQL", icon: "devicon-postgresql-plain" },
    { name: "MongoDB", icon: "devicon-mongodb-plain" },
    { name: "Git", icon: "devicon-git-plain" },
    { name: "GitHub", icon: "devicon-github-original" },
    { name: "Postman", icon: "devicon-postman-plain" },
    { name: "Figma", icon: "devicon-figma-plain" },
    { name: "Axios", icon: "devicon-axios-plain" },
    // { name: "RAG", icon: "devicon-graphql-plain" },
    { name: "Gen AI", icon: "devicon-graphql-plain" },

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
              {/* <span className="tech-icon">{tech.icon}</span> */}
               <i className={tech.icon + " tech-icon"} />
              <span className="tech-name">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tech;
