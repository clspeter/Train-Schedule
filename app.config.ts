import { ExpoConfig, ConfigContext } from 'expo/config';
import 'dotenv/config';
/*
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
    name: 'TDXConnect',
    slug: 'TDXConnect',
});
 */

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Train-Schedule',
  slug: 'Train-Schedule',
  extra: {
    eas: {
      CLIENT_ID: process.env.REACT_APP_CLIENT_ID,
      CLIENT_SECRET: process.env.REACT_APP_CLIENT_SECRET,
      projectId: 'e1c77d55-32de-4fa8-8018-8b8e6003bee8',
    },
  },
});
