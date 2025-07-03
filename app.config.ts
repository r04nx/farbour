import { ExpoConfig, ConfigContext } from 'expo/config';
import 'dotenv/config';

// Get the environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const twilioAccountSid = process.env.EXPO_PUBLIC_TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.EXPO_PUBLIC_TWILIO_AUTH_TOKEN;
const twilioServiceSid = process.env.EXPO_PUBLIC_TWILIO_SERVICE_SID;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase configuration. Please check your .env file:',
    { supabaseUrl, supabaseAnonKey }
  );
}

if (!twilioAccountSid || !twilioAuthToken || !twilioServiceSid) {
  console.warn(
    'Missing Twilio configuration. Please check your .env file:',
    { twilioAccountSid, twilioAuthToken, twilioServiceSid }
  );
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Farbour',
  slug: 'krishi-connect',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'farbour',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.farbour.app',
    config: {
      usesNonExemptEncryption: false
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.farbour.app'
  },
  web: {
    favicon: './assets/images/favicon.png'
  },
  plugins: [
    'expo-router'
  ],
  extra: {
    supabaseUrl,
    supabaseAnonKey,
    twilio: {
      accountSid: twilioAccountSid,
      authToken: twilioAuthToken,
      serviceSid: twilioServiceSid,
    },
    eas: {
      projectId: "a2aee38b-da1b-4b7b-9d72-29d4af0e8394"
    }
  },
  owner: "r04nx"
}); 