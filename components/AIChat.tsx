'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

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
      {/* 悬浮按钮 */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-white/5 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-accent-blue" />
        ) : (
          <MessageCircle className="w-6 h-6 text-accent-blue group-hover:scale-110 transition-transform" />
        )}
      </motion.button>

      {/* 聊天窗口 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-28 right-8 z-40 w-96 max-h-[600px] bg-white/5 backdrop-blur-md border border-white/10 rounded-sm flex flex-col shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* 头部 */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent-glow border border-accent-blue/30 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-accent-blue" />
                </div>
                <div>
                  <h3 className="text-text-primary text-sm font-medium tracking-wide">数字分身</h3>
                  <p className="text-text-tertiary text-xs tracking-wide">在线 // INTJ模式</p>
                </div>
              </div>
            </div>

            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Sparkles className="w-8 h-8 text-accent-blue mx-auto mb-3 opacity-50" />
                  <p className="text-text-secondary text-sm tracking-wide">与我的数字分身对话</p>
                  <p className="text-text-tertiary text-xs mt-2 tracking-wider">崇尚逻辑 · 厌恶情绪</p>
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
