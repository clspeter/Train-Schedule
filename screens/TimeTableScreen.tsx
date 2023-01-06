import { useRecoilState, useRecoilValue } from 'recoil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box, Text, FlatList, View, HStack, VStack } from 'native-base';
import React, { useState, useEffect, useContext, useRef } from 'react';
import Svg, { Path } from 'react-native-svg';

import { ODTimeTableInfoType, TrainLiveBoardType } from '../types';
import * as Recoil from '../store';

export default function TimeTableScreen() {
  const [oDTimeTableInfoState, setODTimeTableInfoState] = useState<ODTimeTableInfoType[]>([]);
  const [FlatlistIndex, setFlatlistIndex] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const journey = useRecoilValue(Recoil.journeyRecoil);

  const oDTimeTableInfo = useRecoilValue(Recoil.oDTimeTableInfoRecoil);
  const flatList = useRef<typeof FlatList>(null);
  const viewabilityConfig = {
    waitForInteraction: false,
    itemVisiblePercentThreshold: 20,
  };
  const isLater = (item: ODTimeTableInfoType) =>
    item.DepartureTime >
    journey.time.toLocaleTimeString('zh-TW', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });

  useEffect(() => {
    if (oDTimeTableInfo) {
      setFlatlistIndex(() => {
        const index = oDTimeTableInfo.findIndex(isLater);
        if (index === -1) {
          return oDTimeTableInfo.length;
        }
        return index;
      });
      setODTimeTableInfoState(oDTimeTableInfo);
    }
    setIsLoaded(true);
  }, []);

  let count = 0;
  function delay(n: number) {
    return new Promise(function (resolve) {
      setTimeout(resolve, n * 100);
      count++;
    });
  }
  /* const getODTimeTable = async () => {
    try {
      const value = await AsyncStorage.getItem(
        `odtimetables${journey.time.toLocaleDateString('en-CA')}-${
          journey.departure?.StationID
        }-${journey.destination?.StationID}`
      );
      if (value !== null) {
        setODTimeTable(JSON.parse(value));
        setFlatlistIndex(() => {
          const index = JSON.parse(value).findIndex(isLater);
          if (index === -1) {
            return JSON.parse(value).length;
          }
          return index;
        });
        count = 0;
        setIsLoaded(true);
        return;
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
  }; */

  const TravelTime = (props: { train: ODTimeTableInfoType }) => {
    return (
      <Text color="white" fontSize="md" alignSelf="center" mt={-6}>
        {props.train.TravelTime.Hours == 0 ? '' : props.train.TravelTime.Hours + '時'}{' '}
        {props.train.TravelTime.Minutes} 分
      </Text>
    );
  };
  /* 
  const checkandUpdateDelayTime = (
    oDtimetable: ODTimeTableInfoType[],
    trainLiveBoards: TrainLiveBoardType[]
  ) => {
    setODTimeTable(updateDelayTime(oDtimetable, trainLiveBoards));
    console.log(setODTimeTable(updateDelayTime(oDtimetable, trainLiveBoards)));
  };

  useEffect(() => {
    checkandUpdateDelayTime(oDtimetable, trainLiveBoardData.TrainLiveBoards),
      [trainLiveBoardData];
  }); */

  const ShowDelayTime = (props: { time: number }) => {
    const delayTime = props.time;
    if (delayTime === -1) {
      return (
        <Text alignSelf="center" color="gray.600" fontSize="md">
          未發車
        </Text>
      );
    } else if (delayTime > 0) {
      return (
        <Text alignSelf="center" color="red.500" fontSize="md">
          慢{delayTime}分
        </Text>
      );
    } else {
      return (
        <Text alignSelf="center" color="green.500" fontSize="md">
          準點
        </Text>
      );
    }
  };

  const grayOut = (index: number) => {
    if (index < FlatlistIndex) {
      return '#71717a';
    }
    return 'white';
  };

  const SvgArrow = (props: { color: string }) => (
    <Svg width="100" height="50" fill={props.color} viewBox="-10 10 50 50">
      <Path
        scale={0.5}
        d="m 66.666 65.286 l 11.953 -11.953 h -150 v -6.667 h 150 l -11.949 -11.953 l 4.713 -4.713 l 17.644 17.643 a 3.334 3.334 0 0 1 -0.003 4.713 l -17.644 17.644 l -4.714 -4.714 z"
      />
    </Svg>
  );

  const RenderItem = ({ item, index }: { item: ODTimeTableInfoType; index: number }) => {
    const textColor = grayOut(index);
    return (
      <Box
        borderBottomWidth="1"
        borderColor="muted.400"
        backgroundColor={index === FlatlistIndex ? 'info.900' : 'blueGray.900'}
        flex={1}
        h="100"
        pl={['0', '4']}
        pr={['0', '5']}
        py="2">
        <HStack>
          <VStack flex={1.2}>
            <Text alignSelf="center" fontSize={20} ml={1} color={textColor}>
              {item.TrainNo}
            </Text>
            <Text
              fontSize={16}
              ml={1}
              alignSelf="center"
              color={item.TrainTypeName === '區間' ? 'blue.400' : 'white'}>
              {item.TrainTypeName}
            </Text>
            <Text fontSize={16} ml={1} color="white" alignSelf="center">
              {item.Stops}站
            </Text>
          </VStack>
          <HStack mt={0} flex={5}>
            <Text fontSize={30} color={textColor} width={85} alignSelf="center" pl="-5">
              {item.DepartureTime}
            </Text>
            <View w={100} h={30} mt={1}>
              <VStack>
                {new Date(journey.time).toLocaleDateString('en-US') ===
                new Date().toLocaleDateString('en-US') ? (
                  <ShowDelayTime time={item.DelayTime} />
                ) : (
                  <Text alignSelf="center" fontSize="sm">
                    {' '}
                  </Text>
                )}
                <SvgArrow color={textColor} />
                <TravelTime train={item} />
              </VStack>
            </View>
            {/* <Fontisto name="arrow-right-l" size={40} color="white" /> */}
            <Text fontSize={30} color={textColor} width={85} alignSelf="center" ml={2}>
              {item.ArrivalTime}
            </Text>
          </HStack>
        </HStack>
      </Box>
    );
  };
  if (isLoaded === false) {
    return (
      <View _dark={{ bg: 'blueGray.900' }} _light={{ bg: 'blueGray.50' }} flex={1}>
        <Text>Loading...</Text>
      </View>
    );
  } else if (oDTimeTableInfoState) {
    return (
      <View _dark={{ bg: 'blueGray.900' }} _light={{ bg: 'blueGray.50' }} flex={1}>
        <FlatList
          ref={flatList}
          viewabilityConfig={viewabilityConfig}
          removeClippedSubviews={true}
          initialScrollIndex={FlatlistIndex - 1}
          windowSize={6}
          maxToRenderPerBatch={20}
          initialNumToRender={11}
          refreshing={false}
          getItemLayout={(data, index) => ({ length: 100, offset: 100 * index, index })}
          width="100%"
          data={oDTimeTableInfoState}
          /*           onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              flatList.current?.scrollToIndex({ index: info.index, animated: true });
            });
          }} */
          renderItem={RenderItem}
          keyExtractor={(item) => journey.time + item.TrainNo}
        />
      </View>
    );
  } else
    return (
      <View _dark={{ bg: 'blueGray.900' }} _light={{ bg: 'blueGray.50' }} flex={1}>
        <Text>Error...</Text>
      </View>
    );
}
