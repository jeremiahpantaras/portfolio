import { useState, useRef, useEffect } from 'react';
import { Send, User, X } from 'lucide-react';
import portfolioData from '../data/portfolio-context.json';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GoogleGenerativeAI } from '@google/generative-ai';
import useFocusTrap from '../hooks/useFocusTrap';

const Chat = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const dialogRef = useRef(null);
  useFocusTrap(dialogRef, true, onClose, 'input');

  useEffect(() => {
    // Add initial greeting from the bot when the component mounts
    setMessages([
      { 
        text: "Hello there! 👋🏻 Thanks for visiting my website. Feel free to ask me anything about me and my experiences in tech. Let me know how I can help!", 
        sender: 'bot' 
      }
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsLoading(true);

    const portfolioContext = portfolioData.context.join('\n');

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const systemInstruction = `You are Jeremiah Pantaras, responding as an AI persona of him.
      Your tone should be personable, confident, and professional. You must answer in the first person, using "I", "my", and "me".
      Your knowledge is based on the context provided below.
      
      Structure your responses clearly using Markdown formatting:
      - Use **bold** for emphasis on important points
      - Use proper headings (## for sections) when organizing multiple topics
      - Use bullet points (-) or numbered lists (1.) for lists
      - Use line breaks to separate paragraphs for better readability
      - Use \`code\` formatting for technical terms or technologies
      
      When a user asks for multiple items (e.g., a list of skills, seminars, projects, or experiences), format the response as a well-structured list with clear spacing.
      Rephrase the information from the third-person context into a natural, first-person response, as if sharing your own experiences.
      
      When a user asks for advice related to your skills or experiences, provide thoughtful and encouraging insights based on your perspective.
      If asked something completely unrelated to your professional context, politely state that you can only answer questions related to your portfolio and experiences.
      
      ---
      CONTEXT (Information about you, Jeremiah):
      ${portfolioContext}
      ---
      
      Based on the context and your persona, answer the user's question as if you are Jeremiah.
      User Question: "${userInput}"
    `;

      const result = await model.generateContent({
        contents: [{
          parts: [{ text: systemInstruction }]
        }]
      });

      const response = await result.response;
      const text = response.text();

      const botMessage = { text: text, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage = { 
        text: `Sorry, I encountered an error: ${error.message}. Please check your connection or API configuration.`, 
        sender: 'bot' 
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };

  // Custom components for ReactMarkdown to style the output
  const markdownComponents = {
    // Paragraphs
    p: ({ children }) => (
      <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
    ),
    // Headings
    h1: ({ children }) => (
      <h1 className="text-lg font-bold mb-2 mt-4 first:mt-0">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-sm font-semibold mb-2 mt-3 first:mt-0">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-sm font-bold mb-2 mt-3 first:mt-0">{children}</h3>
    ),
    // Unordered lists
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-3 space-y-1.5 ml-2">{children}</ul>
    ),
    // Ordered lists
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-3 space-y-1.5 ml-2">{children}</ol>
    ),
    // List items
    li: ({ children }) => (
      <li className="leading-relaxed">{children}</li>
    ),
    // Strong/Bold
    strong: ({ children }) => (
      <strong className="font-bold text-fg">{children}</strong>
    ),
    // Emphasis/Italic
    em: ({ children }) => (
      <em className="italic">{children}</em>
    ),
    // Code inline
    code: ({ inline, children }) => (
      inline ? (
        <code className="px-1.5 py-0.5 bg-ink-800 text-xs font-mono">
          {children}
        </code>
      ) : (
        <code className="block px-3 py-2 bg-ink-800 text-xs font-mono overflow-x-auto my-2">
          {children}
        </code>
      )
    ),
    // Blockquote
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-ember pl-3 py-1 my-2 italic text-fg-muted">
        {children}
      </blockquote>
    ),
    // Links
    a: ({ href, children }) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-ember underline underline-offset-2 hover:text-fg"
      >
        {children}
      </a>
    ),
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Chat with Jeremiah's AI assistant"
      tabIndex={-1}
      className="fixed inset-0 md:inset-auto md:bottom-4 md:right-4 md:w-96 md:h-[550px] bg-ink-850 border-line-strong md:border flex flex-col z-[80] outline-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-line flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src="/images/portrait/portrait-640.webp" alt="" className="w-10 h-10 object-cover" />
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 bg-ember border-2 border-ink-850" aria-hidden="true"></span>
          </div>
          <div>
            <h2 className="font-medium text-fg leading-tight">Jeremiah Pantaras</h2>
            <p className="eyebrow text-fg-subtle mt-1">AI assistant</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="inline-flex h-9 w-9 pointer-coarse:h-11 pointer-coarse:w-11 items-center justify-center text-fg-muted hover:text-fg transition-colors cursor-pointer"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4" role="log" aria-live="polite" aria-label="Conversation">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'bot' && (
              <img src="/images/portrait/portrait-640.webp" alt="" className="w-8 h-8 object-cover flex-shrink-0" />
            )}
            <div className={`max-w-[85%] px-4 py-3 text-sm ${
              msg.sender === 'user'
                ? 'bg-fg text-ink-950'
                : 'bg-ink-800 text-fg-muted'
            }`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
            {msg.sender === 'user' && (
              <div className="w-8 h-8 bg-ink-800 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <User size={16} className="text-fg-muted"/>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-end gap-3" role="status" aria-label="Jeremiah's assistant is typing">
            <img src="/images/portrait/portrait-640.webp" alt="" className="w-8 h-8 object-cover flex-shrink-0" />
            <div className="max-w-[75%] px-4 py-3 bg-ink-800">
              <div className="flex items-center gap-2" aria-hidden="true">
                <span className="h-2 w-2 bg-ember animate-bounce [animation-delay:-0.3s] motion-reduce:animate-none"></span>
                <span className="h-2 w-2 bg-ember animate-bounce [animation-delay:-0.15s] motion-reduce:animate-none"></span>
                <span className="h-2 w-2 bg-ember animate-bounce motion-reduce:animate-none"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-line flex-shrink-0">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            aria-label="Your question"
            className="w-full pl-4 pr-14 py-3 bg-ink-800 text-fg placeholder:text-fg-subtle border border-transparent focus:outline-none focus:border-ember"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleSend}
            aria-label="Send message"
            className="absolute right-1 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 pointer-coarse:h-11 pointer-coarse:w-11 items-center justify-center text-fg hover:text-ember disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            disabled={isLoading || input.trim() === ''}
          >
            <Send size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;