import { atom, selector } from 'recoil';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { apiTodayTrainStatusByNo, apiDailyStationTimetableTodayStation } from './api/apiRequest';
import { TrainInfoType, TrainLiveBaordTrainInfoDisplay, TrainLiveBoardType } from './types';
import {
  DailyStationTimetableTodayStationTypeWithDelayTime,
  DailyStationTimetableTodayStationType,
  TimeTableType,
} from './type/DailyStationTimetableTodayStation';

import {
  Journey,
  ShortCutType,
  ApiToken,
  TrainLiveBoardDataType,
  ODTimeTableInfoType,
  SettingType,
  StatinType,
} from './types';
dayjs.extend(customParseFormat);

export const currentTimeRecoil = atom({
  key: 'currentTimeRecoil',
  default: dayjs(new Date()).format('HH:mm'),
});

export const neareastStationRecoil = atom({
  key: 'neareastStationRecoil',
  default: {} as StatinType,
});

export const nextTrainRecoil = selector({
  key: 'nextTrainRecoil',
  get: async ({ get }) => {
    const neareastStation = get(neareastStationRecoil);
    const apiToken = get(apiTokenRecoil);
    if (neareastStation.StationID === '') return {} as DailyStationTimetableTodayStationType;
    const NextTrainData = await apiDailyStationTimetableTodayStation(
      apiToken.access_token,
      neareastStation.StationID
    ).then((res) => {
      return res.data;
    });
    return NextTrainData as DailyStationTimetableTodayStationType;
  },
});

export const nextTrainIndexReciol = selector({
  key: 'nextTrainIndexReciol',
  get: async ({ get }) => {
    const nextTrain = get(nextTrainRecoil);
    const currentTime = get(currentTimeRecoil);
    console.log('currentTime:', currentTime);
    if (!nextTrain) {
      console.log('nextTrainIndex not found');
      return;
    }
    console.log('try to find nextTrainIndex');
    const nextTrainIndex = nextTrain.StationTimetables[0].TimeTables.findIndex(
      (train: TimeTableType) => {
        return currentTime > train.DepartureTime;
      }
    );
    console.log('nextTrainIndex:', nextTrainIndex);
    return nextTrainIndex;
  },
});

export const nextTrainLiveRecoil = selector({
  key: 'nextTrainLiveRecoil',
  get: async ({ get }) => {
    const nextTrain = get(nextTrainRecoil);
    const trainLiveBoardData = get(trainLiveBoardDataRecoil);
    //add delayTime to nextTrain
    if (!nextTrain || !trainLiveBoardData) return;

    console.log('nextTrainLiveRecoil', nextTrain);

    const nextTrainLive = nextTrain.StationTimetables[0].TimeTables.map((train: TimeTableType) => {
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
    return nextTrainLive;
  },
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
    departure: initialStation,
    destination: initialStation,
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

export const TrainInfoRecoil = atom({
  key: 'TrainInfoRecoil',
  default: {} as ODTimeTableInfoType,
});

export const TrainInfoDetailRecoil = selector({
  key: 'TrainInfoDetailRecoil',
  get: async ({ get }) => {
    const trainInfo = get(TrainInfoRecoil);
    const apiToken = get(apiTokenRecoil);
    const trainInfoDetail = await apiTodayTrainStatusByNo(
      apiToken.access_token,
      trainInfo.TrainNo
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
