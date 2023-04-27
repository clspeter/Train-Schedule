import {
  Text,
  HStack,
  Center,
  VStack,
  View,
  Box,
  Button,
  FlatList,
  Pressable,
  Toast,
  Alert,
  useToast,
} from 'native-base';
import React, { useContext, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import * as Recoil from '../store';
import { ShortCutType } from '../type/types';
import Constatns from 'expo-constants';

import { AntDesign } from '@expo/vector-icons';
import SelectStationandTime from '../components/SelectTimeStation';
import ToggleDarkMode from '../components/ToggleDarkMode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs, { duration } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { isArrivalTimeRecoil } from '../store';

const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // clear error
  }
  console.log('All storage Cleared.');
};
const DebugView = () => {
  const apiToken = useRecoilValue(Recoil.apiTokenRecoil);
  const trainLiveBoardData = useRecoilValue(Recoil.trainLiveBoardDataRecoil);
  const [apiStatus, setApiStatus] = useRecoilState(Recoil.apiStatusRecoil);
  return (
    <Center m={5}>
      <Text>
        API Token: {apiToken.access_token ? `...${apiToken.access_token.slice(-5)}` : 'NULL'} |
        Vaild: {new Date(apiToken.vaild_time).toLocaleString()}
      </Text>
      <Text>
        Train Status Updated Time: {new Date(trainLiveBoardData.UpdateTime).toLocaleString()}
      </Text>
      <HStack space={4}>
        <Button
          mt="5"
          width="150"
          rounded="3xl"
          onPress={() => {
            clearAll();
          }}>
          <HStack space={2} alignItems="center">
            <Text fontSize="md">清除快取資料</Text>
          </HStack>
        </Button>
        <Button
          mt="5"
          width="150"
          rounded="3xl"
          onPress={() => {
            setApiStatus(!apiStatus);
          }}>
          <HStack space={2} alignItems="center">
            <Text fontSize="md">開關警告</Text>
          </HStack>
        </Button>
      </HStack>
    </Center>
  );
};
const ShortCuts = () => {
  const [journey, setJourney] = useRecoilState(Recoil.journeyRecoil);
  const [shortCuts, setShortCuts] = useRecoilState(Recoil.shortCutsRecoil);
  const [isNow, setIsNow] = useRecoilState(Recoil.isNowRecoil);
  const [isArrivalTime, setIsArrivalTime] = useRecoilState(Recoil.isArrivalTimeRecoil);
  require('dayjs/locale/zh-tw');

  const handleApplyShortcut = (item: ShortCutType) => {
    if (item.isNow) {
      setJourney({
        ...journey,
        departure: item.departure,
        destination: item.destination,
      });
      setIsNow(true);
      setIsArrivalTime(false);
    } else if (item.isArrivalTime) {
      setJourney({
        departure: item.departure,
        destination: item.destination,
        time: dayjs().set('hour', item.time.hour).set('minute', item.time.minute).toDate(),
      });
      setIsNow(false);
      setIsArrivalTime(true);
    } else {
      setJourney({
        departure: item.departure,
        destination: item.destination,
        time: dayjs().set('hour', item.time.hour).set('minute', item.time.minute).toDate(),
      });
      setIsNow(false);
      setIsArrivalTime(false);
    }
  };

  const handleNowShortcut = () => {
    const newShortCut: ShortCutType = {
      departure: journey.departure,
      destination: journey.destination,
      time: { hour: dayjs(journey.time).hour(), minute: dayjs(journey.time).minute() },
      isNow: isNow,
      isArrivalTime: isArrivalTime,
    };
    setShortCuts([...shortCuts, newShortCut]);
  };

  const handleDeleteShortcut = (index: number) => {
    const newShortCuts = shortCuts.filter((item, i) => i !== index);
    setShortCuts(newShortCuts);
  };

  const renderItems = ({ item, index }: { item: ShortCutType; index: number }) => {
    return (
      <Box
        key={`${item.departure?.StationID}-${item.destination?.StationID}`}
        borderColor="gray.400"
        borderWidth={1}
        borderRadius="md"
        marginX={2}
        mt={1}>
        <HStack justifyContent="space-between">
          <View flex={5} justifyContent="center">
            <Pressable
              justifyContent="center"
              flex={1}
              onPress={() => {
                handleApplyShortcut(item);
              }}
              _pressed={{ backgroundColor: 'blueGray.400' }}>
              <Text alignSelf="center" fontSize={18}>
                {item.departure?.StationName.Zh_tw}{' '}
                <AntDesign name="arrowright" size={18} color="white" />{' '}
                {item.destination?.StationName.Zh_tw}{' '}
                {item.isNow
                  ? '立即出發'
                  : dayjs()
                      .set('hour', item.time.hour)
                      .set('minute', item.time.minute)
                      .locale('zh-tw')
                      .format('A HH:mm')}{' '}
                {item.isArrivalTime ? '抵達' : ''}
              </Text>
            </Pressable>
          </View>
          <Button onPress={() => handleDeleteShortcut(index)} borderLeftRadius="none">
            刪除
          </Button>
        </HStack>
      </Box>
    );
  };

  return (
    <Box backgroundColor="blueGray.700" m={5} rounded="md" borderColor="gray.400" borderWidth={1}>
      <Text mt={2} fontSize="2xl" alignSelf="center">
        快速行程
      </Text>
      <FlatList data={shortCuts} renderItem={renderItems} />
      <Button m={2} onPress={handleNowShortcut} bg="info.600">
        新增現在行程
      </Button>
    </Box>
  );
};

export default function HomeScreen() {
  const apiStatus = useRecoilValue(Recoil.apiStatusRecoil);

  const toast = useToast();

  const toastApiError = () => {
    toast.show({
      render: () => {
        return (
          <Alert status="error">
            <HStack space={2} alignItems="center">
              <Alert.Icon />
              <Text fontSize="md" fontWeight="medium" color="gray.500">
                API 錯誤，請檢查網路連線
              </Text>
            </HStack>
          </Alert>
        );
      },
      duration: null,
    });
  };

  const toastClose = () => {
    Toast.closeAll();
  };

  useEffect(() => {
    if (!apiStatus) toastApiError();
    else toastClose();
  }, [apiStatus]);

  return (
    <View _dark={{ bg: 'blueGray.900' }} _light={{ bg: 'blueGray.50' }} flex={1}>
      <VStack space={5} alignItems="center" mt="10">
        <HStack space={2} alignItems="center">
          <SelectStationandTime />
        </HStack>
      </VStack>
      <ShortCuts />
      {__DEV__ && <DebugView />}
    </View>
  );
}
