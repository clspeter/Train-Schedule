import { View, Switch, Text, HStack, Flex, Button, VStack, Center, Box } from 'native-base';
import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { appSettingRecoil, apiTokenRecoil, trainLiveBoardDataRecoil } from '../store';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingScreen() {
  const [appSetting, setAppSetting] = useRecoilState(appSettingRecoil);
  const saveSettingToStorage = async () => {
    try {
      await AsyncStorage.setItem(
        'setting',
        JSON.stringify({
          ...appSetting,
          useNearestStationOnStartUp: !appSetting.useNearestStationOnStartUp,
        })
      );
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    console.log(appSetting);
  }, [appSetting]);

  const handleSwitch = () => {
    setAppSetting({
      ...appSetting,
      useNearestStationOnStartUp: !appSetting.useNearestStationOnStartUp,
    });
    saveSettingToStorage();
  };
  const clearStorageData = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      // clear error
    }
    console.log('All storage Cleared.');
  };

  const DebugView = () => {
    const apiToken = useRecoilValue(apiTokenRecoil);
    const trainLiveBoardData = useRecoilValue(trainLiveBoardDataRecoil);
    return (
      <Center m={3}>
        <Text>
          API Token: {apiToken.access_token ? `...${apiToken.access_token.slice(-5)}` : 'NULL'} |
          Vaild: {new Date(apiToken.vaild_time).toLocaleString()}
        </Text>
        <Text>
          Train Status Updated Time: {new Date(trainLiveBoardData.UpdateTime).toLocaleString()}
        </Text>
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
      </Center>
    );
  };

  return (
    <View _dark={{ bg: 'blueGray.900' }} _light={{ bg: 'blueGray.50' }} px={2} flex={1}>
      <HStack justifyContent="space-between" m={3}>
        <Box>
          <Text fontSize="xl" color="white">
            自動以最近車站為出發站
          </Text>
        </Box>
        <Switch
          ml={5}
          size="md"
          isChecked={appSetting.useNearestStationOnStartUp}
          onChange={() => {
            handleSwitch();
          }}
        />
      </HStack>
      <DebugView />
    </View>
  );
}
