import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { Database } from '@/types/supabase';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;
const twilioConfig = Constants.expoConfig?.extra?.twilio;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Please check your app.config.ts and .env files.');
  throw new Error('Missing Supabase configuration');
}

if (!twilioConfig?.accountSid || !twilioConfig?.authToken || !twilioConfig?.serviceSid) {
  console.error('Missing Twilio configuration. Please check your app.config.ts and .env files.');
  throw new Error('Missing Twilio configuration');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
    debug: __DEV__,
  },
}); 