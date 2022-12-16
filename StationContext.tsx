import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, createContext, useEffect } from 'react';

import { StationList } from './StationList';
import { getApiToken } from './api/apiRequest';
import { Journey, StatinType, ApiToken } from './types';

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

  const getApiTokenAndSave = () => {
    getApiToken().then((token) => {
      //get token and set vaild time
      const vaild_time = new Date();
      vaild_time.setHours(vaild_time.getHours() + 1); //1 for testind, 24 for production
      setApiToken({
        access_token: token.access_token,
        vaild_time,
      });
      AsyncStorage.setItem(
        'apiToken',
        JSON.stringify({ access_token: token.access_token, vaild_time })
      );
    });
  };
  //check if token is expired or not exist in async storage
  const checkAndUpdateToken = async () => {
    const token = await AsyncStorage.getItem('apiToken');
    //if token is null, get token and save it
    if (token === null) {
      console.log('token not found, get new token');
      getApiTokenAndSave();
      return;
    }
    //if token is not null, check if it is expired
    const tokenObj = JSON.parse(token);
    const vaild_time = new Date(tokenObj.vaild_time);
    /*   console.log(vaild_time.toLocaleString());
    console.log(new Date().toLocaleString());
    vaild_time.setHours(vaild_time.getHours() - 23); */
    if (new Date() < vaild_time) {
      setApiToken(tokenObj);
      console.log('token valid until: ' + vaild_time.toLocaleString());
      return;
    }
    console.log('token not valid, get new token');
    getApiTokenAndSave();
  };

  useEffect(() => {
    setJourney({
      ...journey,
      departure: StationList.find((station) => station.StationID === '1150') as StatinType,
      destination: StationList.find((station) => station.StationID === '1140') as StatinType,
    });
    checkAndUpdateToken();
  }, []);
  return <StationContext.Provider value={value}>{children}</StationContext.Provider>;
};

export default StationProvider;
