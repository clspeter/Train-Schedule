import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box, Text, FlatList, View, HStack, VStack } from 'native-base';
import React, { useState, useEffect, useContext, useRef } from 'react';
import Svg, { Path } from 'react-native-svg';

import { StationContext } from '../StationContext';
import { ODTimeTableInfoType, TrainLiveBoardType } from '../types';
import { updateDelayTime } from '../api/dataProcess';

export default function TimeTableScreen() {
  const [oDTimeTableInfo, setODTimeTableInfo] = useState<ODTimeTableInfoType[]>([]);
  const [FlatlistIndex, setFlatlistIndex] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const Context = useContext(StationContext);
  const flatList = useRef<typeof FlatList>(null);
  const viewabilityConfig = {
    waitForInteraction: false,
    itemVisiblePercentThreshold: 95,
  };
  const isLater = (item: ODTimeTableInfoType) =>
    item.DepartureTime >
    Context.journey.time.toLocaleTimeString('zh-TW', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });

  useEffect(() => {
    if (Context.oDTimeTableInfo) {
      setODTimeTableInfo(Context.oDTimeTableInfo);
    }
  }, [Context.oDTimeTableInfo]);

  useEffect(() => {
    if (Context.oDTimeTableInfo) {
      setFlatlistIndex(() => {
        const index = Context.oDTimeTableInfo.findIndex(isLater);
        if (index === -1) {
          return Context.oDTimeTableInfo.length;
        }
        return index;
      });
      setODTimeTableInfo(Context.oDTimeTableInfo);
    }
  }, []);
  useEffect(() => {
    setIsLoaded(true);
  }, [oDTimeTableInfo]);
  useEffect(() => {
    setIsLoaded(false);
  }, [Context.oDTimeTableInfo]);

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
        `odtimetables${Context.journey.time.toLocaleDateString('en-CA')}-${
          Context.journey.departure?.StationID
        }-${Context.journey.destination?.StationID}`
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
    const travelHours = Math.floor(props.train.TravelTime / 60);
    const travelMinutes = props.train.TravelTime % 60;
    if (travelMinutes < 60) {
      return (
        <Text color="white" fontSize="md" alignSelf="center" mt={-6}>
          {Math.abs(travelMinutes)} 分
        </Text>
      );
    } else {
      return (
        <Text color="white" fontSize="md" alignSelf="center" mt={-6}>
          {travelHours} 時 {travelMinutes} 分
        </Text>
      );
    }
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
    checkandUpdateDelayTime(oDtimetable, Context.trainLiveBoardData.TrainLiveBoards),
      [Context.trainLiveBoardData];
  }); */

  const ShowDelayTime = (props: { time: number }) => {
    const delayTime = props.time;
    if (delayTime === -1) {
      return (
        <Text alignSelf="center" color="gray.700" fontSize="md">
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

  const RenderItem = ({ item, index }: { item: ODTimeTableInfoType; index: number }) => (
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
          <Text
            fontSize={30}
            color={index >= FlatlistIndex ? 'white' : 'gray.600'}
            width={85}
            alignSelf="center"
            pl="-5">
            {item.DepartureTime}
          </Text>
          <View w={100} h={30} mt={1}>
            <VStack>
              {new Date(Context.journey.time).toLocaleDateString('en-US') ===
              new Date().toLocaleDateString('en-US') ? (
                <ShowDelayTime time={item.DelayTime} />
              ) : (
                <Text alignSelf="center" fontSize="sm">
                  {' '}
                </Text>
              )}
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
            {item.ArrivalTime}
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
  } else if (oDTimeTableInfo) {
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
          data={oDTimeTableInfo}
          /*           onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              flatList.current?.scrollToIndex({ index: info.index, animated: true });
            });
          }} */
          renderItem={RenderItem}
          keyExtractor={(item) => Context.journey.time + item.TrainNo}
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
