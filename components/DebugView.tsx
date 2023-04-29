import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import * as Recoil from '../store';
import { Button, Center, HStack, Text } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

const clearStorageData = async () => {
  const [reset, setReset] = useRecoilState(Recoil.resetRecoil);
  try {
    await AsyncStorage.clear();
    setReset(!reset);
    console.log('All storage Cleared.');
  } catch (e) {
    console.log('Storage Clear error.'); // clear error
  }
};

export const DebugView = () => {
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
            clearStorageData();
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
            <Text fontSize="md">API 錯誤測試</Text>
          </HStack>
        </Button>
      </HStack>
    </Center>
  );
};

export default DebugView;
