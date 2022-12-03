import React from "react";
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
} from "native-base";
import NativeBaseIcon from "./components/NativeBaseIcon";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "./screens/HomeScreen";
import { Platform } from "react-native";

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: 'dark',
};

const Stack = createNativeStackNavigator();

// extend the theme
export const theme = extendTheme({ config })
type MyThemeType = typeof theme;
declare module "native-base" {
  interface ICustomTheme extends MyThemeType {}
}
export default function App() : JSX.Element {
  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} 
        options={{
          title: '鐵路時刻',
          headerStyle: {
            backgroundColor: '#0A1E45',
          },
          headerTintColor: '#AAAAAA',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}/>
      </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}


// Color Switch Component

