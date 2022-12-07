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

import StationProvider from './StationContext';
import NativeBaseIcon from './components/NativeBaseIcon';
import HomeScreen from './screens/HomeScreen';
import SelectDepartureScreen from './screens/SelectDepartureScreen';

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: 'dark',
};

const Stack = createNativeStackNavigator();

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
        <StationProvider>
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
        </StationProvider>
      </NativeBaseProvider>
    </SSRProvider>
  );
}

// Color Switch Component
