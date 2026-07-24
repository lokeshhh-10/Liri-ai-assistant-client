import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './ChatPage.css';
import SYSTEM_PROMPT from "../../constants/systemPrompt";
import { streamGeminiRequest } from '../../clients/geminiClient';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const ChatPage: React.FC = () => {

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial-welcome',
      role: 'assistant',
      content: "Hey! I’m Liri, Loki’s AI assistant 😊 I’m here to answer questions about Loki. What would you like to know?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Typewriter buffer ref for smooth line-by-line word streaming
  const streamBufferRef = useRef<{ id: string; targetText: string; currentText: string; isFinished: boolean }>({
    id: '',
    targetText: '',
    currentText: '',
    isFinished: false,
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading || isStreaming) return;

    const trimmedMsg = userMessage.trim();
    setInputValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const conversationHistory = messages
      .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n");

    const promptText = `
${SYSTEM_PROMPT}

${conversationHistory}
User: ${trimmedMsg}
Assistant:
`;

    const userMsgId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const assistantMsgId = `assistant-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: 'user', content: trimmedMsg },
      { id: assistantMsgId, role: 'assistant', content: '' }
    ]);

    setIsLoading(true);
    setIsStreaming(true);

    streamBufferRef.current = {
      id: assistantMsgId,
      targetText: '',
      currentText: '',
      isFinished: false,
    };

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const buf = streamBufferRef.current;
      if (!buf.id) return;

      if (buf.currentText.length < buf.targetText.length) {
        const diff = buf.targetText.length - buf.currentText.length;
        const stepSize = diff > 40 ? 5 : diff > 20 ? 3 : 2;
        buf.currentText = buf.targetText.slice(0, buf.currentText.length + stepSize);

        const newText = buf.currentText;
        setIsLoading(false);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === buf.id ? { ...msg, content: newText } : msg
          )
        );
      } else if (buf.isFinished) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setIsStreaming(false);
      }
    }, 15);

    try {
      await streamGeminiRequest(promptText, (chunkText) => {
        streamBufferRef.current.targetText += chunkText;
      });
    } catch (error) {
      console.error("Chat error:", error);
      setIsLoading(false);
      const buf = streamBufferRef.current;
      if (!buf.targetText) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? { ...msg, content: "Sorry, I encountered an error. Please try again later." }
              : msg
          )
        );
      } else {
        buf.targetText += "\n\n*(Error: Connection interrupted)*";
      }
    } finally {
      streamBufferRef.current.isFinished = true;
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const clearChat = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    streamBufferRef.current = { id: '', targetText: '', currentText: '', isFinished: true };
    setIsStreaming(false);
    setIsLoading(false);
    setMessages([
      {
        id: 'initial-welcome',
        role: 'assistant',
        content: "Hey! I’m Liri, Loki’s AI assistant 😊 I’m here to answer questions about Loki. What would you like to know?"
      }
    ]);
  };

  return (
    <div className="chat-page">
      {/* Top ChatGPT Navigation Header */}
      <header className="chat-page-header">
        <div className="chat-page-nav-left">
          <a href="/" className="brand-link" title="Back to Portfolio">
            <svg className="back-arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span className="brand-text">lokeshhh-10</span>
          </a>
        </div>

        <div className="chat-page-brand">
          <img src="/liri-logo2.png" alt="Liri Logo" className="chat-header-logo-img" />
          <h1>Liri.ai</h1>
        </div>



        <div className="chat-page-actions">
          <button
            className="chat-page-action-btn"
            onClick={clearChat}
            title="New Chat / Clear History"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>New Chat</span>
          </button>
        </div>
      </header>

      {/* Main Conversation Container */}
      <main className="chat-page-main">
        <div className="chat-page-content">
          {messages.length === 1 && !isLoading && !isStreaming && (
            <div className="chat-hero-welcome">
              <img src="/liri-logo.png" alt="Liri Logo" className="hero-logo-img" />
              <h2>How can I help you today?</h2>
              <p>I'm Loki's interactive AI assistant. Ask me anything about his technical stack, projects, architecture, or background.</p>

              <div className="prompt-cards-grid">
                <button
                  className="prompt-card"
                  onClick={() => sendMessage("What technologies and technical stack does Loki specialize in?")}
                >
                  <span className="card-icon">⚡</span>
                  <div>
                    <h4>What tech stack does Loki use?</h4>
                    <p>React, Node.js, TypeScript, Cloud Native Services</p>
                  </div>
                </button>

                <button
                  className="prompt-card"
                  onClick={() => sendMessage("Tell me about JewelryPro ERP and how its architecture is designed.")}
                >
                  <span className="card-icon">🚀</span>
                  <div>
                    <h4>Tell me about JewelryPro</h4>
                    <p>Enterprise ERP platform architecture & capabilities</p>
                  </div>
                </button>

                <button
                  className="prompt-card"
                  onClick={() => sendMessage("How does LiveSurvey achieve low latency and real-time updates?")}
                >
                  <span className="card-icon">📡</span>
                  <div>
                    <h4>How does LiveSurvey work?</h4>
                    <p>Real-time WebSockets & survey distribution system</p>
                  </div>
                </button>

                <button
                  className="prompt-card"
                  onClick={() => sendMessage("Summarize Loki's professional background, experience, and key accomplishments.")}
                >
                  <span className="card-icon">📄</span>
                  <div>
                    <h4>Summarize Loki's background</h4>
                    <p>Overview of experience, career trajectory, and highlights</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          <div className="chat-page-thread">
            {messages.map((message, index) => {
              if (message.role === 'assistant' && !message.content && isLoading) {
                return null;
              }

              const isLastAssistantStreaming = isStreaming && index === messages.length - 1 && message.role === 'assistant';

              return (
                <div
                  key={message.id}
                  className={`chat-page-row ${message.role === 'user' ? 'user-row' : 'assistant-row'}`}
                >
                  <div className="row-inner">
                    {message.role === 'assistant' && (
                      <div className="avatar-col">
                        <img
                          src="/liri-logo2.png"
                          alt="Liri"
                          className={`assistant-logo-icon ${isLastAssistantStreaming ? 'animating' : ''}`}
                        />
                      </div>
                    )}

                    <div className="message-col">
                      {message.role === 'assistant' ? (
                        <>
                          <ReactMarkdown
                            components={{
                              p: ({ node, ...props }) => <p className="markdown-p" {...props} />,
                              strong: ({ node, ...props }) => <strong className="markdown-strong" {...props} />,
                              em: ({ node, ...props }) => <em className="markdown-em" {...props} />,
                              ul: ({ node, ...props }) => <ul className="markdown-ul" {...props} />,
                              ol: ({ node, ...props }) => <ol className="markdown-ol" {...props} />,
                              li: ({ node, ...props }) => <li className="markdown-li" {...props} />,
                              h1: ({ node, ...props }) => <h1 className="markdown-h1" {...props} />,
                              h2: ({ node, ...props }) => <h2 className="markdown-h2" {...props} />,
                              h3: ({ node, ...props }) => <h3 className="markdown-h3" {...props} />,
                              code: ({ node, ...props }) => <code className="markdown-code" {...props} />,
                              pre: ({ node, ...props }) => <pre className="markdown-pre" {...props} />,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                          {isLastAssistantStreaming && <span className="streaming-cursor" />}
                        </>
                      ) : (
                        <div className="user-bubble-text">{message.content}</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="chat-page-row assistant-row">
                <div className="row-inner">
                  <div className="avatar-col">
                    <img src="/liri-logo2.png" alt="Liri" className="assistant-logo-icon animating" />
                  </div>
                  <div className="message-col">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Sticky Bottom Prompt Bar */}
      <footer className="chat-page-footer">
        <div className="footer-container">
          <div className="input-box-wrapper">
            <textarea
              ref={textareaRef}
              className="chat-page-textarea"
              placeholder="Message Liri..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isLoading || isStreaming}
            />
            <button
              className="chat-page-send-btn"
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim() || isLoading || isStreaming}
              aria-label="Send message"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
          <p className="chat-footer-disclaimer">
            Liri.ai may provide information about Loki's skills and projects.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;

