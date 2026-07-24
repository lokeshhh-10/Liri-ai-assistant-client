import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './ChatWidget.css';
import SYSTEM_PROMPT from "../constants/systemPrompt";
import { streamGeminiRequest } from '../clients/geminiClient';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
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
  const inputRef = useRef<HTMLInputElement>(null);

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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Lock background body scrolling when in expanded fullscreen mode
  useEffect(() => {
    if (isOpen && isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isFullscreen]);


  useEffect(() => {
    const handleOpenChat = (event: Event) => {
      const customEvent = event as CustomEvent<{ prompt?: string }>;
      setIsOpen(true);
      if (customEvent.detail?.prompt) {
        const query = customEvent.detail.prompt;
        setInputValue(query);
        setTimeout(() => {
          sendMessage(query);
        }, 100);
      }
    };

    window.addEventListener('open-liri-chat', handleOpenChat);
    return () => {
      window.removeEventListener('open-liri-chat', handleOpenChat);
    };
  }, [messages, isLoading, isStreaming]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading || isStreaming) return;

    const trimmedMsg = userMessage.trim();
    setInputValue('');

    const conversationHistory = messages
      .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n");

    const promptText = `
${SYSTEM_PROMPT}

${conversationHistory}
User: ${trimmedMsg}
Assistant:
`;

    // Unique IDs for user and assistant messages
    const userMsgId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const assistantMsgId = `assistant-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: 'user', content: trimmedMsg },
      { id: assistantMsgId, role: 'assistant', content: '' }
    ]);

    setIsLoading(true);
    setIsStreaming(true);

    // Initialize typewriter stream buffer
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

  const handleSend = () => {
    sendMessage(inputValue);
  };

  const triggerQuery = (queryText: string) => {
    sendMessage(queryText);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
    <>
      {/* Chat Button */}
      <button
        className={`chat-button ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`chat-window ${isFullscreen ? 'fullscreen' : ''}`}>
          <div className="chat-header">
            {isFullscreen && (
              <div className="chat-header-left">
                <button
                  className="chat-back-btn"
                  onClick={() => setIsFullscreen(false)}
                  aria-label="Back"
                  title="Back"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
                <button
                  className="brand-link desktop-only-brand"
                  onClick={() => setIsFullscreen(false)}
                  title="Minimize full screen"
                >
                  lokeshhh-10
                </button>
              </div>
            )}
            <div className="chat-header-info">
              <img src="/liri-logo2.png" alt="Liri" className="chat-avatar-logo-img" />
              <div>
                <h3>Liri.ai</h3>
                <p className="chat-status">Online</p>
              </div>
            </div>

            <div className="chat-header-actions">
              {/* Fullscreen Toggle Button */}
              <button
                className="chat-fullscreen-btn"
                onClick={() => setIsFullscreen(!isFullscreen)}
                aria-label={isFullscreen ? "Exit full screen" : "Full screen"}
                title={isFullscreen ? "Exit full screen (ESC)" : "Full screen"}
              >
                {isFullscreen ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4 14 10 14 10 20"></polyline>
                    <polyline points="20 10 14 10 14 4"></polyline>
                    <line x1="14" y1="10" x2="21" y2="3"></line>
                    <line x1="10" y1="14" x2="3" y2="21"></line>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <polyline points="9 21 3 21 3 15"></polyline>
                    <line x1="21" y1="3" x2="14" y2="10"></line>
                    <line x1="3" y1="21" x2="10" y2="14"></line>
                  </svg>
                )}
              </button>
              {/* Open /chat Route Button */}
              <a
                href="/chat"
                className="chat-fullpage-btn"
                aria-label="Open standalone view"
                title="Open standalone view (/chat)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
              <button
                className="chat-clear-btn"
                onClick={clearChat}
                aria-label="Clear chat"
                title="Clear chat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
              <button
                className="chat-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                title="Close chat"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((message, index) => {
              if (message.role === 'assistant' && !message.content && isLoading) {
                return null;
              }

              const isLastAssistantStreaming = isStreaming && index === messages.length - 1 && message.role === 'assistant';
              return (
                <div
                  key={message.id}
                  className={`chat-message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="avatar-col">
                      <img
                        src="/liri-logo2.png"
                        alt="Liri"
                        className={`assistant-logo-icon ${isLastAssistantStreaming ? 'animating' : ''}`}
                      />
                    </div>
                  )}
                  <div className="message-content">
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
                      message.content
                    )}
                  </div>
                </div>
              );
            })}
            {messages.length === 1 && !isLoading && !isStreaming && (
              <div className="chat-quick-chips">
                <p className="chips-title">Suggested questions:</p>
                <div className="chips-grid">
                  <button className="chip-btn" onClick={() => triggerQuery("What technologies does Loki use most?")}>
                    <span className="chip-icon">💡</span>
                    <div className="chip-text-group">
                      <span className="chip-title">What tech stack does Loki use?</span>
                      <span className="chip-desc">React, Node.js, TypeScript & Cloud Native</span>
                    </div>
                  </button>
                  <button className="chip-btn" onClick={() => triggerQuery("Tell me about JewelryPro ERP and its architecture.")}>
                    <span className="chip-icon">🚀</span>
                    <div className="chip-text-group">
                      <span className="chip-title">Tell me about JewelryPro</span>
                      <span className="chip-desc">ERP platform architecture & system design</span>
                    </div>
                  </button>
                  <button className="chip-btn" onClick={() => triggerQuery("How does LiveSurvey achieve real-time updates?")}>
                    <span className="chip-icon">⚡</span>
                    <div className="chip-text-group">
                      <span className="chip-title">How does LiveSurvey work?</span>
                      <span className="chip-desc">Real-time WebSockets & live survey engine</span>
                    </div>
                  </button>
                  <button className="chip-btn" onClick={() => triggerQuery("Summarize Loki's experience and background.")}>
                    <span className="chip-icon">📄</span>
                    <div className="chip-text-group">
                      <span className="chip-title">Summarize Loki's background</span>
                      <span className="chip-desc">Career timeline, key projects & skills</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
            {isLoading && (
              <div className="chat-message assistant-message">
                <div className="avatar-col">
                  <img src="/liri-logo2.png" alt="Liri" className="assistant-logo-icon animating" />
                </div>
                <div className="message-content typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-container">

            <input
              ref={inputRef}
              type="text"
              className="chat-input"
              placeholder="Ask me anything about Loki..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading || isStreaming}
            />
            <button
              className="chat-send-btn"
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading || isStreaming}
              aria-label="Send message"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;




