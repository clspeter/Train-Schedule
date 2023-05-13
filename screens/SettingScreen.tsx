import { View, Switch, Text, HStack, Box, Button } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { appSettingRecoil } from '../store';

import AsyncStorage from '@react-native-async-storage/async-storage';

import DebugView from '../components/DebugView';

export default function SettingScreen() {
  const [appSetting, setAppSetting] = useRecoilState(appSettingRecoil);
  const [showDebug, setShowDebug] = React.useState<boolean>(false);
  const [useNearestStation, setUseNearestStation] = useState<boolean>(
    appSetting.useNearestStationOnStartUp
  );
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
    setUseNearestStation(!useNearestStation);
    setAppSetting({
      ...appSetting,
      useNearestStationOnStartUp: !useNearestStation,
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
        <Switch ml={5} size="md" isChecked={useNearestStation} onToggle={handleSwitch} />
      </HStack>
      <Button onPress={() => setShowDebug(!showDebug)}>偵錯資訊</Button>
      {showDebug && <DebugView />}
    </View>
  );
}
