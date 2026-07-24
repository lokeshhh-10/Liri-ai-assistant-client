import React from 'react';
import './ResumeModal.css';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/Resume_Lokesh.pdf';
    link.download = 'Resume_Lokesh.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="resume-modal-overlay" onClick={onClose}>
      <div className="resume-modal-container" onClick={(e) => e.stopPropagation()}>
        <header className="resume-modal-header">
          <div className="resume-modal-title-group">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <h3>Lokeshwaran K – Resume</h3>
          </div>
          <div className="resume-modal-actions">
            <button className="resume-action-btn primary" onClick={handleDownload} title="Download PDF resume">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Download PDF</span>
            </button>
            <button className="resume-close-btn" onClick={onClose} aria-label="Close modal">
              ✕
            </button>
          </div>
        </header>

        <div className="resume-modal-body">
          <iframe
            src="/Resume_Lokesh.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH"
            title="Lokeshwaran K Resume PDF"
            className="resume-iframe"
          />
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
