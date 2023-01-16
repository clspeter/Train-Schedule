import { useRecoilState, useRecoilValue } from 'recoil';
import React, { Suspense, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import * as Recoil from '../store';
import { View, Text, Heading, VStack, HStack } from 'native-base';
import { TrainInfoType, StopTimes } from '../types';
import { TrainInfo } from '../type/DailyTrainTimetableTodayTrainNoType';

export const TrainInfoScreen = () => {
  const [delayShown, setDelayShown] = useState<boolean>(false);
  const trainInfo = useRecoilValue(Recoil.TrainInfoRecoil);
  const trainInfoDetail = useRecoilValue(Recoil.TrainInfoDetailRecoil);
  const trainInfoLive = useRecoilValue(Recoil.TrainInfoLiveRecoil);

  const ShowDelayTime = () => {
    if (trainInfoLive?.DelayTime === -1) {
      return (
        <Text textAlign="center" color="gray.600" fontSize="md">
          未發車
        </Text>
      );
    } else if (trainInfoLive?.DelayTime === 0) {
      return (
        <Text textAlign="center" color="green.500" fontSize="md">
          準點
        </Text>
      );
    } else {
      return (
        <Text textAlign="center" color="red.500" fontSize="md">
          慢{trainInfoLive?.DelayTime}分
        </Text>
      );
    }
  };

  const RenderItem = ({
    item,
    index,
  }: {
    item: TrainInfoType['TrainTimetables'][0]['StopTimes'][0];
    index: number;
  }) => {
    return (
      <View _dark={{ bg: 'blueGray.900' }} _light={{ bg: 'blueGray.50' }} flex={1} key={index}>
        <HStack>
          <View flex={1}></View>
          <Text flex={1} fontSize={24} textAlign="center">
            {item.StationName.Zh_tw}{' '}
          </Text>
          <Text flex={1} fontSize={24} textAlign="center">
            {item.ArrivalTime}
          </Text>
          <Text flex={1} fontSize={24} textAlign="center">
            {item.DepartureTime}
          </Text>
          <View flex={1} justifyContent="center">
            {index === trainInfoLive?.index.showDelayTime ? <ShowDelayTime /> : <View />}
          </View>
        </HStack>
      </View>
    );
  };

  return (
    <View _dark={{ bg: 'blueGray.900' }} _light={{ bg: 'blueGray.50' }} flex={1}>
      <Text fontSize={24}>
        {trainInfo.TrainNo}次 {trainInfo.TrainTypeName}
      </Text>
      <Text fontSize={24}>
        {trainInfo.StartingStationName} 到 {trainInfo.EndingStationName}
      </Text>
      <HStack>
        <View flex={1}></View>
        <Text flex={1} fontSize={20} textAlign="center">
          停靠站
        </Text>
        <Text flex={1} fontSize={20} textAlign="center">
          到站
        </Text>
        <Text flex={1} fontSize={20} textAlign="center">
          離站
        </Text>
        <View flex={1}></View>
      </HStack>
      <Suspense fallback="Loading...">
        <FlashList
          removeClippedSubviews={true}
          initialScrollIndex={trainInfoLive?.index.showDelayTime}
          refreshing={false}
          estimatedItemSize={100}
          data={trainInfoDetail.StopTimes}
          renderItem={RenderItem}
          keyExtractor={(item) => item.StationID}
        />
      </Suspense>
    </View>
  );
};
export default TrainInfoScreen;
