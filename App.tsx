import { StatusBar } from 'expo-status-bar';
import { extendTheme, NativeBaseProvider } from 'native-base';
import React from 'react';
import { Text } from 'react-native';
import { RecoilRoot } from 'recoil';

import { Ionicons } from '@expo/vector-icons';
import { SSRProvider } from '@react-aria/ssr';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import NextTrainScreen from './screens/NextTrainScreen';
import SelectDepartureScreen from './screens/SelectDepartureScreen';
import SelectDestinationScreen from './screens/SelectDestinationScreen';
import SettingScreen from './screens/SettingScreen';
import TimeTableScreen from './screens/TimeTableScreen';
import TrainInfoScreen from './screens/TrainInfoScreen';
import RecoilState from './state';
import { homeScreenProp, RootStackParamList } from './type/types';

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: 'dark',
};
interface TextWithDefaultProps extends Text {
  defaultProps?: { allowFontScaling?: boolean };
}

(Text as unknown as TextWithDefaultProps).defaultProps = {
  ...((Text as unknown as TextWithDefaultProps).defaultProps || {}),
  allowFontScaling: false,
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// extend the theme
export const theme = extendTheme({ config });
/* type MyThemeType = typeof theme;
declare module 'native-base' {
  interface ICustomTheme extends MyThemeType {}
} */
export default function App(): JSX.Element {
  return (
    <SSRProvider>
      <NativeBaseProvider theme={theme}>
        <RecoilRoot>
          <RecoilState />
          <StatusBar style="light" />
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={({ navigation }) => ({
                  title: '台鐵快查',
                  headerStyle: {
                    backgroundColor: '#0A1E45',
                  },
                  headerRight: () => (
                    <Ionicons
                      name="md-settings-outline"
                      size={24}
                      color="#06b6d4"
                      onPress={() => {
                        navigation.navigate('Setting');
                      }}
                    />
                  ),
                  headerTintColor: '#AAAAAA',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 20,
                    color: 'white',
                  },
                })}
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
                    fontSize: 20,
                    color: 'white',
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
                    fontSize: 20,
                    color: 'white',
                  },
                }}
              />
              <Stack.Screen
                name="TimeTable"
                component={TimeTableScreen}
                options={{
                  title: '時刻表',
                  headerStyle: {
                    backgroundColor: '#0A1E45',
                  },
                  headerTintColor: '#AAAAAA',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 20,
                    color: 'white',
                  },
                }}
              />
              <Stack.Screen
                name="Setting"
                component={SettingScreen}
                options={{
                  title: '設定',
                  headerStyle: {
                    backgroundColor: '#0A1E45',
                  },
                  headerTintColor: '#AAAAAA',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 20,
                    color: 'white',
                  },
                }}
              />
              <Stack.Screen
                name="TrainInfo"
                component={TrainInfoScreen}
                options={{
                  title: '列車詳細資料',
                  headerStyle: {
                    backgroundColor: '#0A1E45',
                  },
                  headerTintColor: '#AAAAAA',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 20,
                    color: 'white',
                  },
                }}></Stack.Screen>
              <Stack.Screen
                name="NextTrain"
                component={NextTrainScreen}
                options={({ route }) => ({
                  title: route.params.name,
                  headerStyle: {
                    backgroundColor: '#0A1E45',
                  },
                  headerTintColor: '#AAAAAA',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 20,
                    color: 'white',
                  },
                })}></Stack.Screen>
            </Stack.Navigator>
          </NavigationContainer>
        </RecoilRoot>
      </NativeBaseProvider>
    </SSRProvider>
  );
}

// Color Switch Component
