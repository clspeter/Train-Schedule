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
  View,
} from 'native-base';
import React from 'react';

import SelectStation from '../components/SelectStation';
import ToggleDarkMode from '../components/ToggleDarkMode';

export default function HomeScreen() {
  return (
    <View _dark={{ bg: 'blueGray.900' }} _light={{ bg: 'blueGray.50' }} px={4} flex={1}>
      <VStack space={5} alignItems="center" mt="10">
        <HStack space={2} alignItems="center">
          <SelectStation />
        </HStack>
      </VStack>
    </View>
  );
}
