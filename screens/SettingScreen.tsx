import { View, Switch, Text, HStack, Flex } from 'native-base';
import React, { useContext } from 'react';
import { StationContext } from '../StationContext';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingScreen() {
  const Context = useContext(StationContext);
  const saveSettingToStorage = async () => {
    try {
      await AsyncStorage.setItem(
        'setting',
        JSON.stringify({
          ...Context.appSetting,
          useNearestStationOnStartUp: !Context.appSetting.useNearestStationOnStartUp,
        })
      );
    } catch (e) {
      console.log(e);
    }
  };

  const handleSwitch = () => {
    Context.setAppSetting({
      ...Context.appSetting,
      useNearestStationOnStartUp: !Context.appSetting.useNearestStationOnStartUp,
    });
    saveSettingToStorage();
  };

  return (
    <View _dark={{ bg: 'blueGray.900' }} _light={{ bg: 'blueGray.50' }} px={2} flex={1}>
      <HStack flex="1" justifyContent="space-between" flexDirection="row" mt={5}>
        <Text fontSize={20}>啟動App時以最近車站為出發地</Text>
        <Switch
          ml={5}
          size="md"
          isChecked={Context.appSetting.useNearestStationOnStartUp}
          onChange={() => {
            handleSwitch();
          }}
        />
      </HStack>
    </View>
  );
}
