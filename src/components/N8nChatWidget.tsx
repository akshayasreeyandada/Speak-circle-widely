import React, { useEffect, useState, useRef } from 'react';
import { Bot, MessageSquare, X, Send, Sparkles, RefreshCw } from 'lucide-react';

interface N8nChatWidgetProps {
  isInCall?: boolean;
}

const WEBHOOK_URL = 'https://aki13.app.n8n.cloud/webhook/cc2f07bf-b16f-485c-9be7-82c6221f0286/chat';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export const N8nChatWidget: React.FC<N8nChatWidgetProps> = ({ isInCall = false }) => {
  const [isN8nScriptLoaded, setIsN8nScriptLoaded] = useState(false);
  const [fallbackOpen, setFallbackOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'Hi there! 👋 I am your SpeakCircle AI Practice Partner powered by n8n.',
      timestamp: 'Just now'
    },
    {
      id: 'welcome-2',
      sender: 'bot',
      text: 'You can practice answering interview questions, chat casually, or ask for vocabulary suggestions. Speak without fear — practice without judgment!',
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => 'sc_' + Math.random().toString(36).substring(2, 11));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize official @n8n/chat widget
  useEffect(() => {
    let isMounted = true;

    // Load stylesheet if not already in document
    const existingLink = document.querySelector('link[href*="@n8n/chat"]');
    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
      document.head.appendChild(link);
    }

    // Load @n8n/chat ES bundle
    const loadN8n = async () => {
      try {
        // @ts-expect-error dynamic import from CDN
        const module = await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js');
        if (module && typeof module.createChat === 'function' && isMounted) {
          module.createChat({
            webhookUrl: WEBHOOK_URL,
            webhookConfig: {
              method: 'POST',
              headers: {}
            },
            showWelcomeScreen: false,
            defaultLanguage: 'en',
            initialMessages: [
              'Hi there! 👋 I am your SpeakCircle AI Practice Partner.',
              'Ask me any question, practice interview answers, or chat casually in English. Speak without fear!'
            ],
            i18n: {
              en: {
                title: 'SpeakCircle AI Coach',
                subtitle: 'Powered by n8n • Speak without fear',
                footer: '',
                getStarted: 'Start Practicing',
                inputPlaceholder: 'Type your message in English...'
              }
            }
          });
          setIsN8nScriptLoaded(true);
        }
      } catch (err) {
        console.warn('Official @n8n/chat script note:', err);
      }
    };

    loadN8n();

    // Expose open helper globally for buttons in Navbar or Practice tab
    window.openSpeakCircleAiChat = () => {
      const officialToggle = document.querySelector<HTMLElement>(
        '.chat-window-toggle, .chat-toggle-button, [class*="chat-window-toggle"], [class*="chat-toggle"]'
      );
      if (officialToggle) {
        officialToggle.click();
      } else {
        setFallbackOpen(true);
      }
    };

    return () => {
      isMounted = false;
    };
  }, []);

  // Update body class when in call to hide chat widget
  useEffect(() => {
    if (isInCall) {
      document.body.classList.add('in-call');
    } else {
      document.body.classList.remove('in-call');
    }
  }, [isInCall]);

  useEffect(() => {
    if (fallbackOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, fallbackOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const promptToSend = inputText.trim();
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'sendMessage',
          sessionId,
          chatInput: promptToSend,
          message: promptToSend
        })
      });

      if (!response.ok) {
        throw new Error(`n8n webhook responded with status ${response.status}`);
      }

      const data = await response.json();
      const botResponseText =
        data.text ||
        data.output ||
        data.message ||
        data.response ||
        (typeof data === 'string' ? data : 'I received your response! Keep going, how would you like to continue?');

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err: unknown) {
      console.error('Error communicating with n8n chatbot:', err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'I received your message! Please make sure your n8n workflow Chat Trigger node is Active and has CORS (Allowed Origins) set to accept requests.',
        timestamp: 'Notice'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Do not render anything when inside an active voice call
  if (isInCall) return null;

  return (
    <>
      {/* If official n8n script hasn't rendered launcher yet, show native floating button */}
      {!isN8nScriptLoaded && !fallbackOpen && (
        <button
          onClick={() => setFallbackOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 bg-teal-600 hover:bg-teal-700 text-white rounded-full p-3.5 shadow-lg shadow-teal-700/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 group"
          title="Chat with n8n AI Coach"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-teal-600 animate-pulse" />
          </div>
          <span className="text-xs font-semibold pr-1 hidden sm:inline">AI Practice Coach</span>
        </button>
      )}

      {/* Built-in fallback dialog modal if opened */}
      {fallbackOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white w-full sm:max-w-md h-[85vh] sm:h-[600px] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="bg-teal-700 px-4 py-3.5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-teal-800 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-teal-200" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight font-display">SpeakCircle AI Coach</h3>
                  <p className="text-[11px] text-teal-200 leading-none">Powered by n8n • Speak without fear</p>
                </div>
              </div>
              <button
                onClick={() => setFallbackOpen(false)}
                className="p-1.5 text-teal-200 hover:text-white hover:bg-teal-800 rounded-lg transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-teal-600 text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span
                      className={`block text-[10px] mt-1 ${
                        msg.sender === 'user' ? 'text-teal-200 text-right' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200/80 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5 text-slate-500 text-xs shadow-xs">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
                    <span>AI Coach is typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-3 py-2 bg-slate-100/80 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
              <span className="text-slate-500 font-medium whitespace-nowrap flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> Quick:
              </span>
              <button
                type="button"
                onClick={() => setInputText('How do I introduce myself in an interview?')}
                className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded-full border border-slate-200 whitespace-nowrap transition-colors"
              >
                Interview Intro
              </button>
              <button
                type="button"
                onClick={() => setInputText('Give me a fun question to practice speaking English.')}
                className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded-full border border-slate-200 whitespace-nowrap transition-colors"
              >
                Fun Question
              </button>
              <button
                type="button"
                onClick={() => setInputText('I feel shy speaking English with strangers. Any quick advice?')}
                className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded-full border border-slate-200 whitespace-nowrap transition-colors"
              >
                Overcoming Shyness
              </button>
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Type your message in English..."
                className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-100 rounded-xl border border-transparent focus:border-teal-500 focus:bg-white focus:outline-none transition-colors"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="px-3.5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors flex items-center justify-center shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// Augment window object for global open helper
declare global {
  interface Window {
    openSpeakCircleAiChat?: () => void;
  }
}
