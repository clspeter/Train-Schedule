import axios from 'axios';
import {
  Text,
  Link,
  HStack,
  Center,
  Heading,
  Switch,
  useColorMode,
  NativeBaseProvider,
  extendTheme,
  VStack,
  Box,
  Pressable,
  View,
} from 'native-base';
import React, { useContext, useEffect } from 'react';
import { Touchable, TouchableOpacity } from 'react-native';

import { StationContext } from '../StationContext';
import Locaton from '../components/GetLocaton';
import SelectStationandTime from '../components/SelectTimeStation';
import ToggleDarkMode from '../components/ToggleDarkMode';

export default function HomeScreen() {
  const Context = useContext(StationContext);
  useEffect(() => {}, [Context.apiToken]);
  return (
    <View _dark={{ bg: 'blueGray.900' }} _light={{ bg: 'blueGray.50' }} flex={1}>
      <VStack space={5} alignItems="center" mt="10">
        <HStack space={2} alignItems="center">
          <SelectStationandTime />
        </HStack>
      </VStack>
      <Locaton />
      <Text>API Token: {Context.apiToken ? 'Readyr' : 'NULL'}</Text>
    </View>
  );
}
