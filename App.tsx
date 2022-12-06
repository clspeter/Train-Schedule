import { SSRProvider } from '@react-aria/ssr';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
} from 'native-base';
import React from 'react';
import { Platform } from 'react-native';

import NativeBaseIcon from './components/NativeBaseIcon';
import HomeScreen from './screens/HomeScreen';
import SelectDepartureScreen from './screens/SelectDepartureScreen';

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: 'dark',
};

const Stack = createNativeStackNavigator();

const Context = React.createContext({ departure: '', arrival: '', time: '' });

const StationProvider = ({ children }) => {
  const [departure, setDeparture] = React.useState('中壢');
  const [arrival, setArrival] = React.useState('南港');
  const [time, setTime] = React.useState('2021-08-01T12:00:00');
  const defalutValue = { departure, setDeparture, arrival, setArrival, time, setTime };
};
// extend the theme
export const theme = extendTheme({ config });
type MyThemeType = typeof theme;
declare module 'native-base' {
  interface ICustomTheme extends MyThemeType {}
}
export default function App(): JSX.Element {
  return (
    <SSRProvider>
      <NativeBaseProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: '鐵路時刻表',
                headerStyle: {
                  backgroundColor: '#0A1E45',
                },
                headerTintColor: '#AAAAAA',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            <Stack.Screen
              name="SelectDeparture"
              component={SelectDepartureScreen}
              options={{
                title: '選擇出發時間',
                headerStyle: {
                  backgroundColor: '#0A1E45',
                },
                headerTintColor: '#AAAAAA',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </SSRProvider>
  );
}

// Color Switch Component
