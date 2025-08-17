import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAdmin: false,
  });

  useEffect(() => {
    // Check current session
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Check if user is admin
          const { data: adminUser } = await supabase
            .from('admin_users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          setAuthState({
            user: session.user,
            loading: false,
            isAdmin: !!adminUser,
          });
        } else {
          setAuthState({
            user: null,
            loading: false,
            isAdmin: false,
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthState({
          user: null,
          loading: false,
          isAdmin: false,
        });
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Check if user is admin
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setAuthState({
          user: session.user,
          loading: false,
          isAdmin: !!adminUser,
        });
      } else {
        setAuthState({
          user: null,
          loading: false,
          isAdmin: false,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  // Kakao OAuth login
  const signInWithKakao = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'profile_nickname profile_image', // 필요한 권한 요청
      },
    });
    return { data, error };
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    signInWithKakao,
  };
}

// Hook for protecting pages
export function useRequireAuth(requireAdmin = false) {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to login
        router.push('/auth/login?redirect=' + encodeURIComponent(router.asPath));
      } else if (requireAdmin && !isAdmin) {
        // Logged in but not admin, redirect to home
        router.push('/');
      }
    }
  }, [loading, user, isAdmin, requireAdmin, router]);

  return { user, loading, isAdmin };
}