import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/theme/theme';
import { GlobalStyles } from '@/theme/globalStyles';
import { StyledComponentsRegistry } from '@/lib/registry';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function App({ Component, pageProps }: AppProps) {
  // Initialize Supabase auth listener
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: string) => {
        // Handle auth state changes
        console.log('Auth event:', event);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Component {...pageProps} />
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}