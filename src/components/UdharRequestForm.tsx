import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUdhar } from '../context/UdharContext';

interface UdharRequestFormProps {
  shopId: string;
  shopName: string;
  onClose: () => void;
}

export const UdharRequestForm = ({ shopId, shopName, onClose }: UdharRequestFormProps) => {
  const { user } = useAuth();
  const { sendRequest } = useUdhar();
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    phone: '',
    address: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendRequest({
      customerId: user?.uid || 'anon',
      customerName: formData.name,
      phoneNumber: formData.phone,
      address: formData.address,
      message: formData.message,
      shopId: shopId
    });
    onClose();
    alert('Udhar request sent successfully!');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900">Request Udhar</h2>
              <p className="text-sm text-gray-500 font-bold">at {shopName}</p>
            </div>
            <button onClick={onClose} className="p-2 bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1 block">Your Name</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-gray-900"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1 block">Phone Number</label>
              <input 
                required
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-gray-900"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1 block">Address</label>
              <textarea 
                required
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-gray-900 h-24 resize-none"
                placeholder="Enter your full address"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1 block">Message / Purpose</label>
              <textarea 
                required
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-gray-900 h-24 resize-none"
                placeholder="e.g. I want monthly grocery khata..."
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#1DB954] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-green-100 flex items-center justify-center gap-2 mt-4"
            >
              <Send className="w-4 h-4" />
              Send Request
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};
