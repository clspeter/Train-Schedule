import { useNavigation } from '@react-navigation/native';
import { VStack, Box, Divider, View, Text, HStack, Button, ScrollView, Center } from 'native-base';
import React, { useRef, useState } from 'react';
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

export default function StationCardsView(props: { selected: 'departure' | 'destination' }) {
  const [cityId, setCityId] = React.useState(0);
  const [journey, setJourney] = useRecoilState(journeyRecoil);
  const [dividerLayout, setDividerLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const navigation = useNavigation<homeScreenProp>();
  const notselected = props.selected === 'departure' ? 'destination' : 'departure';
  const scrollViewRef = useRef(null);
  //基隆的車站列表

  const scrollToDivider = () => {
    if (dividerLayout && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: dividerLayout.y,
        animated: true,
      });
    }
  };

  const handleSetCity = (cityId: number) => {
    setCityId(cityId);
    scrollToDivider();
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

  const renderCityButtons = (data: { name: string; id: number }[]) => {
    const buttons = [];
    const numButtons = data.length;
    const dummyButton = numButtons % 3 == 0 ? 0 : 3 - (numButtons % 3);
    for (let i = 0; i < numButtons; i += 3) {
      buttons.push(
        <View key={`row${i}`} style={{ flexDirection: 'row' }}>
          {data.slice(i, i + 3).map((item) => (
            <Button
              onPress={() => handleSetCity(item.id)}
              key={`city${item.id}`}
              _text={{
                fontSize: 'lg',
                fontWeight: 'medium',
                color: 'muted.100',
                letterSpacing: 'lg',
                textAlign: 'center',
              }}
              borderColor={cityId === item.id ? 'blue.500' : 'blueGray.500'}
              borderWidth={1}
              bg="blueGray.800"
              rounded="xl"
              mx="0.5"
              flex={1}
              h={20}>
              {item.name}
            </Button>
          ))}

          {/* Add number of dummyButtons button*/}

          {dummyButton > 0 && i >= numButtons - 3 && (
            <Button
              key="dummy1"
              _text={{ fontSize: 'lg', fontWeight: 'medium', color: 'transparent' }}
              bg="transparent"
              rounded="xl"
              mx="0.5"
              flex={1}
              h={20}
            />
          )}
          {dummyButton > 1 && i >= numButtons - 3 && (
            <Button
              key="dummy2"
              _text={{ fontSize: 'lg', fontWeight: 'medium', color: 'transparent' }}
              bg="transparent"
              rounded="xl"
              mx="0.5"
              flex={1}
              h={20}
            />
          )}
        </View>
      );
    }
    return buttons;
  };

  const renderStationButtons = (data: StationListType) => {
    const buttons = [];
    const numButtons = data.length;
    const dummyButton = numButtons % 3 == 0 ? 0 : 3 - (numButtons % 3);
    for (let i = 0; i < data.length; i += 3) {
      buttons.push(
        <View key={`row${i}`} style={{ flexDirection: 'row' }}>
          {data.slice(i, i + 3).map((item) => (
            <Button
              key={`station${item.StationID}`}
              onPress={() => handelSetDeparture(item)}
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
              {item.StationName.Zh_tw}
            </Button>
          ))}

          {/* Add number of  dummyButtons button if the number of buttons is not a multiple of 3 */}
          {dummyButton > 0 && i >= numButtons - 3 && (
            <Button
              key="dummy1"
              _text={{ fontSize: 'lg', fontWeight: 'medium', color: 'transparent' }}
              bg="transparent"
              rounded="xl"
              mx="0.5"
              flex={1}
              h={20}
            />
          )}

          {dummyButton > 1 && i >= numButtons - 3 && (
            <Button
              key="dummy2"
              _text={{ fontSize: 'lg', fontWeight: 'medium', color: 'transparent' }}
              bg="transparent"
              rounded="xl"
              mx="0.5"
              flex={1}
              h={20}
            />
          )}
        </View>
      );
    }
    return buttons;
  };

  return (
    <VStack space="1" alignItems="center" my={1}>
      <ScrollView w="100%" showsVerticalScrollIndicator={false} ref={scrollViewRef}>
        <Center
          _text={{
            fontSize: '2xl',
            fontWeight: 'medium',
            color: 'muted.100',
            letterSpacing: 'lg',
            textAlign: 'center',
          }}>
          地區
        </Center>
        <VStack space="1" alignItems="center">
          {renderCityButtons(cityListWithIndex)}
        </VStack>
        <Divider my={2} onLayout={(event) => setDividerLayout(event.nativeEvent.layout)}></Divider>
        <Center
          _text={{
            fontSize: '2xl',
            fontWeight: 'medium',
            color: 'muted.100',
            letterSpacing: 'lg',
            textAlign: 'center',
          }}>
          車站
        </Center>
        <VStack space="1" alignItems="center">
          {renderStationButtons(stationsListByCityByIndex[cityId])}
        </VStack>
      </ScrollView>
    </VStack>
  );
}
