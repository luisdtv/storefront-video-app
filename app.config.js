import 'dotenv/config';

export default ({
  config
}) => ({
  ...
  config,
  name: 'lookym',
  slug: 'lookym',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'myapp',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#FFFFFF',
      foregroundImage: './assets/images/adaptive-icon.png'
    },
    package: 'com.lookym.app'
  },
  web: {
    favicon: './assets/images/favicon.png'
  },
  extra: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    eas: {
      projectId: 'your-project-id'
    }
  }
});