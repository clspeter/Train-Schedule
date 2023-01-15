import { useRecoilState, useRecoilValue } from 'recoil';
import React, { Suspense, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import * as Recoil from '../store';
import { View, Text, Heading, VStack, HStack } from 'native-base';
import { TrainInfoType, StopTimes } from '../types';

export const TrainInfoScreen = () => {
  const trainInfo = useRecoilValue(Recoil.TrainInfoRecoil);
  const trainInfoDetail = useRecoilValue(Recoil.TrainInfoDetailRecoil);

  const RenderItem = ({
    item,
    index,
  }: {
    item: TrainInfoType['TrainTimetables'][0]['StopTimes'][0];
    index: number;
  }) => {
    return (
      <View
        _dark={{ bg: 'blueGray.900' }}
        _light={{ bg: 'blueGray.50' }}
        px={4}
        flex={1}
        key={index}>
        <HStack>
          <Text>{item.StationName.Zh_tw} </Text>
          <Text>{item.ArrivalTime}</Text>
          <Text>
            {'->'}
            {item.DepartureTime}
          </Text>
        </HStack>
      </View>
    );
  };

  return (
    <View _dark={{ bg: 'blueGray.900' }} _light={{ bg: 'blueGray.50' }} px={4} flex={1}>
      <Heading>
        {trainInfo.TrainNo}次 {trainInfo.TrainTypeName}
      </Heading>
      <Heading>
        {trainInfo.StartingStationName} 到 {trainInfo.EndingStationName}
      </Heading>
      <Suspense fallback="Loading...">
        <FlashList
          removeClippedSubviews={true}
          initialScrollIndex={0}
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
