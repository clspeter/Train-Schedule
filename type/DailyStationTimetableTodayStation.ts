export interface DailyStationTimetableTodayStation {
  UpdateTime: Date;
  UpdateInterval: number;
  SrcUpdateTime: Date;
  SrcUpdateInterval: number;
  TrainDate: Date;
  StationTimetables: StationTimetable[];
}

export interface StationTimetable {
  StationID: string;
  StationName: Name;
  Direction: number;
  TimeTables: TimeTable[];
}

export interface Name {
  Zh_tw: string;
  En: string;
}

export interface TimeTable {
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
