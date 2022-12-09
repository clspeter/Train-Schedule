import { StationList } from './StationList';

export type StationListType = typeof StationList;
export type StatinType = StationListType[number];

export type Journey = {
  departure: StatinType | null;
  destination: StatinType | null;
  time: Date;
};
