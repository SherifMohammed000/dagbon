"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, User, Bot } from "lucide-react";
import { useState } from "react";

export default function CulturalGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", content: "Antire (Good morning)! I am your Dagbon Cultural Guide. Ask me anything about our history, music, or traditions." }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    
    // Mock response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "bot", 
        content: "That is a fascinating question about Dagbon! Did you know that our kings (Ya-Na) have been ruling for over 600 years? I can tell you more about the Gbewaa Palace if you'd like." 
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-secondary text-white shadow-2xl flex items-center justify-center z-50 group"
      >
        <Sparkles className="absolute -top-1 -right-1 text-accent animate-pulse" size={20} />
        <MessageSquare size={28} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-28 right-8 w-96 h-[500px] glass-dark border border-white/10 rounded-[40px] shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-primary text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary">
                  <Bot size={24} />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold">AI Cultural Guide</h4>
                  <p className="text-[10px] text-accent uppercase tracking-widest font-bold">Powered by Dagbon Heritage</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-secondary text-white rounded-tr-none' 
                      : 'bg-white/10 text-sand rounded-tl-none border border-white/5'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-white/5">
              <div className="flex items-center gap-2 bg-white/5 rounded-2xl px-4 py-2 border border-white/10">
                <input 
                  type="text" 
                  placeholder="Ask a cultural question..." 
                  className="bg-transparent border-none focus:ring-0 flex-1 text-white text-sm"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  className="w-10 h-10 rounded-xl bg-accent text-primary flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
