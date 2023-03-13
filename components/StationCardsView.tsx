import { useNavigation } from '@react-navigation/native';
import {
  VStack,
  Box,
  Divider,
  View,
  Text,
  HStack,
  Button,
  ScrollView,
  Center,
  Container,
} from 'native-base';
import React, { useRef, useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { journeyRecoil, selectedCityIdRecoil } from '../store';

import stationsListByCity from '../responselist/stationsListByCity.json';
import cityListWithIndex from '../data/cityListWithIndex.json';
import stationsListByCityByIndex from '../data/stationsListByCityIndex.json';

import { Journey, StationListType, StatinType, homeScreenProp } from '../types';
import { FlashList } from '@shopify/flash-list';

export default function StationCardsView(props: { selected: 'departure' | 'destination' }) {
  const [selectedCityId, setSelectedCityId] = useState(16);
  const [journey, setJourney] = useRecoilState(journeyRecoil);
  const [dividerLayout, setDividerLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const navigation = useNavigation<homeScreenProp>();
  const notselected = props.selected === 'departure' ? 'destination' : 'departure';
  const scrollViewRef = useRef<typeof ScrollView | null>(null);

  const currentCityIndex = stationsListByCityByIndex.findIndex((item) =>
    item.map((item) => item.StationID).includes(journey[props.selected].StationID)
  );

  useEffect(() => {
    if (currentCityIndex === selectedCityId) return;
    setSelectedCityId(currentCityIndex);
  }, []);

  useEffect(() => {
    console.log('selectedCityId:', selectedCityId);
  }, [selectedCityId]);

  const scrollToDivider = () => {
    if (dividerLayout && scrollViewRef.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scrollViewRef.current.scrollTo({
        y: dividerLayout.y,
        animated: true,
      });
    }
  };

  const handleSetCity = (selectedCityId: number) => {
    setSelectedCityId(selectedCityId);
    scrollToDivider();
  };

  const handleSetStation = (station: StatinType) => {
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
    const dummyButton = numButtons % 4 == 0 ? 0 : 4 - (numButtons % 4);
    for (let i = 0; i < numButtons; i += 4) {
      buttons.push(
        <View key={`row${i}`} style={{ flexDirection: 'row' }}>
          {data.slice(i, i + 4).map((item) => (
            <Button
              onPress={() => handleSetCity(item.id)}
              key={`city${item.id}`}
              _text={{
                fontSize: 'xl',
                fontWeight: 'medium',
                color: 'muted.100',
                letterSpacing: 'lg',
                textAlign: 'center',
              }}
              borderColor={selectedCityId === item.id ? 'blue.500' : 'blueGray.500'}
              borderWidth={1}
              bg={selectedCityId === item.id ? 'darkBlue.800' : 'blueGray.800'}
              rounded="xl"
              m="0.5"
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
  const stationListData = stationsListByCityByIndex[selectedCityId];

  const StationList = ({ data }: { data: StationListType }) => {
    return (
      <FlashList
        data={data}
        renderItem={({ item }) => {
          const borderColor = () => {
            if (journey[props.selected] === item) {
              return 'blue.500';
            } else if (item.StationClass === '0') {
              return 'red.500';
            } else if (item.StationClass === '1') {
              return 'white';
            } else {
              return 'blueGray.600';
            }
          };
          return (
            <Button
              onPress={() => handleSetStation(item)}
              id={item.StationID}
              _text={{
                fontSize: 'xl',
                fontWeight: 'medium',
                color: 'muted.100',
                letterSpacing: 'lg',
                textAlign: 'center',
              }}
              borderColor={borderColor()}
              borderWidth={1}
              bg={journey[props.selected] === item ? 'darkBlue.800' : 'blueGray.800'}
              rounded="xl"
              m="0.5"
              flex={1}
              h={20}>
              {item.StationName.Zh_tw}
            </Button>
          );
        }}
        keyExtractor={(item) => `${item.StationID}`}
        numColumns={4}
        estimatedItemSize={84}
      />
    );
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
        <View>{renderCityButtons(cityListWithIndex)}</View>
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
        <View h={Math.ceil(stationListData.length / 4) * 84}>
          <StationList data={stationListData} />
        </View>
      </ScrollView>
    </VStack>
  );
}
