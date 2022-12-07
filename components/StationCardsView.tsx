import { useNavigation } from '@react-navigation/native';
import { VStack, Box, Divider, View, Text, HStack, Button } from 'native-base';
import React, { useContext } from 'react';

import { StationContext } from '../StationContext';
import { StationList } from '../StationList';
import { Journey, StationListType } from '../types';

const arrayChunk = (arr: StationListType, column: number) => {
  const array = arr.slice();
  const chunks = [];
  while (array.length) chunks.push(array.splice(0, column));
  return chunks;
};

export default function StationCardsView(props: { selected: 'departure' | 'destination' }) {
  const stationContext = useContext(StationContext);
  const navigation = useNavigation();
  const notselected = props.selected === 'departure' ? 'destination' : 'departure';
  const handelSetDeparture = (station: string) => {
    if (stationContext.journey[notselected] === station) {
      stationContext.setJourney({
        departure: stationContext.journey.destination,
        destination: stationContext.journey.departure,
        time: stationContext.journey.time,
      } as Journey);
    } else {
      stationContext.setJourney({
        ...stationContext.journey,
        [props.selected]: station,
      } as Journey);
    }
    navigation.navigate('Home');
  };

  return (
    <VStack space="1" alignItems="center" mt={1}>
      {arrayChunk(StationList, 3).map((row, i) => (
        <HStack key={i}>
          {row.map((col, i) => (
            <Button
              onPress={() => {
                handelSetDeparture(col.StationName.Zh_tw);
              }}
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
