import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';
import { Text, View } from 'native-base';
import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';

export default function GetLocaton() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const location = await Location.getLastKnownPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  if (!location) {
    return <Text>loading location, please wait </Text>;
  } else {
    return (
      <View>
        <Text>Longitude:{location?.coords.longitude}</Text>
        <Text>Latitude:{location?.coords.latitude}</Text>
      </View>
    );
  }
}
