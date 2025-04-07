export default ({ config }) => ({
  ...config,
  name: 'lookym',
  slug: 'lookym',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'myapp',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.anonymous.lookym'
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png'
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff'
      }
    ]
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    // Add your Supabase credentials here
    supabaseUrl: process.env.SUPABASE_URL || 'https://eguhtltgkwilomwqjgxs.supabase.co',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVndWh0bHRna3dpbG9td3FqZ3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMzgwNTEsImV4cCI6MjA1OTYxNDA1MX0.v5p8coKl8saWxtYH7cPPTnNTe4wxqzaCFb4UY3avrME',
    eas: {
      // Optional: Add EAS Build Project ID if you use EAS
      projectId: process.env.EAS_PROJECT_ID || '' 
    }
  },
});
