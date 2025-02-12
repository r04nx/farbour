import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

// Test user credentials
const TEST_USER = {
  name: 'rohan',
  phone: '1234',
  user_type: 'farmer' as const,
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (phone: string, name: string) => Promise<{ error: any | null, isNewUser: boolean }>;
  verifyOTP: (phone: string, token: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        getProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        getProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function getProfile(userId: string, retryCount = 0) {
    try {
      // First check if user exists and get profile data
      const { data: checkData, error: checkError } = await supabase
        .rpc('check_user_exists', { phone_number: user?.phone || '' });

      if (checkError) {
        console.error('Error checking user:', checkError);
        return;
      }

      // If profile doesn't exist in either auth or profiles, wait and retry
      if (!checkData[0].exists_in_profiles && retryCount < 3) {
        console.log('Profile not found, retrying...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return getProfile(userId, retryCount + 1);
      }

      // If we have profile data from check_user_exists, use it
      if (checkData[0].profile_data) {
        setProfile(checkData[0].profile_data);
        return;
      }

      // Fallback to direct profile fetch
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116' && retryCount < 3) {
          // If profile doesn't exist and we haven't retried too many times
          console.log('Profile not found, retrying...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          return getProfile(userId, retryCount + 1);
        }
        console.error('Error fetching profile:', error);
      } else if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in getProfile:', error);
    }
  }

  const signIn = async (phone: string, name: string) => {
    try {
      // First, check if user exists
      const { data: checkData, error: checkError } = await supabase
        .rpc('check_user_exists', { phone_number: phone });

      if (checkError) {
        console.error('Error checking user:', checkError);
        return { error: checkError, isNewUser: false };
      }

      const isNewUser = !checkData[0].exists_in_profiles;

      // Sign in with OTP
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          data: {
            name,
            user_type: 'farmer', // Default to farmer, can be changed later
          },
        },
      });

      return { error, isNewUser };
    } catch (error) {
      console.error('Error in signIn:', error);
      return { error, isNewUser: false };
    }
  };

  const verifyOTP = async (phone: string, token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });

      if (!error) {
        // After successful verification, get the user's profile
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          // Add a longer delay before fetching profile to ensure trigger completes
          await new Promise(resolve => setTimeout(resolve, 2000));
          await getProfile(userData.user.id);
        }
      }

      return { error };
    } catch (error) {
      console.error('Error in verifyOTP:', error);
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (!error && profile) {
        setProfile({ ...profile, ...updates });
      }
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signIn,
    verifyOTP,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 