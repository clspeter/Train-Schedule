import { Ionicons, SimpleLineIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import {
  VStack,
  HStack,
  Center,
  Text,
  Icon,
  Button,
  Pressable,
  Divider,
  Flex,
  Modal,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import * as Recoil from '../store';

import { apiDailyTimetableOD } from '../api/apiRequest';
import { apiDailyTimetableODDataProcess } from '../api/dataProcess';
import { Journey, homeScreenProp, ODTimeTableInfoType } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box } from 'native-base';

export default function SelectStationandTime() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showModal, setShowModal] = useState(false);
  const [show, setShow] = useState(false);
  const [isNow, setIsNow] = useRecoilState(Recoil.isNowRecoil);
  const [isArrivalTime, setIsArrivalTime] = useRecoilState(Recoil.isArrivalTimeRecoil);
  const [journey, setJourney] = useRecoilState(Recoil.journeyRecoil);
  const [oDTimeTableInfo, setODTimeTableInfo] = useRecoilState(Recoil.oDTimeTableInfoInitialRecoil);
  const apiToken = useRecoilValue(Recoil.apiTokenRecoil);
  const neareastStation = useRecoilValue(Recoil.neareastStationRecoil);

  const navigation = useNavigation<homeScreenProp>();
  const handleSwapDepartureAndDestination = () => {
    setJourney({
      departure: journey.destination,
      destination: journey.departure,
      time: journey.time,
    } as Journey);
  };

  const handelIsNow = () => {
    if (isNow) {
      setIsNow(false);
    } else {
      setIsNow(true);
      setJourney({
        ...journey,
        time: new Date(),
      });
      if (isArrivalTime) setIsArrivalTime(false);
    }
  };
  const handelIsArriveTime = () => {
    if (isArrivalTime) {
      setIsArrivalTime(false);
    } else {
      setIsArrivalTime(true);
      if (isNow) setIsNow(false);
    }
  };

  const saveJourney = async () => {
    try {
      await AsyncStorage.setItem('journey', JSON.stringify(journey));
    } catch (e) {
      console.log(e);
    }
  };

  const onChange = (_event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    setShow(false);
    setJourney({ ...journey, time: selectedDate } as Journey);
  };

  const handleLookUp = () => {
    saveJourney();
    navigation.navigate('TimeTable');
  };

  const handleNextTrain = () => {
    saveJourney();
    navigation.navigate('NextTrain', { name: `${neareastStation.StationName.Zh_tw}-下一班火車` });
  };

  const checkTimeTable = async () => {
    if (journey.departure && journey.destination)
      try {
        const jsonValue = await AsyncStorage.getItem(
          `odtimetables${journey.time.toLocaleDateString('en-CA')}-${journey.departure.StationID}-${
            journey.destination.StationID
          }`
        );
        return jsonValue != null ? JSON.parse(jsonValue) : null;
      } catch (e) {
        console.log(e);
      }
  };

  const storeTimeTable = async (
    departureStationID: string,
    destinationStationID: string,
    value: ODTimeTableInfoType[]
  ) => {
    if (journey.departure && journey.destination)
      try {
        await AsyncStorage.setItem(
          `odtimetables${journey.time.toLocaleDateString(
            'en-CA'
          )}-${departureStationID}-${destinationStationID}`,
          JSON.stringify(value)
        );
      } catch (e) {
        console.log(e);
      }
  };

  const apiTimeTable = async () => {
    if (journey.departure && journey.destination) {
      apiDailyTimetableOD(
        apiToken.access_token,
        journey.departure.StationID,
        journey.destination.StationID,
        journey.time.toLocaleDateString('en-CA')
      ).then((res) => {
        const infoData = apiDailyTimetableODDataProcess(res.data);
        setODTimeTableInfo(infoData);
        storeTimeTable(journey.departure.StationID, journey.destination.StationID, infoData);
      });
      apiDailyTimetableOD(
        apiToken.access_token,
        journey.destination.StationID,
        journey.departure.StationID,
        journey.time.toLocaleDateString('en-CA')
      ).then((res) => {
        const infoData = apiDailyTimetableODDataProcess(res.data);
        storeTimeTable(journey.destination.StationID, journey.departure.StationID, infoData);
      });
    }
  };

  useEffect(() => {
    if (journey.departure && journey.destination && apiToken.access_token) {
      checkTimeTable().then((res) => {
        if (res) {
          setODTimeTableInfo(res);
          console.log('use local stored timetable');
        } else {
          apiTimeTable();
          console.log('api get two-way timetables');
        }
      });
    }
  }, [journey.time, journey.departure, journey.destination, apiToken.access_token]);

  useEffect(() => {
    if (isNow) {
      const intervalId = setInterval(() => {
        setJourney({ ...journey, time: new Date() });
      }, 60000 - new Date().getSeconds() * 1000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isNow]);

  if (journey.departure === undefined || journey.destination === undefined) {
    return (
      <Center flex={1}>
        <Text>loading</Text>
      </Center>
    );
  } else
    return (
      <VStack flex={1} justifyContent="center" alignItems="center">
        <Box borderWidth={1} borderColor="gray.600" borderRadius="md" p={6}>
          <Center mb={6}>
            <HStack>
              <Button
                onPress={() => navigation.navigate('SelectDeparture')}
                mr="1"
                alignSelf="center"
                _text={{
                  fontSize: 'lg',
                  fontWeight: 'medium',
                  color: 'muted.400',
                  letterSpacing: 'lg',
                  textAlign: 'center',
                }}
                pt="0"
                bg="info.900"
                w="120"
                h="120"
                rounded="xl">
                出發車站
                <Center
                  _text={{
                    fontSize: '3xl',
                    fontWeight: 'medium',
                    color: 'muted.100',
                    letterSpacing: 'lg',
                    textAlign: 'center',
                  }}>
                  {journey?.departure.StationName.Zh_tw}
                </Center>
              </Button>
              <Center>
                <Pressable
                  onPress={() => {
                    handleSwapDepartureAndDestination();
                  }}>
                  <Icon as={Ionicons} name="swap-horizontal" size={10} color="white" mt="2" />
                </Pressable>
              </Center>
              <Button
                onPress={() => navigation.navigate('SelectDestination')}
                ml="1"
                alignSelf="center"
                _text={{
                  fontSize: 'lg',
                  fontWeight: 'medium',
                  color: 'muted.400',
                  letterSpacing: 'lg',
                  textAlign: 'center',
                }}
                pt="0"
                bg="info.900"
                w="120"
                h="120"
                rounded="xl">
                抵達車站
                <Center
                  _text={{
                    fontSize: '3xl',
                    fontWeight: 'medium',
                    color: 'muted.100',
                    letterSpacing: 'lg',
                    textAlign: 'center',
                  }}>
                  {journey?.destination.StationName.Zh_tw}
                </Center>
              </Button>
            </HStack>
          </Center>
          <Center>
            <Pressable
              onPress={() => setShowModal(true)}
              mb="6"
              bg="info.900"
              w="290"
              h="50"
              rounded="xl">
              <Flex direction="row" h="50">
                <Center
                  flex="1"
                  _text={{
                    fontSize: '2xl',
                    color: 'white',
                  }}>
                  {journey.time.toLocaleDateString('zh-TW')}
                </Center>
                <Divider bg="#0A1E45" orientation="vertical" />
                <Center
                  flex="1"
                  _text={{
                    fontSize: '2xl',
                    color: 'white',
                  }}>
                  {journey.time.toLocaleTimeString('zh-TW', {
                    hour12: true,
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Center>
              </Flex>
              {show && (
                <DateTimePicker
                  minimumDate={new Date(new Date().setHours(0, 0, 0, 0))}
                  display="spinner"
                  testID="dateTimePicker"
                  value={journey.time}
                  // @ts-expect-error: Componet type not set
                  mode="datetime"
                  locale="zh-TW"
                  minuteInterval={10}
                  is24Hour
                  onChange={onChange}
                />
              )}
            </Pressable>
            <HStack w="290" h="50">
              <Button
                flex="1"
                bg={isNow ? 'info.600' : 'info.900'}
                borderRadius="xl"
                mr={6}
                onPress={() => {
                  handelIsNow();
                }}
                _text={{
                  fontSize: '2xl',
                  color: 'white',
                }}>
                立即
              </Button>
              <Button
                flex="1"
                bg={isArrivalTime ? 'info.600' : 'info.900'}
                borderRadius="xl"
                onPress={() => {
                  handelIsArriveTime();
                }}
                _text={{
                  fontSize: '2xl',
                  color: 'white',
                }}>
                {isArrivalTime ? '抵達' : '出發'}
              </Button>
            </HStack>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} closeOnOverlayClick>
              <Modal.Content width="330">
                <Modal.CloseButton />
                <Modal.Header>選擇時刻</Modal.Header>
                <HStack>
                  <DateTimePicker
                    display="spinner"
                    testID="dateTimePicker"
                    value={journey.time}
                    // @ts-expect-error: Componet type not set
                    mode="datetime"
                    locale="zh-TW"
                    minuteInterval={10}
                    is24Hour
                    onChange={onChange}
                  />
                </HStack>
                <Modal.Footer>
                  <Button.Group space={1}>
                    <Button
                      onPress={() => {
                        setShowModal(false);
                      }}>
                      確定
                    </Button>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          </Center>
        </Box>
        <HStack space={5}>
          <Button
            mt="5"
            width={150}
            height={12}
            rounded="xl"
            onPress={() => {
              handleLookUp();
            }}>
            <HStack space={2} alignItems="center">
              <Icon as={SimpleLineIcons} name="magnifier" size={4} color="white" mt="0.5" />
              <Text fontSize="xl">查詢時刻</Text>
            </HStack>
          </Button>
          <Button
            mt="5"
            width={150}
            height={12}
            rounded="xl"
            onPress={() => {
              handleNextTrain();
            }}>
            <HStack space={2} alignItems="center">
              <MaterialCommunityIcons name="source-commit-next-local" size={24} color="white" />
              <Text fontSize="xl">下一班車</Text>
            </HStack>
          </Button>
        </HStack>
        <Center flex={1} bg="blue.200" w="40" h="40" />
      </VStack>
    );
}
