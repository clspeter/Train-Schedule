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
import React from 'react';
import { Touchable, TouchableOpacity } from 'react-native';

import SelectStationandTime from '../components/SelectTimeStation';
import ToggleDarkMode from '../components/ToggleDarkMode';

export default function HomeScreen() {
  return (
    <View _dark={{ bg: 'blueGray.900' }} _light={{ bg: 'blueGray.50' }} flex={1}>
      <VStack space={5} alignItems="center" mt="10">
        <HStack space={2} alignItems="center">
          <SelectStationandTime />
        </HStack>
      </VStack>
    </View>
  );
}
