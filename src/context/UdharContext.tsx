import React, { createContext, useContext, useState, useEffect } from 'react';
import { UdharRequest, UdharAccount, UdharTransaction } from '../types';
import { useAuth } from './AuthContext';

interface UdharContextType {
  requests: UdharRequest[];
  accounts: UdharAccount[];
  transactions: UdharTransaction[];
  sendRequest: (request: Omit<UdharRequest, 'id' | 'status' | 'date'>) => void;
  approveRequest: (requestId: string, settings: Omit<UdharAccount, 'id' | 'status' | 'createdAt' | 'balance' | 'dueDate' | 'shopId' | 'customerId' | 'customerName'>) => void;
  rejectRequest: (requestId: string) => void;
  acceptAgreement: (accountId: string) => void;
  declineAgreement: (accountId: string) => void;
  addTransaction: (transaction: Omit<UdharTransaction, 'id' | 'date'>) => void;
  getAccountForShop: (shopId: string) => UdharAccount | undefined;
  getRequestsForShop: (shopId: string) => UdharRequest[];
  getAccountsForShop: (shopId: string) => UdharAccount[];
  getTransactionsForAccount: (accountId: string) => UdharTransaction[];
}

const UdharContext = createContext<UdharContextType | undefined>(undefined);

export const UdharProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<UdharRequest[]>([]);
  const [accounts, setAccounts] = useState<UdharAccount[]>([]);
  const [transactions, setTransactions] = useState<UdharTransaction[]>([]);

  // Load mock data or real data
  useEffect(() => {
    // Initial mock data could go here
  }, []);

  const sendRequest = (requestData: Omit<UdharRequest, 'id' | 'status' | 'date'>) => {
    const newRequest: UdharRequest = {
      ...requestData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      date: new Date().toISOString(),
    };
    setRequests(prev => [...prev, newRequest]);
  };

  const approveRequest = (requestId: string, settings: any) => {
    setRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'approved' } : req));
    
    const request = requests.find(r => r.id === requestId);
    if (request) {
      const newAccount: UdharAccount = {
        id: Math.random().toString(36).substr(2, 9),
        shopId: request.shopId,
        shopName: settings.shopName,
        customerId: request.customerId,
        customerName: request.customerName,
        limit: settings.limit,
        minOrder: settings.minOrder,
        interestRate: settings.interestRate,
        interestEnabled: settings.interestEnabled,
        paymentPeriod: settings.paymentPeriod,
        balance: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + settings.paymentPeriod * 24 * 60 * 60 * 1000).toISOString(),
      };
      setAccounts(prev => [...prev, newAccount]);
    }
  };

  const rejectRequest = (requestId: string) => {
    setRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'rejected' } : req));
  };

  const acceptAgreement = (accountId: string) => {
    // In this simple mock, accounts are active by default once approved, 
    // but we could add a 'pending_agreement' status
  };

  const declineAgreement = (accountId: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== accountId));
  };

  const addTransaction = (transactionData: Omit<UdharTransaction, 'id' | 'date'>) => {
    const newTransaction: UdharTransaction = {
      ...transactionData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    setTransactions(prev => [...prev, newTransaction]);

    // Update account balance
    setAccounts(prev => prev.map(acc => {
      if (acc.id === transactionData.accountId) {
        const balanceChange = transactionData.type === 'payment' ? -transactionData.amount : transactionData.amount;
        return { ...acc, balance: acc.balance + balanceChange };
      }
      return acc;
    }));
  };

  const getAccountForShop = (shopId: string) => {
    return accounts.find(acc => acc.shopId === shopId && acc.customerId === user?.uid);
  };

  const getRequestsForShop = (shopId: string) => {
    return requests.filter(req => req.shopId === shopId);
  };

  const getAccountsForShop = (shopId: string) => {
    return accounts.filter(acc => acc.shopId === shopId);
  };

  const getTransactionsForAccount = (accountId: string) => {
    return transactions.filter(t => t.accountId === accountId);
  };

  return (
    <UdharContext.Provider value={{
      requests,
      accounts,
      transactions,
      sendRequest,
      approveRequest,
      rejectRequest,
      acceptAgreement,
      declineAgreement,
      addTransaction,
      getAccountForShop,
      getRequestsForShop,
      getAccountsForShop,
      getTransactionsForAccount
    }}>
      {children}
    </UdharContext.Provider>
  );
};

export const useUdhar = () => {
  const context = useContext(UdharContext);
  if (context === undefined) {
    throw new Error('useUdhar must be used within a UdharProvider');
  }
  return context;
};
