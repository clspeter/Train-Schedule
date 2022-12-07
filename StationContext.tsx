import React, { useState, createContext } from 'react';

import { Journey } from './types';

type ContextType = {
  journey: Journey;
  setJourney: React.Dispatch<React.SetStateAction<Journey>>;
};

type StationProviderProps = {
  children: React.ReactNode;
};

export const StationContext = createContext<ContextType>({} as ContextType);

const StationProvider = ({ children }: StationProviderProps) => {
  const [journey, setJourney] = useState<Journey>({
    departure: '中壢',
    destination: '北湖',
    time: new Date(),
  });
  return (
    <StationContext.Provider value={{ journey, setJourney }}>{children}</StationContext.Provider>
  );
};

export default StationProvider;
