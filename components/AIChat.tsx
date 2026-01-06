'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import AstraLogo from './AstraLogo';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.reply
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: '通信链路不稳定,请稍后重试。'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* 左边中间 - 固定入口按钮 */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Astra Logo */}
        <div className="relative">
          <motion.div
            animate={{
              rotate: [0, 2, -2, 0],
              scale: [1, 1.02, 0.98, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: [0.4, 0, 0.2, 1],
            }}
            style={{
              filter: 'drop-shadow(0 0 40px rgba(212, 175, 55, 0.2)) drop-shadow(0 0 80px rgba(74, 144, 226, 0.15))',
            }}
          >
            <AstraLogo size={64} />
          </motion.div>

          {/* 悬停时的琥珀金光圈 */}
          <div className="absolute inset-0 -m-2 rounded-full bg-accent-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
        </div>

        {/* 提示文字 */}
        <div className="absolute left-full ml-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 whitespace-nowrap">
          <span className="text-secondary text-xs tracking-[0.3em]">
            ASTRA
          </span>
        </div>
      </motion.button>

      {/* 聊天窗口 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed left-24 top-1/2 -translate-y-1/2 z-50 w-96 max-h-[600px] bg-white/5 backdrop-blur-md border border-white/10 rounded-sm flex flex-col"
            style={{
              /* 深空黑洞阴影 */
              boxShadow: `
                inset 0 1px 0 0 rgba(255, 255, 255, 0.08),
                0 4px 36px -3px rgba(0, 0, 0, 0.6),
                0 12px 80px -8px rgba(0, 0, 0, 0.4),
                0 0 40px -10px rgba(74, 144, 226, 0.15)
              `
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* 头部 */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AstraLogo size={32} />
                <div>
                  <h3 className="text-text-primary text-sm font-medium tracking-wide">Astra</h3>
                </div>
              </div>
            </div>

            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="inline-block mb-4 opacity-60">
                    <AstraLogo size={40} />
                  </div>
                  <p className="text-text-secondary text-sm tracking-wide font-serif mt-4">这里是 Astra 的宇宙。</p>
                </div>
              )}

              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed tracking-wide ${
                      message.role === 'user'
                        ? 'bg-accent-blue/20 border border-accent-blue/30 text-text-primary rounded-tr-sm'
                        : 'bg-white/5 backdrop-blur-md border border-white/10 text-text-secondary rounded-tl-sm'
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-tl-sm">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-accent-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-accent-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-accent-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* 输入框 */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="输入你的思考..."
                  className="flex-1 metal-input rounded-sm text-sm tracking-wide"
                  disabled={isTyping}
                />
                <motion.button
                  onClick={handleSend}
                  disabled={isTyping || !input.trim()}
                  className="metal-button px-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
