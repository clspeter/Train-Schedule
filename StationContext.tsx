import React, { useState, createContext, useEffect } from 'react';

import { StationList } from './StationList';
import { getApiToken } from './api/apiRequest';
import { Journey, StatinType, ApiToken } from './types';
import { getJSDocDeprecatedTag } from 'typescript';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ContextType = {
  apiToken: ApiToken;
  setApiToken: React.Dispatch<React.SetStateAction<ApiToken>>;
  journey: Journey;
  setJourney: React.Dispatch<React.SetStateAction<Journey>>;
};

type StationProviderProps = {
  children: React.ReactNode;
};

export const StationContext = createContext<ContextType>({} as ContextType);

const StationProvider = ({ children }: StationProviderProps) => {
  const [apiToken, setApiToken] = useState<ApiToken>({
    access_token: '',
    vaild_time: new Date(),
  });
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
    //check if token is expired or not exist in async storage
    AsyncStorage.getItem('apiToken').then((token) => {
      if (token) {
        const tokenObj = JSON.parse(token);
        const vaild_time = new Date(tokenObj.vaild_time);
        console.log(vaild_time.toLocaleString());
        console.log(new Date().toLocaleString());
        vaild_time.setHours(vaild_time.getHours() - 1);
        if (new Date() < vaild_time) {
          setApiToken(tokenObj);
          console.log('token is valid');
          return;
        }
      }
      getApiToken().then((token) => {
        //get token and set vaild date to 12 hours later
        const vaild_time = new Date();
        vaild_time.setHours(vaild_time.getHours() + 24);
        setApiToken({
          access_token: token.access_token,
          vaild_time,
        });
        AsyncStorage.setItem(
          'apiToken',
          JSON.stringify({ access_token: token.access_token, vaild_time })
        );
      });
    });
  }, []);
  return <StationContext.Provider value={value}>{children}</StationContext.Provider>;
};

export default StationProvider;
