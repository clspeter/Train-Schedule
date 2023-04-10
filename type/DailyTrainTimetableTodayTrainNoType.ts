import { TrainLiveBoardType } from './types';
export interface Welcome9 {
  UpdateTime: Date;
  UpdateInterval: number;
  SrcUpdateTime: Date;
  SrcUpdateInterval: number;
  TrainDate: Date;
  TrainTimetables: TrainTimetable[];
}

export interface TrainTimetable {
  TrainInfo: TrainInfo;
  StopTimes: StopTime[];
}
export interface TrainTimetableLive extends TrainTimetable {
  TrainLiveBoard: TrainLiveBoardType;
}

export interface StopTime {
  StopSequence: number;
  StationID: string;
  StationName: Name;
  ArrivalTime: string;
  DepartureTime: string;
  SuspendedFlag: number;
}

export interface Name {
  Zh_tw: string;
  En: string;
}

export interface TrainInfo {
  TrainNo: string;
  RouteID: string;
  Direction: number;
  TrainTypeID: string;
  TrainTypeCode: string;
  TrainTypeName: Name;
  TripHeadSign: string;
  StartingStationID: string;
  StartingStationName: Name;
  EndingStationID: string;
  EndingStationName: Name;
  OverNightStationID: string;
  TripLine: number;
  WheelChairFlag: number;
  PackageServiceFlag: number;
  DiningFlag: number;
  BreastFeedFlag: number;
  BikeFlag: number;
  CarFlag: number;
  DailyFlag: number;
  ExtraTrainFlag: number;
  SuspendedFlag: number;
  Note: string;
}
