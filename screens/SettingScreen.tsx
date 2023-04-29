import { View, Switch, Text, HStack, Flex, Button, VStack, Center, Box } from 'native-base';
import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  appSettingRecoil,
  apiTokenRecoil,
  trainLiveBoardDataRecoil,
  resetRecoil,
  apiStatusRecoil,
} from '../store';

import AsyncStorage from '@react-native-async-storage/async-storage';

import DebugView from '../components/DebugView';

export default function SettingScreen() {
  const [appSetting, setAppSetting] = useRecoilState(appSettingRecoil);
  const [reset, setReset] = useRecoilState(resetRecoil);
  const [apiStatus, setApiStatus] = useRecoilState(apiStatusRecoil);
  const saveSettingToStorage = async () => {
    try {
      await AsyncStorage.setItem('setting', JSON.stringify(appSetting));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    saveSettingToStorage();
  }, [appSetting]);

  const handleSwitch = () => {
    setAppSetting({
      ...appSetting,
      useNearestStationOnStartUp: !appSetting.useNearestStationOnStartUp,
    });
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
