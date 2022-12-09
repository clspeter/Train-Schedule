import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { StationList } from './StationList';

export type StationListType = typeof StationList;
export type StatinType = StationListType[number];

export type Journey = {
  departure: StatinType | null;
  destination: StatinType | null;
  time: Date;
};

export type RootStackParamList = {
  Home: undefined;
  SelectDeparture: undefined;
  SelectDestination: undefined;
  SelectStation: undefined;
};

export type homeScreenProp = NativeStackNavigationProp<RootStackParamList>;
