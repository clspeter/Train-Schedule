import { Box, Text, FlatList, View, HStack, Center } from 'native-base';
import React, { useState, useEffect, useContext, useRef } from 'react';
import Svg, { Path } from 'react-native-svg';
import { Fontisto } from '@expo/vector-icons';
import { StationContext } from '../StationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { oDTimeTableType } from '../types';

export default function TimeTableScreen() {
  const [oDtimetable, setODTimeTable] = useState<any[] | null>([]);
  const [FlatlistIndex, setFlatlistIndex] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const Context = useContext(StationContext);
  const isFocused = useIsFocused();
  const flatList = useRef<typeof FlatList>(null);
  const isLater = (item: oDTimeTableType) =>
    item.OriginStopTime.DepartureTime >
    Context.journey.time.toLocaleTimeString('zh-TW', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
  let count = 0;
  function delay(n: number) {
    return new Promise(function (resolve) {
      setTimeout(resolve, n * 100);
      count++;
    });
  }
  const getODTimeTable = async () => {
    try {
      const value = await AsyncStorage.getItem(
        `odtimetables${Context.journey.time.toLocaleDateString('en-CA')}-${
          Context.journey.departure!.StationID
        }-${Context.journey.destination!.StationID}`
      );
      if (value !== null) {
        setODTimeTable(JSON.parse(value));
        setFlatlistIndex(() => {
          const index = JSON.parse(value).findIndex(isLater);
          console.log(index);
          return index;
        });
        count = 0;
        setIsLoaded(true);
      }
      if (value === null || count < 20) {
        await delay(2);
        getODTimeTable();
      } else {
        count = 0;
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getODTimeTable();
    console.log(
      Context.journey.time.toLocaleTimeString('zh-TW', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  }, []);
  if (isLoaded === false) {
    return (
      <View _dark={{ bg: 'blueGray.900' }} _light={{ bg: 'blueGray.50' }} flex={1}>
        <Text>Loading...</Text>
      </View>
    );
  } else {
    return (
      <View _dark={{ bg: 'blueGray.900' }} _light={{ bg: 'blueGray.50' }} flex={1}>
        <FlatList
          ref={flatList}
          initialScrollIndex={FlatlistIndex - 1}
          initialNumToRender={10}
          getItemLayout={(data, index) => ({ length: 100, offset: 100 * index, index })}
          width="100%"
          data={oDtimetable}
          /*           onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              flatList.current?.scrollToIndex({ index: info.index, animated: true });
            });
          }} */
          renderItem={({ item }) => (
            <Box
              borderBottomWidth="1"
              borderColor="muted.400"
              flex={1}
              h="100"
              pl={['0', '4']}
              pr={['0', '5']}
              py="2">
              <HStack>
                <Text fontSize={22} m={1}>
                  {item.DailyTrainInfo.TrainNo}
                </Text>
                <Center flex={5}>
                  <HStack mt={5}>
                    <Text fontSize={30}>{item.OriginStopTime.DepartureTime}</Text>
                    <View w={100} h={30} mt={2}>
                      <Svg width="100" height="50" fill="white" viewBox="-10 10 50 50">
                        <Path
                          scale={0.5}
                          d="m 66.666 65.286 l 11.953 -11.953 h -150 v -6.667 h 150 l -11.949 -11.953 l 4.713 -4.713 l 17.644 17.643 a 3.334 3.334 0 0 1 -0.003 4.713 l -17.644 17.644 l -4.714 -4.714 z"
                        />
                      </Svg>
                    </View>
                    {/* <Fontisto name="arrow-right-l" size={40} color="white" /> */}
                    <Text fontSize={30}>{item.DestinationStopTime.ArrivalTime}</Text>
                  </HStack>
                </Center>
              </HStack>
            </Box>
          )}
          keyExtractor={(item) => item.DailyTrainInfo.TrainNo}
        />
      </View>
    );
  }
}
