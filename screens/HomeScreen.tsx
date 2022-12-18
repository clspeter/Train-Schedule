import { Text, HStack, Center, VStack, View } from 'native-base';
import React, { useContext } from 'react';

import { StationContext } from '../StationContext';
import Locaton from '../components/GetLocaton';
import SelectStationandTime from '../components/SelectTimeStation';
import ToggleDarkMode from '../components/ToggleDarkMode';

export default function HomeScreen() {
  const Context = useContext(StationContext);
  return (
    <View _dark={{ bg: 'blueGray.900' }} _light={{ bg: 'blueGray.50' }} flex={1}>
      <VStack space={5} alignItems="center" mt="10">
        <HStack space={2} alignItems="center">
          <SelectStationandTime />
        </HStack>
      </VStack>
      <Center m={5}>
        <Locaton />
        <Text>
          API Token:{' '}
          {Context.apiToken.access_token ? `...${Context.apiToken.access_token.slice(-5)}` : 'NULL'}{' '}
          | Vaild: {new Date(Context.apiToken.vaild_time).toLocaleString()}
        </Text>
        <Text>
          Train Status Updated Time: {new Date(Context.trainStatus.UpdateTime).toLocaleString()}
        </Text>
      </Center>
    </View>
  );
}
