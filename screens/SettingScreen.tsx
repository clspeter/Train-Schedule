import { View, Switch, Text, HStack, Flex, Button, VStack, Center, Box } from 'native-base';
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
  const clearStorageData = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      // clear error
    }
    console.log('All storage Cleared.');
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
      <Center>
        <Button
          m={5}
          width="150"
          rounded="3xl"
          onPress={() => {
            clearStorageData();
          }}>
          <Text fontSize="md">清除快取資料</Text>
        </Button>
      </Center>
    </View>
  );
}
