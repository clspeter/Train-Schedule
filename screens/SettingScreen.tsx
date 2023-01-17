import { View, Switch, Text, HStack, Flex } from 'native-base';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { appSettingRecoil } from '../store';

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

  return (
    <View _dark={{ bg: 'blueGray.900' }} _light={{ bg: 'blueGray.50' }} px={2} flex={1}>
      <HStack flex="1" justifyContent="space-between" flexDirection="row" mt={5}>
        <Text fontSize={20}>自動以最近車站為出發站</Text>
        <Switch
          ml={5}
          size="md"
          isChecked={appSetting.useNearestStationOnStartUp}
          onChange={() => {
            handleSwitch();
          }}
        />
      </HStack>
    </View>
  );
}
