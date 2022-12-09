import React, { useState, createContext, useEffect } from 'react';

import { StationList } from './StationList';
import { Journey, StatinType } from './types';

type ContextType = {
  apiToken: string;
  setApiToken: React.Dispatch<React.SetStateAction<string>>;
  journey: Journey;
  setJourney: React.Dispatch<React.SetStateAction<Journey>>;
};

type StationProviderProps = {
  children: React.ReactNode;
};

export const StationContext = createContext<ContextType>({} as ContextType);

const StationProvider = ({ children }: StationProviderProps) => {
  const [apiToken, setApiToken] = useState<string>('');
  const [journey, setJourney] = useState<Journey>({
    departure: null,
    destination: null,
    time: new Date(),
  });
  const value = { apiToken, setApiToken, journey, setJourney };
  useEffect(() => {
    setJourney({
      ...journey,
      departure: StationList.find((station) => station.StationID === '1150') as StatinType,
      destination: StationList.find((station) => station.StationID === '1140') as StatinType,
    });
  }, []);
  return <StationContext.Provider value={value}>{children}</StationContext.Provider>;
};

export default StationProvider;
