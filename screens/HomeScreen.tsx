import { Text, HStack, Center, VStack, View, Box, Button, FlatList, Pressable } from 'native-base';
import React, { useContext } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import * as Recoil from '../store';
import { ShortCutType } from '../types';

import { AntDesign } from '@expo/vector-icons';
import SelectStationandTime from '../components/SelectTimeStation';
import ToggleDarkMode from '../components/ToggleDarkMode';
import AsyncStorage from '@react-native-async-storage/async-storage';

const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // clear error
  }
  console.log('All storage Cleared.');
};

const ShortCuts = () => {
  const [journey, setJourney] = useRecoilState(Recoil.journeyRecoil);
  const [shortCuts, setShortCuts] = useRecoilState(Recoil.shortCutsRecoil);

  const handleNowShortcut = () => {
    const newShortCut: ShortCutType = {
      index: shortCuts.length + 1,
      departure: journey.departure,
      destination: journey.destination,
      time: new Date(journey.time),
      isNow: 'false',
    };
    setShortCuts([...shortCuts, newShortCut]);
  };
  const handleDeleteShortcut = (index: number) => {
    setShortCuts(shortCuts.filter((item) => item.index !== index));
  };

  const renderItems = ({ item, index }: { item: ShortCutType; index: number }) => {
    return (
      <Box
        key={`${item.departure?.StationID}-${item.destination?.StationID}`}
        borderColor="gray.400"
        borderWidth={1}
        borderRadius="md"
        marginX={2}
        mt={1}>
        <HStack space={2} alignItems="center" justifyContent="space-between">
          <View flex={5}>
            <Pressable
              onPress={() => {
                setJourney({
                  departure: item.departure,
                  destination: item.destination,
                  time: item.time,
                });
              }}>
              <Text alignSelf="center" fontSize={18}>
                {item.departure?.StationName.Zh_tw}{' '}
                <AntDesign name="arrowright" size={18} color="white" />{' '}
                {item.destination?.StationName.Zh_tw}{' '}
                {item.time?.toLocaleString('zh-TW', {
                  hour12: true,
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </Pressable>
          </View>
          <Button onPress={() => handleDeleteShortcut(item.index)} borderLeftRadius="none">
            刪除
          </Button>
        </HStack>
      </Box>
    );
  };

  return (
    <Box backgroundColor="blueGray.700" m={5} rounded="sm" borderColor="gray.400" borderWidth={1}>
      <Text mt={2} fontSize="2xl" alignSelf="center">
        快速行程
      </Text>
      <FlatList data={shortCuts} renderItem={renderItems} />
      <Button m={2} onPress={handleNowShortcut}>
        新增現在行程
      </Button>
    </Box>
  );
};

export default function HomeScreen() {
  const apiToken = useRecoilValue(Recoil.apiTokenRecoil);
  const trainLiveBoardData = useRecoilValue(Recoil.trainLiveBoardDataRecoil);

  return (
    <View _dark={{ bg: 'blueGray.900' }} _light={{ bg: 'blueGray.50' }} flex={1}>
      <VStack space={5} alignItems="center" mt="10">
        <HStack space={2} alignItems="center">
          <SelectStationandTime />
        </HStack>
      </VStack>
      <ShortCuts />
      <Center m={5}>
        <Text>
          API Token: {apiToken.access_token ? `...${apiToken.access_token.slice(-5)}` : 'NULL'} |
          Vaild: {new Date(apiToken.vaild_time).toLocaleString()}
        </Text>
        <Text>
          Train Status Updated Time: {new Date(trainLiveBoardData.UpdateTime).toLocaleString()}
        </Text>
      </Center>
      <Button
        mt="5"
        width="150"
        rounded="3xl"
        onPress={() => {
          clearAll();
        }}>
        <HStack space={2} alignItems="center">
          <Text fontSize="md">Clear All</Text>
        </HStack>
      </Button>
      <Recoil.RecoilStore />
    </View>
  );
}
