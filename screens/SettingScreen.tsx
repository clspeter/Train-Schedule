import { View, Switch, Text, HStack } from 'native-base';
import React, { useContext } from 'react';
import { StationContext } from '../StationContext';

export default function SettingScreen() {
  const Context = useContext(StationContext);

  return (
    <View _dark={{ bg: 'blueGray.900' }} _light={{ bg: 'blueGray.50' }} px={4} flex={1}>
      <HStack alignItems="center">
        <Text fontSize={20}>打開時以最近車站為出發地</Text>
        <Switch size="md" />
      </HStack>
    </View>
  );
}
