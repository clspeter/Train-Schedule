import React, { useState, createContext, useEffect } from 'react';

import { StationList } from './StationList';
import { Journey, StatinType } from './types';

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
    departure: null,
    destination: null,
    time: new Date(),
  });
  useEffect(() => {
    setJourney({
      ...journey,
      departure: StationList.find((station) => station.StationID === '1150') as StatinType,
      destination: StationList.find((station) => station.StationID === '1140') as StatinType,
    });
  }, []);
  return (
    <StationContext.Provider value={{ journey, setJourney }}>{children}</StationContext.Provider>
  );
};

export default StationProvider;
