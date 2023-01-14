import ODTimeTable from '../responselist/oDTimeTableExample.json';
import { oDTimeTableType, TrainLiveBoardType, ODTimeTableInfoType } from '../types';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';
// caculate the time difference between two time

// caculate travel time hours and minutes
const caulateTravelTime = (time1: string, time2: string) => {
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

const travelTimeCaulate = (time1: string, time2: string) => {
  dayjs.extend(customParseFormat);
  dayjs.extend(duration);

  const time2obj = dayjs(time2, 'HH:mm');
  const time1obj = dayjs(time1, 'HH:mm');
  let traveltime = dayjs.duration(time2obj.diff(time1obj));
  if (time1 > time2) {
    traveltime = traveltime.add(1, 'days');
  }
  const hoursStr = traveltime.hours() > 0 ? traveltime.hours() + '時' : '';
  const minuatesStr = traveltime.minutes() > 0 ? traveltime.minutes() + '分' : '';
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
  const trainTypeSlice2 = TrainTypeNameZH.slice(0, 2);
  const trainTypeSlice3 = TrainTypeNameZH.slice(0, 3);
  const trainTypeSlice4 = TrainTypeNameZH.slice(0, 4);
  if (trainTypeSlice2 === '區間') {
    return '區間';
  } else if (trainTypeSlice4 === '自強(3') {
    return '自強3K';
  } else if (trainTypeSlice3 === '自強(') {
    return '自強';
  } else if (trainTypeSlice2 === '莒光') {
    return '莒光';
  } else if (trainTypeSlice3 === '太魯閣') {
    return '太魯閣';
  } else if (trainTypeSlice3 === '普悠瑪') {
    return '普悠瑪';
  } else return 'e' + TrainTypeNameZH;
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
      TrainTypeName: trainType(item.DailyTrainInfo.TrainTypeName.Zh_tw),
      StartingStationID: item.DailyTrainInfo.StartingStationID,
      StartingStationName: item.DailyTrainInfo.StartingStationName.Zh_tw,
      EndingStationID: item.DailyTrainInfo.EndingStationID,
      EndingStationName: item.DailyTrainInfo.EndingStationName.Zh_tw,
      DepartureTime: item.OriginStopTime.DepartureTime,
      ArrivalTime: item.DestinationStopTime.ArrivalTime,
      Stops: stopCount(item.OriginStopTime.StopSequence, item.DestinationStopTime.StopSequence),
      TravelTime: { Hours: travelTime.hoursStr, Minutes: travelTime.minuatesStr },
      DelayTime: -1,
    };
    ODTimeTableInfo.push(ODTimeTableItem);
  });
  return ODTimeTableInfo;
};
