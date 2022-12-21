import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import StationList from './responselist/StationList.json';
import oDTimeTableExample from './responselist/oDTimeTableExample.json';
import trainLiveBoardData from './responselist/trainLiveBoardData.json';

export type oDTimeTableType = typeof oDTimeTableExample[number];
export type TrainLiveBoardDataType = typeof trainLiveBoardData;
export type TrainLiveBoardType = typeof trainLiveBoardData.TrainLiveBoards[0];
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
  TimeTable: undefined;
};

export type ApiToken = {
  access_token: string;
  vaild_time: Date;
};

export type homeScreenProp = NativeStackNavigationProp<RootStackParamList>;
