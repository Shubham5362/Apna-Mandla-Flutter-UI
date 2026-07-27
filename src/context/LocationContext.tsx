import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Area {
  id: string;
  name: string;
}

interface LocationContextType {
  district: string;
  selectedArea: Area | null;
  areas: Area[];
  setSelectedArea: (area: Area) => void;
  detectLocation: () => Promise<void>;
  permissionStatus: 'prompt' | 'granted' | 'denied';
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const MANDLA_AREAS: Area[] = [
  { id: 'lalipur', name: 'Lalipur' },
  { id: 'katra', name: 'Katra' },
  { id: 'binjhiya', name: 'Binjhiya' },
  { id: 'maharajpur', name: 'Maharajpur' },
  { id: 'bamhni', name: 'Bamhni' },
];

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [district, setDistrict] = useState('Detecting...');
  const [selectedArea, setSelectedAreaState] = useState<Area | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  useEffect(() => {
    const savedArea = localStorage.getItem('selectedArea');
    if (savedArea) {
      setSelectedAreaState(JSON.parse(savedArea));
      setDistrict('Mandla');
    }
  }, []);

  const setSelectedArea = (area: Area) => {
    setSelectedAreaState(area);
    localStorage.setItem('selectedArea', JSON.stringify(area));
  };

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      setDistrict('Mandla');
      return;
    }

    try {
      // Simulate GPS permission request
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      setPermissionStatus('granted');
      // In a real app, we'd use reverse geocoding here
      setDistrict('Mandla');
      
      // If no area is selected, we don't auto-select one anymore
      // We want the user to see the list of areas
    } catch (error) {
      setPermissionStatus('denied');
      setDistrict('Mandla');
    }
  };

  return (
    <LocationContext.Provider
      value={{
        district,
        selectedArea,
        areas: MANDLA_AREAS,
        setSelectedArea,
        detectLocation,
        permissionStatus,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within a LocationProvider');
  return context;
};
