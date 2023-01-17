import { SSRProvider } from '@react-aria/ssr';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider, extendTheme } from 'native-base';
import React, { ReactNode } from 'react';
import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil';
import RecoilState from './state';
import { appSettingRecoil } from './store';

import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import { atom } from 'recoil';
import SelectDepartureScreen from './screens/SelectDepartureScreen';
import SelectDestinationScreen from './screens/SelectDestinationScreen';
import SettingScreen from './screens/SettingScreen';
import TrainInfoScreen from './screens/TrainInfoScreen';
import TimeTableScreen from './screens/TimeTableScreen';
import { RootStackParamList, homeScreenProp } from './types';

/* type MyThemeType = typeof theme;
declare module 'native-base' {
  interface ICustomTheme extends MyThemeType {}
} */

const NativeBaseProviderTheme = (props: { children: ReactNode }) => {
  const appSetting = useRecoilValue(appSettingRecoil);
  const themeConfig = appSetting.themeConfig;
  const config = {
    useSystemColorMode: true,
    initialColorMode: 'light',
  };
  console.log(themeConfig + 'themeConfig');
  console.log(config + 'config');
  // extend the theme

  console.log(themeConfig == config);
  const theme = extendTheme({ config });
  return <NativeBaseProvider theme={theme}>{props.children}</NativeBaseProvider>;
};

export default function App(): JSX.Element {
  // Define the config

  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <SSRProvider>
      <RecoilRoot>
        <RecoilState />
        <NativeBaseProviderTheme>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={({ navigation }) => ({
                  title: '鐵路時刻表',
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
                  },
                }}></Stack.Screen>
            </Stack.Navigator>
          </NavigationContainer>
        </NativeBaseProviderTheme>
      </RecoilRoot>
    </SSRProvider>
  );
}

// Color Switch Component
