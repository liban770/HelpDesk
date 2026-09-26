import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabaseClient } from '../lib/supabase';

export type UserRole = 'admin' | 'staff_engineer' | 'tier2_lead' | 'viewer';

export interface NexusUserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl: string;
  department: string;
  clusterAccess: string[];
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: NexusUserProfile | null;
  isLoading: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithPassword: (email: string, password: string, fullName: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  switchMockRole: (role: UserRole) => void;
}

const DEFAULT_PROFILE: NexusUserProfile = {
  id: 'usr_elena_rostova',
  email: 'elena.rostova@nexusdesk.internal',
  fullName: 'Elena Rostova (You)',
  role: 'staff_engineer',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtH2iqbsmZ_rDtikzjLjxwQ7FvOs6WJETrzFHTDt8goMNhoC5hz0JWvFJrkt7njXIHnn8OCVFEd_6AiJfTNaUyqPglAaRlMKo6ZScMSYjWPk3ZNuNDqtvPbCDA2XmPN5yMamBuhCsvgCD5GdfBHEaVVQLEoJ7SnBIsd0mNmUfVqXkbC04AUo5Vh52hv1mZAlY9JcMwqtxAQcZU7LDn-zlO9TvoN0RfunbG7cqvfKBwFnW6oBUby_kg',
  department: 'Production Tier-3 Escalations',
  clusterAccess: ['eu-west-1a', 'us-east-1', 'ap-southeast-1'],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<NexusUserProfile | null>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) {
      setIsLoading(false);
      return;
    }

    // Check active Supabase Auth session
    client.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        updateProfileFromUser(session.user);
      }
      setIsLoading(false);
    });

    // Listen to real-time auth changes
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        updateProfileFromUser(session.user);
      } else {
        setProfile(DEFAULT_PROFILE);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateProfileFromUser = (sbUser: User) => {
    const role: UserRole = (sbUser.user_metadata?.role as UserRole) || 'staff_engineer';
    const fullName = sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'Support Agent';
    setProfile({
      id: sbUser.id,
      email: sbUser.email || '',
      fullName,
      role,
      avatarUrl: DEFAULT_PROFILE.avatarUrl,
      department: sbUser.user_metadata?.department || 'Production Tier-3 Escalations',
      clusterAccess: ['eu-west-1a', 'us-east-1'],
    });
  };

  const signInWithPassword = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, error: 'Supabase client is not initialized.' };
    }

    try {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) {
        return { success: false, error: error.message };
      }
      if (data.user) {
        updateProfileFromUser(data.user);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Login failed.' };
    }
  };

  const signUpWithPassword = async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole = 'staff_engineer'
  ): Promise<{ success: boolean; error?: string }> => {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, error: 'Supabase client is not initialized.' };
    }

    try {
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
            department: role === 'admin' ? 'Security & Ops Admin' : 'Production Escalations',
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }
      if (data.user) {
        updateProfileFromUser(data.user);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Registration failed.' };
    }
  };

  const signOut = async () => {
    const client = getSupabaseClient();
    if (client) {
      await client.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(DEFAULT_PROFILE);
  };

  const switchMockRole = (role: UserRole) => {
    setProfile((prev) => (prev ? { ...prev, role } : DEFAULT_PROFILE));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        signInWithPassword,
        signUpWithPassword,
        signOut,
        switchMockRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
