export interface DailyStationTimetableTodayStationType {
  UpdateTime: Date;
  UpdateInterval: number;
  SrcUpdateTime: Date;
  SrcUpdateInterval: number;
  TrainDate: Date;
  StationTimetables: StationTimetableType[];
}

export interface StationTimetableType {
  StationID: string;
  StationName: Name;
  Direction: number;
  TimeTables: TimeTableType[];
}

export interface Name {
  Zh_tw: string;
  En: string;
}

export interface TimeTableType {
  Sequence: number;
  TrainNo: string;
  DestinationStationID: string;
  DestinationStationName: Name;
  TrainTypeID: string;
  TrainTypeCode: string;
  TrainTypeName: Name;
  ArrivalTime: string;
  DepartureTime: string;
  SuspendedFlag: number;
}

export interface TimeTableLiveType extends TimeTableType {
  DelayTime: number;
  PassedByStation: {
    ID: string;
    Name: string;
  };
}
