import { StationList } from './StationList';

export type StationListType = typeof StationList;

export type Journey = {
  departure: string;
  destination: string;
  time: Date;
};
