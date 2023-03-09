import { atom, selector } from 'recoil';
import { apiTodayTrainStatusByNo, apiDailyStationTimetableTodayStation } from './api/apiRequest';
import { TrainInfoType, TrainLiveBaordTrainInfoDisplay, TrainLiveBoardType } from './types';
import {
  DailyStationTimetableTodayStationTypeWithDelayTime,
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

export const neareastStationRecoil = atom({
  key: 'neareastStationRecoil',
  default: {} as StatinType,
});

export const nextTrainRecoil = selector({
  key: 'nextTrainRecoil',
  get: async ({ get }) => {
    const neareastStation = get(neareastStationRecoil);
    const apiToken = get(apiTokenRecoil);

    const NextTrainData = await apiDailyStationTimetableTodayStation(
      apiToken.access_token,
      neareastStation.StationID
    ).then((res) => {
      return res.data;
    });
    return NextTrainData;
  },
});

export const nextTrainLiveRecoil = selector({
  key: 'nextTrainLiveRecoil',
  get: async ({ get }) => {
    const nextTrain = get(nextTrainRecoil);
    const trainLiveBoardData = get(trainLiveBoardDataRecoil);
    //add delayTime to nextTrain
    const nextTrainLive = nextTrain.StationTimetables[0].map((train: TimeTableType) => {
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
