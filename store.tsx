import { atom, useRecoilState } from 'recoil';
import React, { useContext, useEffect } from 'react';
import { StationContext } from './StationContext';
import { Journey, ShortCutType, ShortCutWithSrtingTimeType } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const shortCutsState = atom({
  key: 'shortCutsState',
  default: [] as ShortCutType[],
});

export const StateStore = () => {
  const [shortCuts, setShortCuts] = useRecoilState(shortCutsState);
  const saveShortcuts = async () => {
    try {
      await AsyncStorage.setItem('shortcuts', JSON.stringify(shortCuts));
    } catch (e) {
      // saving error
    }
  };

  const loadShortcuts = async () => {
    try {
      const value = await AsyncStorage.getItem('shortcuts');
      if (value !== null) {
        const objShortCuts = JSON.parse(value);
        objShortCuts.forEach((item: ShortCutWithSrtingTimeType) => {
          item.time = new Date(Date.parse(item.time));
        });
        setShortCuts(objShortCuts);
      }
    } catch (e) {
      console.log('error loading shortcuts');
    }
  };

  useEffect(() => {
    if (shortCuts.length > 0) {
      saveShortcuts();
      console.log(shortCuts);
      console.log('shortcuts saved');
    }
  }, [shortCuts]);

  useEffect(() => {
    loadShortcuts();
  }, []);
  return <></>;
};

export default StateStore;
