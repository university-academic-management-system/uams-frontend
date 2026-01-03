
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2, X } from 'lucide-react';
import { Message } from '../types';

const fetchLocalResponse = async (history: Message[], userInput: string) => {
  // Simple local/stub response (no external services)
  const text = userInput.toLowerCase();
  if (text.includes('help')) {
    return 'Try breaking topics into smaller parts, make concise notes, and test yourself regularly.';
  }
  return "Thanks for your question — here's a quick study tip: review material actively with short, focused sessions and test yourself regularly.";
};

interface ChatBotProps {
  onClose?: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm your UniEdu Study Buddy. How can I help you with your academic inquiries today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    const response = await fetchLocalResponse(messages, userMessage);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="bg-white flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-base">Study Buddy</h3>
            <p className="text-[10px] text-blue-300 uppercase tracking-widest font-bold">Academic Assistant</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`p-4 rounded-[1.5rem] text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-lg' 
                  : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[90%]">
              <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
              </div>
              <div className="p-4 bg-white border border-slate-100 rounded-[1.5rem] rounded-tl-none shadow-sm">
                <div className="flex gap-1.5">
                   <div className="w-2 h-2 bg-blue-200 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                   <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                   <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-slate-100">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            placeholder="Ask anything about your courses..."
            className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-slate-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-[10px] text-slate-400 text-center mt-4 font-medium uppercase tracking-widest">
          Study Buddy
        </p>
      </div>
    </div>
  );
};

export default ChatBot;
