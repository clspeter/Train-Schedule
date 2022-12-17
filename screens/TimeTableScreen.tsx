import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box, Text, FlatList, View, HStack, Center, VStack } from 'native-base';
import React, { useState, useEffect, useContext, useRef } from 'react';
import Svg, { Path } from 'react-native-svg';

import { StationContext } from '../StationContext';
import { oDTimeTableType, TrainLiveBoardType } from '../types';

export default function TimeTableScreen() {
  const [oDtimetable, setODTimeTable] = useState<any[] | null>([]);
  const [FlatlistIndex, setFlatlistIndex] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const Context = useContext(StationContext);
  const flatList = useRef<typeof FlatList>(null);
  const viewabilityConfig = {
    waitForInteraction: false,
    itemVisiblePercentThreshold: 95,
  };
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
  };

  const checkDelayTime = (trainNo: number, trainLiveBoards: TrainLiveBoardType) => {
    for (const train of trainLiveBoards.TrainLiveBoards) {
      if (train.TrainNo === trainNo) {
        return train.delayTime;
      }
    }
    return null;
  };
  const TravelTime = (props: { train: oDTimeTableType }) => {
    const hoursDiff =
      parseInt(props.train.DestinationStopTime.ArrivalTime.split(':')[0]) -
      parseInt(props.train.OriginStopTime.DepartureTime.split(':')[0]);
    const minutesDiff =
      parseInt(props.train.DestinationStopTime.ArrivalTime.split(':')[1]) -
      parseInt(props.train.OriginStopTime.DepartureTime.split(':')[1]);
    if (minutesDiff < 0) {
      return (
        <Text color="white" fontSize="sm" alignSelf="center" mt={-5}>
          {hoursDiff == 1 ? '' : `${hoursDiff - 1} 時`} {60 + minutesDiff} 分
        </Text>
      );
    } else {
      return (
        <Text color="white" fontSize="sm" alignSelf="center" mt={-5}>
          {hoursDiff == 0 ? '' : `${hoursDiff} 時`} {minutesDiff} 分
        </Text>
      );
    }
  };

  const ShowDelayTime = (train) => {
    const delayTime = checkDelayTime(train.TrainNo, Context.trainStatus.TrainLiveBoards);
    if (delayTime === null) {
      return;
    }
    if (delayTime === 0) {
      return (
        <Text color="white" fontSize="sm">
          準點
        </Text>
      );
    }
    if (delayTime > 0) {
      return (
        <Text color="red.500" fontSize="sm">
          慢{delayTime}分
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

  useEffect(() => {
    getODTimeTable();
  }, []);

  const RenderItem = ({ item, index }: { item: oDTimeTableType; index: number }) => (
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
          <Text
            alignSelf="center"
            fontSize={20}
            ml={1}
            color={index >= FlatlistIndex ? 'white' : 'gray.600'}>
            {item.DailyTrainInfo.TrainNo}
          </Text>
          <Text
            fontSize={16}
            ml={1}
            alignSelf="center"
            color={item.DailyTrainInfo.TrainTypeName.Zh_tw === '區間' ? 'blue.400' : 'white'}>
            {item.DailyTrainInfo.TrainTypeName.Zh_tw}
          </Text>
          <Text fontSize={16} ml={1} color="white" alignSelf="center">
            {item.DestinationStopTime.StopSequence - item.OriginStopTime.StopSequence}站
          </Text>
        </VStack>
        <HStack mt={0} flex={5}>
          <Text
            fontSize={30}
            color={index >= FlatlistIndex ? 'white' : 'gray.600'}
            width={85}
            alignSelf="center"
            pl="-5">
            {item.OriginStopTime.DepartureTime}
          </Text>
          <View w={100} h={30} mt={1}>
            <VStack>
              <Text alignSelf="center">準點</Text>
              <SvgArrow color={index >= FlatlistIndex ? 'white' : '#71717a'} />
              <TravelTime train={item} />
            </VStack>
          </View>
          {/* <Fontisto name="arrow-right-l" size={40} color="white" /> */}
          <Text
            fontSize={30}
            color={index >= FlatlistIndex ? 'white' : 'gray.600'}
            width={85}
            alignSelf="center"
            ml={2}>
            {item.DestinationStopTime.ArrivalTime}
          </Text>
        </HStack>
      </HStack>
    </Box>
  );

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
          viewabilityConfig={viewabilityConfig}
          initialScrollIndex={FlatlistIndex - 1}
          windowSize={21}
          updateCellsBatchingPeriod={30}
          maxToRenderPerBatch={20}
          initialNumToRender={20}
          refreshing={false}
          getItemLayout={(data, index) => ({ length: 100, offset: 100 * index, index })}
          width="100%"
          data={oDtimetable}
          /*           onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              flatList.current?.scrollToIndex({ index: info.index, animated: true });
            });
          }} */
          renderItem={RenderItem}
          keyExtractor={(item) => item.DailyTrainInfo.TrainNo}
        />
      </View>
    );
  }
}
