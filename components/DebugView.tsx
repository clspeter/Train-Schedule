import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import * as Recoil from '../store';
import { Button, Center, HStack, Text, Toast } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constatns from 'expo-constants';

export const DebugView = () => {
  const apiToken = useRecoilValue(Recoil.apiTokenRecoil);
  const trainLiveBoardData = useRecoilValue(Recoil.trainLiveBoardDataRecoil);
  const [apiStatus, setApiStatus] = useRecoilState(Recoil.apiStatusRecoil);
  const [reset, setReset] = useRecoilState(Recoil.resetRecoil);

  const clearCacheAndGetNewApi = async () => {
    try {
      await AsyncStorage.clear();
      setReset(!reset);
      Toast.show({
        title: '清除快取資料並重新取得API Token',
        duration: 3000,
      });
      console.log('All storage Cleared.');
    } catch (e) {
      console.log('Storage Clear error.'); // clear error
    }
  };

  const CLIENT_ID = Constatns?.expoConfig?.extra?.CLIENT_ID;
  const CLIENT_SECRET = Constatns?.expoConfig?.extra?.CLIENT_SECRET;

  return (
    <Center m={5}>
      <Text>
        API Token: {apiToken.access_token ? `True` : 'NULL'} | Vaild:{' '}
        {new Date(apiToken.vaild_time).toLocaleString()}
      </Text>
      <Text>
        Train Status Updated Time: {new Date(trainLiveBoardData.UpdateTime).toLocaleString()}
      </Text>
      <Text>
        CI: {CLIENT_ID ? `True` : 'NULL'} CS: {CLIENT_SECRET ? `True` : 'NULL'} | Version:{' '}
        {Constatns?.expoConfig?.version} Build: {Constatns?.expoConfig?.ios?.buildNumber}
      </Text>
      <HStack space={4}>
        <Button
          mt="5"
          width="150"
          rounded="3xl"
          onPress={() => {
            clearCacheAndGetNewApi();
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
