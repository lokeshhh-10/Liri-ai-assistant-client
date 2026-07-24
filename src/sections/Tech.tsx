import React, { useState } from "react";
import "./Tech.css";

interface TechItem {
  name: string;
  icon?: string;
  customIcon?: React.ReactNode;
  category: "Frontend" | "Backend" | "Databases & Tools";
  color?: string;
}

const RenderLogo = () => (
  <svg width="38" height="38" viewBox="14 14 82 82" fill="currentColor">
    <path d="M 24 78 V 48 A 24 24 0 0 0 48 48 C 48 34 58 24 68 24 A 20 20 0 1 1 68 64 C 58 64 50 56 50 48 V 78 Z" />
  </svg>
);

const Tech: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const technologies: TechItem[] = [
    // Frontend
    { name: "JavaScript", icon: "devicon-javascript-plain colored", category: "Frontend", color: "#F7DF1E" },
    { name: "TypeScript", icon: "devicon-typescript-plain colored", category: "Frontend", color: "#3178C6" },
    { name: "React", icon: "devicon-react-original colored", category: "Frontend", color: "#61DAFB" },
    { name: "Redux", icon: "devicon-redux-original colored", category: "Frontend", color: "#764ABC" },
    { name: "Tailwind CSS", icon: "devicon-tailwindcss-plain colored", category: "Frontend", color: "#06B6D4" },
    { name: "Material UI", icon: "devicon-materialui-plain colored", category: "Frontend", color: "#007FFF" },
    { name: "Bootstrap", icon: "devicon-bootstrap-plain colored", category: "Frontend", color: "#7952B3" },
    { name: "Chart.js", icon: "devicon-chartjs-plain colored", category: "Frontend", color: "#FF6384" },

    // Backend
    { name: "Node.js", icon: "devicon-nodejs-plain colored", category: "Backend", color: "#339933" },
    { name: "Express", icon: "devicon-express-original", category: "Backend", color: "#64ffda" },
    { name: "Python", icon: "devicon-python-plain colored", category: "Backend", color: "#3776AB" },
    { name: "FastAPI", icon: "devicon-fastapi-plain colored", category: "Backend", color: "#009688" },
    { name: "Socket.io", icon: "devicon-socketio-original", category: "Backend", color: "#64ffda" },
    { name: "Axios", icon: "devicon-axios-plain colored", category: "Backend", color: "#5A29E4" },
    { name: "Gen AI", icon: "devicon-graphql-plain colored", category: "Backend", color: "#E535AB" },

    // Databases & Tools
    { name: "MongoDB", icon: "devicon-mongodb-plain colored", category: "Databases & Tools", color: "#47A248" },
    { name: "PostgreSQL", icon: "devicon-postgresql-plain colored", category: "Databases & Tools", color: "#4169E1" },
    { name: "Prisma", icon: "devicon-prisma-original", category: "Databases & Tools", color: "#2D3748" },
    { name: "Git", icon: "devicon-git-plain colored", category: "Databases & Tools", color: "#F05032" },
    { name: "GitHub", icon: "devicon-github-original", category: "Databases & Tools", color: "#ffffff" },
    { name: "Postman", icon: "devicon-postman-plain colored", category: "Databases & Tools", color: "#FF6C37" },
    { name: "Figma", icon: "devicon-figma-plain colored", category: "Databases & Tools", color: "#F24E1E" },
    { name: "Vercel", icon: "devicon-vercel-original", category: "Databases & Tools", color: "#ffffff" },
    { name: "Render", customIcon: <RenderLogo />, category: "Databases & Tools", color: "#ffffff" },
  ];

  
  const categories = ["All", "Frontend", "Backend", "Databases & Tools"];

  const filteredTechnologies = activeCategory === "All"
    ? technologies
    : technologies.filter(tech => tech.category === activeCategory);

  return (
    <section id="tech" className="tech">
      <div className="tech-container">
        <div className="tech-header-wrap">
          <div className="tech-header">
            <h2 className="section-number">03.</h2>
            <h3 className="section-title">Technologies I Work With</h3>
          </div>

          <div className="tech-category-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`tech-tab-btn ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="tech-grid">
          {filteredTechnologies.map((tech, index) => (
            <div key={index} className="tech-card" style={{ '--brand-color': tech.color || '#64ffda' } as React.CSSProperties}>
              <div className="tech-icon-box">
                {tech.customIcon ? (
                  tech.customIcon
                ) : (
                  <i className={`${tech.icon} tech-icon-dev`} />
                )}
              </div>
              <span className="tech-card-name">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tech;
