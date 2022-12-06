import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { VStack, Box, Divider, View, Text, HStack, Button } from 'native-base';
import React, { useState } from 'react';

import { StationList, StationListType } from '../StationList';
import { Journey } from '../types';

const arrayChunk = (arr: StationListType, column: number) => {
  const array = arr.slice();
  const chunks = [];
  while (array.length) chunks.push(array.splice(0, column));
  return chunks;
};

function StationCardList() {
  return (
    <VStack space="1" alignItems="center" mt={1}>
      {arrayChunk(StationList, 3).map((row, i) => (
        <HStack key={i}>
          {row.map((col, i) => (
            <Button
              key={`${col.StationID}2`}
              _text={{
                fontSize: 'lg',
                fontWeight: 'medium',
                color: 'muted.100',
                letterSpacing: 'lg',
                textAlign: 'center',
              }}
              borderColor="blueGray.500"
              borderWidth={1}
              bg="blueGray.800"
              rounded="xl"
              mx="0.5"
              flex={1}
              h={20}>
              {col.StationName.Zh_tw}
            </Button>
          ))}
        </HStack>
      ))}
    </VStack>
  );
}

export default function SelectDepartureScreen(props) {
  const [departure, setDeparture] = useState('中壢');
  return (
    <View _dark={{ bg: 'blueGray.900' }} _light={{ bg: 'blueGray.50' }} px={4} flex={1}>
      <StationCardList />
    </View>
  );
}
