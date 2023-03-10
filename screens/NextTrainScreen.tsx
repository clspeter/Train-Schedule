import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Box,
  Text,
  View,
  HStack,
  VStack,
  Center,
  Spinner,
  Container,
  Toast,
  Pressable,
} from 'native-base';
import React, { useState, useEffect, useContext, useRef } from 'react';
import Svg, { Path } from 'react-native-svg';
import { FlashList } from '@shopify/flash-list';
import { useNavigation, useRoute } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { apiDailyStationTimetableTodayStation } from '../api/apiRequest';
import {
  DailyStationTimetableTodayStationTypeWithDelayTime,
  DailyStationTimetableTodayStationType,
  TimeTableType,
} from '../type/DailyStationTimetableTodayStation';

import {
  ODTimeTableInfoType,
  TrainLiveBoardType,
  homeScreenProp,
  TopTabNavigatorParamList,
} from '../types';
import * as Recoil from '../store';
import { neareastStationRecoil, nextTrainTableRecoil } from '../store';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered.']);

export default function TimeTableScreen() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const setTrainInfo = useSetRecoilState(Recoil.TrainInfoRecoil);
  const isArrivalTime = useRecoilValue(Recoil.isArrivalTimeRecoil);
  const navigation = useNavigation<homeScreenProp>();
  const Tab = createMaterialTopTabNavigator();
  const { NextTrainNorthTable, NextTrainSouthTable, nextTrainIndexNorth, nextTrainIndexSouth } =
    useRecoilValue(nextTrainTableRecoil);
  const neareastStation = useRecoilValue(neareastStationRecoil);

  const oDTimeTableInfo = useRecoilValue(Recoil.oDTimeTableInfoRecoil);
  const handleOnPress = (item: ODTimeTableInfoType) => {
    setTrainInfo(item);
    navigation.navigate('TrainInfo');
  };

  const toastUpdateTrainLiveBoard = () => {
    Toast.show({
      title: '列車即時資訊已更新',
      duration: 3000,
    });
    setIsRefreshing(true);
  };

  useEffect(() => {
    if (NextTrainNorthTable.length > 0) {
      setIsLoaded(true);
    }
  }, [NextTrainNorthTable]);

  useEffect(() => {
    setTimeout(() => {
      setIsRefreshing(false);
    }, 100);
  }, [isRefreshing]);

  useEffect(() => {
    if (isLoaded) {
      toastUpdateTrainLiveBoard();
    }
  }, [oDTimeTableInfo]);

  const LoadingSpinner = () => {
    return (
      <Spinner
        animating={false}
        size="lg"
        color="blue.500"
        justifyContent="center"
        position="absolute"
        w="100%"
        h="100%"
        top="0"
        left="0"
        zIndex={100}
        backgroundColor="rgba(0, 0, 0, 0.5)"
      />
    );
  };

  const ShowDelayTime = (props: { time: number }) => {
    const delayTime = props.time;
    if (delayTime === -1) {
      return (
        <Text alignSelf="center" color="gray.600" fontSize="md">
          未發車
        </Text>
      );
    } else if (delayTime === 0) {
      return (
        <Text alignSelf="center" color="green.500" fontSize="md">
          準點
        </Text>
      );
    } else {
      return (
        <Text alignSelf="center" color="red.500" fontSize="md">
          慢{delayTime}分
        </Text>
      );
    }
  };

  const SvgArrow = (props: { color: string }) => (
    <Svg width="100" height="50" fill={props.color} viewBox="-10 10 50 50">
      <Path
        scale={0.5}
        d="m 66.666 65.286 l 11.953 -11.953 h -150 v -6.667 h 150 l -11.949 -11.953 l 4.713 -4.713 l 17.644 17.643 a 3.334 3.334 0 0 1 -0.003 4.713 l -17.644 17.644 l -4.714 -4.714 z"
      />
    </Svg>
  );

  const RenderItemNorth = ({ item, index }: { item: TimeTableType; index: number }) => {
    const checkFlatlistIndex = (index: number) => {
      if (index === nextTrainIndexNorth) {
        return 'info.900';
      } else return 'blueGray.900';
    };
    return (
      <Pressable
        opacity={index + 1 > nextTrainIndexNorth ? 1 : 0.5}
        borderTopWidth="1"
        borderColor="muted.400"
        _pressed={{ backgroundColor: 'blueGray.700' }}
        backgroundColor={checkFlatlistIndex(index)}
        flex={1}
        h="50"
        pl={['0', '4']}
        pr={['0', '5']}
        py="2">
        <HStack space={5}>
          <Text fontSize={24} flex={1} color="white" textAlign="center">
            {item.TrainNo}
          </Text>
          <Text fontSize={24} flex={1} color="white" textAlign="center">
            {item.DepartureTime}
          </Text>
          <Text fontSize={24} flex={1} color="white" textAlign="center">
            {item.DestinationStationName.Zh_tw}
          </Text>
        </HStack>
      </Pressable>
    );
  };

  const NextTrainNorth = () => {
    return (
      <View backgroundColor="blueGray.900" flex={1}>
        <HStack space={5}>
          <Text fontSize={24} flex={1} color="white" textAlign="center">
            車次
          </Text>
          <Text fontSize={24} flex={1} color="white" textAlign="center">
            出發時間
          </Text>
          <Text fontSize={24} flex={1} color="white" textAlign="center">
            終點站
          </Text>
        </HStack>
        <FlashList
          removeClippedSubviews={true}
          initialScrollIndex={nextTrainIndexNorth - 1}
          refreshing={false}
          estimatedItemSize={50}
          data={NextTrainNorthTable}
          renderItem={RenderItemNorth}
          keyExtractor={(item) => item.TrainNo}
        />
      </View>
    );
  };

  const RenderItemSouth = ({ item, index }: { item: TimeTableType; index: number }) => {
    const checkFlatlistIndex = (index: number) => {
      if (index === nextTrainIndexSouth) {
        return 'info.900';
      } else return 'blueGray.900';
    };
    return (
      <Pressable
        opacity={index + 1 > nextTrainIndexSouth ? 1 : 0.5}
        borderTopWidth="1"
        borderColor="muted.400"
        _pressed={{ backgroundColor: 'blueGray.700' }}
        backgroundColor={checkFlatlistIndex(index)}
        flex={1}
        h="50"
        pl={['0', '4']}
        pr={['0', '5']}
        py="2">
        <HStack space={5}>
          <Text fontSize={24} flex={1} color="white" textAlign="center">
            {item.TrainNo}
          </Text>
          <Text fontSize={24} flex={1} color="white" textAlign="center">
            {item.DepartureTime}
          </Text>
          <Text fontSize={24} flex={1} color="white" textAlign="center">
            {item.DestinationStationName.Zh_tw}
          </Text>
        </HStack>
      </Pressable>
    );
  };

  const NextTrainSouth = () => {
    return (
      <View backgroundColor="blueGray.900" flex={1}>
        <HStack space={5}>
          <Text fontSize={24} flex={1} color="white" textAlign="center">
            車次
          </Text>
          <Text fontSize={24} flex={1} color="white" textAlign="center">
            出發時間
          </Text>
          <Text fontSize={24} flex={1} color="white" textAlign="center">
            終點站
          </Text>
        </HStack>
        <FlashList
          removeClippedSubviews={true}
          initialScrollIndex={nextTrainIndexSouth - 1}
          refreshing={false}
          estimatedItemSize={50}
          data={NextTrainSouthTable}
          renderItem={RenderItemSouth}
          keyExtractor={(item) => item.TrainNo}
        />
      </View>
    );
  };

  if (isLoaded === false) {
    return (
      <View backgroundColor="blueGray.900" flex={1} justifyContent="center">
        <Center>
          <Spinner size="lg" />
        </Center>
      </View>
    );
  } else if (NextTrainNorthTable) {
    return (
      <Box flex={1} backgroundColor="blueGray.900">
        {isRefreshing && <LoadingSpinner />}
        <View backgroundColor="blueGray.900" flex={1}>
          <NavigationContainer independent>
            <Tab.Navigator
              screenOptions={{
                tabBarLabelStyle: { fontSize: 14, color: 'white' },
                tabBarActiveTintColor: 'info',
                tabBarInactiveTintColor: 'Gray',
                tabBarIndicatorStyle: { backgroundColor: '#0369a1' },
                tabBarStyle: { backgroundColor: 'blueGray.800' },
                animationEnabled: false,
              }}
              initialRouteName="NextTrainNorth">
              <Tab.Screen
                name="NextTrainNorth"
                component={NextTrainNorth}
                options={{
                  tabBarLabel: '北上',
                  //tabBarIcon: ({ color }) => <AntDesign name="home" color={color} size={26} />,
                }}
              />
              <Tab.Screen
                name="NextTrainSouth"
                component={NextTrainSouth}
                options={{
                  tabBarLabel: '南下',
                  //tabBarIcon: ({ color }) => <AntDesign name="youtube" color={color} size={26} />,
                }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </View>
      </Box>
    );
  } else
    return (
      <View backgroundColor="blueGray.900" flex={1}>
        <Text>Error...</Text>
      </View>
    );
}
