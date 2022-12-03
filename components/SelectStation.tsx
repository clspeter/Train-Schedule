import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
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
} from 'native-base';
import React, { useState } from 'react';

export default function SelectStation(): JSX.Element {
  const [date, setDate] = useState(new Date(1668165071));
  const [destination, setDestination] = useState('台北');
  const [departure, setDeparture] = useState('中壢');
  const handleSwapDepartureAndDestination = () => {
    const temp = destination;
    setDestination(departure);
    setDeparture(temp);
  };
  return (
    <VStack flex={1} justifyContent="center" alignItems="center">
      <HStack>
        <Box
          mr="1"
          alignSelf="center"
          _text={{
            fontSize: 'lg',
            fontWeight: 'medium',
            color: 'muted.400',
            letterSpacing: 'lg',
            textAlign: 'center',
          }}
          pt="4"
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
            {departure}
          </Center>
        </Box>
        <Center>
          <Pressable
            onPress={() => {
              handleSwapDepartureAndDestination();
            }}>
            <Icon as={Ionicons} name="swap-horizontal" size={10} color="white" mt="2" />
          </Pressable>
        </Center>
        <Box
          ml="1"
          alignSelf="center"
          _text={{
            fontSize: 'lg',
            fontWeight: 'medium',
            color: 'muted.400',
            letterSpacing: 'lg',
            textAlign: 'center',
          }}
          pt="4"
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
            {destination}
          </Center>
        </Box>
      </HStack>
      <Box mt="4" bg="info.900" w="300" h="50" rounded="xl">
        <Flex direction="row" h="50">
          <Center
            flex="3"
            _text={{
              fontSize: '2xl',
              color: 'white',
            }}>
            2022/11/11
          </Center>
          <Divider bg="#0A1E45" orientation="vertical" />
          <Center
            flex="2"
            _text={{
              fontSize: '2xl',
              color: 'white',
            }}>
            11:11
          </Center>
        </Flex>
      </Box>
      <Button mt="5" width="150" rounded="3xl">
        <HStack space={2} alignItems="center">
          <Icon as={SimpleLineIcons} name="magnifier" size={4} color="white" mt="0.5" />
          <Text fontSize="md">查詢時刻</Text>
        </HStack>
      </Button>
      <Center flex={1} bg="blue.200" w="40" h="40" />
    </VStack>
  );
}
