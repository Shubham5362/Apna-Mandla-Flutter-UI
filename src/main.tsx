import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';
import { UdharProvider } from './context/UdharContext';
import { SettingsProvider } from './context/SettingsContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <UdharProvider>
              <App />
            </UdharProvider>
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </SettingsProvider>
  </StrictMode>,
);
