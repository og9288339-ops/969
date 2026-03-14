import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiModel } from '@/config/aiConfig';
import { useDebounce } from '@/hooks/useDebounce';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { THEME } from '@/config/constants';
import { ZapIcon, CloseIcon, LoaderIcon, UserIcon, SparklesIcon } from '@/assets/icons';

/**
 * @module ChatBot
 * @description Cinema-grade AI shopping assistant ($10k+ enterprise marketplace)
 * @author Principal Full-Stack Engineer
 * @version 3.0.0
 */

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useLocalStorage('ai_chat_history', [
    { role: 'assistant', content: 'Welcome to the Global Auction VIP lounge. How can I assist your luxury acquisition today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiModel.sendMessage(input);
      const botMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Apologies, my neural link is temporarily offline. Please try again shortly.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([{ 
      role: 'assistant', 
      content: 'System reset. How can I assist you fresh today?' 
    }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            layoutId="chat-bubble"
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full bg-black border border-gold/30 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all shadow-gold/20"
          >
            <SparklesIcon className="w-8 h-8 text-gold animate-pulse" />
          </motion.button>
        ) : (
          <motion.div
            layoutId="chat-bubble"
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="w-[380px] h-[550px] bg-black/95 backdrop-blur-2xl border border-white/10 rounded-2xl flex flex-col shadow-[0_20px_50px_rgba(212,175,55,0.15)] overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold tracking-widest text-white uppercase">Global AI Concierge</span>
              </div>
              <div className="flex gap-3">
                <button onClick={clearHistory} className="text-[10px] text-gray-500 hover:text-gold uppercase tracking-tighter transition-colors">
                  Clear
                </button>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-gold text-black font-semibold rounded-tr-none shadow-lg shadow-gold/10' 
                    : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 p-3 rounded-xl flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-duration:0.8s]" />
                    <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Inquire about luxury assets..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold/50 transition-all placeholder:text-gray-600"
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-11 h-11 bg-gold text-black rounded-lg flex items-center justify-center hover:bg-yellow-500 transition-all active:scale-90 disabled:opacity-30 disabled:grayscale"
              >
                <ZapIcon className="w-5 h-5 fill-current" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;
