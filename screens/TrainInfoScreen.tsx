import { useSetRecoilState, useRecoilValue } from 'recoil';
import React, { Suspense } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import * as Recoil from '../store';
import { View, Text, HStack } from 'native-base';
import { TrainInfoType } from '../type/types';

export const TrainInfoScreen = () => {
  const setSelectTrainNo = useSetRecoilState(Recoil.selectTrainNoRecoil);
  const trainInfoDetail = useRecoilValue(Recoil.TrainInfoDetailRecoil);
  const trainInfoLive = useRecoilValue(Recoil.TrainInfoLiveRecoil);
  const Journey = useRecoilValue(Recoil.journeyRecoil);

  // unmount時清空trainInfo,避免後臺持續更新trainInfoLive
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (!__DEV__) setSelectTrainNo('');
        console.log('TrainInfoScreen unmount');
      };
    }, [])
  );

  const ShowDelayTime = () => {
    if (trainInfoLive?.DelayTime === -1) {
      return (
        <Text textAlign="center" color="gray.500" fontSize="xl">
          準點
        </Text>
      );
    } else if (trainInfoLive?.DelayTime === 0) {
      return (
        <Text textAlign="center" color="green.500" fontSize="xl">
          準點
        </Text>
      );
    } else {
      return (
        <Text textAlign="center" color="red.500" fontSize="xl">
          慢{trainInfoLive?.DelayTime}分
        </Text>
      );
    }
  };
  const ShowStartEnd = (props: { StationID: string }) => {
    if (props.StationID === Journey.departure.StationID) {
      return (
        <Text flex={1} fontSize={24} textAlign="center">
          出發
        </Text>
      );
    } else if (props.StationID === Journey.destination.StationID) {
      return (
        <Text flex={1} fontSize={24} textAlign="center">
          抵達
        </Text>
      );
    } else {
      return <View flex={1} />;
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
      <View
        _dark={{ bg: 'blueGray.900' }}
        _light={{ bg: 'blueGray.50' }}
        flex={1}
        key={index}
        height="50px">
        <HStack>
          <ShowStartEnd StationID={item.StationID} />
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
        {trainInfoDetail.TrainInfo.TrainNo}次 {trainInfoDetail.TrainInfo.TrainTypeName.Zh_tw}
      </Text>
      <Text fontSize={24}>
        {trainInfoDetail.TrainInfo.StartingStationName.Zh_tw} 到{' '}
        {trainInfoDetail.TrainInfo.EndingStationName.Zh_tw}
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
        <View flex={1} justifyContent="center">
          <ShowDelayTime />
        </View>
      </HStack>
      <Suspense fallback="Loading...">
        <FlashList
          removeClippedSubviews={true}
          initialScrollIndex={trainInfoLive?.index.initialScroll}
          refreshing={false}
          estimatedItemSize={50}
          data={trainInfoDetail.StopTimes}
          renderItem={RenderItem}
          keyExtractor={(item) => item.StationID}
        />
      </Suspense>
    </View>
  );
};
export default TrainInfoScreen;
