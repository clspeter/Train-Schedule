import { View } from 'native-base';
import React from 'react';

import StationCardsView from '../components/StationCardsView';

export default function SelectDestiantionScreen() {
  return (
    <View _dark={{ bg: 'blueGray.900' }} _light={{ bg: 'blueGray.50' }} px={4} flex={1}>
      <StationCardsView selected="destination" />
    </View>
  );
}

// split Array to Chunked
