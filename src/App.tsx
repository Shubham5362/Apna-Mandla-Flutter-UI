import React, { useState, useEffect } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { CustomerDashboard } from './components/CustomerDashboard';
import { SellerDashboard } from './components/SellerDashboard';
import { RiderDashboard } from './components/RiderDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { PublicProfile } from './components/PublicProfile';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user, loading, logout } = useAuth();
  const [activeRole, setActiveRole] = useState<string>('customer');

  // Simple routing for public profile
  const urlParams = new URLSearchParams(window.location.search);
  const profileUid = urlParams.get('profile');

  useEffect(() => {
    if (user) {
      setActiveRole(user.role || 'customer');
    } else {
      setActiveRole('customer');
    }
  }, [user]);

  if (profileUid) {
    return <PublicProfile uid={profileUid} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onLoginSuccess={() => {}} />;
  }

  // Dashboard based on role
  switch (activeRole) {
    case 'admin':
    case 'superadmin':
      return <AdminDashboard onLogout={logout} onSwitchRole={setActiveRole} />;
    case 'seller':
    case 'shop_owner':
      return <SellerDashboard onLogout={logout} onSwitchRole={setActiveRole} />;
    case 'rider':
      return <RiderDashboard onLogout={logout} onSwitchRole={setActiveRole} />;
    case 'customer':
    default:
      return <CustomerDashboard onLogout={logout} onSwitchRole={setActiveRole} />;
  }
}
