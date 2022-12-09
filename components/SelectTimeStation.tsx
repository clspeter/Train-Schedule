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
} from 'native-base';
import React, { useContext, useState } from 'react';
import { DeviceEventEmitter, View, StyleSheet } from 'react-native';

import { StationContext } from '../StationContext';
import { Journey, homeScreenProp } from '../types';
import { getApiToken } from './GetApiData';
import TimeSelectModal from './TimeSelectModal';

export default function SelectStationandTime() {
  const [showModal, setShowModal] = useState(false);
  const [show, setShow] = useState(false);
  const stationContext = useContext(StationContext);
  const navigation = useNavigation<homeScreenProp>();
  const handleSwapDepartureAndDestination = () => {
    stationContext.setJourney({
      departure: stationContext.journey.destination,
      destination: stationContext.journey.departure,
      time: stationContext.journey.time,
    } as Journey);
  };

  const onChange = (_event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    setShow(false);
    stationContext.setJourney({ ...stationContext.journey, time: selectedDate } as Journey);
  };
  const handleLookUp = () => {
    const token = getApiToken().then((token) => {
      console.log(token);
      stationContext.setApiToken(token);
    });
  };

  const offset = stationContext.journey.time.getTimezoneOffset();
  const dateInUTC = new Date(stationContext.journey.time.getTime() - offset * 60 * 1000);

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
            {stationContext.journey.departure?.StationName.Zh_tw}
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
            {stationContext.journey.destination?.StationName.Zh_tw}
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
              {stationContext.journey.time.toLocaleDateString('zh-TW')}
            </Center>
            <Divider bg="#0A1E45" orientation="vertical" />
            <Center
              flex="1"
              _text={{
                fontSize: '2xl',
                color: 'white',
              }}>
              {stationContext.journey.time.toLocaleTimeString('zh-TW', {
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
              value={stationContext.journey.time}
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
                value={stationContext.journey.time}
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
    </VStack>
  );
}
