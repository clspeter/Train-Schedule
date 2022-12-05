import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { VStack, Box, Divider, View, Text, HStack, Button } from 'native-base';
import React, { useState } from 'react';

import { StationList } from '../StationList';

export default function SelectDepartureScreen(props) {
  const [departure, setDeparture] = useState('中壢');
  return (
    <View _dark={{ bg: 'blueGray.900' }} _light={{ bg: 'blueGray.50' }} px={4} flex={1}>
      <VStack space={4} alignItems="center">
        <HStack>
          {StationList.map((StationList) => (
            <Button
              onPress={() => props.setDeparture(StationList.StationName.Zh_tw)}
              key={StationList.StationID}
              _text={{
                fontSize: 'lg',
                fontWeight: 'medium',
                color: 'muted.100',
                letterSpacing: 'lg',
                textAlign: 'center',
              }}
              bg="info.900"
              w="12"
              h="20"
              rounded="xl">
              {StationList.StationName.Zh_tw}
            </Button>
          ))}
        </HStack>
      </VStack>
    </View>
  );
}
