/* import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
    name: 'TDXConnect',
    slug: 'TDXConnect',
});
 */
import 'dotenv/config';

export default {
  expo: {
    name: 'Train-Schedule',
    slug: 'Train-Schedule',
    owner: 'mustpe',
    version: '1.0.1',
    orientation: 'portrait',
    icon: './assets/train.png',
    userInterfaceStyle: 'dark',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#0f172a',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.mustpe.TrainSchedule',
      buildNumber: '1',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/train.png',
        backgroundColor: '#FFFFFF',
      },
    },
    web: {
      favicon: './assets/train.png',
    },
    extra: {
      eas: {
        CLIENT_ID: process.env.REACT_APP_CLIENT_ID,
        CLIENT_SECRET: process.env.CLIENT_SECRET,
        projectId: 'e1c77d55-32de-4fa8-8018-8b8e6003bee8',
      },
    },
  },
};
