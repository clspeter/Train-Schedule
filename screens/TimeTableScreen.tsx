import { Box, Text, FlatList, View, HStack, Center } from 'native-base';
import React, { useState, useEffect } from 'react';
import Svg, { Path } from 'react-native-svg';
import TrainTimeTable from '../TrainTimeTable.json';
import { Fontisto } from '@expo/vector-icons';

export default function TimeTableScreen(props: { oDTimeTable: any; Time: Date }) {
  return (
    <View _dark={{ bg: 'blueGray.900' }} _light={{ bg: 'blueGray.50' }} flex={1}>
      <FlatList
        width="100%"
        data={TrainTimeTable}
        renderItem={({ item }) => (
          <Box
            borderBottomWidth="1"
            borderColor="muted.400"
            flex={1}
            h="100"
            pl={['0', '4']}
            pr={['0', '5']}
            py="2">
            <HStack>
              <Text fontSize={22} m={1}>
                {item.DailyTrainInfo.TrainNo}{' '}
              </Text>
              <Center flex={5}>
                <HStack mt={5}>
                  <Text fontSize={30}>{item.OriginStopTime.ArrivalTime}</Text>
                  <View w={100} h={50} mt={2}>
                    <Svg width="100" height="50" fill="white" viewBox="-10 10 50 50">
                      <Path
                        scale={0.5}
                        d="m 66.666 65.286 l 11.953 -11.953 h -150 v -6.667 h 150 l -11.949 -11.953 l 4.713 -4.713 l 17.644 17.643 a 3.334 3.334 0 0 1 -0.003 4.713 l -17.644 17.644 l -4.714 -4.714 z"
                      />
                    </Svg>
                  </View>
                  {/* <Fontisto name="arrow-right-l" size={40} color="white" /> */}
                  <Text fontSize={30}>{item.DestinationStopTime.DepartureTime}</Text>
                </HStack>
              </Center>
            </HStack>
          </Box>
        )}
        keyExtractor={(item) => item.DailyTrainInfo.TrainNo}
      />
    </View>
  );
}
