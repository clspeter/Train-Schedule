import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import StationList from './responselist/StationList.json';
import oDTimeTableExample from './responselist/oDTimeTableExample.json';
import trainLiveBoardData from './responselist/trainLiveBoardData.json';

export type oDTimeTableType = typeof oDTimeTableExample[number];
export type TrainLiveBoardDataType = typeof trainLiveBoardData;
export type TrainLiveBoardType = typeof trainLiveBoardData.TrainLiveBoards[0];
export type StationListType = typeof StationList;
export type StatinType = StationListType[number];

export type ODTimeTableInfoType = {
  TrainNo: string;
  TrainDate: string;
  TrainTypeName: string;
  OriginStationID: string;
  DepartureTime: string;
  DestinationStationID: string;
  ArrivalTime: string;
  Stops: number;
  TravelTime: { Hours: string; Minutes: string };
  DelayTime: number;
};

export interface Journey {
  departure: StatinType | null;
  destination: StatinType | null;
  time: Date;
}

export type ShortCutType = Journey & {
  index: number;
  isNow: string;
};

export interface ShortCutWithSrtingTimeType {
  departure: StatinType;
  destination: StatinType;
  time: Date | string;
  index: number;
  isNow: string;
}

export type SettingType = {
  useNearestStationOnStartUp: boolean;
};

export type RootStackParamList = {
  Home: undefined;
  SelectDeparture: undefined;
  SelectDestination: undefined;
  SelectStation: undefined;
  TimeTable: undefined;
  Setting: undefined;
};

export type ApiToken = {
  access_token: string;
  vaild_time: Date;
};

export type homeScreenProp = NativeStackNavigationProp<RootStackParamList>;
