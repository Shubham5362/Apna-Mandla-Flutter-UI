import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CreditCard, TrendingUp, History, ChevronRight, AlertCircle } from 'lucide-react';
import { useUdhar } from '../context/UdharContext';

interface UdharScreenProps {
  onBack: () => void;
}

export const UdharScreen = ({ onBack }: UdharScreenProps) => {
  const { accounts, transactions } = useUdhar();

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto pb-24">
      {/* Header */}
      <div className="bg-white px-6 py-6 sticky top-0 z-10 border-b border-gray-100 flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-gray-50 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-black text-gray-900">My Udhar / Khata</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary Card */}
        <div className="bg-gradient-to-br from-[#1DB954] to-[#4CAF50] p-8 rounded-[40px] text-white shadow-xl shadow-green-100">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">Total Outstanding</p>
              <h3 className="text-4xl font-black">₹{accounts.reduce((sum, acc) => sum + acc.balance, 0)}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-sm">
              <p className="text-white/60 text-[8px] font-black uppercase tracking-widest mb-1">Active Accounts</p>
              <p className="text-xl font-black">{accounts.length}</p>
            </div>
            <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-sm">
              <p className="text-white/60 text-[8px] font-black uppercase tracking-widest mb-1">Total Limit</p>
              <p className="text-xl font-black">₹{accounts.reduce((sum, acc) => sum + acc.limit, 0)}</p>
            </div>
          </div>
        </div>

        {/* Active Accounts */}
        <div>
          <div className="flex items-center gap-2 mb-4 ml-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Active Khata Accounts</h3>
          </div>
          <div className="space-y-4">
            {accounts.map((acc) => (
              <div key={acc.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-black text-gray-900 text-lg">{acc.shopName}</h4>
                    <p className="text-xs text-gray-400 font-bold">Limit: ₹{acc.limit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-red-600">₹{acc.balance}</p>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Balance</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl mb-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-bold text-gray-600">Due: {new Date(acc.dueDate).toLocaleDateString()}</span>
                  </div>
                  <span className="text-xs font-black text-green-600 uppercase tracking-widest">Pay Now</span>
                </div>

                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-red-500 h-full rounded-full" 
                    style={{ width: `${(acc.balance / acc.limit) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {accounts.length === 0 && (
              <div className="text-center py-12 bg-white rounded-[40px] border border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-500 font-bold">No active khata accounts</p>
                <p className="text-xs text-gray-400 mt-1">Request udhar from your favorite shops</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center gap-2 mb-4 ml-2">
            <History className="w-4 h-4 text-blue-500" />
            <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Recent Transactions</h3>
          </div>
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
            {transactions.slice(0, 10).map((tx, idx) => (
              <div key={tx.id} className={`p-5 flex items-center gap-4 ${idx !== 0 ? 'border-t border-gray-50' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'purchase' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                  {tx.type === 'purchase' ? <TrendingUp className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className="font-black text-gray-900 text-sm">{tx.type === 'purchase' ? 'Purchase' : 'Payment'}</p>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{new Date(tx.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className={`font-black ${tx.type === 'purchase' ? 'text-red-600' : 'text-green-600'}`}>
                    {tx.type === 'purchase' ? '+' : '-'}₹{tx.amount}
                  </p>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <p className="text-center py-8 text-gray-400 text-sm font-bold">No transactions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
