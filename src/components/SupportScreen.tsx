import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MessageCircle, 
  Phone, 
  Mail, 
  HelpCircle, 
  ChevronRight, 
  Search,
  Send,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SupportScreenProps {
  onBack: () => void;
}

export const SupportScreen = ({ onBack }: SupportScreenProps) => {
  const [isChatting, setIsChatting] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, text: 'Hello! How can we help you today?', sender: 'support' },
  ]);

  const helpTopics = [
    { id: 1, title: 'Order Status', description: 'Track your current orders' },
    { id: 2, title: 'Payments & Wallet', description: 'Issues with transactions' },
    { id: 3, title: 'Seller Support', description: 'Help for registered sellers' },
    { id: 4, title: 'Rider Support', description: 'Help for delivery partners' },
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setChatHistory([...chatHistory, { id: Date.now(), text: message, sender: 'user' }]);
    setMessage('');
    
    // Simulated response
    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        id: Date.now() + 1, 
        text: 'Thanks for reaching out! A support executive will be with you shortly.', 
        sender: 'support' 
      }]);
    }, 1000);
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-black text-gray-900">Support & Help</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Search Help */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search help topics..."
            className="w-full bg-white border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-900 shadow-sm outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Quick Contact */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setIsChatting(true)}
            className="bg-purple-600 text-white p-6 rounded-[32px] flex flex-col items-center gap-3 shadow-xl shadow-purple-100"
          >
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="font-black text-sm uppercase tracking-widest">Live Chat</span>
          </button>
          <button className="bg-white p-6 rounded-[32px] border border-gray-100 flex flex-col items-center gap-3 shadow-sm">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
              <Phone className="w-6 h-6" />
            </div>
            <span className="font-black text-sm uppercase tracking-widest text-gray-900">Call Us</span>
          </button>
        </div>

        {/* Help Topics */}
        <div className="space-y-4">
          <h3 className="font-black text-gray-900 px-2">Popular Topics</h3>
          {helpTopics.map(topic => (
            <div key={topic.id} className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-purple-200 transition-colors shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{topic.title}</p>
                  <p className="text-xs text-gray-400 font-bold">{topic.description}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-purple-500 transition-colors" />
            </div>
          ))}
        </div>

        {/* Other Contact Info */}
        <div className="bg-gray-900 rounded-[40px] p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-4">Other Ways to Connect</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white/60">
                <Mail className="w-5 h-5" />
                <p className="text-sm font-bold">support@apnamandla.com</p>
              </div>
              <div className="flex items-center gap-3 text-white/60">
                <Phone className="w-5 h-5" />
                <p className="text-sm font-bold">+91 12345 67890</p>
              </div>
            </div>
          </div>
          <HelpCircle className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5" />
        </div>
      </div>

      {/* Chat Overlay */}
      <AnimatePresence>
        {isChatting && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-0 bg-white z-[60] flex flex-col"
          >
            <div className="bg-white px-6 pt-12 pb-6 flex items-center gap-4 border-b border-gray-100 sticky top-0 z-10">
              <button onClick={() => setIsChatting(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-black text-gray-900">Support Agent</h2>
                  <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Online</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {chatHistory.map(chat => (
                <div key={chat.id} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-3xl font-bold text-sm ${
                    chat.sender === 'user' 
                      ? 'bg-purple-600 text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-900 rounded-tl-none'
                  }`}>
                    {chat.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-white border-t border-gray-100 flex gap-3 items-center">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 font-bold text-gray-900 outline-none focus:border-purple-500 transition-colors"
              />
              <button 
                onClick={handleSendMessage}
                className="w-14 h-14 bg-purple-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-purple-100 active:scale-95 transition-transform"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
