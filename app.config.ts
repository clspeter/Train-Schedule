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
    extra: {
      CLIENT_ID: process.env.REACT_APP_CLIENT_ID,
      CLIENT_SECRET: process.env.REACT_APP_CLIENT_SECRET,
    },
  },
};
