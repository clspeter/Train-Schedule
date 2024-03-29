import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { atom, selector } from 'recoil';

import { apiDailyStationTimetableTodayStation, apiTodayTrainStatusByNo } from './api/apiRequest';
import { TimeTableLiveType, TimeTableType } from './type/DailyStationTimetableTodayStation';
import {
  ApiToken,
  Journey,
  ODTimeTableInfoType,
  SettingType,
  ShortCutType,
  StatinType,
  TrainInfoType,
  TrainLiveBaordTrainInfoDisplay,
  TrainLiveBoardDataType,
  TrainLiveBoardType,
} from './type/types';

dayjs.extend(customParseFormat);

export const resetRecoil = atom({
  key: 'resetRecoil',
  default: false,
});

export const currentTimeRecoil = atom({
  key: 'currentTimeRecoil',
  default: dayjs(new Date()).format('HH:mm'),
});

export const apiStatusRecoil = atom({
  key: 'apiStatusRecoil',
  default: true,
});

export const neareastStationRecoil = atom({
  key: 'neareastStationRecoil',
  default: {} as StatinType,
});

export const nextTrainDataRecoil = selector({
  key: 'nextTrainDataRecoil',
  get: async ({ get }) => {
    const neareastStation = get(neareastStationRecoil);
    const apiToken = get(apiTokenRecoil);
    if (neareastStation.StationID === '')
      return { NextTrainNorthTable: [], NextTrainSouthTable: [] } as {
        NextTrainNorthTable: TimeTableType[];
        NextTrainSouthTable: TimeTableType[];
      };
    const NextTrainData = await apiDailyStationTimetableTodayStation(
      apiToken.access_token,
      neareastStation.StationID
    ).then((res) => {
      return res.data;
    });
    return NextTrainData;
  },
});

export const nextTrainTableRecoil = selector({
  key: 'nextTrainTableRecoil',
  get: async ({ get }) => {
    const NextTrainData = get(nextTrainDataRecoil);
    const NextTrainNorthTable = NextTrainData.StationTimetables[0].TimeTables;
    const NextTrainSouthTable = NextTrainData.StationTimetables[1].TimeTables;
    if (NextTrainNorthTable.length === 0) {
      return {
        NextTrainNorthTable: [],
        NextTrainSouthTable: [],
      } as {
        NextTrainNorthTable: TimeTableType[];
        NextTrainSouthTable: TimeTableType[];
      };
    }

    return {
      NextTrainNorthTable,
      NextTrainSouthTable,
    } as {
      NextTrainNorthTable: TimeTableType[];
      NextTrainSouthTable: TimeTableType[];
    };
  },
  //find nextTrainIndex
});

export const nextTrainIndexReciol = selector({
  key: 'nextTrainIndexReciol',
  get: async ({ get }) => {
    const { NextTrainNorthTable, NextTrainSouthTable } = get(nextTrainTableRecoil);
    const currentTime = get(currentTimeRecoil);
    const nextTrainIndexNorth = NextTrainNorthTable.findIndex((train: TimeTableType) => {
      return currentTime < train.DepartureTime;
    });
    const nextTrainIndexSouth = NextTrainSouthTable.findIndex((train: TimeTableType) => {
      return currentTime < train.DepartureTime;
    });
    return {
      nextTrainIndexNorth,
      nextTrainIndexSouth,
    } as {
      nextTrainIndexNorth: number;
      nextTrainIndexSouth: number;
    };
  },
});

export const nextTrainLiveTableRecoil = selector({
  key: 'nextTrainLiveTableRecoil',
  get: async ({ get }) => {
    const { NextTrainNorthTable, NextTrainSouthTable } = get(nextTrainTableRecoil);
    const trainLiveBoardData = get(trainLiveBoardDataRecoil);
    //add delayTime to nextTrain
    if (!NextTrainNorthTable || !trainLiveBoardData)
      return {
        NextTrainNorthLiveTable: [],
        NextTrainSouthLiveTable: [],
      } as {
        NextTrainNorthLiveTable: TimeTableLiveType[];
        NextTrainSouthLiveTable: TimeTableLiveType[];
      };

    const NextTrainNorthLiveTable = NextTrainNorthTable.map((train: TimeTableType) => {
      const trainLive = trainLiveBoardData.TrainLiveBoards.find(
        (trainLive) => trainLive.TrainNo === train.TrainNo
      );
      if (trainLive) {
        return {
          ...train,
          DelayTime: trainLive.DelayTime,
        };
      } else {
        return {
          ...train,
          DelayTime: -1,
        };
      }
    });

    const NextTrainSouthLiveTable = NextTrainSouthTable.map((train: TimeTableType) => {
      const trainLive = trainLiveBoardData.TrainLiveBoards.find(
        (trainLive) => trainLive.TrainNo === train.TrainNo
      );
      if (trainLive) {
        return {
          ...train,
          DelayTime: trainLive.DelayTime,
        };
      } else {
        return {
          ...train,
          DelayTime: -1,
        };
      }
    });
    return {
      NextTrainNorthLiveTable,
      NextTrainSouthLiveTable,
    } as {
      NextTrainNorthLiveTable: TimeTableLiveType[];
      NextTrainSouthLiveTable: TimeTableLiveType[];
    };
  },
});
export const selectedCityIdRecoil = atom({
  key: 'selectedCityIdRecoil',
  default: 16,
});

export const isArrivalTimeRecoil = atom({
  key: 'isArrivalTimeRecoil',
  default: false,
});

export const isNowRecoil = atom({
  key: 'isNowRecoil',
  default: false,
});

export const shortCutsRecoil = atom({
  key: 'shortCutsRecoil',
  default: [] as ShortCutType[],
});

const initialStationDeparture: StatinType = {
  StationUID: 'TRA-1000',
  StationID: '1000',
  StationName: { Zh_tw: '臺北', En: 'Taipei' },
  StationPosition: { PositionLon: 121.51784, PositionLat: 25.04771 },
  StationAddress: '100230臺北市中正區黎明里北平西路 3 號',
  StationPhone: '02-23713558',
  StationClass: '0',
  StationURL: 'http://www.railway.gov.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1000',
};

const initialStationDestination: StatinType = {
  StationUID: 'TRA-0990',
  StationID: '0990',
  StationName: { Zh_tw: '松山', En: 'Songshan' },
  StationPosition: { PositionLon: 121.57807, PositionLat: 25.04936 },
  StationAddress: '11088臺北市信義區永吉里松山路 11 號B1',
  StationPhone: '02-27673819',
  StationClass: '1',
  StationURL: 'http://www.railway.gov.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/0990',
};

const initialStation: StatinType = {
  StationUID: '',
  StationID: '',
  StationName: {
    Zh_tw: '',
    En: '',
  },
  StationPosition: {
    PositionLon: 0,
    PositionLat: 0,
  },
  StationAddress: '',
  StationPhone: '',
  StationClass: '',
  StationURL: '',
};

export const journeyRecoil = atom({
  key: 'journeyRecoil',
  default: {
    departure: initialStationDeparture,
    destination: initialStationDestination,
    time: new Date(),
  } as Journey,
});

export const apiTokenRecoil = atom({
  key: 'apiTokenRecoil',
  default: {
    access_token: '',
    vaild_time: new Date(),
  } as ApiToken,
});

export const trainLiveBoardDataRecoil = atom({
  key: 'trainLiveBoardDataRecoil',
  default: {} as TrainLiveBoardDataType,
});

export const oDTimeTableInfoRecoil = atom({
  key: 'oDTimeTableInfoRecoil',
  default: [] as ODTimeTableInfoType[],
});

export const oDTimeTableInfoInitialRecoil = atom({
  key: 'oDTimeTableInfoInitialRecoil',
  default: [] as ODTimeTableInfoType[],
});

export const appSettingRecoil = atom({
  key: 'appSettingRecoil',
  default: { useNearestStationOnStartUp: false } as SettingType,
});

export const selectTrainNoRecoil = atom({
  key: 'selectTrainNoRecoil',
  default: '',
});

export const TrainInfoDetailRecoil = selector({
  key: 'TrainInfoDetailRecoil',
  get: async ({ get }) => {
    const selectTrainNo = get(selectTrainNoRecoil);
    const apiToken = get(apiTokenRecoil);
    const trainInfoDetail = await apiTodayTrainStatusByNo(
      apiToken.access_token,
      selectTrainNo
    ).then((res) => {
      return res.data.TrainTimetables[0] as TrainInfoType['TrainTimetables'][0];
    });
    return trainInfoDetail;
  },
});

export const TrainInfoLiveRecoil = selector({
  key: 'TrainInfoLiveRecoil',
  get: async ({ get }) => {
    const trainInfoDetail = get(TrainInfoDetailRecoil);
    const trainLiveBoardData = get(trainLiveBoardDataRecoil);
    const trainLiveBoard = trainLiveBoardData.TrainLiveBoards.find(
      (train) => train.TrainNo === trainInfoDetail.TrainInfo.TrainNo
    );

    //if trainInfoDetail is blank, return
    if (!trainInfoDetail) {
      console.log('TrainInfoScreen not focoused');
      return;
    }
    if (!trainLiveBoard) {
      console.log('Train not found');
      return {
        DelayTime: -1,
        index: {
          initialScroll: 0,
          showDelayTime: -1,
          start: 0,
          end: 0,
        },
      } as TrainLiveBaordTrainInfoDisplay;
    } else {
      const showDelayIndex = trainInfoDetail.StopTimes.findIndex((stopTime) => {
        if (trainInfoDetail.TrainInfo.Direction === 0) {
          return trainLiveBoard.StationID >= stopTime.StationID;
        }
        return trainLiveBoard.StationID <= stopTime.StationID;
      });
      console.log('showDelayIndex ' + showDelayIndex);
      return {
        ...trainLiveBoard,
        index: {
          initialScroll: showDelayIndex - 1,
          showDelayTime: showDelayIndex,
          start: 0,
          end: 0,
        },
      } as TrainLiveBaordTrainInfoDisplay;
    }
  },
});
