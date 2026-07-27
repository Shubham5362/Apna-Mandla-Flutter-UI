import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  Wallet, 
  CreditCard, 
  Smartphone,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WalletScreenProps {
  onBack: () => void;
}

export const WalletScreen = ({ onBack }: WalletScreenProps) => {
  const [isRecharging, setIsRecharging] = useState(false);
  const [amount, setAmount] = useState('');

  const transactions = [
    { id: 1, type: 'payment', title: 'Sharma Electronics', amount: -1240, date: 'Today, 2:30 PM', status: 'Success' },
    { id: 2, type: 'recharge', title: 'Wallet Recharge', amount: 2000, date: 'Yesterday, 10:15 AM', status: 'Success' },
    { id: 3, type: 'payment', title: 'Mandla Grocery', amount: -450, date: '12 Mar, 6:45 PM', status: 'Success' },
    { id: 4, type: 'payment', title: 'Parcel Delivery', amount: -120, date: '10 Mar, 11:20 AM', status: 'Success' },
  ];

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-black text-gray-900">My Wallet</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Balance Card */}
        <div className="bg-gray-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-gray-900/20">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Available Balance</p>
                <h2 className="text-4xl font-black mt-1">₹2,450.00</h2>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-[#1DB954]" />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setIsRecharging(true)}
                className="flex-1 bg-[#1DB954] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-green-900/20"
              >
                <Plus className="w-5 h-5" /> Add Money
              </button>
              <button className="flex-1 bg-white/10 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 backdrop-blur-md">
                <History className="w-5 h-5" /> History
              </button>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-[#1DB954]/10 rounded-full blur-3xl" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: <Smartphone />, label: 'UPI Pay', color: 'bg-blue-50 text-blue-600' },
            { icon: <CreditCard />, label: 'Cards', color: 'bg-purple-50 text-purple-600' },
            { icon: <ShieldCheck />, label: 'Security', color: 'bg-green-50 text-green-600' },
          ].map((action, i) => (
            <div key={i} className="bg-white p-4 rounded-3xl border border-gray-100 flex flex-col items-center gap-2 shadow-sm">
              <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center`}>
                {React.cloneElement(action.icon as React.ReactElement<any>, { className: 'w-5 h-5' })}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{action.label}</span>
            </div>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-gray-900">Recent Transactions</h3>
            <button className="text-xs font-black text-[#1DB954] uppercase tracking-widest">View All</button>
          </div>
          <div className="space-y-6">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    tx.type === 'recharge' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                  }`}>
                    {tx.type === 'recharge' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{tx.title}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black ${tx.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount)}
                  </p>
                  <p className="text-[10px] text-green-500 font-black uppercase tracking-widest">{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recharge Modal */}
      <AnimatePresence>
        {isRecharging && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRecharging(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] p-8 z-[70] shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />
              <h3 className="text-2xl font-black text-gray-900 mb-2">Add Money to Wallet</h3>
              <p className="text-gray-500 text-sm font-bold mb-8">Enter the amount you want to add to your APNA MANDLA wallet.</p>
              
              <div className="relative mb-8">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-gray-900">₹</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-3xl py-6 pl-12 pr-6 text-3xl font-black text-gray-900 focus:border-[#1DB954] outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 mb-8">
                {[500, 1000, 2000].map(val => (
                  <button 
                    key={val}
                    onClick={() => setAmount(val.toString())}
                    className="bg-gray-50 py-3 rounded-2xl font-black text-gray-900 hover:bg-green-50 hover:text-[#1DB954] transition-colors"
                  >
                    +₹{val}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setIsRecharging(false)}
                className="w-full bg-[#1DB954] text-white py-5 rounded-3xl font-black text-lg uppercase tracking-widest shadow-xl shadow-green-100 active:scale-95 transition-transform"
              >
                Proceed to Pay
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
