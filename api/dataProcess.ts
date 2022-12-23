import ODTimeTable from '../responselist/oDTimeTableExample.json';
import { oDTimeTableType, TrainLiveBoardType, ODTimeTableInfoType } from '../types';
// caculate the time difference between two time

const travelTimeminuate = (time1: string, time2: string) => {
  const time1Arr = time1.split(':');
  const time2Arr = time2.split(':');
  const time1Min = parseInt(time1Arr[0]) * 60 + parseInt(time1Arr[1]);
  const time2Min = parseInt(time2Arr[0]) * 60 + parseInt(time2Arr[1]);
  return time2Min - time1Min;
};

const stopCount = (OriginStopSequence: number, DestinationStopSequence: number) => {
  return DestinationStopSequence - OriginStopSequence;
};

export const updateDelayTime = (
  ODTimeTableInfo: ODTimeTableInfoType[],
  trainLiveBoards: TrainLiveBoardType[]
) => {
  ODTimeTableInfo.forEach((item) => {
    const trainLiveBoard = trainLiveBoards.find(
      (trainLiveBoard) => trainLiveBoard.TrainNo === item.TrainNo
    );
    if (trainLiveBoard) {
      item.DelayTime = trainLiveBoard.DelayTime;
    }
  });
  return ODTimeTableInfo;
};

const trainType = (TrainTypeNameZH: string) => {
  return TrainTypeNameZH;
};
//處理資料
export const apiDailyTimetableODDataProcess = (ODTimeTable: oDTimeTableType[]) => {
  const ODTimeTableInfo: ODTimeTableInfoType[] = [];
  ODTimeTable.forEach((item) => {
    const ODTimeTableItem: ODTimeTableInfoType = {
      TrainNo: item.DailyTrainInfo.TrainNo,
      TrainDate: item.TrainDate,
      TrainTypeName: item.DailyTrainInfo.TrainTypeName.Zh_tw,
      OriginStationID: item.DailyTrainInfo.StartingStationID,
      DepartureTime: item.OriginStopTime.DepartureTime,
      DestinationStationID: item.DailyTrainInfo.EndingStationID,
      ArrivalTime: item.DestinationStopTime.ArrivalTime,
      Stops: stopCount(item.OriginStopTime.StopSequence, item.DestinationStopTime.StopSequence),
      TravelTime: travelTimeminuate(
        item.OriginStopTime.DepartureTime,
        item.DestinationStopTime.ArrivalTime
      ),
      DelayTime: -1,
    };
    ODTimeTableInfo.push(ODTimeTableItem);
  });
  return ODTimeTableInfo;
};