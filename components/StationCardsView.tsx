import { useNavigation } from '@react-navigation/native';
import { VStack, Box, Divider, View, Text, HStack, Button } from 'native-base';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { journeyRecoil } from '../store';

import stationsListByCity from '../responselist/stationsListByCity.json';
import cityListWithIndex from '../data/cityListWithIndex.json';
import stationsListByCityByIndex from '../data/stationsListByCityIndex.json';

import {
  Journey,
  StationListType,
  StatinType,
  homeScreenProp,
  stationsListByCityByIndexType,
} from '../types';

const stationArrayChunk = (arr: StationListType, column: number) => {
  const array = arr.slice();
  const chunks = [];
  while (array.length) chunks.push(array.splice(0, column));
  return chunks;
};
const cityListArrayChuck = (arr: { name: string; id: number }[], column: number) => {
  const array = arr.slice();
  const chunks = [];
  while (array.length) chunks.push(array.splice(0, column));
  return chunks;
};

export default function StationCardsView(props: { selected: 'departure' | 'destination' }) {
  const [cityId, setCityId] = React.useState(0);
  const [journey, setJourney] = useRecoilState(journeyRecoil);
  const navigation = useNavigation<homeScreenProp>();
  const notselected = props.selected === 'departure' ? 'destination' : 'departure';
  //基隆的車站列表

  const handleSetCity = (cityId: number) => {
    setCityId(cityId);
    console.log('select' + cityId);
  };

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
    <VStack space="1" alignItems="center" my={1}>
      <VStack space="1" alignItems="center" my={2}>
        {cityListArrayChuck(cityListWithIndex, 3).map((row, i) => (
          <HStack key={i}>
            {row.map((col, i) => (
              <Button
                onPress={() => {
                  handleSetCity(col.id);
                }}
                key={`${i}2`}
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
                {col.name}
              </Button>
            ))}
          </HStack>
        ))}
      </VStack>
      <Divider></Divider>
      <VStack space="1" alignItems="center" my={2}>
        {stationArrayChunk(stationsListByCityByIndex[cityId], 3).map((row, i) => (
          <HStack key={i}>
            {row.map((col, i) => (
              <Button
                onPress={() => {
                  handelSetDeparture(col);
                }}
                key={`${i}2`}
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
    </VStack>
  );
}
