import { useNavigation } from '@react-navigation/native';
import { VStack, Box, Divider, View, Text, HStack, Button } from 'native-base';
import React from 'react';
import { useRecoilState } from 'recoil';
import { journeyRecoil } from '../store';

import StationList from '../responselist/StationList.json';
import { Journey, StationListType, StatinType, homeScreenProp } from '../types';
const arrayChunk = (arr: StationListType, column: number) => {
  const array = arr.slice();
  const chunks = [];
  while (array.length) chunks.push(array.splice(0, column));
  return chunks;
};

export default function StationCardsView(props: { selected: 'departure' | 'destination' }) {
  const [journey, setJourney] = useRecoilState(journeyRecoil);
  const navigation = useNavigation<homeScreenProp>();
  const notselected = props.selected === 'departure' ? 'destination' : 'departure';
  const handelSetDeparture = (station: StatinType) => {
    if (journey[notselected] === station) {
      setJourney({
        departure: journey.destination,
        destination: journey.departure,
        time: journey.time,
      } as Journey);
    } else {
      setJourney({
        ...journey,
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
                handelSetDeparture(col);
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
