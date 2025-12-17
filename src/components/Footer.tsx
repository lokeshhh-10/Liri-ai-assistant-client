import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/lokeshhh-10' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/lokeshhh10' }
  ];

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
              aria-label={social.name}
            >
              {social.name}
            </a>
          ))}
        </div>
        <div className="footer-text">
          <p>Designed & Built by Lokeshwaran K</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;