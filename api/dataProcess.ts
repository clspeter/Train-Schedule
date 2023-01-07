import ODTimeTable from '../responselist/oDTimeTableExample.json';
import { oDTimeTableType, TrainLiveBoardType, ODTimeTableInfoType } from '../types';
// caculate the time difference between two time

// caculate travel time hours and minutes
const travelTimeCaulate = (time1: string, time2: string) => {
  const time1Arr = time1.split(':');
  const time2Arr = time2.split(':');
  const time1Min = parseInt(time1Arr[0]) * 60 + parseInt(time1Arr[1]);
  const time2Min = parseInt(time2Arr[0]) * 60 + parseInt(time2Arr[1]);
  const travelTimeMin = time2Min - time1Min;
  let hours = Math.floor(travelTimeMin / 60);
  if (hours < 0) {
    hours = hours + 24;
  }
  let minuates = travelTimeMin % 60;
  if (minuates < 0) {
    minuates = minuates + 60;
  }
  const hoursStr = hours > 0 ? hours + '時' : '';
  const minuatesStr = minuates > 0 ? minuates + '分' : '';
  return { hoursStr, minuatesStr };
};

const stopCount = (OriginStopSequence: number, DestinationStopSequence: number) => {
  return DestinationStopSequence - OriginStopSequence;
};

export const updateDelayTime = (
  ODTimeTableInfo: ODTimeTableInfoType[],
  trainLiveBoards: TrainLiveBoardType[]
) => {
  const updatedODTimeTableInfo = ODTimeTableInfo.map((item) => {
    const trainLiveBoard = trainLiveBoards.find(
      (trainLiveBoard) => trainLiveBoard.TrainNo === item.TrainNo
    );
    if (trainLiveBoard) {
      return { ...item, DelayTime: trainLiveBoard.DelayTime };
    }
    return item;
  });
  return updatedODTimeTableInfo;
};

const trainType = (TrainTypeNameZH: string) => {
  return TrainTypeNameZH;
};
//處理資料
export const apiDailyTimetableODDataProcess = (ODTimeTable: oDTimeTableType[]) => {
  const ODTimeTableInfo: ODTimeTableInfoType[] = [];
  ODTimeTable.forEach((item) => {
    const travelTime = travelTimeCaulate(
      item.OriginStopTime.DepartureTime,
      item.DestinationStopTime.ArrivalTime
    );
    const ODTimeTableItem: ODTimeTableInfoType = {
      TrainNo: item.DailyTrainInfo.TrainNo,
      TrainDate: item.TrainDate,
      TrainTypeName: item.DailyTrainInfo.TrainTypeName.Zh_tw,
      OriginStationID: item.DailyTrainInfo.StartingStationID,
      DepartureTime: item.OriginStopTime.DepartureTime,
      DestinationStationID: item.DailyTrainInfo.EndingStationID,
      ArrivalTime: item.DestinationStopTime.ArrivalTime,
      Stops: stopCount(item.OriginStopTime.StopSequence, item.DestinationStopTime.StopSequence),
      TravelTime: { Hours: travelTime.hoursStr, Minutes: travelTime.minuatesStr },
      DelayTime: -1,
    };
    ODTimeTableInfo.push(ODTimeTableItem);
  });
  return ODTimeTableInfo;
};
