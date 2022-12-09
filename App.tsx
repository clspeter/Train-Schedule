import { SSRProvider } from '@react-aria/ssr';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider, extendTheme } from 'native-base';
import React from 'react';

import StationProvider from './StationContext';
import HomeScreen from './screens/HomeScreen';
import SelectDepartureScreen from './screens/SelectDepartureScreen';
import SelectDestinationScreen from './screens/SelectDestinationScreen';
import { RootStackParamList } from './types';

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: 'dark',
};

const Stack = createNativeStackNavigator<RootStackParamList>();

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
                  title: '選擇出發車站',
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
                name="SelectDestination"
                component={SelectDestinationScreen}
                options={{
                  title: '選擇抵達車站',
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
