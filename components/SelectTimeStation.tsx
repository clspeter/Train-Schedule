import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  VStack,
  HStack,
  Box,
  Center,
  Text,
  Icon,
  Button,
  Input,
  Pressable,
  Divider,
  Flex,
  FormControl,
  Modal,
  FlatList,
} from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import { DeviceEventEmitter, View, StyleSheet } from 'react-native';

import { StationContext } from '../StationContext';
import { apiDailyTimetableOD } from '../api/apiRequest';
import { Journey, homeScreenProp, oDTimeTableType } from '../types';
import TimeSelectModal from './TimeSelectModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SelectStationandTime() {
  const [oDTimeTable, setODTimeTable] = useState<any[] | null>([]);
  const [showModal, setShowModal] = useState(false);
  const [show, setShow] = useState(false);
  const Context = useContext(StationContext);
  const navigation = useNavigation<homeScreenProp>();
  const handleSwapDepartureAndDestination = () => {
    Context.setJourney({
      departure: Context.journey.destination,
      destination: Context.journey.departure,
      time: Context.journey.time,
    } as Journey);
  };

  const onChange = (_event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    setShow(false);
    Context.setJourney({ ...Context.journey, time: selectedDate } as Journey);
  };
  const clearAll = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      // clear error
    }

    console.log('Clear all storage.');
  };
  const handleLookUp = () => {
    /*  apiDailyTimetableOD(
      Context.apiToken,
      Context.journey.departure!.StationID,
      Context.journey.destination!.StationID,
      Context.journey.time.toLocaleDateString('en-CA')
    ).then((res) => {
      setODTimeTable(res.data);
    }); */
    navigation.navigate('TimeTable');
  };
  const checkTimeTable = async () => {
    if (Context.journey.departure && Context.journey.destination)
      try {
        const jsonValue = await AsyncStorage.getItem(
          `odtimetables${Context.journey.time.toLocaleDateString('en-CA')}-${
            Context.journey.departure.StationID
          }-${Context.journey.destination.StationID}`
        );
        return jsonValue != null ? JSON.parse(jsonValue) : null;
      } catch (e) {
        console.log(e);
      }
  };

  const storeTimeTable = async (value: oDTimeTableType) => {
    if (Context.journey.departure && Context.journey.destination)
      try {
        await AsyncStorage.setItem(
          `odtimetables${Context.journey.time.toLocaleDateString('en-CA')}-${
            Context.journey.departure.StationID
          }-${Context.journey.destination.StationID}`,
          JSON.stringify(value)
        );
      } catch (e) {
        console.log(e);
      }
  };

  const apiTimeTable = async () => {
    if (Context.journey.departure && Context.journey.destination) {
      apiDailyTimetableOD(
        Context.apiToken.access_token,
        Context.journey.departure.StationID,
        Context.journey.destination.StationID,
        Context.journey.time.toLocaleDateString('en-CA')
      ).then((res) => {
        storeTimeTable(res.data);
      });
    }
  };

  useEffect(() => {
    if (Context.journey.departure && Context.journey.destination && Context.apiToken.access_token) {
      checkTimeTable().then((res) => {
        if (res) {
          setODTimeTable(res);
        } else {
          apiTimeTable();
        }
      });
    }
  }, [
    Context.journey.time,
    Context.journey.departure,
    Context.journey.destination,
    Context.apiToken.access_token,
  ]);

  return (
    <VStack flex={1} justifyContent="center" alignItems="center">
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
            {Context.journey.departure?.StationName.Zh_tw}
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
            {Context.journey.destination?.StationName.Zh_tw}
          </Center>
        </Button>
      </HStack>
      <Center>
        <Pressable
          onPress={() => setShowModal(true)}
          mt="4"
          bg="info.900"
          w="300"
          h="50"
          rounded="xl">
          <Flex direction="row" h="50">
            <Center
              flex="1"
              _text={{
                fontSize: '2xl',
                color: 'white',
              }}>
              {Context.journey.time.toLocaleDateString('zh-TW')}
            </Center>
            <Divider bg="#0A1E45" orientation="vertical" />
            <Center
              flex="1"
              _text={{
                fontSize: '2xl',
                color: 'white',
              }}>
              {Context.journey.time.toLocaleTimeString('zh-TW', {
                hour12: true,
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Center>
          </Flex>
          {show && (
            <DateTimePicker
              display="spinner"
              testID="dateTimePicker"
              value={Context.journey.time}
              // @ts-expect-error: Componet type not set
              mode="datetime"
              locale="zh-TW"
              minuteInterval={10}
              is24Hour
              onChange={onChange}
            />
          )}
        </Pressable>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} closeOnOverlayClick>
          <Modal.Content width="330">
            <Modal.CloseButton />
            <Modal.Header>選擇時刻</Modal.Header>
            <HStack>
              <DateTimePicker
                display="spinner"
                testID="dateTimePicker"
                value={Context.journey.time}
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

      <Button
        mt="5"
        width="150"
        rounded="3xl"
        onPress={() => {
          handleLookUp();
        }}>
        <HStack space={2} alignItems="center">
          <Icon as={SimpleLineIcons} name="magnifier" size={4} color="white" mt="0.5" />
          <Text fontSize="md">查詢時刻</Text>
        </HStack>
      </Button>
      <Center flex={1} bg="blue.200" w="40" h="40" />
      <Button
        mt="5"
        width="150"
        rounded="3xl"
        onPress={() => {
          clearAll();
          console.log(Context.apiToken);
        }}>
        <HStack space={2} alignItems="center">
          <Text fontSize="md">ClearAll</Text>
        </HStack>
      </Button>
    </VStack>
    // make a flatlist to show the timetable
  );
}
