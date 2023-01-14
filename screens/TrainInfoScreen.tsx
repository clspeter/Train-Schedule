import { useRecoilState, useRecoilValue } from 'recoil';
import React, { useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import * as Recoil from '../store';
import { View, Text, Heading } from 'native-base';

export const TrainInfoScreen = () => {
  const TrainInfo = useRecoilValue(Recoil.TrainInfoRecoil);
  return (
    <View _dark={{ bg: 'blueGray.900' }} _light={{ bg: 'blueGray.50' }} px={4} flex={1}>
      <Heading>
        {TrainInfo.TrainNo}次 {TrainInfo.TrainTypeName}
      </Heading>
      <Heading>
        {TrainInfo.StartingStationName} 到 {TrainInfo.EndingStationName}
      </Heading>
    </View>
  );
};
export default TrainInfoScreen;
