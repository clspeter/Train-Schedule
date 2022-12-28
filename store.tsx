import { atom, useRecoilState } from 'recoil';
import React, { useContext } from 'react';
import { StationContext } from './StationContext';
import { Journey, ShortCutType } from './types';

export const shortCutsState = atom({
  key: 'shortCutsState',
  default: [] as ShortCutType[],
});
