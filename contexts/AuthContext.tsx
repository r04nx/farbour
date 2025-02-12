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
  signIn: (phone: string, name: string) => Promise<{ error: any | null }>;
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

  async function getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setProfile(data);
    }
  }

  const signIn = async (phone: string, name: string) => {
    try {
      // Check for test user
      if (phone === TEST_USER.phone && name.toLowerCase() === TEST_USER.name) {
        console.log('Using test user credentials');
        return { error: null };
      }

      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          data: {
            name,
            user_type: 'farmer',
          },
        },
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const verifyOTP = async (phone: string, token: string) => {
    try {
      // Check for test user
      if (phone === TEST_USER.phone) {
        if (token === '1234') {
          // Create a test session
          const { data, error } = await supabase.auth.signInWithPassword({
            email: `${TEST_USER.phone}@test.com`,
            password: 'test-password',
          });

          if (!error && data.user) {
            // Create or update test user profile
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: data.user.id,
                name: TEST_USER.name,
                phone: TEST_USER.phone,
                user_type: TEST_USER.user_type,
                is_phone_verified: true,
              });

            if (profileError) {
              console.error('Error creating test profile:', profileError);
            }
          }

          return { error: null };
        } else {
          return { error: new Error('Invalid test user OTP. Use 1234.') };
        }
      }

      const { error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });
      return { error };
    } catch (error) {
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