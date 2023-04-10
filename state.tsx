import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Recoil from './store';
import StationList from './type/responselist/StationList.json';
import { updateDelayTime } from './api/dataProcess';
import { Journey, StatinType, ODTimeTableInfoType, TrainLiveBoardType } from './type/types';
import { getApiToken, apiTrainStatus } from './api/apiRequest';
import { neareastStationRecoil } from './store';
import dayjs from 'dayjs';

export const RecoilState = () => {
  const [shortCuts, setShortCuts] = useRecoilState(Recoil.shortCutsRecoil);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [appSetting, setAppSetting] = useRecoilState(Recoil.appSettingRecoil);
  const [trainLiveBoardData, setTrainLiveBoardData] = useRecoilState(
    Recoil.trainLiveBoardDataRecoil
  );

  const [currentTime, setCurrentTime] = useRecoilState(Recoil.currentTimeRecoil);
  const [neareastStation, setNeareastStation] = useRecoilState(neareastStationRecoil);
  const oDTimeTableInfoInitial = useRecoilValue(Recoil.oDTimeTableInfoInitialRecoil);
  const setODTimeTableInfo = useSetRecoilState(Recoil.oDTimeTableInfoRecoil);
  const [apiToken, setApiToken] = useRecoilState(Recoil.apiTokenRecoil);
  const [journey, setJourney] = useRecoilState(Recoil.journeyRecoil);
  const [initalJourney, setInitalJourney] = useState<Journey>({
    departure: {} as StatinType,
    destination: {} as StatinType,
    time: new Date(),
  });

  const loadSettingFromStorage = async () => {
    try {
      const setting = await AsyncStorage.getItem('setting');
      if (setting === null) {
        console.log('no saved setting, use default and save it');
        await AsyncStorage.setItem('setting', JSON.stringify(appSetting));
      } else {
        const objSetting = JSON.parse(setting);
        console.log(
          'saved setting found, load it. useNearestStationOnStartUp: ' +
            objSetting.useNearestStationOnStartUp
        );
        setAppSetting(objSetting);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const loadJourney = async () => {
    try {
      const savedDD = await AsyncStorage.getItem('journey');
      if (savedDD === null) {
        console.log('no saved journey, set default');
        setJourney({
          ...journey,
          departure: StationList.find((station) => station.StationID === '1150') as StatinType,
          destination: StationList.find((station) => station.StationID === '1000') as StatinType,
        });
        setInitalJourney({
          ...journey,
          departure: StationList.find((station) => station.StationID === '1150') as StatinType,
          destination: StationList.find((station) => station.StationID === '1000') as StatinType,
        });
      } else {
        console.log('saved journey found, load it');
        const objSavedDD = JSON.parse(savedDD);
        setJourney({
          ...journey,
          departure: objSavedDD.departure,
          destination: objSavedDD.destination,
        });
        setInitalJourney({
          ...journey,
          departure: objSavedDD.departure,
          destination: objSavedDD.destination,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getApiTokenAndSave = () => {
    getApiToken().then((token) => {
      //get token and set vaild time
      const vaild_time = new Date();
      vaild_time.setHours(vaild_time.getHours() + (__DEV__ ? 1 : 23)); //1 for testind, 24 for production
      setApiToken({
        access_token: token.access_token,
        vaild_time,
      });
      AsyncStorage.setItem(
        'apiToken',
        JSON.stringify({ access_token: token.access_token, vaild_time })
      );
    });
  };

  const checkAndUpdateToken = async () => {
    const token = await AsyncStorage.getItem('apiToken');
    //if token is null, get token and save it
    if (token === null) {
      console.log('token not found, get new token');
      getApiTokenAndSave();
      return;
    }
    //if token is not null, check if it is expired
    const tokenObj = JSON.parse(token);
    const vaild_time = new Date(tokenObj.vaild_time);

    if (new Date() < vaild_time) {
      setApiToken(tokenObj);
      console.log('token valid until: ' + vaild_time.toLocaleString());
      return;
    }
    console.log('token invalid, get new token');
    getApiTokenAndSave();
  };

  useEffect(() => {
    loadSettingFromStorage();
    loadJourney();
    checkAndUpdateToken();
  }, []);

  const findNearestStation = async (toJourney: boolean) => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
    const location = await Location.getLastKnownPositionAsync({});
    if (location === null) {
      console.log('location not found');
      return;
    } else {
      const { latitude, longitude } = location.coords;
      const nearestStation = StationList.reduce((prev, curr) => {
        const prevDistance = Math.sqrt(
          Math.pow(prev.StationPosition.PositionLat - latitude, 2) +
            Math.pow(prev.StationPosition.PositionLon - longitude, 2)
        );
        const currDistance = Math.sqrt(
          Math.pow(curr.StationPosition.PositionLat - latitude, 2) +
            Math.pow(curr.StationPosition.PositionLon - longitude, 2)
        );
        return prevDistance < currDistance ? prev : curr;
      });
      setNeareastStation(nearestStation);
      console.log('nearest station: ' + nearestStation.StationName.Zh_tw);
      if (toJourney) {
        if (nearestStation.StationID === journey.departure?.StationID) return;
        else if (nearestStation.StationID === journey.destination?.StationID) {
          setJourney({
            ...journey,
            departure: nearestStation,
            destination: journey.departure,
          });
        } else {
          setJourney({ ...journey, departure: nearestStation });
        }
      }
    }
  };

  useEffect(() => {
    if (initalJourney.departure === null) return;
    else {
      if (!appSetting.useNearestStationOnStartUp) {
        findNearestStation(false);
        return;
      }
    }
    findNearestStation(true);
  }, [initalJourney, appSetting.useNearestStationOnStartUp]);

  const updateTrainStatus = () => {
    apiTrainStatus(apiToken.access_token).then((status) => {
      if (status.data === undefined) {
        return;
      }
      if (status.data === trainLiveBoardData) {
        return;
      }
      setTrainLiveBoardData(status.data);
      console.log(
        'live status update time: ' +
          new Date(status.data.UpdateTime).toLocaleString(
            //show hours and minutes only
            'en-US',
            { hour: 'numeric', minute: 'numeric', hour12: true }
          )
      );
    });
  };

  useEffect(() => {
    if (apiToken.access_token === '') {
      return;
    }
    updateTrainStatus();
    const interval = setInterval(() => {
      updateTrainStatus();
      setCurrentTime(dayjs(new Date()).format('HH:mm'));
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, [apiToken]);

  const saveShortcuts = async () => {
    try {
      await AsyncStorage.setItem('shortcuts', JSON.stringify(shortCuts));
    } catch (e) {
      // saving error
    }
  };

  const loadShortcuts = async () => {
    try {
      const value = await AsyncStorage.getItem('shortcuts');
      if (value !== null) {
        const objShortCuts = JSON.parse(value);
        setShortCuts(objShortCuts);
      }
    } catch (e) {
      console.log('error loading shortcuts');
    }
  };

  useEffect(() => {
    if (shortCuts.length > 0) {
      saveShortcuts();
    }
  }, [shortCuts]);

  useEffect(() => {
    loadShortcuts();
  }, []);

  const checkandUpdateDelayTime = () => {
    const updatedODTimeTableInfo = updateDelayTime(
      oDTimeTableInfoInitial,
      trainLiveBoardData.TrainLiveBoards
    );
    setODTimeTableInfo(updatedODTimeTableInfo);
  };

  useEffect(() => {
    if (trainLiveBoardData.TrainLiveBoards === undefined || oDTimeTableInfoInitial === undefined) {
      return;
    }
    checkandUpdateDelayTime();
  }, [trainLiveBoardData, oDTimeTableInfoInitial]);

  return <></>;
};

export default RecoilState;
